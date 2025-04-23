
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Unlimited access to all features",
  "Priority customer support",
  "Advanced analytics dashboard",
  "Custom integrations",
  "No setup fees"
];

const Pricing = () => {
  const [discountOption, setDiscountOption] = useState("none");
  
  const basePrice = 49;
  const getPriceWithDiscount = () => {
    switch (discountOption) {
      case "8weeks":
        return (basePrice * 0.85).toFixed(2); // 15% off
      case "52weeks":
        return (basePrice * 0.7).toFixed(2); // 30% off
      default:
        return basePrice.toFixed(2);
    }
  };

  const getButtonText = () => {
    switch (discountOption) {
      case "8weeks":
        return "Start with 15% off";
      case "52weeks":
        return "Start with 30% off";
      default:
        return "Start your trial";
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            One plan with all features included. Choose a discount option that works for you.
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <CardDescription>Everything you need for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-4xl font-bold">${getPriceWithDiscount()}<span className="text-base font-normal text-gray-500">/month</span></p>
              {discountOption !== "none" && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {discountOption === "8weeks" ? "15% off for 8 weeks" : "30% off for 52 weeks"}
                </p>
              )}
            </div>
            
            <div className="space-y-3 my-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <p className="font-medium mb-2">Choose your discount:</p>
              <RadioGroup value={discountOption} onValueChange={setDiscountOption} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">Standard monthly price</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8weeks" id="8weeks" />
                  <Label htmlFor="8weeks">15% off for 8 weeks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="52weeks" id="52weeks" />
                  <Label htmlFor="52weeks">30% off for 52 weeks</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 rounded-lg transition-colors"
              asChild
            >
              <Link to="/auth?tab=signup">{getButtonText()}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
