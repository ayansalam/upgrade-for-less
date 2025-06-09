import { Request, Response } from 'express';
import crypto from 'crypto';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification parameters' });
    }

    // Create signature hash
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // Compare signatures
    if (digest !== razorpay_signature) {
      console.error('Payment signature verification failed');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Payment verified successfully
    console.log('Payment verified successfully:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

    // Here you would typically:
    // 1. Update order status in your database
    // 2. Activate the user's subscription
    // 3. Send confirmation email
    // 4. Update any relevant user data

    return res.status(200).json({
      message: 'Payment verified successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      error: 'Payment verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 