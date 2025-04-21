
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, LineChart } from "lucide-react";

interface PricingFormValues {
  monthlyPrice: number;
  planName: string;
  businessGoal: string;
}

export function PricingOptimizer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const form = useForm<PricingFormValues>({
    defaultValues: {
      monthlyPrice: 0,
      planName: "",
      businessGoal: "",
    },
  });

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
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your pricing information has been submitted.",
      });

      // For now, we'll just show a loading state
      // Later this will be updated by Make.com via Supabase
      setSuggestion("Generating smart pricing suggestions...");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit pricing information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Pricing Optimizer
        </CardTitle>
        <CardDescription>
          Get AI-powered pricing suggestions based on your business goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your current monthly price"
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
              name="planName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your plan name" {...field} />
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

            <Button type="submit" disabled={isLoading} className="w-full">
              Get Pricing Suggestions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>

        {suggestion ? (
          <div className="mt-6 rounded-lg bg-accent/50 p-4">
            <p className="text-sm">{suggestion}</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Submit your monthly price to get optimized pricing suggestions.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
