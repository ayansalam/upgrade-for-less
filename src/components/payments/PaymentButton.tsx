import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  purpose?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * PaymentButton - A reusable component for initiating payments
 * 
 * This button redirects users to the checkout page with the specified payment details
 */
const PaymentButton = ({
  amount,
  currency = "INR",
  purpose = "",
  variant = "default",
  size = "default",
  className = "",
  children,
  disabled = false,
  fullWidth = false
}: PaymentButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentClick = () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please specify a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Build checkout URL with parameters
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    params.append('currency', currency);
    if (purpose) params.append('purpose', purpose);
    
    // Redirect to checkout page
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handlePaymentClick}
      disabled={disabled || isLoading || amount <= 0}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children || `Pay ${new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
      }).format(amount)}`}
    </Button>
  );
};

export default PaymentButton;