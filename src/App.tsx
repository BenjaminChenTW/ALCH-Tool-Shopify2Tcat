import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Radio,
  RadioChangeEvent,
  Upload,
  UploadProps,
} from "antd";
import classNames from "classnames";
import * as csv from "csv/lib/sync";
import parsePhoneNumber from "libphonenumber-js";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import PrintTable from "./components/PrintTable";
import TransformError from "./errors/TransformError";
import "./styles.css";
import type TcatOrder from "./types/TcatOrder.interface";

const getColumn = (orderRecord: Record<string, string>, key: string) => {
  if (typeof orderRecord[key] === "undefined")
    throw new TransformError("CSV 格式錯誤");
  return orderRecord[key].replace(/^'|'$/, "").trim();
};

const getDeliverTime = (text: string) => {
  if (text.indexOf("A.13點前") !== -1) return "1";
  if (text.indexOf("B.14-18時") !== -1) return "2";
  return "4";
};

const getDeliverTemp = (text: string) => {
  if (text.indexOf("冷藏") !== -1) return "2";
  return "1";
};

const transformRecord =
  (payment: string) =>
  (orderRecord: any): TcatOrder => {
    const parsedPhone = parsePhoneNumber(
      getColumn(orderRecord, "Shipping Phone"),
      "TW"
    );
    const phone = parsedPhone ? `0${parsedPhone.nationalNumber}` : "";
    const price =
      payment === "paid"
        ? null
        : Math.round(parseFloat(getColumn(orderRecord, "Total")));
    if (
      payment === "cash_on_delivery" &&
      price &&
      (price <= 0 || price > 100000)
    )
      throw new TransformError("貨到付款金額必須大於 0 或是小於 100,000");
    const obj: TcatOrder = {
      收件人名稱: getColumn(orderRecord, "Shipping Name"),
      收件人電話: phone,
      收件人手機: "",
      收件人地址:
        getColumn(orderRecord, "Shipping Zip") +
        getColumn(orderRecord, "Shipping Address1"),
      代收金額或到付: price ? price.toString() : "",
      件數: "1",
      "品名(詳參數表)": "3",
      備註: "",
      訂單編號: getColumn(orderRecord, "Name"),
      "希望配達時間((詳參數表))": getDeliverTime(
        getColumn(orderRecord, "Notes")
      ),
      "出貨日期(YYYY/MM/DD)": moment().format("YYYY/MM/DD"),
      "預定配達日期(YYYY/MM/DD)": moment().add(1, "days").format("YYYY/MM/DD"),
      "溫層((詳參數表))": getDeliverTemp(getColumn(orderRecord, "Notes")),
      "尺寸((詳參數表))": "1",
      寄件人姓名: "華恩菸酒",
      寄件人電話: "06-2973838",
      寄件人手機: "",
      寄件人地址: "台南市安平區建平十二街65號",
      "保值金額(20001~10萬之間)-會產生額外費用": "",
      品名說明: "酒類",
      是否列印: "Y",
      是否捐贈: "N",
      統一編號: "28647509",
      手機載具: "",
      愛心碼: "",
    };
    return obj;
  };

export default function App() {
  const [statusText, setStatusText] = useState("請選擇檔案");
  const [file, setFile] = useState<File | null>(null);
  const [payment, setPayment] = useState("paid");
  const [exportCsv, setExportCsv] = useState<string | null>(null);
  const [exportArray, setExportArray] = useState<TcatOrder[] | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);

  const downloadButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!exportArray) {
      setExportCsv(null);
      return;
    }
    const exportCsv = csv.stringify(exportArray, { header: true });
    setExportCsv(exportCsv);
    setDownloadFileName(`order_${moment().format("YYYYMMDDHHmmsss")}.csv`);
  }, [exportArray]);

  const transformToExport = (text: string): TcatOrder[] => {
    const importArray = csv.parse(text, { columns: true }) as Record<
      string,
      string
    >[];
    const exportArray = importArray
      .filter((orderRecord) => orderRecord["Financial Status"] !== "")
      .map((orderRecord) => transformRecord(payment)(orderRecord));
    return exportArray;
  };

  const clearStates = () => {
    setStatusText("請選擇檔案");
    setExportArray(null);
  };

  const handleOnPaymentChange = (e: RadioChangeEvent) => {
    setPayment(e.target.value);
  };

  const handleOnFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files && e.target.files[0];
    setFile(file);
    if (!file) {
      clearStates();
      return;
    }
    setExportArray(null);
    setStatusText("選擇完畢請點擊「上傳檔案」");
  };

  const handleOnFileSubmit: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const text = event.target?.result;
      try {
        if (!text || typeof text !== "string")
          throw new TransformError("不支援的檔案格式");
        const exportArray = transformToExport(text);
        setStatusText("上傳成功！");
        setExportArray(exportArray);
        const exportCsv = csv.stringify(exportArray, { header: true });
        setExportCsv(exportCsv);
      } catch (e) {
        clearStates();
        if (e instanceof TransformError) {
          setStatusText(e.message);
          return;
        }
        console.error(e);
        setStatusText("上傳失敗！請找工程師協助");
      }
    };
    fileReader.readAsText(file);
  };

  const uploadProps: UploadProps = {
    accept: ".csv",
    maxCount: 1,
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
  };

  return (
    <div className="App">
      <h1>Shopify 訂單轉換黑貓托運單</h1>

      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="付款方式">
          <Radio.Group onChange={handleOnPaymentChange} value={payment}>
            <Radio value={"paid"}>已付款</Radio>
            <Radio value={"cash_on_delivery"}>貨到付款</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Shopify 訂單 CSV">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>選擇檔案</Button>
          </Upload>
        </Form.Item>
      </Form>

      <p>{statusText}</p>

      <br />

      {exportCsv ? (
        <a
          ref={downloadButtonRef}
          className={classNames({
            Disable: !exportCsv,
          })}
          href={`data:application/octet-stream,${encodeURIComponent(
            exportCsv
          )}`}
          download={downloadFileName}
        >
          下載黑貓托運單 CSV
        </a>
      ) : null}

      <PrintTable data={exportArray} />
    </div>
  );
}
