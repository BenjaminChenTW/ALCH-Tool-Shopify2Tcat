import { Form, Table, TableProps, Typography } from "antd";
import { useEffect, useState } from "react";

import TcatOrder from "../../types/TcatOrder.interface";

type TcatOrderRecord = TcatOrder & { key: string };

const columns: TableProps<TcatOrderRecord>["columns"] = [
  {
    title: "收件人名稱",
    dataIndex: "收件人名稱",
    key: "recipient_name",
    width: 110,
    fixed: "left",
  },
  {
    title: "收件人電話",
    dataIndex: "收件人電話",
    key: "recipient_phone",
    width: 120,
  },
  {
    title: "收件人手機",
    dataIndex: "收件人手機",
    key: "recipient_mobile",
    width: 120,
  },
  {
    title: "收件人地址",
    dataIndex: "收件人地址",
    key: "recipient_address",
    width: 400,
  },
  {
    title: "到付金額",
    dataIndex: "代收金額或到付",
    key: "price",
    width: 100,
    render: (text) => (text === "" ? "-" : text),
  },
  {
    title: "件數",
    dataIndex: "件數",
    key: "amount",
    width: 80,
  },
  {
    title: "品名",
    dataIndex: "品名(詳參數表)",
    key: "product_type",
    width: 150,
    render: (text) => {
      switch (text) {
        case "1":
          return "0001-一般食品";
        case "2":
          return "0002-名特產/甜點";
        case "3":
          return "0003-酒/油/醋/醬";
        case "4":
          return "0004-穀物蔬果";
        case "5":
          return "0005-水產/肉品";
        case "6":
          return "0006-3C";
        case "7":
          return "0007-家電";
        case "8":
          return "0008-服飾配件";
        case "9":
          return "0009-生活用品";
        case "10":
          return "0010-美容彩妝";
        case "11":
          return "0011-保健食品";
        case "12":
          return "0012-醫療相關用品";
        case "13":
          return "0013-寵物用品飼料";
        case "14":
          return "0014-印刷品";
        case "15":
          return "0015-其他";
        default:
          return "參數錯誤";
      }
    },
  },
  {
    title: "備註",
    dataIndex: "備註",
    key: "note",
  },
  {
    title: "訂單編號",
    dataIndex: "訂單編號",
    key: "order_id",
    width: 100,
    fixed: "left",
  },
  {
    title: "希望配達時間",
    dataIndex: "希望配達時間((詳參數表))",
    key: "deliver_time",
    width: 120,
    render: (text) => {
      switch (text) {
        case "1":
          return "13點前";
        case "2":
          return "14:00~18:00";
        case "4":
          return "不指定";
        default:
          return "參數錯誤";
      }
    },
  },
  {
    title: "出貨日期",
    dataIndex: "出貨日期(YYYY/MM/DD)",
    key: "deliver_date",
    width: 120,
  },
  {
    title: "預定配達日期",
    dataIndex: "預定配達日期(YYYY/MM/DD)",
    key: "eta",
    width: 120,
  },
  {
    title: "溫層",
    dataIndex: "溫層((詳參數表))",
    key: "temp",
    width: 100,
    render: (text) => {
      switch (text) {
        case "1":
          return "常溫";
        case "2":
          return "冷藏";
        case "3":
          return "冷凍";
        default:
          return "參數錯誤";
      }
    },
  },
  {
    title: "尺寸",
    dataIndex: "尺寸((詳參數表))",
    key: "size",
    width: 100,
    render: (text) => {
      switch (text) {
        case "1":
          return "60cm";
        case "2":
          return "90cm";
        case "3":
          return "120cm";
        case "4":
          return "150cm";
        default:
          return "參數錯誤";
      }
    },
  },
  {
    title: "寄件人姓名",
    dataIndex: "寄件人姓名",
    key: "sender_name",
    width: 110,
  },
  {
    title: "寄件人電話",
    dataIndex: "寄件人電話",
    key: "sender_phone",
    width: 120,
  },
  {
    title: "寄件人手機",
    dataIndex: "寄件人手機",
    key: "sender_mobile",
    width: 120,
  },
  {
    title: "寄件人地址",
    dataIndex: "寄件人地址",
    key: "sender_address",
    width: 220,
  },
  {
    title: "保值金額(20001~10萬之間)-會產生額外費用",
    dataIndex: "保值金額(20001~10萬之間)-會產生額外費用",
    key: "insurance",
    width: 320,
  },
  {
    title: "品名說明",
    dataIndex: "品名說明",
    key: "product_name",
    width: 100,
  },
  {
    title: "是否列印",
    dataIndex: "是否列印",
    key: "is_print",
    width: 100,
    render: (text) => (text === "Y" ? "是" : "否"),
  },
  {
    title: "是否捐贈",
    dataIndex: "是否捐贈",
    key: "is_donate",
    width: 100,
    render: (text) => (text === "Y" ? "是" : "否"),
  },
  {
    title: "統一編號",
    dataIndex: "統一編號",
    key: "vat_id",
    width: 110,
  },
  {
    title: "手機載具",
    dataIndex: "手機載具",
    key: "carrier",
    width: 110,
  },
  {
    title: "愛心碼",
    dataIndex: "愛心碼",
    key: "love_code",
    width: 110,
  },
];

const { Title } = Typography;

export default function PrintTable(props: Readonly<{ data: TcatOrder[] }>) {
  const { data: originData } = props;

  const [data, setData] = useState<TcatOrderRecord[]>([]);

  // const [editingKey, setEditingKey] = useState<React.Key>("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (!originData) {
      setData([]);
      return;
    }
    setData(
      originData.map((row, idx) => ({
        ...row,
        key: idx.toString(),
      }))
    );
  }, [originData]);

  // useEffect(() => {
  //   console.log("editingKey", editingKey);
  //   const record = data.find((row) => row.key === editingKey);
  //   if (record) form.setFieldsValue({ ...record });
  // }, [editingKey]);

  // const save = async (key: React.Key) => {
  //   try {
  //     const row = (await form.validateFields()) as TcatOrderRecord;

  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setData(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey("");
  //     }
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  // const mergedColumns: TableProps<TcatOrderRecord>["columns"] = columns.map(
  //   (col) => ({
  //     ...col,
  //     fixed: col.fixed as ColumnType<TcatOrderRecord>["fixed"],
  //     // onCell: (record: TcatOrderRecord) => ({
  //     //   title: col.title,
  //     //   dataIndex: col.dataIndex,
  //     //   record,
  //     //   setIsEditing: () => {
  //     //     setEditingKey(record.key);
  //     //   },
  //     //   handleSave: () => {
  //     //     save(record.key);
  //     //   },
  //     // }),
  //   })
  // );

  return (
    <>
      <Title
        level={2}
        style={{
          textAlign: "center",
        }}
      >
        黑貓托運單預覽
      </Title>
      <Form form={form} component={false}>
        <Table
          columns={columns}
          // components={{
          //   body: {
          //     cell: EditableCell,
          //   },
          // }}
          dataSource={data}
          scroll={{ x: 3500 }}
          style={{ padding: "0 24px" }}
          pagination={false}
          bordered
        />
      </Form>
    </>
  );
}
