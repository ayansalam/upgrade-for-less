
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PricingCard from "./PricingCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Example: Monthly plan price
const MONTHLY_PRICE = 29;

const DISCOUNTS = [
  {
    key: "none",
    label: "No discount",
    percent: 0,
    durationLabel: "Cancel anytime",
    description: "Pay full price, month-to-month.",
  },
  {
    key: "8weeks",
    label: "15% off for 8 weeks",
    percent: 15,
    durationLabel: "8 weeks",
    description: "Get 15% off for 8 weeks, pay monthly after.",
  },
  {
    key: "52weeks",
    label: "30% off for 52 weeks",
    percent: 30,
    durationLabel: "52 weeks",
    description: "Get 30% off for 52 weeks, pay monthly after.",
  },
];

const PricingSection = () => {
  const [selectedDiscount, setSelectedDiscount] = useState<"none" | "8weeks" | "52weeks">("none");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in
  useState(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    
    checkUser();
  });

  const handleDiscountChange = (key: string) => {
    setSelectedDiscount(key as "none" | "8weeks" | "52weeks");
  };

  // Calculate discounted price
  const getDisplayPrice = () => {
    const discount = DISCOUNTS.find((d) => d.key === selectedDiscount)!;
    return discount.percent === 0
      ? MONTHLY_PRICE
      : Math.round(MONTHLY_PRICE * (1 - discount.percent / 100));
  };

  const selectedOption = DISCOUNTS.find((d) => d.key === selectedDiscount);

  const handleStartFreeTrial = () => {
    if (!user) {
      // If not logged in, redirect to auth page
      navigate("/auth");
      toast({
        title: "Login required",
        description: "Please log in or sign up to start your free trial.",
      });
    } else {
      // If logged in, show success message
      toast({
        title: "Free trial started!",
        description: "Your 14-day free trial has been activated.",
      });
      // In a real app, this would also call an API to start the trial
    }
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo scheduled!",
      description: "Thank you for your interest. Our team will contact you soon to schedule a demo.",
    });
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Simple, Transparent Discounts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the discount that works best for you. All options include a 14-day free trial.
          </p>
        </div>

        <div className="mb-8">
          <RadioGroup
            value={selectedDiscount}
            onValueChange={handleDiscountChange}
            className="flex flex-col md:flex-row gap-4 items-center justify-center"
          >
            {DISCOUNTS.map((option) => (
              <Label
                key={option.key}
                className={`w-full md:w-1/3 transition bg-white rounded-lg px-6 py-4 shadow border cursor-pointer hover:border-brand
                  ${selectedDiscount === option.key ? "border-brand bg-brand-light" : "border-gray-200"}
                `}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value={option.key} id={option.key} />
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{option.description}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <PricingCard
          title="Upgrade Subscription"
          price={getDisplayPrice()}
          yearly={false}
          description={selectedOption?.description ?? ""}
          features={[
            "Everything in the product",
            "Cancel anytime",
            "14-day free trial",
            selectedDiscount !== "none"
              ? `${selectedOption?.percent}% discount for ${selectedOption?.durationLabel}`
              : "No discount",
          ]}
          buttonText={
            selectedDiscount === "none"
              ? "Start Free Trial"
              : `Start Free Trial (with ${selectedOption?.label})`
          }
          // Add onClick handler to button
          onButtonClick={handleStartFreeTrial}
        />

        {/* Demo CTA */}
        <div className="text-center mt-12">
          <p className="text-lg mb-4">Not ready to commit? See our product in action first.</p>
          <button 
            onClick={handleScheduleDemo}
            className="text-brand font-medium hover:underline"
          >
            Schedule a Live Demo →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
