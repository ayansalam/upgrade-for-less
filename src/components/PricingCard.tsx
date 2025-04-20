
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: number;
  yearlyPrice?: number;
  yearly: boolean;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const PricingCard = ({
  title,
  price,
  yearlyPrice,
  yearly,
  description,
  features,
  popular = false,
  buttonText = "Get Started",
  onButtonClick,
}: PricingCardProps) => {
  const displayPrice = yearly && yearlyPrice ? yearlyPrice : price;
  const monthlyEquivalent = yearly && yearlyPrice ? Math.round(yearlyPrice / 12) : null;
  
  return (
    <Card className={`w-full ${popular ? 'border-brand shadow-lg' : ''} transition-all duration-300 hover:shadow-md`}>
      <CardHeader>
        {popular && <Badge className="mb-2 bg-brand hover:bg-brand-dark">Most Popular</Badge>}
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">${displayPrice}</span>
            <span className="text-muted-foreground ml-1">/{yearly ? 'year' : 'month'}</span>
          </div>
          {yearly && monthlyEquivalent && (
            <p className="text-sm text-muted-foreground mt-1">
              Just ${monthlyEquivalent}/mo when billed annually
            </p>
          )}
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-brand mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${popular ? 'bg-brand hover:bg-brand-dark' : ''}`}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
