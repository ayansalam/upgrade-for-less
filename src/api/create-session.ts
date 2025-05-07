// Import types for request and response
import type { Request, Response } from 'express';

// Replace with your actual Cashfree credentials
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || '';
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET || '';
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST'; // or 'PROD'

const CASHFREE_BASE_URL = CASHFREE_ENV === 'PROD'
  ? 'https://api.cashfree.com'
  : 'https://sandbox.cashfree.com';

async function createCashfreeSession(amount: number) {
  const url = `${CASHFREE_BASE_URL}/pg/orders`;
  const payload = {
    order_amount: amount,
    order_currency: 'INR',
    order_note: 'Payment via Cashfree',
    customer_details: {
      customer_id: `user_${Date.now()}`,
      customer_email: 'test@example.com', // Replace with actual user email if available
      customer_phone: '9999999999' // Replace with actual user phone if available
    }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': CASHFREE_CLIENT_ID,
      'x-client-secret': CASHFREE_CLIENT_SECRET
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Cashfree API error: ${res.status}`);
  }
  const data = await res.json();
  return data.payment_session_id;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Authentication check (example using a session cookie)
  // if (!req.cookies || !req.cookies.session) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  const { amount } = req.body;
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const paymentSessionId = await createCashfreeSession(amount);
    return res.status(200).json({ paymentSessionId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create payment session' });
  }
}