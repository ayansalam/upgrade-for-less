import { cashfreeApi, PaymentLinkRequest } from "@/integrations/cashfree/client";
import { supabase } from "@/integrations/supabase/client";
import { CashfreeTransaction, CashfreeTransactionInsert, CashfreeTransactionStatus } from "@/integrations/supabase/cashfree-types";
import { Json } from "@/integrations/supabase/types";

/**
 * Payment Service
 * 
 * This service provides functions for handling payments and transactions
 * using the Cashfree payment gateway integration.
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

export interface TransactionDetails {
  id: string;
  order_id: string;
  payment_link_id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: CashfreeTransactionStatus;
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
    const orderData = {
      orderId: uniqueOrderId,
      orderAmount: paymentDetails.amount,
      orderCurrency: paymentDetails.currency,
      customerDetails: {
        customerId: paymentDetails.userId,
        customerEmail: paymentDetails.userEmail,
        customerName: paymentDetails.userName || paymentDetails.userEmail.split('@')[0]
      },
      orderMeta: {
        returnUrl: `${window.location.origin}/payment-status?order_id=${uniqueOrderId}`,
        notifyUrl: `${window.location.origin}/api/webhooks/cashfree`
      },
      orderNote: paymentDetails.purpose
    };
    const response = await cashfreeApi.createPaymentOrder(orderData);
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
    const linkData: PaymentLinkRequest = {
      linkId: uniqueLinkId,
      linkAmount: paymentDetails.amount,
      linkCurrency: paymentDetails.currency,
      linkPurpose: paymentDetails.purpose,
      customerDetails: {
        customerId: paymentDetails.userId,
        customerEmail: paymentDetails.userEmail,
        customerName: paymentDetails.userName || paymentDetails.userEmail.split('@')[0]
      },
      linkExpiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
      linkNotifyBy: 'EMAIL',
      linkAutoReminders: true,
      metadata: paymentDetails.metadata
    };
    const response = await cashfreeApi.createPaymentLink(linkData);
    return response;
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};

// Get user's transaction history
export const getUserTransactions = async (userId: string): Promise<CashfreeTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('cashfree_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Convert Supabase data to CashfreeTransaction type
    const transactions: CashfreeTransaction[] = data?.map(item => ({
      id: item.id,
      order_id: item.order_id,
      payment_link_id: item.payment_link_id,
      user_id: item.user_id,
      amount: item.amount,
      currency: item.currency,
      status: item.status as CashfreeTransactionStatus,
      payment_method: item.payment_method,
      reference_id: item.reference_id,
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
export const getTransactionByOrderId = async (orderId: string): Promise<CashfreeTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('cashfree_transactions')
      .select('*')
      .eq('order_id', orderId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    if (!data) return null;
    
    // Convert Supabase data to CashfreeTransaction type
    const transaction: CashfreeTransaction = {
      id: data.id,
      order_id: data.order_id,
      payment_link_id: data.payment_link_id,
      user_id: data.user_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status as CashfreeTransactionStatus,
      payment_method: data.payment_method,
      reference_id: data.reference_id,
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
    const orderDetails = await cashfreeApi.getOrderDetails(orderId);
    return orderDetails;
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Bonus: How to generate Supabase types via CLI
// Run the following command in your terminal (replace <your_project_id> with your actual Supabase project ID):
// supabase gen types typescript --project-id <your_project_id>