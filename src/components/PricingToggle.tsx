
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BadgePercent } from "lucide-react";

interface PricingToggleProps {
  yearlyDiscount: number;
  onChange: (yearly: boolean) => void;
}

const PricingToggle = ({ yearlyDiscount, onChange }: PricingToggleProps) => {
  const [yearly, setYearly] = useState(false);

  const handleToggle = () => {
    const newValue = !yearly;
    setYearly(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <div className="flex items-center space-x-2 mb-3">
        <Label htmlFor="pricing-toggle" className="text-lg font-medium cursor-pointer">
          Pay Monthly
        </Label>
        <Switch id="pricing-toggle" checked={yearly} onCheckedChange={handleToggle} />
        <div className="flex items-center">
          <Label htmlFor="pricing-toggle" className="text-lg font-medium cursor-pointer mr-2">
            Pay Yearly
          </Label>
          {yearly && (
            <span className="inline-flex items-center bg-discount-light text-discount-DEFAULT text-sm font-medium px-2.5 py-0.5 rounded-full">
              <BadgePercent className="mr-1 h-3.5 w-3.5" />
              Save {yearlyDiscount}%
            </span>
          )}
        </div>
      </div>
      {yearly && (
        <p className="text-sm text-muted-foreground animate-fade-in">
          You'll be billed yearly and save {yearlyDiscount}% compared to monthly billing.
        </p>
      )}
    </div>
  );
};

export default PricingToggle;
