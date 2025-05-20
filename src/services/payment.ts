import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Payment Service
 * 
 * This service provides functions for handling payments and transactions.
 * Note: This is a generic payment service with no external payment gateway integration.
 */

// Types
export interface PaymentDetails {
  amount: number;
  currency: string;
  purpose: string;
  userId: string;
  userEmail: string;
  userName?: string;
  metadata?: Record<string, any>;
}

// Payment status types
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TransactionDetails {
  id: string;
  order_id?: string;
  payment_id?: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_date: string;
  customer_email?: string;
  user_id?: string;
  payment_method?: string;
  country?: string;
  metadata?: Json;
}

// Create a payment checkout session
export const createPaymentCheckout = async (paymentDetails: PaymentDetails): Promise<Record<string, any>> => {
  try {
    // Generate a unique order ID
    const uniqueOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create a mock payment order response
    const response = {
      orderId: uniqueOrderId,
      orderAmount: paymentDetails.amount,
      orderCurrency: paymentDetails.currency,
      orderStatus: 'ACTIVE',
      customerDetails: {
        customerId: paymentDetails.userId,
        customerEmail: paymentDetails.userEmail,
        customerName: paymentDetails.userName || paymentDetails.userEmail.split('@')[0]
      },
      paymentUrl: `${window.location.origin}/checkout?order_id=${uniqueOrderId}&amount=${paymentDetails.amount}&currency=${paymentDetails.currency}`,
      orderNote: paymentDetails.purpose,
      createdAt: new Date().toISOString()
    };
    
    // Store transaction in database
    await storeTransaction({
      order_id: uniqueOrderId,
      user_id: paymentDetails.userId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      payment_status: 'PENDING' as PaymentStatus,
      payment_date: new Date().toISOString(),
      customer_email: paymentDetails.userEmail,
      metadata: paymentDetails.metadata as Json
    });
    
    return response;
  } catch (error: any) {
    console.error('Error creating payment checkout:', error);
    throw error;
  }
};

// Create a payment link that can be shared
export const createPaymentLink = async (paymentDetails: PaymentDetails): Promise<Record<string, any>> => {
  try {
    // Generate a unique link ID
    const uniqueLinkId = `link_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create a mock payment link response
    const response = {
      linkId: uniqueLinkId,
      linkUrl: `${window.location.origin}/checkout?link_id=${uniqueLinkId}&amount=${paymentDetails.amount}&currency=${paymentDetails.currency}&purpose=${encodeURIComponent(paymentDetails.purpose)}`,
      linkAmount: paymentDetails.amount,
      linkCurrency: paymentDetails.currency,
      linkStatus: 'ACTIVE',
      linkExpiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
      linkCreatedAt: new Date().toISOString(),
      customerDetails: {
        customerId: paymentDetails.userId,
        customerEmail: paymentDetails.userEmail,
        customerName: paymentDetails.userName || paymentDetails.userEmail.split('@')[0]
      }
    };
    
    // Store transaction in database
    await storeTransaction({
      order_id: uniqueLinkId, // Using order_id field for payment links
      user_id: paymentDetails.userId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      payment_status: 'PENDING' as PaymentStatus,
      payment_date: new Date().toISOString(),
      customer_email: paymentDetails.userEmail,
      metadata: paymentDetails.metadata as Json
    });
    
    return response;
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};

// Get user's transaction history
export const getUserTransactions = async (userId: string): Promise<TransactionDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('payment_date', { ascending: false });
    if (error) throw error;
    const transactions: TransactionDetails[] = data?.map(item => ({
      id: item.id,
      order_id: item.cashfree_order_id, // Map from existing DB column
      payment_id: item.cashfree_payment_id, // Map from existing DB column
      amount: Number(item.amount),
      currency: item.currency,
      payment_status: item.payment_status as PaymentStatus,
      payment_date: item.payment_date,
      customer_email: item.customer_email,
      user_id: item.user_id,
      payment_method: item.payment_method,
      country: item.country,
      metadata: item.metadata
    })) || [];
    return transactions;
  } catch (error: any) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

// Get transaction details by order ID
export const getTransactionByOrderId = async (orderId: string): Promise<TransactionDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('cashfree_order_id', orderId) // Using existing DB column
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    if (!data) return null;
    const transaction: TransactionDetails = {
      id: data.id,
      order_id: data.cashfree_order_id, // Map from existing DB column
      payment_id: data.cashfree_payment_id, // Map from existing DB column
      amount: Number(data.amount),
      currency: data.currency,
      payment_status: data.payment_status as PaymentStatus,
      payment_date: data.payment_date,
      customer_email: data.customer_email,
      user_id: data.user_id,
      payment_method: data.payment_method,
      country: data.country,
      metadata: data.metadata
    };
    return transaction;
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

// Check payment status
export const checkPaymentStatus = async (orderId: string): Promise<Record<string, any>> => {
  try {
    const transaction = await getTransactionByOrderId(orderId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return {
      orderId: transaction.order_id,
      orderAmount: transaction.amount,
      orderCurrency: transaction.currency,
      orderStatus: transaction.payment_status,
      paymentDetails: {
        paymentMethod: transaction.payment_method || 'CARD',
        paymentTime: transaction.payment_date
      },
      customerDetails: {
        customerId: transaction.user_id
      },
      createdAt: transaction.payment_date
    };
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Helper function to store transaction in database
const storeTransaction = async (transactionData: {
  order_id?: string;
  payment_id?: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_date?: string;
  customer_email?: string;
  user_id?: string;
  payment_method?: string;
  country?: string;
  metadata?: Json;
}) => {
  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        cashfree_order_id: transactionData.order_id, // Using existing DB column for compatibility
        cashfree_payment_id: transactionData.payment_id, // Using existing DB column for compatibility
        amount: transactionData.amount,
        currency: transactionData.currency,
        payment_status: transactionData.payment_status,
        payment_date: transactionData.payment_date || new Date().toISOString(),
        customer_email: transactionData.customer_email,
        user_id: transactionData.user_id,
        payment_method: transactionData.payment_method,
        country: transactionData.country,
        metadata: transactionData.metadata
      });
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error storing transaction:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (orderId: string, status: PaymentStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({ 
        payment_status: status,
        payment_date: new Date().toISOString()
      })
      .eq('cashfree_order_id', orderId); // Using existing DB column
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Note: The database still uses the original column names (cashfree_order_id, cashfree_payment_id)
// for compatibility, but the application code uses generic names (order_id, payment_id).

// Bonus: How to generate Supabase types via CLI
// Run the following command in your terminal (replace <your_project_id> with your actual Supabase project ID):
// supabase gen types typescript --project-id <your_project_id>