import axios from "axios";

const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg/links";
const CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Cashfree credentials are missing in environment variables");
}

export interface CashfreePaymentLinkPayload {
  customer_details: {
    customer_id: string;
    customer_email: string;
    customer_phone?: string;
    customer_name?: string;
  };
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_note?: string;
  link_notify?: { send_sms?: boolean; send_email?: boolean };
  link_expiry_time?: string;
  return_url?: string;
  notify_url?: string;
}

export async function createCashfreePaymentLink(payload: CashfreePaymentLinkPayload) {
  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/create`,
      payload,
      {
        headers: {
          "x-client-id": CLIENT_ID,
          "x-client-secret": CLIENT_SECRET,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Cashfree payment link creation failed:", error.response?.data || error.message);
    throw error;
  }
}