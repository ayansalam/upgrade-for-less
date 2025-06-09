interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  description?: string;
}

interface VerifyPaymentParams {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const createOrder = async ({
  amount,
  currency = 'INR',
  receipt,
  description
}: CreateOrderParams) => {
  try {
    console.log('Creating order for amount:', amount);
    
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
        description
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    const data = await response.json();
    console.log('Order created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (params: VerifyPaymentParams) => {
  try {
    console.log('Verifying payment:', params);
    
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment verification failed');
    }

    const data = await response.json();
    console.log('Payment verified successfully:', data);
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 