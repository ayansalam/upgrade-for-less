import { useState } from 'react';
import { RazorpayButton } from './RazorpayButton';
import { useToast } from "@/hooks/use-toast";
import { RAZORPAY_CONFIG } from '@/config/razorpay.config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PaymentTest = () => {
  const [amount, setAmount] = useState(RAZORPAY_CONFIG.AMOUNTS.TEST);
  const [currency, setCurrency] = useState(RAZORPAY_CONFIG.CURRENCIES.INR);
  const { toast } = useToast();

  const handlePaymentSuccess = (response: any) => {
    console.group('Payment Success Details');
    console.log('Payment ID:', response.razorpay_payment_id);
    console.log('Order ID:', response.razorpay_order_id);
    console.log('Signature:', response.razorpay_signature);
    console.log('Verification:', response.verificationData);
    console.groupEnd();

    toast({
      title: "Payment Successful",
      description: `Payment ID: ${response.razorpay_payment_id}`,
    });
  };

  const handlePaymentError = (error: any) => {
    console.group('Payment Error Details');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.groupEnd();

    toast({
      title: "Payment Failed",
      description: error.message || "Something went wrong",
      variant: "destructive"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Razorpay Payment</CardTitle>
        <CardDescription>
          Use test card: {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.number}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={RAZORPAY_CONFIG.AMOUNTS.MIN}
            max={RAZORPAY_CONFIG.AMOUNTS.MAX}
          />
          <p className="text-sm text-gray-500">
            Min: ₹{RAZORPAY_CONFIG.AMOUNTS.MIN}, Max: ₹{RAZORPAY_CONFIG.AMOUNTS.MAX}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RAZORPAY_CONFIG.CURRENCIES.INR}>
                Indian Rupee (INR)
              </SelectItem>
              <SelectItem value={RAZORPAY_CONFIG.CURRENCIES.USD}>
                US Dollar (USD)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="font-medium">Test Card Details:</h3>
          <div className="text-sm space-y-1">
            <p>Number: {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.number}</p>
            <p>Expiry: {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.expiry}</p>
            <p>CVV: {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.cvv}</p>
            <p>OTP: {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.otp}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <RazorpayButton
          amount={amount}
          currency={currency}
          email="test@example.com"
          contact="9999999999"
          description="Test Payment"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}; 