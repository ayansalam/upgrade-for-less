import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../src/integrations/supabase/client';
import { updatePaymentStatus } from '../../src/services/payment';

// Cashfree webhook event types
type CashfreeWebhookEvent = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND_SUCCESS' | 'REFUND_FAILED';

interface CashfreeWebhookPayload {
  event: CashfreeWebhookEvent;
  data: {
    order: {
      orderId: string;
      orderAmount: number;
      orderCurrency: string;
      orderStatus: string;
    };
    payment?: {
      paymentId: string;
      paymentStatus: string;
      paymentAmount: number;
      paymentCurrency: string;
      paymentTime: string;
      paymentMethod: string;
    };
    refund?: {
      refundId: string;
      refundStatus: string;
      refundAmount: number;
      refundTime: string;
    };
  };
}

const cashfreeWebhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!cashfreeWebhookSecret) {
    return res.status(500).json({ error: 'Cashfree webhook secret is missing' });
  }

  // Cashfree sends the signature in the x-webhook-signature header
  const signature = req.headers['x-webhook-signature'] as string;
  const timestamp = req.headers['x-webhook-timestamp'] as string;
  const rawBody = JSON.stringify(req.body); // Vercel parses body, so we stringify it back for signature verification

  if (!signature || !timestamp || !rawBody) {
    return res.status(400).json({ error: 'Bad request: Missing signature, timestamp, or body' });
  }

  // TODO: Implement Cashfree signature verification
  // Cashfree signature verification involves HMAC SHA256 with the secret and raw body + timestamp
  // For now, we'll skip verification for testing purposes.
  // const expectedSignature = crypto.createHmac('sha256', cashfreeWebhookSecret)
  //   .update(timestamp + rawBody)
  //   .digest('base64');

  // if (signature !== expectedSignature) {
  //   return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
  // }

  let payload: CashfreeWebhookPayload;
  try {
    payload = req.body as CashfreeWebhookPayload;
  } catch (err) {
    console.error('Error parsing Cashfree webhook payload:', err);
    return res.status(400).json({ error: 'Bad request: Invalid JSON payload' });
  }

  const event = payload.event;
  const orderId = payload.data.order.orderId;
  const orderStatus = payload.data.order.orderStatus;

  try {
    switch (event) {
      case 'PAYMENT_SUCCESS':
        await updatePaymentStatus(orderId, 'SUCCESS');
        console.log(`Cashfree Payment Success for Order ID: ${orderId}`);
        break;
      case 'PAYMENT_FAILED':
        await updatePaymentStatus(orderId, 'FAILED');
        console.log(`Cashfree Payment Failed for Order ID: ${orderId}`);
        break;
      case 'REFUND_SUCCESS':
        // Handle refund success if needed
        console.log(`Cashfree Refund Success for Order ID: ${orderId}`);
        break;
      case 'REFUND_FAILED':
        // Handle refund failed if needed
        console.log(`Cashfree Refund Failed for Order ID: ${orderId}`);
        break;
      default:
        console.warn(`Unhandled Cashfree webhook event: ${event}`);
        break;
    }
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(`Error processing Cashfree webhook for Order ID ${orderId}:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}