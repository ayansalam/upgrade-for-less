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

  const createPaymentOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a payment",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate a unique order ID
      const uniqueOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      setOrderId(uniqueOrderId);

      const orderData: PaymentOrderRequest = {
        orderId: uniqueOrderId,
        orderAmount: amount,
        orderCurrency: currency,
        customerDetails: {
          customerId: user.id,
          customerEmail: user.email,
          customerName: user.email.split('@')[0] // Basic fallback if name is not available
        },
        orderMeta: {
          returnUrl: `${returnUrl}?order_id=${uniqueOrderId}`,
          notifyUrl: `${window.location.origin}/api/webhooks/cashfree`
        }
      };

      const response = await cashfreeApi.createPaymentOrder(orderData);
      
      if (response && response.paymentLink) {
        setCheckoutUrl(response.paymentLink);
      } else {
        throw new Error("Payment link not received from Cashfree");
      }
    } catch (error) {
      console.error("Error creating payment order:", error);
      toast({
        title: "Payment initialization failed",
        description: error.message || "Could not initialize payment",
        variant: "destructive"
      });
      if (onFailure) onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      createPaymentOrder();
    }
  };

  useEffect(() => {
    // If order ID exists, check payment status periodically
    if (orderId) {
      const checkStatus = async () => {
        try {
          const orderDetails = await cashfreeApi.getOrderDetails(orderId);
          if (orderDetails.orderStatus === "PAID" || orderDetails.orderStatus === "SUCCESS") {
            toast({
              title: "Payment successful",
              description: "Your payment has been processed successfully"
            });
            if (onSuccess) onSuccess(orderDetails);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      // Check once when component mounts with an order ID
      checkStatus();
    }
  }, [orderId, onSuccess, toast]);

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