export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('✅ Cashfree Webhook Received:', req.body);
    return res.status(200).json({ message: 'Webhook received successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}