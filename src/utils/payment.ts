import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface IPayment {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
}

export type TResponseMidtrans = {
  token: string;
  redirect_url: string;
};

export default {
  async createLink(payload: IPayment): Promise<TResponseMidtrans> {
    const result = await axios.post<TResponseMidtrans>(
      `${MIDTRANS_TRANSACTION_URL}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${MIDTRANS_SERVER_KEY}:`
          ).toString("base64")}`,
        },
      }
    );

    if (result.status !== 201) {
      throw new Error("payment failed");
    }
    return result?.data;
  },
};
