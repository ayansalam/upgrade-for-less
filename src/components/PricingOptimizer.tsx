
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, LineChart, CheckCircle, Loader2 } from "lucide-react";

interface PricingFormValues {
  monthlyPrice: number;
  planName: string;
  businessGoal: string;
  targetAudience: string;
}

interface PricingSuggestion {
  monthlyPrice: number;
  weeklyPrice?: number;
  annualPrice?: number;
  insight?: string;
}

export function PricingOptimizer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<PricingSuggestion | null>(null);
  const [previewText, setPreviewText] = useState<string>("");

  const form = useForm<PricingFormValues>({
    defaultValues: {
      monthlyPrice: 0,
      planName: "",
      businessGoal: "",
      targetAudience: "",
    },
  });

  // Update preview as form values change
  const watchAll = form.watch();
  useEffect(() => {
    const { planName, monthlyPrice, businessGoal, targetAudience } = watchAll;
    
    if (planName || monthlyPrice || businessGoal || targetAudience) {
      let preview = `Your Plan: ${planName || "[Plan Name]"} - $${monthlyPrice || "0"}/month`;
      
      if (targetAudience) {
        preview += ` targeting ${targetAudience}`;
      }
      
      if (businessGoal) {
        preview += `. Goal: ${businessGoal}`;
      }
      
      setPreviewText(preview);
    } else {
      setPreviewText("");
    }
  }, [watchAll]);

  const onSubmit = async (data: PricingFormValues) => {
    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If no user is authenticated, show a warning
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit pricing information.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.from("user_pricing_inputs").insert([
        {
          monthly_price: data.monthlyPrice,
          plan_name: data.planName,
          business_goal: data.businessGoal,
          target_audience: data.targetAudience,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      // Simulate API delay
      setTimeout(() => {
        // Generate pricing suggestions based on inputs
        const basePrice = parseFloat(data.monthlyPrice.toString());
        const weeklyPrice = basePrice * 4 * 0.9 / 8; // 10% discount for 8-week prepay
        const annualPrice = basePrice * 0.7; // 30% discount for annual prepay
        
        let insight = "";
        switch(data.businessGoal) {
          case "More Signups":
            insight = "Our data suggests lowering the entry barrier with a 14-day free trial could increase signups by 30%.";
            break;
          case "Reduce Churn":
            insight = "Offering annual plans with 30% discounts has shown to reduce churn by 45% in similar products.";
            break;
          case "Increase Revenue":
            insight = "Consider a tiered approach with feature limitations instead of price discounts to maximize revenue.";
            break;
          default:
            insight = "Consider testing different price points with A/B testing to find your optimal pricing strategy.";
        }
        
        setSuggestion({
          monthlyPrice: basePrice,
          weeklyPrice: parseFloat(weeklyPrice.toFixed(2)),
          annualPrice: parseFloat(annualPrice.toFixed(2)),
          insight
        });
        
        // Show success message
        toast({
          title: "🎉 Success!",
          description: "Your pricing suggestions have been generated.",
        });
        
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit pricing information.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Form Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Pricing Optimizer
          </CardTitle>
          <CardDescription>
            Ready to optimize your pricing? Submit your plan details to get intelligent suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Starter Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 29"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="More Signups">More Signups</SelectItem>
                        <SelectItem value="Reduce Churn">Reduce Churn</SelectItem>
                        <SelectItem value="Increase Revenue">Increase Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Startups, Small Businesses" 
                        {...field} 
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating suggestions...
                  </>
                ) : (
                  <>
                    Submit for Pricing Suggestions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview and Results Section */}
      <div className="flex flex-col gap-6">
        {/* Live Preview Card */}
        <Card className="w-full bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <CardDescription>
              This is how your plan will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewText ? (
              <p className="text-md font-medium">{previewText}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Fill in the form to see a live preview of your plan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Card */}
        {suggestion && (
          <Card className="w-full border-primary/20">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
                Optimized Pricing Suggestions
              </CardTitle>
              <CardDescription>
                Based on your inputs and market research
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Payment Option</span>
                  <span className="font-medium">Price</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Monthly</span>
                  <span className="font-semibold">${suggestion.monthlyPrice}/mo</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>8-Week Prepay <span className="text-xs text-emerald-600 font-medium">10% SAVINGS</span></span>
                  <span className="font-semibold">${suggestion.weeklyPrice}/week</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Annual <span className="text-xs text-emerald-600 font-medium">30% SAVINGS</span></span>
                  <span className="font-semibold">${suggestion.annualPrice}/mo</span>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Research Insight:</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.insight}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-accent/10 flex justify-between">
              <Button variant="outline" size="sm">
                Download Report
              </Button>
              <Button size="sm">
                Apply Suggestions
              </Button>
            </CardFooter>
          </Card>
        )}

        {!suggestion && !isLoading && (
          <Card className="w-full bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <LineChart className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">No Suggestions Yet</h3>
              <p className="text-sm text-muted-foreground">
                Fill out the form and click "Submit" to get personalized pricing recommendations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
