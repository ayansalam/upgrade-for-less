import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validatePaymentVerification, razorpayInstance } from '../utils/razorpay';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../utils/supabase';
import { logger } from '../utils/logger';

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RefundRequest {
  payment_id: string;
  amount?: number;
  notes?: string;
}

const router = Router();

// Create order
router.post('/create-order', asyncHandler(async (req: Request<{}, {}, CreateOrderRequest>, res: Response) => {
  const { amount, currency = 'INR', receipt, notes } = req.body;

  if (!amount || amount < 100) {
    throw new AppError('Invalid amount. Minimum amount is 100 paise (₹1)', 400);
  }

  const options = {
    amount,
    currency,
    receipt,
    notes,
  };

  const order = await razorpayInstance.orders.create(options);
  res.json(order);
}));

// Verify payment
router.post('/verify-payment', asyncHandler(async (req: Request<{}, {}, VerifyPaymentRequest>, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Missing required payment verification parameters', 400);
  }

  const isValid = validatePaymentVerification({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    throw new AppError('Invalid payment signature', 400);
  }

  // Get payment details
  const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

  // Verify payment status
  if (payment.status !== 'captured') {
    throw new AppError(`Payment not captured. Status: ${payment.status}`, 400);
  }

  res.json({
    message: 'Payment verified successfully',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    email: payment.email,
    contact: payment.contact,
    createdAt: payment.created_at,
  });
}));

// Get payment details
router.get('/payment/:paymentId', asyncHandler(async (req: Request<{ paymentId: string }>, res: Response) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new AppError('Payment ID is required', 400);
  }

  const payment = await razorpayInstance.payments.fetch(paymentId);
  res.json(payment);
}));

// Process refund
router.post('/refund', asyncHandler(async (req: Request<{}, {}, RefundRequest>, res: Response) => {
  const { payment_id, amount, notes } = req.body;

  if (!payment_id) {
    throw new AppError('Payment ID is required', 400);
  }

  try {
    // 1. Fetch payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(payment_id);
    
    if (payment.status !== 'captured') {
      throw new AppError(`Cannot refund payment with status: ${payment.status}`, 400);
    }

    // 2. Check if payment is already refunded
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('status, refund_id')
      .eq('payment_id', payment_id)
      .single();

    if (existingPayment?.status === 'refunded') {
      throw new AppError('Payment is already refunded', 400);
    }

    if (existingPayment?.status === 'refund_pending') {
      throw new AppError('A refund is already in progress for this payment', 400);
    }

    // 3. Calculate refund amount
    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new AppError('Refund amount cannot be greater than payment amount', 400);
    }

    // 4. Update payment status to refund_pending
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'refund_pending',
        refund_amount: refundAmount,
        refund_notes: notes
      })
      .eq('payment_id', payment_id);

    if (updateError) {
      throw new AppError('Failed to update payment status', 500);
    }

    // 5. Process refund through Razorpay
    const refund = await razorpayInstance.payments.refund(payment_id, {
      amount: refundAmount,
      notes: notes ? { reason: notes } : undefined,
      speed: 'normal'
    });

    // 6. Update payment record with refund details
    const { error: refundUpdateError } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refund_id: refund.id,
        refund_status: refund.status,
        refunded_at: new Date().toISOString()
      })
      .eq('payment_id', payment_id);

    if (refundUpdateError) {
      logger.error('Failed to update refund details', { error: refundUpdateError });
      // Don't throw here as refund is already processed
    }

    logger.info('Refund processed successfully', {
      payment_id,
      refund_id: refund.id,
      amount: refundAmount
    });

    res.json({
      message: 'Refund processed successfully',
      refund_id: refund.id,
      status: refund.status,
      amount: refundAmount
    });

  } catch (error: any) {
    // If it's a Razorpay error
    if (error.statusCode) {
      // Update payment status to refund_failed
      await supabase
        .from('payments')
        .update({
          status: 'refund_failed',
          refund_notes: `Refund failed: ${error.message}`
        })
        .eq('payment_id', payment_id);

      throw new AppError(error.message || 'Refund failed', error.statusCode);
    }
    
    throw error;
  }
}));

export default router; 