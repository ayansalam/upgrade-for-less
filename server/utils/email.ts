import { Resend } from 'resend';
import { logger } from './logger';
import { Payment } from './supabase';

if (!process.env.RESEND_API_KEY) {
  logger.error('Missing Resend API key');
  throw new Error('RESEND_API_KEY environment variable is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayment {
  email: string;
  amount: number;
  currency: string;
  payment_id: string;
  order_id: string;
  payment_method: string;
}

interface RefundDetails {
  email: string;
  amount: number;
  currency: string;
  payment_id: string;
  refund_id: string;
}

export async function sendPaymentConfirmation(payment: EmailPayment) {
  try {
    const { email, amount, currency, payment_id, order_id, payment_method } = payment;
    const amountInMainUnit = (amount / 100).toFixed(2); // Convert from paise/cents to main unit

    const { data, error } = await resend.emails.send({
      from: 'Upgrade For Less <payments@upgradeforless.com>',
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Successful!</h1>
        <p>Thank you for your payment. Here are your transaction details:</p>
        <ul>
          <li>Amount: ${currency} ${amountInMainUnit}</li>
          <li>Payment ID: ${payment_id}</li>
          <li>Order ID: ${order_id}</li>
          <li>Payment Method: ${payment_method}</li>
        </ul>
        <p>If you have any questions, please contact our support team.</p>
      `
    });

    if (error) {
      throw error;
    }

    logger.info('Payment confirmation email sent', {
      email,
      paymentId: payment_id,
      emailId: data?.id
    });

  } catch (error) {
    logger.error('Failed to send payment confirmation email', { error });
    throw error;
  }
}

export async function sendRefundConfirmation(refund: RefundDetails) {
  try {
    const { email, amount, currency, payment_id, refund_id } = refund;
    const amountInMainUnit = (amount / 100).toFixed(2); // Convert from paise/cents to main unit

    const { data, error } = await resend.emails.send({
      from: 'Upgrade For Less <payments@upgradeforless.com>',
      to: email,
      subject: 'Refund Processed',
      html: `
        <h1>Refund Processed Successfully</h1>
        <p>Your refund has been processed. Here are the details:</p>
        <ul>
          <li>Refund Amount: ${currency} ${amountInMainUnit}</li>
          <li>Original Payment ID: ${payment_id}</li>
          <li>Refund ID: ${refund_id}</li>
        </ul>
        <p>The refund should be credited to your original payment method within 5-7 business days.</p>
        <p>If you have any questions, please contact our support team.</p>
      `
    });

    if (error) {
      throw error;
    }

    logger.info('Refund confirmation email sent', {
      email,
      refundId: refund_id,
      emailId: data?.id
    });

  } catch (error) {
    logger.error('Failed to send refund confirmation email', { error });
    throw error;
  }
} 