import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createOrder, verifyPayment } from '@/services/razorpay';

interface RazorpayButtonProps {
  amount: number; // amount in INR (rupees)
  currency?: string;
  name?: string;
  description?: string;
  email?: string;
  contact?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayButton = ({
  amount,
  currency = "INR",
  name = "Upgrade For Less",
  description = "Purchase",
  email = "",
  contact = "",
  onSuccess,
  onError,
  className = "",
  children
}: RazorpayButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please try again later.",
        variant: "destructive"
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast({
        title: "Error",
        description: "Payment gateway is still loading. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Initializing payment for amount:', amount);

      // Create order
      const orderData = await createOrder({
        amount,
        currency,
        description,
        receipt: `receipt_${Date.now()}`
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount, // Amount from order in paise
        currency: orderData.currency,
        name,
        description,
        order_id: orderData.orderId,
        prefill: {
          email,
          contact
        },
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          
          try {
            // Verify payment
            const verificationData = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            console.log('Payment verified:', verificationData);
            
            toast({
              title: "Success",
              description: "Payment completed successfully!",
            });
            
            onSuccess?.({
              ...response,
              verificationData
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: "Warning",
              description: "Payment received but verification failed. Please contact support.",
              variant: "destructive"
            });
            onError?.(error);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Checkout form closed');
            setIsLoading(false);
          }
        },
        theme: {
          color: "#6366f1"
        }
      };

      const razorpay = new window.Razorpay(options);
      console.log('Opening Razorpay checkout');
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
      onError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !isScriptLoaded || amount <= 0}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children || `Pay ${new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency
      }).format(amount)}`}
    </Button>
  );
}; 