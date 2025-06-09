import type { VercelRequest, VercelResponse } from "@vercel/node";
import Razorpay from "razorpay";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const payment_capture = 1;
    const amount = 499 * 100; // ₹499 in paise
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
      payment_capture,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
}