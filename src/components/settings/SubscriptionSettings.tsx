
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, AlertCircle } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface SubscriptionData {
  id: string;
  tier_id: string;
  is_yearly: boolean;
  status: string;
  current_period_end: string;
  tier: {
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    features: Json; // Changed from string[] to Json to match Supabase's type
  };
}

const SubscriptionSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [tiers, setTiers] = useState([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      if (!user) {
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      try {
        // Fetch subscription from Supabase
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*,tier:tiers(*)")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        if (
          data &&
          data.tier &&
          typeof data.tier === "object" &&
          "name" in data.tier &&
          "description" in data.tier &&
          "monthly_price" in data.tier &&
          "yearly_price" in data.tier &&
          "features" in data.tier
        ) {
          setSubscription(data);
          setBillingCycle(data.is_yearly ? "yearly" : "monthly");
        } else {
          setSubscription(null);
        }
        // Fetch all tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from("tiers")
          .select("*");
        if (tiersError) throw tiersError;
        setTiers(tiersData);
      } catch (err) {
        toast({
          title: "Error loading subscription",
          description: err.message || "Could not fetch subscription data.",
          variant: "destructive",
        });
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptionData();
  }, [user]);
  
  // Helper function to safely render features that could be either string[] or Json
  const renderFeatures = (features: Json) => {
    if (!features) return null;
    
    // Try to handle features whether it's an array or a JSON string
    let featureList: string[] = [];
    
    if (Array.isArray(features)) {
      featureList = features as string[];
    } else if (typeof features === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(features);
        featureList = Array.isArray(parsed) ? parsed : [features];
      } catch (e) {
        // If parsing fails, treat as a single feature string
        featureList = [features];
      }
    } else {
      // Handle other possible types
      featureList = [String(features)];
    }
    
    return (
      <ul className="space-y-2">
        {featureList.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleBillingCycleChange = (value) => {
    if (value) setBillingCycle(value);
  };
  
  const handleChangePlan = (tierId) => {
    toast({
      title: "Feature Coming Soon",
      description: "Changing plans will be available in a future update.",
    });
  };
  
  const handleCancelSubscription = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Subscription cancellation will be available in a future update.",
    });
  };
  
  if (isLoading) {
    return <p>Loading subscription information...</p>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">Manage your subscription and billing preferences.</p>
      </div>
      
      {subscription && subscription.tier && typeof subscription.tier === "object" &&
        "name" in subscription.tier &&
        "description" in subscription.tier &&
        "monthly_price" in subscription.tier &&
        "yearly_price" in subscription.tier &&
        "features" in subscription.tier ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Current Plan: {subscription.tier.name}</CardTitle>
              <CardDescription>{subscription.tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Billing Cycle</p>
                  <span>{subscription.is_yearly ? "Yearly" : "Monthly"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Next Payment</p>
                  <span>{formatDate(subscription.current_period_end)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Amount</p>
                  <span>
                    {subscription.is_yearly 
                      ? formatPrice(subscription.tier.yearly_price) + "/year" 
                      : formatPrice(subscription.tier.monthly_price) + "/month"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
              <Button>Manage Payment Details</Button>
            </CardFooter>
          </Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Cycle</h3>
            <ToggleGroup 
              type="single" 
              value={billingCycle}
              onValueChange={handleBillingCycleChange}
              className="justify-start"
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly (Save 20%)</ToggleGroupItem>
            </ToggleGroup>
            <p className="text-sm text-muted-foreground">
              Changes to billing cycle will take effect at the next billing period.
            </p>
          </div>
        </>
      ) : (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              No active subscription
            </CardTitle>
            <CardDescription>You don't have an active subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Choose a plan to get started with UpgradeForLess.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="/pricing">View Available Plans</a>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers && Array.isArray(tiers) && tiers.length > 0 ? tiers
            .filter(
              (tier) =>
                tier &&
                typeof tier === "object" &&
                "id" in tier &&
                "name" in tier &&
                "description" in tier &&
                "monthly_price" in tier &&
                "yearly_price" in tier &&
                "features" in tier
            )
            .map((tier) => (
              <Card key={tier.id} className={tier && subscription?.tier_id && tier.id === subscription.tier_id ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold">
                        {billingCycle === "monthly" 
                          ? formatPrice(tier.monthly_price)
                          : formatPrice(tier.yearly_price)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      </p>
                    </div>
                    {renderFeatures(tier.features)}
                  </div>
                </CardContent>
                <CardFooter>
                  {tier && subscription && tier.id === subscription.tier_id ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleChangePlan(tier.id)}
                    >
                      {subscription ? "Change Plan" : "Select Plan"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )) : <p>No plans available.</p>}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
