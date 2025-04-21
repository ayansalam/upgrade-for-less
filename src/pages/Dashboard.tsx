import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CreditCard, HelpCircle, Home, LineChart, Settings, User } from "lucide-react";
import { PricingOptimizer } from "@/components/PricingOptimizer";

const Dashboard = () => {
  // Mock user data - in a real app, this would come from a backend
  const userData = {
    name: "John Doe",
    plan: "Premium",
    discount: "30% off for 52 weeks",
    startDate: "January 15, 2025",
    nextPayment: "May 15, 2025",
    paymentAmount: 34.30, // 30% off the $49 base price
    daysRemaining: 48,
    totalDays: 52 * 7, // 52 weeks in days
  };

  // Calculate progress for discount period
  const daysUsed = userData.totalDays - userData.daysRemaining;
  const progressPercentage = (daysUsed / userData.totalDays) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {userData.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild variant="outline" className="mr-2">
              <Link to="/support"><HelpCircle className="h-4 w-4 mr-2" /> Get Help</Link>
            </Button>
            <Button asChild>
              <Link to="/"><Home className="h-4 w-4 mr-2" /> Home</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>Current plan and discount details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">{userData.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Discount Applied</p>
                  <p className="font-medium text-green-600">{userData.discount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{userData.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Payment</p>
                  <p className="font-medium">{userData.nextPayment}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Discount Period</p>
                  <p className="text-sm text-gray-500">{userData.daysRemaining} days remaining</p>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>
          
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Monthly charge</span>
                <span className="font-medium">${userData.paymentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span>Savings</span>
                <span className="font-medium">$14.70/month</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Next payment</span>
                  <span className="font-medium">${userData.paymentAmount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">On {userData.nextPayment}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/support">
                  <CreditCard className="h-4 w-4 mr-2" /> Update Payment Method
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <PricingOptimizer />
          </div>
          
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" /> Account Settings
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/support">
                  <HelpCircle className="h-4 w-4 mr-2" /> Get Support
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/billing">
                  <CreditCard className="h-4 w-4 mr-2" /> Billing History
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/usage">
                  <LineChart className="h-4 w-4 mr-2" /> Usage Analytics
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/calendar">
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Demo
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Special Offers / Upsell */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Maximize Your Savings</CardTitle>
              <CardDescription>Opportunities to get more value from your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-2">Recommend UpgradeForLess to a friend</h3>
                <p className="text-sm text-gray-600 mb-4">
                  When they sign up, you both get an additional 5% off your subscription for 3 months.
                </p>
                <Button variant="secondary" size="sm">
                  Invite Friends <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
