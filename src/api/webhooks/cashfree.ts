import { supabase } from "@/integrations/supabase/client";
import { CashfreeTransaction, CashfreeTransactionStatus } from "@/integrations/supabase/cashfree-types";

import { CashfreeWebhookData } from "@/integrations/supabase/cashfree-types";

// Webhook handler for Cashfree payment notifications
export async function handleCashfreeWebhook(req: Request): Promise<Response> {
  try {
    const webhookData = await req.json() as CashfreeWebhookData;
    if (webhookData && webhookData.data) {
      const { data } = webhookData;
      const cashfree_order_id = data.orderId || data.order_id;
      const cashfree_payment_id = data.paymentId || data.payment_id || data.cfPaymentId;
      const amount = parseFloat(String(data.orderAmount || data.amount || data.payment_amount || 0));
      const currency = data.orderCurrency || data.currency || 'INR';
      const payment_status = data.orderStatus || data.order_status || data.paymentStatus || data.status;
      const payment_date = data.paymentTime || data.payment_date || data.created_at || new Date().toISOString();
      const customer_email = data.customerEmail || data.customer_email || data.email || null;
      const user_id = data.userId || data.user_id || null;
      const payment_method = data.paymentMethod || data.payment_method || null;
      const country = data.country || data.customerCountry || data.customer_country || null;
      if (!cashfree_order_id) {
        throw new Error('Order ID not found in webhook data');
      }
      await upsertPaymentRecord({
        order_id: cashfree_order_id,
        payment_link_id: data.linkId || data.payment_link_id || null,
        user_id,
        amount,
        currency,
        status: mapCashfreeStatus(payment_status),
        payment_method,
        reference_id: cashfree_payment_id || null,
        created_at: payment_date,
        updated_at: new Date().toISOString(),
        metadata: data
      });
      if (payment_status === 'PAID' || payment_status === 'SUCCESS') {
        await handleSuccessfulPayment(cashfree_order_id);
      } else if (payment_status === 'FAILED' || payment_status === 'FAILURE') {
        await handleFailedPayment(cashfree_order_id);
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw new Error('Invalid webhook data');
  } catch (error: any) {
    console.error('Error processing Cashfree webhook:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to update transaction status
async function upsertPaymentRecord(payment: CashfreeTransaction): Promise<boolean> {
  try {
    // Create a transaction insert object that matches the database schema
    const transactionData: CashfreeTransactionInsert = {
      order_id: payment.order_id,
      payment_link_id: payment.payment_link_id,
      user_id: payment.user_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      payment_method: payment.payment_method,
      reference_id: payment.reference_id,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      metadata: payment.metadata as Json
    };
    
    const { error } = await supabase
      .from('cashfree_transactions')
      .upsert([transactionData], { onConflict: ['order_id'] });
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error upserting cashfree transaction:', error);
    throw error;
  }
}

// Helper function to map Cashfree status to internal status
function mapCashfreeStatus(cashfreeStatus: string): CashfreeTransactionStatus {
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

// Handle successful payment
async function handleSuccessfulPayment(orderId: string): Promise<boolean> {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('cashfree_order_id', orderId)
      .single();
    if (error) throw error;
    if (!payment) throw new Error(`Payment not found for order ID: ${orderId}`);
    // Business logic for successful payment goes here
    return true;
  } catch (error: any) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

// Handle failed payment
async function handleFailedPayment(orderId: string): Promise<boolean> {
  try {
    // Log the failed payment
    console.error('Payment failed for order:', orderId);
    // You could implement additional logic here, such as:
    // - Notifying the user via email
    // - Creating a support ticket
    // - Attempting to retry the payment
    return true;
  } catch (error: any) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}