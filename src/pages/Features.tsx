
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Layers, LifeBuoy, Rocket, Settings, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Smart Pricing Strategy",
      description: "Reframe your subscription pricing to focus on discounts rather than plan duration.",
      icon: <Rocket className="h-8 w-8 text-primary" />
    },
    {
      title: "Conversion Analytics",
      description: "Track how different discount options impact your conversion rates in real-time.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />
    },
    {
      title: "User Dashboard",
      description: "Give users transparency with a clean dashboard showing their plan and savings.",
      icon: <Layers className="h-8 w-8 text-primary" />
    },
    {
      title: "Admin Controls",
      description: "Manage users, view selected discounts and payment histories from one place.",
      icon: <Settings className="h-8 w-8 text-primary" />
    },
    {
      title: "Seamless Integration",
      description: "Easily integrate with your existing SaaS platform with our simple API.",
      icon: <Zap className="h-8 w-8 text-primary" />
    },
    {
      title: "Priority Support",
      description: "Get help whenever you need it with our dedicated support team.",
      icon: <LifeBuoy className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our innovative approach to subscription pricing helps increase conversions by reframing the value proposition.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your conversion rates?</h2>
            <p className="text-gray-600">
              Join the many businesses that have seen up to 4x increase in subscription conversions.
            </p>
          </div>
          
          <Button asChild size="lg" className="mr-4">
            <Link to="/pricing">See Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
