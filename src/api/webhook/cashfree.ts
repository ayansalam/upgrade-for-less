// Import types for request and response
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const payload = req.body;

  // TODO: Add signature verification if needed
  console.log('Webhook Received:', payload);

  return res.status(200).json({ success: true });
}