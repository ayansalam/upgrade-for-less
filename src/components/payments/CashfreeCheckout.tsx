import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cashfreeApi, PaymentOrderRequest } from "@/integrations/cashfree/client";
import { Loader2 } from "lucide-react";

interface CashfreeCheckoutProps {
  amount: number;
  currency?: string;
  purpose: string;
  onSuccess?: (data: Record<string, any>) => void;
  onFailure?: (error: Error | { message?: string }) => void;
  returnUrl?: string;
}

const CashfreeCheckout = ({
  amount,
  currency = "INR",
  purpose,
  onSuccess,
  onFailure,
  returnUrl = window.location.origin + "/payment-status"
}: CashfreeCheckoutProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Cashfree SDK script with retry mechanism
    const scriptId = "cashfree-sdk-script";
    let retryCount = 0;
    const maxRetries = 3;
    const loadScript = () => {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js";
        script.async = true;
        script.id = scriptId;
        script.onload = () => setSdkLoaded(true);
        script.onerror = () => {
          retryCount++;
          if (retryCount < maxRetries) {
            setTimeout(loadScript, 1000 * retryCount); // Exponential backoff
          } else {
            setSdkLoaded(false);
            toast({
              title: "Cashfree SDK failed to load",
              description: "Unable to load payment SDK after multiple attempts. Please refresh or try again later.",
              variant: "destructive"
            });
          }
        };
        document.body.appendChild(script);
      } else {
        setSdkLoaded(true);
      }
    };
    loadScript();
  }, []);

  const createPaymentSession = async () => {
    try {
      setIsLoading(true);
      // Call your backend to create a payment session and get paymentSessionId
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (data.paymentSessionId) {
        return data.paymentSessionId;
      } else {
        throw new Error("Failed to get paymentSessionId");
      }
    } catch (error) {
      toast({
        title: "Payment initialization failed",
        description: error.message || "Could not initialize payment",
        variant: "destructive"
      });
      if (onFailure) onFailure(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a payment",
        variant: "destructive"
      });
      return;
    }
    if (!sdkLoaded || !window.Cashfree) {
      toast({
        title: "Cashfree SDK not loaded",
        description: sdkLoaded ? "Cashfree object missing. Please refresh and try again." : "SDK failed to load. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    const paymentSessionId = await createPaymentSession();
    if (!paymentSessionId) return;
    try {
      window.Cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self"
      });
      if (onSuccess) onSuccess({ paymentSessionId });
    } catch (error) {
      console.error("Cashfree payment failed", error);
      toast({
        title: "Payment Modal Error",
        description: error.message || "Unexpected error occurred during payment",
        variant: "destructive"
      });
      if (onFailure) onFailure(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>{purpose}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency
              }).format(amount)}
            </div>
          </div>
          {user ? (
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
          ) : (
            <div className="text-sm text-red-500">
              Please log in to continue with payment
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCheckoutClick} 
          disabled={isLoading || !user}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CashfreeCheckout;