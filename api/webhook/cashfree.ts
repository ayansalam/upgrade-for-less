import type { VercelRequest, VercelResponse } from '@vercel/node';
import getRawBody from 'raw-body';
// Enhanced logging for debugging webhook invocation and request body
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("📩 Incoming request to /api/webhook/cashfree");
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  if (req.method !== 'POST') {
    console.log("Non-POST request received. Body:", req.body);
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }
  try {
    const rawBody = await getRawBody(req);
    const parsedBody = rawBody.toString(); // Cashfree usually sends form-encoded or raw JSON
    console.log("✅ Raw Body:", parsedBody);
    // TODO: Parse or verify signature here if needed
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ success: false });
  }
}
// trigger redeploy