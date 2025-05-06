import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cashfreeApi } from "@/integrations/cashfree/client";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import CashfreeCheckout from "@/components/payments/CashfreeCheckout";

interface CheckoutProps {}

const Checkout = ({}: CheckoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("INR");
  const [purpose, setPurpose] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Get checkout parameters from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    const currencyParam = params.get('currency');
    const purposeParam = params.get('purpose');
    
    if (amountParam) setAmount(parseFloat(amountParam));
    if (currencyParam) setCurrency(currencyParam);
    if (purposeParam) setPurpose(purposeParam);
  }, [location.search]);
  
  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with checkout",
        variant: "destructive"
      });
      navigate('/auth', { state: { from: location } });
    }
  }, [user, navigate, location, toast]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const handlePaymentSuccess = (data: Record<string, any>) => {
    toast({
      title: "Payment Initiated",
      description: "You will be redirected to complete your payment"
    });
  };
  
  const handlePaymentFailure = (error: Error | { message?: string }) => {
    setPaymentError(error.message || "Payment initialization failed");
    toast({
      title: "Payment Error",
      description: error.message || "There was an error processing your payment",
      variant: "destructive"
    });
  };
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to continue with checkout</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/auth', { state: { from: location } })}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {purpose ? (
                  <div>
                    <Label>Purpose</Label>
                    <p className="text-lg font-medium">{purpose}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Enter payment purpose"
                      required
                    />
                  </div>
                )}
                
                {amount > 0 ? (
                  <div>
                    <Label>Amount</Label>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: currency
                      }).format(amount)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount || ''}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {paymentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Payment Error</h3>
                  <p className="text-red-700">{paymentError}</p>
                </div>
              </div>
            )}
            
            <CashfreeCheckout
              amount={amount}
              currency={currency}
              purpose={purpose || "Payment for services"}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              returnUrl={`${window.location.origin}/payment-status`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;