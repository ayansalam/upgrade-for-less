import axios from 'axios';
import { supabase } from "@/integrations/supabase/client";
import { CashfreeTransaction, CashfreeTransactionStatus, CashfreeTransactionInsert, CashfreeWebhookData } from "@/integrations/supabase/cashfree-types";
import { Json } from "@/integrations/supabase/types";

// Cashfree API credentials from environment variables
const CASHFREE_APP_ID = import.meta.env.CASHFREE_CLIENT_ID || '75930545239664b66952792a56503957';
const CASHFREE_SECRET_KEY = import.meta.env.CASHFREE_CLIENT_SECRET || 'cfsk_ma_prod_11258e59b378f85d97315442e06ac120_568afe95';
const CASHFREE_API_BASE_URL = import.meta.env.CASHFREE_ENV === 'PROD' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

// Cashfree API client
const cashfreeClient = axios.create({
  baseURL: CASHFREE_API_BASE_URL,
  headers: {
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
    'Content-Type': 'application/json',
  },
});

// Types for Cashfree integration
export interface PaymentLinkRequest {
  linkId: string;
  linkAmount: number;
  linkCurrency: string;
  linkPurpose: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
  };
  linkExpiryTime?: string;
  linkNotifyBy?: 'EMAIL' | 'SMS';
  linkAutoReminders?: boolean;
  linkPartialPayments?: boolean;
  linkMinimumPartialAmount?: number;
  metadata?: Record<string, any>;
}

export interface PaymentOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl?: string;
    paymentMethods?: string;
  };
  orderNote?: string;
}

// Using the imported CashfreeTransaction type from cashfree-types.ts

// Cashfree API functions
export const cashfreeApi = {
  // Create a payment link
  createPaymentLink: async (paymentLinkData: PaymentLinkRequest) => {
    try {
      const response = await cashfreeClient.post('/links', paymentLinkData);
      
      // Store transaction in database
      if (response.data && response.data.cfLinkId) {
        await storeTransaction({
          id: response.data.cfLinkId,
          order_id: paymentLinkData.linkId,
          payment_link_id: response.data.cfLinkId,
          user_id: paymentLinkData.customerDetails.customerId,
          amount: paymentLinkData.linkAmount,
          currency: paymentLinkData.linkCurrency,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: response.data
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  },

  // Create a payment order for checkout
  createPaymentOrder: async (orderData: PaymentOrderRequest) => {
    try {
      const response = await cashfreeClient.post('/orders', orderData);
      
      // Store transaction in database
      if (response.data && response.data.orderId) {
        await storeTransaction({
          id: response.data.orderId,
          order_id: orderData.orderId,
          user_id: orderData.customerDetails.customerId,
          amount: orderData.orderAmount,
          currency: orderData.orderCurrency,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: response.data
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  },

  // Get payment order details
  getOrderDetails: async (orderId: string) => {
    try {
      const response = await cashfreeClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Get payment link details
  getPaymentLinkDetails: async (linkId: string) => {
    try {
      const response = await cashfreeClient.get(`/links/${linkId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment link details:', error);
      throw error;
    }
  },

  // Process webhook notification
  processWebhookNotification: async (webhookData: CashfreeWebhookData) => {
    try {
      // Verify webhook signature (implement proper verification in production)
      // const isValid = verifyWebhookSignature(webhookData, signature);
      // if (!isValid) throw new Error('Invalid webhook signature');
      
      // Update transaction status based on webhook data
      if (webhookData.data && (webhookData.data.orderId || webhookData.data.order_id)) {
        const orderId = webhookData.data.orderId || webhookData.data.order_id;
        const status = mapCashfreeStatusToInternal(webhookData.data.orderStatus || webhookData.data.order_status || webhookData.data.paymentStatus || webhookData.data.status);
        
        await updateTransactionStatus(orderId, status);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error processing webhook notification:', error);
      throw error;
    }
  }
};

// Helper function to store transaction in database
async function storeTransaction(transaction: CashfreeTransaction): Promise<boolean> {
  try {
    // Create a transaction insert object that matches the database schema
    const transactionData: CashfreeTransactionInsert = {
      id: transaction.id,
      order_id: transaction.order_id,
      payment_link_id: transaction.payment_link_id,
      user_id: transaction.user_id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      payment_method: transaction.payment_method,
      reference_id: transaction.reference_id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      metadata: transaction.metadata as Json
    };
    
    const { error } = await supabase
      .from('cashfree_transactions')
      .insert(transactionData);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error storing transaction:', error);
    throw error;
  }
}

// Helper function to update transaction status
async function updateTransactionStatus(transactionId: string, status: CashfreeTransactionStatus): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cashfree_transactions')
      .update({ status })
      .eq('order_id', transactionId);
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}

// Helper function to map Cashfree status to internal status
function mapCashfreeStatusToInternal(cashfreeStatus: string): CashfreeTransactionStatus {
  if (!cashfreeStatus) return 'PENDING';
  switch (cashfreeStatus.toUpperCase()) {
    case 'PAID':
    case 'SUCCESS':
      return 'SUCCESS';
    case 'FAILED':
    case 'FAILURE':
      return 'FAILED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
}