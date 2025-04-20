
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Subscription {
  id: string;
  status: string;
  is_yearly: boolean;
  current_period_end: string | null;
  tier: {
    name: string;
    monthly_price: number;
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      fetchUserData(session.user.id);
    };

    checkUser();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch subscription data
      const { data: subscriptionData, error: subError } = await supabase
        .from("subscriptions")
        .select(`
          id,
          status,
          is_yearly,
          current_period_end,
          subscription_tiers (
            name,
            monthly_price
          )
        `)
        .eq("user_id", userId)
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.error("Error fetching subscription:", subError);
      } else if (subscriptionData) {
        setSubscription({
          ...subscriptionData,
          tier: subscriptionData.subscription_tiers
        });
      }

      // Fetch payment history
      const { data: paymentData, error: payError } = await supabase
        .from("payments")
        .select("id, amount, status, payment_date")
        .eq("user_id", userId)
        .order("payment_date", { ascending: false });

      if (payError) {
        console.error("Error fetching payments:", payError);
      } else {
        setPayments(paymentData || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountInfo = () => {
    if (!subscription) return { hasDiscount: false, discountPercent: 0, duration: "" };
    
    if (subscription.is_yearly) {
      return { hasDiscount: true, discountPercent: 30, duration: "52 weeks" };
    }
    
    // For demonstration purposes, assuming 8-week discount
    // In a real app, you'd store the discount info in the database
    const hasDiscount = Math.random() > 0.5; // Just for demo
    return { 
      hasDiscount, 
      discountPercent: hasDiscount ? 15 : 0,
      duration: hasDiscount ? "8 weeks" : ""
    };
  };

  const { hasDiscount, discountPercent, duration } = getDiscountInfo();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading your dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Subscription Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Subscription</CardTitle>
                <CardDescription>
                  Current plan and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {subscription.tier?.name || "Standard"} Plan
                        </h3>
                        <p className="text-muted-foreground">
                          Status: <span className={`font-medium ${subscription.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      {subscription.status === "active" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Base Price</p>
                          <p className="font-semibold">{formatCurrency(subscription.tier?.monthly_price || 2900)}/month</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Payment Date</p>
                          <p className="font-semibold">{formatDate(subscription.current_period_end)}</p>
                        </div>
                      </div>
                    </div>

                    {hasDiscount && (
                      <div className="bg-brand-light border border-brand p-4 rounded-lg mb-6">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-brand mr-2 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Discount Applied</p>
                            <p className="text-muted-foreground">
                              You're saving {discountPercent}% for {duration}!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "Subscription management will be available soon." })}>
                        Manage Subscription
                      </Button>
                      <Button className="bg-brand hover:bg-brand-dark" onClick={() => toast({ title: "Coming soon", description: "Payment method management will be available soon." })}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Update Payment Method
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have an active subscription yet.
                    </p>
                    <Button className="bg-brand hover:bg-brand-dark" onClick={() => navigate("/#pricing")}>
                      View Pricing Options
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>
                  Your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {user?.created_at 
                        ? formatDate(user.created_at) 
                        : formatDate(new Date().toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium">{subscription ? "Paid" : "Free Trial"}</p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => toast({ title: "Coming soon", description: "Account settings will be available soon." })}>
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="py-3 px-4">{formatDate(payment.payment_date)}</td>
                        <td className="py-3 px-4">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            payment.status === "succeeded" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                            payment.status === "processing" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                            "bg-red-100 text-red-800 hover:bg-red-200"
                          }>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment history available.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
