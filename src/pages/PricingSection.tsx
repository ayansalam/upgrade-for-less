import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Add Razorpay type to window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PlanDetails {
  name: string;
  amount: number;
  features: string[];
}

const PLANS: Record<string, PlanDetails> = {
  free: {
    name: "Free",
    amount: 0,
    features: ["Limited access", "Basic features", "Community support"]
  },
  pro: {
    name: "Pro",
    amount: 49900, // ₹499 in paise
    features: ["Full access", "Priority updates", "Email support"]
  },
  business: {
    name: "Business",
    amount: 199900, // ₹1,999 in paise
    features: ["Team access", "Premium support", "Custom features"]
  }
};

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = async (plan: string) => {
    try {
      setLoading(plan);
      setError(null);
      
      const planDetails = PLANS[plan];
      
      if (planDetails.amount === 0) {
        toast({
          title: "Free Plan Selected",
          description: "You can start using the free plan right away!",
        });
        return;
      }

      // Check if the payment server is configured
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        toast({
          title: "Development Mode",
          description: "Payment system is in development mode. Please try again later.",
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:5176/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan, amount: planDetails.amount }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to create order");
        }

        // Initialize Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency || "INR",
          name: "Upgrade for Less",
          description: `${planDetails.name} Plan Subscription`,
          order_id: data.id,
          handler: async function (response: any) {
            toast({
              title: "Payment Successful",
              description: "Thank you for your purchase! You'll receive a confirmation email shortly.",
            });
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function() {
              setLoading(null);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        console.error("Payment server error:", err);
        toast({
          title: "Service Unavailable",
          description: "Our payment system is currently unavailable. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Plans & Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Simple, transparent pricing for every stage of your business.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-50 rounded-xl p-8 shadow border border-gray-100 flex flex-col items-center">
            <h3 className="font-bold text-2xl mb-2">{PLANS.free.name}</h3>
            <p className="text-3xl font-bold text-primary mb-4">₹0<span className="text-base font-normal text-gray-500">/mo</span></p>
            <ul className="text-gray-600 mb-6 space-y-2 text-center">
              {PLANS.free.features.map((feature, index) => (
                <li key={index}>✔️ {feature}</li>
              ))}
            </ul>
            <button 
              className="w-full bg-primary/10 text-primary hover:bg-primary/20 rounded-lg py-2 font-semibold"
              onClick={() => handlePayment('free')}
              disabled={loading === 'free'}
            >
              {loading === 'free' ? 'Processing...' : 'Get Started'}
            </button>
          </div>
          {/* Pro Plan */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-primary flex flex-col items-center scale-105">
            <h3 className="font-bold text-2xl mb-2">{PLANS.pro.name}</h3>
            <p className="text-3xl font-bold text-primary mb-4">₹499<span className="text-base font-normal text-gray-500">/mo</span></p>
            <ul className="text-gray-600 mb-6 space-y-2 text-center">
              {PLANS.pro.features.map((feature, index) => (
                <li key={index}>✔️ {feature}</li>
              ))}
            </ul>
            <button 
              className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg py-2 font-semibold"
              onClick={() => handlePayment('pro')}
              disabled={loading === 'pro'}
            >
              {loading === 'pro' ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
          {/* Business Plan */}
          <div className="bg-gray-50 rounded-xl p-8 shadow border border-gray-100 flex flex-col items-center">
            <h3 className="font-bold text-2xl mb-2">{PLANS.business.name}</h3>
            <p className="text-3xl font-bold text-primary mb-4">₹1,999<span className="text-base font-normal text-gray-500">/mo</span></p>
            <ul className="text-gray-600 mb-6 space-y-2 text-center">
              {PLANS.business.features.map((feature, index) => (
                <li key={index}>✔️ {feature}</li>
              ))}
            </ul>
            <button 
              className="w-full bg-primary/10 text-primary hover:bg-primary/20 rounded-lg py-2 font-semibold"
              onClick={() => handlePayment('business')}
              disabled={loading === 'business'}
            >
              {loading === 'business' ? 'Processing...' : 'Contact Sales'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 