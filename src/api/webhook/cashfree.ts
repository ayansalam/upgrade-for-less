export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  try {
    console.log("✅ Webhook Received:", req.body);
    // TODO: Add signature verification logic here if needed
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ success: false });
  }
}