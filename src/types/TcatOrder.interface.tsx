export default interface TcatOrder {
  收件人名稱: string;
  收件人電話: string;
  收件人手機: string;
  收件人地址: string;
  代收金額或到付: string;
  件數: string;
  "品名(詳參數表)":
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14";
  備註: string;
  訂單編號: string;
  "希望配達時間((詳參數表))": "1" | "2" | "4";
  "出貨日期(YYYY/MM/DD)": string;
  "預定配達日期(YYYY/MM/DD)": string;
  "溫層((詳參數表))": "1" | "2" | "3";
  "尺寸((詳參數表))": "1" | "2" | "3" | "4";
  寄件人姓名: string;
  寄件人電話: string;
  寄件人手機: string;
  寄件人地址: string;
  "保值金額(20001~10萬之間)-會產生額外費用": string;
  品名說明: string;
  是否列印: "Y" | "N";
  是否捐贈: "Y" | "N";
  統一編號: string;
  手機載具: string;
  愛心碼: string;
}
