import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
/// <reference types="node" />
import { supabase } from '../../src/integrations/supabase/client';

// Custom type for Razorpay webhook request with raw body
interface RazorpayWebhookRequest extends Request {
  rawBody?: string;
}

// Webhook event types
type WebhookEvent = 
  | 'payment.captured'
  | 'payment.failed'
  | 'refund.processed'
  | 'refund.failed';

interface WebhookPayload {
  event: WebhookEvent;
  payload: {
    payment?: {
      entity: {
        id: string;
        status: string;
        method: string;
        error_code?: string;
        error_description?: string;
      };
    };
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        status: string;
        amount: number;
        error_code?: string;
        error_description?: string;
      };
    };
  };
}

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Razorpay webhook secret is missing' });
  }

  // Vercel does not provide rawBody by default, so reconstruct it
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Bad request' });
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Parse webhook payload
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const event = payload.event;
  const data = payload.payload;

  try {
    switch (event) {
      case 'payment.captured': {
        const paymentId = data.payment!.entity.id;
        const status = data.payment!.entity.status;
        const method = data.payment!.entity.method;
        await supabase
          .from('payments')
          .update({
            status,
            payment_method: method,
            updated_at: new Date().toISOString(),
            metadata: {
              ...data.payment!.entity,
              updated_at: new Date().toISOString()
            }
          })
          .eq('payment_id', paymentId);
        break;
      }
      case 'payment.failed': {
        const paymentId = data.payment!.entity.id;
        const status = data.payment!.entity.status;
        const errorCode = data.payment!.entity.error_code;
        const errorDescription = data.payment!.entity.error_description;
        await supabase
          .from('payments')
          .update({
            status,
            error_code: errorCode,
            error_description: errorDescription,
            updated_at: new Date().toISOString(),
            metadata: {
              ...data.payment!.entity,
              updated_at: new Date().toISOString()
            }
          })
          .eq('payment_id', paymentId);
        break;
      }
      case 'refund.processed': {
        const refundId = data.refund!.entity.id;
        const paymentId = data.refund!.entity.payment_id;
        const status = data.refund!.entity.status;
        const amount = data.refund!.entity.amount;
        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            refund_id: refundId,
            refund_amount: amount,
            refund_status: status,
            refunded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {
              ...data.refund!.entity,
              updated_at: new Date().toISOString()
            }
          })
          .eq('payment_id', paymentId);
        break;
      }
      case 'refund.failed': {
        const refundId = data.refund!.entity.id;
        const paymentId = data.refund!.entity.payment_id;
        const status = data.refund!.entity.status;
        const errorCode = data.refund!.entity.error_code;
        const errorDescription = data.refund!.entity.error_description;
        await supabase
          .from('payments')
          .update({
            refund_status: 'failed',
            error_code: errorCode,
            error_description: errorDescription,
            updated_at: new Date().toISOString(),
            metadata: {
              ...data.refund!.entity,
              error_code: errorCode,
              error_description: errorDescription,
              updated_at: new Date().toISOString()
            }
          })
          .eq('payment_id', paymentId);
        break;
      }
      default:
        // Unhandled event
        break;
    }
    return res.status(200).json({ status: 'Webhook received' });
  } catch (error) {
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}