
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import UsageSettings from "@/components/settings/UsageSettings";
import PreferenceSettings from "@/components/settings/PreferenceSettings";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Bell, CreditCard, Package, Activity, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

const AccountSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Extract tab from URL if present
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          return;
        }
        
        // If no authenticated session, enter demo mode instead of redirecting
        console.log("No authenticated session, entering demo mode");
        setDemoMode(true);
        setUser({ id: "demo-user-id", email: "demo@example.com" });
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Enter demo mode instead of redirecting
        setDemoMode(true);
        setUser({ id: "demo-user-id", email: "demo@example.com" });
        setIsLoading(false);
      }
    };

    checkUser();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading your account settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      {demoMode && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            <strong>Demo Mode:</strong> You're viewing account settings in demo mode. 
            <button 
              onClick={() => navigate('/auth')} 
              className="ml-2 text-blue-600 hover:underline"
            >
              Sign in
            </button> for full access.
          </p>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Usage</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="p-6">
            <ProfileSettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="p-6">
            <SecuritySettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card className="p-6">
            <SubscriptionSettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <NotificationSettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card className="p-6">
            <PaymentSettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card className="p-6">
            <UsageSettings user={user} />
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="p-6">
            <PreferenceSettings user={user} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
