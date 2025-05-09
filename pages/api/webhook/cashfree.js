// pages/api/webhook/cashfree.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // You can log and verify Cashfree payload here
  console.log('Cashfree webhook payload:', req.body);

  res.status(200).json({ message: 'Webhook received successfully' });
}