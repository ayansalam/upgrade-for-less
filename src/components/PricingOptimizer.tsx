
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
  quarterlyPrice?: number;
  annualPrice?: number;
  quarterlySavings?: number;
  annualSavings?: number;
  quarterlyTotalCost?: number;
  annualTotalCost?: number;
  insight?: string;
}

interface PricingOptimizerProps {
  initialValues?: {
    monthlyPrice?: number;
    planName?: string;
    businessGoal?: string;
    targetAudience?: string;
  };
}

export function PricingOptimizer({ initialValues }: PricingOptimizerProps = {}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<PricingSuggestion | null>(null);
  const [previewText, setPreviewText] = useState<string>("");
  const [makeResponse, setMakeResponse] = useState<string | null>(null);
  const [makeError, setMakeError] = useState<string | null>(null);

  const form = useForm<PricingFormValues>({
    defaultValues: {
      monthlyPrice: initialValues?.monthlyPrice || 0,
      planName: initialValues?.planName || "",
      businessGoal: initialValues?.businessGoal || "",
      targetAudience: initialValues?.targetAudience || "",
    },
  });
  
  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.reset({
        monthlyPrice: initialValues.monthlyPrice || form.getValues().monthlyPrice,
        planName: initialValues.planName || form.getValues().planName,
        businessGoal: initialValues.businessGoal || form.getValues().businessGoal,
        targetAudience: initialValues.targetAudience || form.getValues().targetAudience,
      });
    }
  }, [initialValues, form]);

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
      // Allow free trial mode for unauthenticated users
      let userId = user ? user.id : "demo-user-id";
      let userEmail = user ? user.email : "demo@example.com";
      if (!user) {
        toast({
          title: "Free Trial Mode",
          description: "You are using the Pricing Optimizer in free trial mode. Sign up to save your results!",
        });
      }
      // Save input if authenticated, skip DB insert for demo
      if (user) {
        const { error } = await supabase.from("user_pricing_inputs").insert([
          {
            monthly_price: data.monthlyPrice,
            plan_name: data.planName,
            business_goal: data.businessGoal,
            target_audience: data.targetAudience,
            user_id: userId,
          },
        ]);
        if (error) throw error;
      }
      // Simulate API delay
      setTimeout(() => {
        // Generate pricing suggestions based on inputs
        const basePrice = parseFloat(data.monthlyPrice.toString());
        
        // Calculate quarterly price (15% discount)
        const quarterlyDiscount = 0.15;
        const quarterlyPrice = basePrice * (1 - quarterlyDiscount);
        
        // Calculate annual price (30% discount)
        const annualDiscount = 0.30;
        const annualPrice = basePrice * (1 - annualDiscount);
        
        // Calculate savings and total costs
        const quarterlySavings = basePrice * quarterlyDiscount;
        const annualSavings = basePrice * annualDiscount;
        
        // Total costs for comparison (3 months and 12 months)
        const monthlyTotalCost = basePrice * 3; // 3 months at monthly rate
        const quarterlyTotalCost = quarterlyPrice * 3; // 3 months at quarterly rate
        const annualTotalCost = annualPrice * 12; // 12 months at annual rate
        
        let insight = "";
        switch(data.businessGoal) {
          case "More Signups":
            insight = "Our data suggests offering a quarterly plan with 15% savings can increase conversion rates by 25% compared to monthly-only options.";
            break;
          case "Reduce Churn":
            insight = "Customers on annual plans have 78% higher retention rates. Consider highlighting the 30% annual discount to encourage longer commitments.";
            break;
          case "Increase Revenue":
            insight = "Quarterly subscribers spend 22% more annually than monthly subscribers. Emphasize the quarterly option as your recommended choice.";
            break;
          default:
            insight = "Offering multiple subscription durations with increasing discounts creates a natural upgrade path that maximizes customer lifetime value.";
        }
        
        setSuggestion({
          monthlyPrice: basePrice,
          quarterlyPrice: parseFloat(quarterlyPrice.toFixed(2)),
          annualPrice: parseFloat(annualPrice.toFixed(2)),
          quarterlySavings: parseFloat(quarterlySavings.toFixed(2)),
          annualSavings: parseFloat(annualSavings.toFixed(2)),
          quarterlyTotalCost: parseFloat(quarterlyTotalCost.toFixed(2)),
          annualTotalCost: parseFloat(annualTotalCost.toFixed(2)),
          insight
        });
        
        toast({
          title: "🎉 Success!",
          description: user ? "Your pricing suggestions have been generated." : "Your free trial pricing suggestions have been generated.",
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
            <CardContent>
              {suggestion ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">Payment Option</span>
                    <span className="font-medium">Price</span>
                  </div>
                  
                  {/* Monthly Plan */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Monthly</span>
                      <span className="font-medium">${suggestion.monthlyPrice}/mo</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Pay month-to-month with maximum flexibility</p>
                      <p className="mt-1">3-month cost: ${(suggestion.monthlyPrice * 3).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Quarterly Plan - Recommended */}
                  <div className="space-y-1 bg-primary/5 p-3 rounded-md border border-primary/20 relative">
                    <div className="absolute -top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">RECOMMENDED</div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Quarterly</span>
                      <span className="font-medium">${suggestion.quarterlyPrice}/mo</span>
                    </div>
                    <div className="text-sm">
                      <p>Save ${suggestion.quarterlySavings}/mo with quarterly billing</p>
                      <div className="flex justify-between mt-1">
                        <p>3-month cost: <span className="line-through text-muted-foreground">${(suggestion.monthlyPrice * 3).toFixed(2)}</span> <span className="font-medium">${suggestion.quarterlyPrice * 3}</span></p>
                        <p className="text-green-600 font-medium">SAVE 15%</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <p className="text-sm font-medium text-primary">Upgrade from monthly and save ${((suggestion.monthlyPrice * 3) - (suggestion.quarterlyPrice * 3)).toFixed(2)} every 3 months</p>
                    </div>
                  </div>
                  
                  {/* Annual Plan */}
                  <div className="space-y-1 bg-accent/20 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Annual</span>
                      <span className="font-medium">${suggestion.annualPrice}/mo</span>
                    </div>
                    <div className="text-sm">
                      <p>Our best value: Save ${suggestion.annualSavings}/mo with annual billing</p>
                      <div className="flex justify-between mt-1">
                        <p>Annual cost: <span className="line-through text-muted-foreground">${(suggestion.monthlyPrice * 12).toFixed(2)}</span> <span className="font-medium">${suggestion.annualTotalCost}</span></p>
                        <p className="text-green-600 font-medium">SAVE 30%</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <p className="text-sm font-medium text-primary">Upgrade from quarterly and save ${((suggestion.quarterlyPrice * 12) - (suggestion.annualPrice * 12)).toFixed(2)} more per year</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className="font-medium">Research Insight:</span>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.insight}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Submit your plan details to get suggestions.</p>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" disabled={!suggestion}>
                Download Report
              </Button>
              <Button disabled={!suggestion} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                Apply Suggestions
              </Button>
            </CardFooter>
          </Card>
        )}
        {/* Make.com Webhook Response Card */}
        {makeResponse && (
          <Card className="w-full border-green-400/40 mt-2">
            <CardHeader className="bg-green-50 border-b border-green-200/40">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Make.com Webhook Response
              </CardTitle>
              <CardDescription>
                Data received from Make.com
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto whitespace-pre-wrap">{makeResponse}</pre>
            </CardContent>
          </Card>
        )}
        {makeError && (
          <Card className="w-full border-red-400/40 mt-2">
            <CardHeader className="bg-red-50 border-b border-red-200/40">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-4 w-4 text-red-600" />
                Make.com Webhook Error
              </CardTitle>
              <CardDescription>
                There was a problem contacting Make.com
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-700">{makeError}</p>
            </CardContent>
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
