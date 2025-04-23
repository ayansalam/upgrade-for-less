
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2 } from "lucide-react";

const PaymentSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState([
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
  
  const handleAddPaymentMethod = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Adding new payment methods will be available in a future update.",
    });
  };
  
  const handleMakeDefault = (id) => {
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
  
  const handleDeletePaymentMethod = (id) => {
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <p className="text-muted-foreground">
          Manage your payment methods and billing information.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        
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
          Add Payment Method
        </Button>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        
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
          <p className="mt-2 text-xs text-muted-foreground">
            (This feature is coming soon)
          </p>
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Tax Information</h3>
        <p className="text-sm text-muted-foreground">
          Tax information settings will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default PaymentSettings;
