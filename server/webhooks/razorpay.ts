import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { supabase } from '../utils/supabase';
import { sendPaymentConfirmation, sendRefundConfirmation } from '../utils/email';

interface WebhookEvent {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        email: string;
        card_id?: string;
        bank?: string;
        wallet?: string;
        vpa?: string;
      }
    },
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
        currency: string;
        status: string;
        speed_processed: string;
        speed_requested: string;
        created_at: number;
      }
    }
  }
}

// Verify webhook signature
function verifyWebhookSignature(req: Request): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return false;
  }

  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  return digest === signature;
}

async function handlePaymentCaptured(event: WebhookEvent) {
  if (!event.payload.payment) {
    throw new Error('Payment data missing in webhook event');
  }

  const paymentEntity = event.payload.payment.entity;
  logger.info('Payment captured', { paymentId: paymentEntity.id });

  try {
    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'captured',
        payment_method: paymentEntity.method,
      })
      .eq('payment_id', paymentEntity.id);

    if (updateError) {
      throw updateError;
    }

    logger.info('Payment status updated to captured', { paymentId: paymentEntity.id });

    // Send confirmation email
    await sendPaymentConfirmation({
      email: paymentEntity.email,
      amount: paymentEntity.amount,
      currency: paymentEntity.currency,
      payment_id: paymentEntity.id,
      order_id: paymentEntity.order_id,
      payment_method: paymentEntity.method
    });

    logger.info('Payment confirmation email sent', { email: paymentEntity.email });

  } catch (error) {
    logger.error('Error handling payment capture', {
      error,
      paymentId: paymentEntity.id
    });
    throw error;
  }
}

async function handleRefundProcessed(event: WebhookEvent) {
  if (!event.payload.refund) {
    throw new Error('Refund data missing in webhook event');
  }

  const refundEntity = event.payload.refund.entity;
  logger.info('Refund processed', { refundId: refundEntity.id });

  try {
    // Get payment details to get email
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('email')
      .eq('payment_id', refundEntity.payment_id)
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refund_id: refundEntity.id,
        refund_status: refundEntity.status,
        refunded_at: new Date(refundEntity.created_at * 1000).toISOString()
      })
      .eq('payment_id', refundEntity.payment_id);

    if (updateError) {
      throw updateError;
    }

    logger.info('Payment status updated to refunded', { 
      paymentId: refundEntity.payment_id,
      refundId: refundEntity.id 
    });

    // Send refund confirmation email
    if (payment?.email) {
      await sendRefundConfirmation({
        email: payment.email,
        amount: refundEntity.amount,
        currency: refundEntity.currency,
        payment_id: refundEntity.payment_id,
        refund_id: refundEntity.id
      });

      logger.info('Refund confirmation email sent', { email: payment.email });
    }

  } catch (error) {
    logger.error('Error handling refund processed', {
      error,
      refundId: refundEntity.id
    });
    throw error;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(req)) {
      logger.warn('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event: WebhookEvent = req.body;
    logger.info('Webhook received', { event: event.event });

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event);
        break;
      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }

    res.json({ status: 'success' });
  } catch (error) {
    logger.error('Webhook handler error', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
} 