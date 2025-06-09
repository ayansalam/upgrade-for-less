import { useState } from 'react';
import { RazorpayButton } from './RazorpayButton';
import { useToast } from "@/hooks/use-toast";

interface PaymentExampleProps {
  userEmail?: string;
  userName?: string;
}

export const PaymentExample = ({ userEmail = "", userName = "" }: PaymentExampleProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    // Example response object:
    // {
    //   razorpay_payment_id: "pay_123...",
    //   razorpay_order_id: "order_123...",
    //   razorpay_signature: "..."
    // }
    
    // Here you would typically:
    // 1. Verify the payment on your backend
    // 2. Update the user's subscription status
    // 3. Show success message
    // 4. Redirect to success page
    
    toast({
      title: "Payment Successful!",
      description: `Payment ID: ${response.razorpay_payment_id}`,
    });
    
    setIsProcessing(false);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    
    toast({
      title: "Payment Failed",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive"
    });
    
    setIsProcessing(false);
  };

  // Example subscription plans
  const plans = [
    {
      name: "Basic",
      amount: 499,
      description: "Basic Plan - Monthly"
    },
    {
      name: "Pro",
      amount: 999,
      description: "Pro Plan - Monthly"
    },
    {
      name: "Enterprise",
      amount: 2499,
      description: "Enterprise Plan - Monthly"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Choose Your Plan</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className="p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">
              ₹{plan.amount}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </p>
            
            <RazorpayButton
              amount={plan.amount}
              currency="INR"
              name="Upgrade For Less"
              description={plan.description}
              email={userEmail}
              contact=""
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            >
              Subscribe to {plan.name}
            </RazorpayButton>
          </div>
        ))}
      </div>
    </div>
  );
}; 