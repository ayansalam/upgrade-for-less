import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'cancelled'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get order_id and status from URL query parameters
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
        const paymentStatus = params.get('status');
        
        if (!orderId) {
          throw new Error('Order ID not found in URL');
        }

        // Set mock payment details for display
        setPaymentDetails({
          orderId: orderId,
          orderAmount: params.get('amount') || '0',
          orderCurrency: 'USD',
          paymentTime: new Date().toISOString()
        });

        // Update status based on payment result from URL parameter
        if (paymentStatus === 'success') {
          setStatus('success');
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully."
          });
        } else if (paymentStatus === 'failed') {
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment.",
            variant: "destructive"
          });
        } else if (paymentStatus === 'cancelled') {
          setStatus('cancelled');
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "destructive"
          });
        } else {
          // Default to success for demo purposes
          setStatus('success');
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully."
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failed');
        toast({
          title: "Error",
          description: error.message || "Could not verify payment status",
          variant: "destructive"
        });
      }
    };

    if (user) {
      checkPaymentStatus();
    } else {
      // If user is not logged in, redirect to login page
      navigate('/auth', { state: { from: location } });
    }
  }, [location, user, toast, navigate]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          buttonText: "Return to Dashboard",
          buttonAction: () => navigate('/dashboard')
        };
      case 'failed':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          buttonText: "Try Again",
          buttonAction: () => navigate('/settings')
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="h-16 w-16 text-amber-500" />,
          title: "Payment Cancelled",
          description: "Your payment was cancelled.",
          buttonText: "Return to Settings",
          buttonAction: () => navigate('/settings')
        };
      default:
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
          title: "Processing Payment",
          description: "Please wait while we verify your payment...",
          buttonText: "",
          buttonAction: () => {}
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {statusDisplay.icon}
          </div>
          <CardTitle className="text-2xl">{statusDisplay.title}</CardTitle>
          <CardDescription>{statusDisplay.description}</CardDescription>
        </CardHeader>
        
        {paymentDetails && (
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span>{paymentDetails.orderId || 'N/A'}</span>
              </div>
              {paymentDetails.orderAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: paymentDetails.orderCurrency || 'INR'
                    }).format(paymentDetails.orderAmount)}
                  </span>
                </div>
              )}
              {paymentDetails.paymentTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {new Date(paymentDetails.paymentTime).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
        
        <CardFooter>
          {statusDisplay.buttonText && (
            <Button 
              className="w-full" 
              onClick={statusDisplay.buttonAction}
              variant={status === 'success' ? 'default' : 'outline'}
            >
              {statusDisplay.buttonText}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentStatus;