import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loadRazorpayScript } from '../utils/razorpay';

interface PaymentButtonProps {
  amount: number; // in paise
  currency?: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  theme?: {
    color?: string;
  };
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  disabled?: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  theme = { color: '#528FF0' },
  onSuccess,
  onError,
  className = '',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript()
      .then(() => setScriptLoaded(true))
      .catch((error) => {
        console.error('Failed to load Razorpay SDK:', error);
        toast.error('Failed to initialize payment system. Please try again later.');
      });
  }, []);

  const createOrder = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Payment system is still initializing. Please wait.');
      return;
    }

    setLoading(true);

    try {
      const generatedOrderId = orderId || await createOrder();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: import.meta.env.VITE_COMPANY_NAME || 'Your Company Name',
        description: 'Payment for your order',
        order_id: generatedOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/razorpay/verify-payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(response),
              }
            );

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            toast.success('Payment successful!');
            onSuccess?.(response);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            onError?.(error);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme,
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={handlePayment}
      disabled={disabled || loading || !scriptLoaded}
    >
      {loading ? (
        <>
          <svg
            className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : !scriptLoaded ? (
        'Initializing...'
      ) : (
        'Pay Now'
      )}
    </button>
  );
}; 