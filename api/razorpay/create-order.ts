import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!key_id || !key_secret) {
    return res.status(500).json({ error: "Missing Razorpay credentials" });
  }

  try {
    const { amount, planId } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${planId}_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (err: any) {
    return res.status(500).json({ error: 'Order creation failed', message: err.message });
  }
} 