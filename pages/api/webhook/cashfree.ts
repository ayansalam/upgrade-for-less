import { NextApiRequest, NextApiResponse } from 'next';

// Local type definition for webhook data
type CashfreeWebhookData = {
  data: {
    orderId: string;
    order_id?: string;
    payment_id?: string;
    orderAmount?: string | number;
    amount?: string | number;
    status?: string;
    [key: string]: any;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const webhookData: CashfreeWebhookData = req.body;

    console.log('✅ Received Cashfree webhook:', webhookData);

    // Log important info
    console.log(`Order ID: ${webhookData.data?.orderId || webhookData.data?.order_id || 'N/A'}`);
    console.log(`Status: ${webhookData.data?.status || 'N/A'}`);
    console.log(`Amount: ${webhookData.data?.orderAmount || webhookData.data?.amount || 'N/A'}`);
    
    // Add additional error handling
    try {
      // Process webhook data here
      // Future implementation can go here
    } catch (error) {
      console.error('Error processing webhook data:', error);
    }

    res.status(200).json({ received: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}