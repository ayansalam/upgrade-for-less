import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '@/integrations/supabase/client';

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

const router = Router();

// Get webhook secret from environment variables
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

// Check if webhook secret is configured
if (!webhookSecret) {
  console.error("❌ Razorpay webhook secret is missing");
}

const webhookHandler = async (req: RazorpayWebhookRequest, res: Response): Promise<void> => {
  try {
    // Extract signature and raw body
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = req.rawBody;

    // Validate required data
    if (!signature || !webhookSecret || !rawBody) {
      console.error("❌ Missing signature, webhook secret, or raw body");
      res.status(400).json({ error: 'Bad request' });
      return;
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error("❌ Invalid signature");
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Parse webhook payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ Invalid JSON payload", err);
      res.status(400).json({ error: 'Bad request' });
      return;
    }

    const event = payload.event;
    const data = payload.payload;

    console.log("✅ Received Razorpay webhook:", event);

    try {
      switch (event) {
        case 'payment.captured': {
          const paymentId = data.payment!.entity.id;
          const status = data.payment!.entity.status;
          const method = data.payment!.entity.method;
          
          // Update payment status in database
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
          
          console.log("✅ Payment captured:", paymentId);
          break;
        }

        case 'payment.failed': {
          const paymentId = data.payment!.entity.id;
          const status = data.payment!.entity.status;
          const errorCode = data.payment!.entity.error_code;
          const errorDescription = data.payment!.entity.error_description;
          
          // Update payment failure in database
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
          
          console.log("❌ Payment failed:", paymentId, errorCode);
          break;
        }

        case 'refund.processed': {
          const refundId = data.refund!.entity.id;
          const paymentId = data.refund!.entity.payment_id;
          const status = data.refund!.entity.status;
          const amount = data.refund!.entity.amount;
          
          // Update refund status in database
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
          
          console.log("✅ Refund processed:", refundId);
          break;
        }

        case 'refund.failed': {
          const refundId = data.refund!.entity.id;
          const paymentId = data.refund!.entity.payment_id;
          const status = data.refund!.entity.status;
          const errorCode = data.refund!.entity.error_code;
          const errorDescription = data.refund!.entity.error_description;
          
          // Update refund failure in database
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
          
          console.log("❌ Refund failed:", refundId, errorCode);
          break;
        }

        default:
          console.log("ℹ️ Unhandled event:", event);
      }
    } catch (err) {
      console.error("❌ Database update failed:", err);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    res.status(200).json({ status: 'Webhook received' });
    return;
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({ error: 'Webhook processing failed' });
    return;
  }
};

// Mount webhook handler
router.post('/', webhookHandler);

export default router; 