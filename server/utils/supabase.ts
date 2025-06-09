import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  logger.error('Missing Supabase environment variables');
  throw new Error('Missing required environment variables for Supabase');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export interface Payment {
  order_id: string;
  payment_id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at?: string;
}

export async function savePayment(payment: Payment): Promise<void> {
  try {
    const { error } = await supabase
      .from('payments')
      .insert([payment]);

    if (error) {
      logger.error('Error saving payment to Supabase', { error });
      throw error;
    }

    logger.info('Payment saved successfully', { paymentId: payment.payment_id });
  } catch (error) {
    logger.error('Failed to save payment', { error });
    throw error;
  }
} 