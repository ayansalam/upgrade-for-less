import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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
import { useIsMobile } from "@/hooks/use-mobile";

const AccountSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const isMobile = useIsMobile();

  const tabs = [
    { value: "profile", icon: <User className="h-4 w-4" />, label: "Profile" },
    { value: "security", icon: <Shield className="h-4 w-4" />, label: "Security" },
    { value: "subscription", icon: <Package className="h-4 w-4" />, label: "Subscription" },
    { value: "notifications", icon: <Bell className="h-4 w-4" />, label: "Notifications" },
    { value: "payment", icon: <CreditCard className="h-4 w-4" />, label: "Payment" },
    { value: "usage", icon: <Activity className="h-4 w-4" />, label: "Usage" },
    { value: "preferences", icon: <Settings className="h-4 w-4" />, label: "Preferences" },
  ];

  useEffect(() => {
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
        
        console.log("No authenticated session, entering demo mode");
        setDemoMode(true);
        setUser({ id: "demo-user-id", email: "demo@example.com" });
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
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
        {isMobile ? (
          <div className="mb-6">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-1">
                {tabs.map((tab) => (
                  <CarouselItem key={tab.value} className="pl-1 basis-1/3">
                    <TabsTrigger
                      value={tab.value}
                      className="w-full flex flex-col items-center gap-1 p-2"
                    >
                      {tab.icon}
                      <span className="text-xs">{tab.label}</span>
                    </TabsTrigger>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          <TabsList className="grid grid-cols-7 gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}

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
