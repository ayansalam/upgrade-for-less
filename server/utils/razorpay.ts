import Razorpay from 'razorpay';
import crypto from 'crypto';

// Debug logging
console.log("🧾 Razorpay Init → Key:", process.env.RAZORPAY_KEY_ID);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Environment variables missing!");
  console.error("Please ensure your .env file exists at:", require('path').resolve(process.cwd(), '.env'));
  console.error("And contains RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
  throw new Error('Missing required environment variables: RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET');
}

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export function validatePaymentVerification({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
} 