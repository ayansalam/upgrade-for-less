
import { useState } from "react";
import PricingToggle from "./PricingToggle";
import PricingCard from "./PricingCard";

const YEARLY_DISCOUNT = 20;

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  // Calculate yearly prices (with discount applied)
  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round((monthlyPrice * 12) * (1 - YEARLY_DISCOUNT / 100));
  };

  const handleToggleChange = (isYearly: boolean) => {
    setYearly(isYearly);
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </div>

        <PricingToggle yearlyDiscount={YEARLY_DISCOUNT} onChange={handleToggleChange} />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Starter"
            price={29}
            yearlyPrice={getYearlyPrice(29)}
            yearly={yearly}
            description="Perfect for individuals and small teams just getting started."
            features={[
              "Up to 5 team members",
              "10 GB storage",
              "Basic reporting",
              "Email support",
              "2 projects"
            ]}
          />
          
          <PricingCard
            title="Professional"
            price={79}
            yearlyPrice={getYearlyPrice(79)}
            yearly={yearly}
            description="Ideal for growing businesses and teams who need more power."
            features={[
              "Up to 20 team members",
              "50 GB storage",
              "Advanced reporting",
              "Priority email support",
              "10 projects",
              "API access"
            ]}
            popular={true}
          />
          
          <PricingCard
            title="Enterprise"
            price={149}
            yearlyPrice={getYearlyPrice(149)}
            yearly={yearly}
            description="For large organizations with advanced needs and dedicated support."
            features={[
              "Unlimited team members",
              "500 GB storage",
              "Custom reporting",
              "24/7 phone support",
              "Unlimited projects",
              "API access",
              "Dedicated account manager"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
