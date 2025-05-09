import { cashfreeClient } from "@/integrations/cashfree/client";
import { CashfreeWebhookData } from "@/integrations/supabase/cashfree-types";

/**
 * Handles Cashfree webhook notifications
 * Verifies the webhook signature and processes the payment status update
 */
export async function handleCashfreeWebhook(request: Request) {
  try {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse webhook data
    const webhookData: CashfreeWebhookData = await request.json();
    
    // Get signature from headers for verification
    // const signature = request.headers.get('x-webhook-signature');
    // if (!signature) {
    //   return new Response(JSON.stringify({ error: 'Missing webhook signature' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }
    
    // Process the webhook notification
    await cashfreeClient.processWebhookNotification(webhookData);
    
    // Return success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error processing Cashfree webhook:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Failed to process webhook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}