import crypto from "crypto";
import { supabase } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Temporary in-memory store for payments
const payments = [];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  let rawBody = Buffer.from([]);
  await new Promise((resolve) => {
    req.on("data", (chunk) => {
      rawBody = Buffer.concat([rawBody, chunk]);
    });
    req.on("end", resolve);
  });

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Parse the event
  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    // Ensure user_id is passed in notes from the client when creating the order
    const user_id = payment.notes?.user_id || null;
    const { error } = await supabase.from('payments').insert([
      {
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        email: payment.email,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        user_id,
      },
    ]);
    if (error) {
      console.error('Supabase insert error:', error);
    }
    // TODO: Grant premium access to user or upgrade plan here
    return res.status(200).json({ status: "payment handled" });
  }

  // For other events, just acknowledge
  res.status(200).json({ received: true });
} 