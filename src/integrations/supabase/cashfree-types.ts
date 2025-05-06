import { Database } from './types';
import { Json } from './types';

// Type helper for status values
export type CashfreeTransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

// Type for cashfree_transactions table using the generated Database types
export type CashfreeTransaction = {
  id?: string | null;
  order_id: string;
  payment_link_id?: string | null;
  user_id?: string | null;
  amount: number;
  currency: string;
  status: CashfreeTransactionStatus;
  payment_method?: string | null;
  reference_id?: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Json | null;
};

// Use Database types for insert and update operations
export type CashfreeTransactionInsert = Database['public']['Tables']['cashfree_transactions']['Insert'];
export type CashfreeTransactionUpdate = Database['public']['Tables']['cashfree_transactions']['Update'];

// Type for Cashfree webhook data
export interface CashfreeWebhookData {
  data: {
    orderId?: string;
    order_id?: string;
    paymentId?: string;
    payment_id?: string;
    cfPaymentId?: string;
    orderAmount?: string | number;
    amount?: string | number;
    payment_amount?: string | number;
    orderCurrency?: string;
    currency?: string;
    orderStatus?: string;
    order_status?: string;
    paymentStatus?: string;
    status?: string;
    paymentTime?: string;
    payment_date?: string;
    created_at?: string;
    customerEmail?: string;
    customer_email?: string;
    email?: string;
    userId?: string;
    user_id?: string;
    paymentMethod?: string;
    payment_method?: string;
    country?: string;
    customerCountry?: string;
    customer_country?: string;
    linkId?: string;
    payment_link_id?: string;
    [key: string]: any;
  };
  event?: string;
  timestamp?: string;
  [key: string]: any;
}