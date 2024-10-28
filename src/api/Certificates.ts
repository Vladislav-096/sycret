import { z } from "zod";

const API_URL = "https://sycret.ru/service/api/api";
const API_KEY = "011ba11bdcad4fa396660c2ec447ef14";

const certificateSchema = z.object({
  ID: z.string(),
  TABLENAME: z.string(),
  PRIMARYKEY: z.string(),
  NAME: z.string(),
  DESCRIPTION: z.string().optional(),
  PRICE: z.string().regex(/^\d+(\.\d{1,2})?$/),
  SUMMA: z.string().regex(/^\d+(\.\d{1,2})?$/),
  DISCOUNT: z.string().regex(/^\d+(\.\d{1,2})?$/),
  IMAGEURL: z.string().optional(),
  REC_SNO: z.string(),
  REC_NAME: z.string(),
  REC_SUM: z.string().regex(/^\d+(\.\d{1,2})?$/),
  REC_QUANTITY: z.string().regex(/^\d+(\.\d{1,2})?$/),
  REC_PAYMENT_METHOD: z.string(),
  REC_PAYMENT_OBJECT: z.string(),
  REC_TAX: z.string(),
});
export type Certificate = z.infer<typeof certificateSchema>; //  мб не понадобится

const certificatesResponseSchema = z.object({
  data: z.array(certificateSchema),
  result: z.number(),
  resultdescription: z.string(),
});
export type certificatesResponse = z.infer<typeof certificatesResponseSchema>;

export const getCertificates = async () => {
  return fetch(
    `${API_URL}?MethodName=OSGetGoodList&ismob=0&ApiKey=${API_KEY}`,
    {
      method: "GET",
      credentials: "omit",
    }
  )
    .then((response) => response.json())
    .then((data) => certificatesResponseSchema.parse(data))
    .catch((error) => {
      console.log("getCertificates error:", error.message);
      throw error;
    });
};

export interface paymentRequest {
  name: string;
  phone: string;
  email: string;
  message?: string;
  price: string;
  itemName: string; // название сертификата в списке (Сертификат на сумму...)
}

export const paymentRequest = async ({
  name,
  phone,
  email,
  message,
  price,
  itemName,
}: paymentRequest) => {
  return fetch(API_URL, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      methodName: "OSCreatePreOrder",
      CRMClientId: "62032",
      IsTestMode: "1",
      ItemId: "1",
      ItemName: itemName,
      TableName: "DICTCERTSALE",
      PrimaryKey: "1_DICTCERTSALE",
      Price: price,
      Summa: price,
      FName: name,
      Phone: phone,
      Email: email,
      UseDelivery: "0",
      DeliveryAddress: "",
      OSWidgetURL: "https://sycret.ru/service/onlinesale/",
      MSGText: message,
      PName: "",
      PPhone: "",
      ApiKey: API_KEY,
    }),
  });
};
