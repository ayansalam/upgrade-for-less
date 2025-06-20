
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingOptimizer } from "@/components/PricingOptimizer";
import { AIPricingAssistant } from "@/components/AIPricingAssistant";
import { LineChart, HelpCircle, User, Settings, Sparkles, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { useToast } from "@/components/ui/use-toast";
 import { PLAN_LIMITS } from '@/config/planLimits';


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, isLoading, navigate]);
  
  // Payment SDK loading has been removed
  
  // Payment processing code has been removed
  
  // Check for new signup
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isNewUser = queryParams.get('newSignup') === 'true';
    const selectedPlan = localStorage.getItem('selectedPlan');
    
    if (isNewUser && selectedPlan && user) {
      // Payment integration has been removed
      // Clear the selectedPlan from localStorage
      localStorage.removeItem('selectedPlan');
      toast({
        title: "Welcome to Upgrade For Less",
        description: "Your account has been created successfully.",
        variant: "default"
      });
    }
  }, [location.search, user]);
  
  const [pricingFormValues, setPricingFormValues] = useState({
    monthlyPrice: 0,
    planName: "",
    businessGoal: "",
    targetAudience: "",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user ? (
              <>
                <p className="text-gray-500">Welcome, {user.email.split('@')[0]}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Your Plan: <span className="font-semibold">{user.plan}</span></p>
                  {user.plan !== 'Pro' && user.plan !== 'LTD' && (
                    <p>Usage: <span className="font-semibold">{user.usesThisMonth}</span> of <span className="font-semibold">{PLAN_LIMITS[user.plan]}</span> upgrades used this month.</p>
                  )}
                  {(user.plan === 'Free' || user.plan === 'Starter') && user.usesThisMonth >= PLAN_LIMITS[user.plan] && (
                    <p className="text-red-500 mt-1">You've reached your monthly limit. <Link to="/pricing" className="text-blue-600 hover:underline">Upgrade your plan</Link> for more!</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Please log in to access your dashboard</p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/support"><HelpCircle className="h-4 w-4 mr-2" /> Get Help</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account-settings"><Settings className="h-4 w-4 mr-2" /> Account Settings</Link>
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="flex items-center pt-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <LineChart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">🎯 Welcome to the Pricing Optimizer!</h2>
              <p className="text-muted-foreground">
                Ready to optimize your pricing? Submit your current plan details below, and we'll suggest winning strategies!
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Area */}
        <Tabs defaultValue="optimizer" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Pricing Optimizer
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Pricing Assistant
            </TabsTrigger>
          </TabsList>
          <TabsContent value="optimizer">
            <PricingOptimizer initialValues={pricingFormValues} />
          </TabsContent>
          <TabsContent value="ai-assistant">
            <AIPricingAssistant 
              onUseSuggestions={(suggestions) => {
                setPricingFormValues({
                  monthlyPrice: suggestions.monthlyPrice,
                  planName: suggestions.planName,
                  businessGoal: suggestions.businessGoal,
                  targetAudience: suggestions.targetAudience,
                });
                // Switch to the optimizer tab after applying suggestions
                const optimizerTab = document.querySelector('[data-value="optimizer"]');
                if (optimizerTab && optimizerTab instanceof HTMLElement) {
                  optimizerTab.click();
                }
              }} 
            />
          </TabsContent>
        </Tabs>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/account-settings"><User className="h-4 w-4 mr-2" /> Profile</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/account-settings?tab=subscription">
                    <LineChart className="h-4 w-4 mr-2" /> Subscription
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Support</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/support"><HelpCircle className="h-4 w-4 mr-2" /> Help Center</Link>
                </Button>
                {/* Demo scheduling link removed */}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tips</CardTitle>
              <CardDescription>
                Get the most out of our pricing optimizer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full text-xs mr-2">1</span>
                  <span>Start with your current pricing to get the most relevant recommendations.</span>
                </p>
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full text-xs mr-2">2</span>
                  <span>Be specific about your target audience to receive tailored suggestions.</span>
                </p>
                <p className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1 rounded-full text-xs mr-2">3</span>
                  <span>Experiment with different business goals to see various optimization strategies.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => navigate('/')} 
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Dashboard;
