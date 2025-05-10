import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Payment Service
 * 
 * This service provides functions for handling payments and transactions.
 * Note: External payment gateway integration has been removed.
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
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface TransactionDetails {
  id: string;
  order_id: string;
  payment_link_id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any> | null;
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
      status: 'PENDING',
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
      payment_link_id: uniqueLinkId,
      user_id: paymentDetails.userId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      status: 'PENDING',
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
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Convert Supabase data to TransactionDetails type
    const transactions: TransactionDetails[] = data?.map(item => ({
      id: item.id,
      order_id: item.order_id || '',
      payment_link_id: item.payment_link_id,
      user_id: item.user_id,
      amount: item.amount,
      currency: item.currency,
      status: item.status as PaymentStatus,
      payment_method: item.payment_method,
      created_at: item.created_at,
      updated_at: item.updated_at,
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
      .eq('order_id', orderId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    if (!data) return null;
    
    // Convert Supabase data to TransactionDetails type
    const transaction: TransactionDetails = {
      id: data.id,
      order_id: data.order_id || '',
      payment_link_id: data.payment_link_id,
      user_id: data.user_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status as PaymentStatus,
      payment_method: data.payment_method,
      created_at: data.created_at,
      updated_at: data.updated_at,
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
    // Get transaction from database
    const transaction = await getTransactionByOrderId(orderId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    // Return mock order details
    return {
      orderId: transaction.order_id,
      orderAmount: transaction.amount,
      orderCurrency: transaction.currency,
      orderStatus: transaction.status,
      paymentDetails: {
        paymentMethod: transaction.payment_method || 'CARD',
        paymentTime: transaction.updated_at
      },
      customerDetails: {
        customerId: transaction.user_id
      },
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    };
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Helper function to store transaction in database
const storeTransaction = async (transactionData: {
  order_id?: string;
  payment_link_id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  metadata?: Json;
}) => {
  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        order_id: transactionData.order_id,
        payment_link_id: transactionData.payment_link_id,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: transactionData.status,
        payment_method: transactionData.payment_method,
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
        status,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Bonus: How to generate Supabase types via CLI
// Run the following command in your terminal (replace <your_project_id> with your actual Supabase project ID):
// supabase gen types typescript --project-id <your_project_id>