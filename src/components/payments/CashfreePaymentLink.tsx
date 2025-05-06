import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cashfreeApi, PaymentLinkRequest } from "@/integrations/cashfree/client";
import { Loader2, Copy, Check } from "lucide-react";

interface CashfreePaymentLinkProps {
  defaultAmount?: number;
  defaultCurrency?: string;
  defaultPurpose?: string;
  onSuccess?: (data: Record<string, any>) => void;
  onFailure?: (error: Error | { message?: string }) => void;
}

const CashfreePaymentLink = ({
  defaultAmount = 0,
  defaultCurrency = "INR",
  defaultPurpose = "",
  onSuccess,
  onFailure
}: CashfreePaymentLinkProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(defaultAmount);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [purpose, setPurpose] = useState(defaultPurpose);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createPaymentLink = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a payment link",
        variant: "destructive"
      });
      return;
    }

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (!purpose) {
      toast({
        title: "Purpose required",
        description: "Please enter a purpose for the payment",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate a unique link ID
      const uniqueLinkId = `link_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const linkData: PaymentLinkRequest = {
        linkId: uniqueLinkId,
        linkAmount: amount,
        linkCurrency: currency,
        linkPurpose: purpose,
        customerDetails: {
          customerId: user.id,
          customerEmail: user.email,
          customerName: user.email.split('@')[0] // Basic fallback if name is not available
        },
        linkExpiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
        linkNotifyBy: 'EMAIL',
        linkAutoReminders: true
      };

      const response = await cashfreeApi.createPaymentLink(linkData);
      
      if (response && response.linkUrl) {
        setPaymentLink(response.linkUrl);
        toast({
          title: "Payment link created",
          description: "Your payment link has been created successfully"
        });
        if (onSuccess) onSuccess(response);
      } else {
        throw new Error("Payment link not received from Cashfree");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Failed to create payment link",
        description: error.message || "Could not create payment link",
        variant: "destructive"
      });
      if (onFailure) onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Payment link copied to clipboard"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Payment Link</CardTitle>
        <CardDescription>Generate a shareable payment link for your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter amount"
              disabled={isLoading || !!paymentLink}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Currency code (e.g., INR, USD)"
              disabled={isLoading || !!paymentLink}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Payment purpose"
              disabled={isLoading || !!paymentLink}
            />
          </div>

          {paymentLink && (
            <div className="mt-4 space-y-2">
              <Label>Payment Link</Label>
              <div className="flex items-center">
                <Input value={paymentLink} readOnly className="pr-10" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-ml-10"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This link will expire in 7 days
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!paymentLink ? (
          <Button
            className="w-full"
            onClick={createPaymentLink}
            disabled={isLoading || !user}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Link...
              </>
            ) : (
              "Create Payment Link"
            )}
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setPaymentLink(null);
              setAmount(defaultAmount);
              setCurrency(defaultCurrency);
              setPurpose(defaultPurpose);
            }}
          >
            Create Another Link
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CashfreePaymentLink;