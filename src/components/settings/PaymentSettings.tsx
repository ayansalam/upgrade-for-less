
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, Plus, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
// Payment components imports have been removed
import TransactionHistory from "../payments/TransactionHistory";
import PaymentButton from "../payments/PaymentButton";

interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  order_id: string;
  payment_link_id?: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface PaymentSettingsProps {
  user: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

const PaymentSettings = ({ user }: PaymentSettingsProps) => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card_1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ]);

  useEffect(() => {
    if (authUser) {
      fetchTransactions();
    }
  }, [authUser]);

  const fetchTransactions = async () => {
    if (!authUser) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Failed to load transactions",
        description: error.message || "Could not load transaction history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "This feature will be available in a future update.",
    });
  };
  
  const handleMakeDefault = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      
      setIsLoading(false);
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated.",
      });
    }, 500);
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      
      setIsLoading(false);
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed.",
      });
    }, 500);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handlePaymentSuccess = (data: Record<string, any>) => {
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
    fetchTransactions();
  };

  const handlePaymentFailure = (error: Error | { message?: string }) => {
    toast({
      title: "Payment Failed",
      description: error.message || "There was an issue processing your payment.",
      variant: "destructive"
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <p className="text-muted-foreground">
          Manage your payment methods, transactions, and create payment links.
        </p>
      </div>

      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4 mt-4">
          <div className="space-y-3">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <Card key={method.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted rounded-md p-2">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMakeDefault(method.id)}
                        disabled={isLoading}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                No payment methods found.
              </Card>
            )}
          </div>
          
          <Button variant="outline" onClick={handleAddPaymentMethod}>
            <Plus className="h-4 w-4 mr-2" /> Add Payment Method
          </Button>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="United States" disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main St" disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="San Francisco" disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="California" disabled={isLoading} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                <Input id="zipCode" placeholder="94103" disabled={isLoading} />
              </div>
            </div>
            
            <div className="pt-4">
              <Button disabled={isLoading}>
                Save Billing Address
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <TransactionHistory limit={20} showTitle={true} />
        </TabsContent>


          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSettings;
