import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { generatePricingSuggestions, extractJsonFromResponse } from "@/api/gemini";


// This interface is now defined inside the component

interface AIPricingSuggestion {
  planName: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  targetAudience: string;
  businessGoal: string;
  insight: string;
}

export function AIPricingAssistant({ onUseSuggestions }: { onUseSuggestions?: (suggestions: AIPricingSuggestion) => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AIPricingSuggestion | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  interface AIPricingFormValues {
    businessDescription: string;
    monthlyPrice: number;
    businessGoal: string;
  }

  const form = useForm<AIPricingFormValues>({
    defaultValues: {
      businessDescription: "",
      monthlyPrice: 0,
      businessGoal: "",
    },
  });



  const onSubmit = async (data: AIPricingFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);
      const response = await generatePricingSuggestions({
        businessDescription: data.businessDescription,
        monthlyPrice: data.monthlyPrice,
        businessGoal: data.businessGoal
      });
      
      // Extract and process the JSON response
      const jsonData = extractJsonFromResponse(response);
      
      // Calculate quarterly and annual prices based on discounts
      const monthlyPrice = jsonData.monthlyPrice || data.monthlyPrice;
      const weeklyDiscount = jsonData.weeklyDiscount || 15; // Default 15% discount for 8-week
      const annualDiscount = jsonData.annualDiscount || 30; // Default 30% discount for annual
      
      // Set the suggestion
      setSuggestion({
        planName: jsonData.planName || "AI Generated Plan",
        monthlyPrice: monthlyPrice,
        quarterlyPrice: monthlyPrice * (1 - (weeklyDiscount / 100)),
        annualPrice: monthlyPrice * (1 - (annualDiscount / 100)),
        targetAudience: jsonData.targetAudience || "Businesses looking to optimize pricing",
        businessGoal: jsonData.businessGoal || data.businessGoal,
        insight: jsonData.insight || "AI-generated pricing strategy based on your inputs."
      });
      
      toast({
        title: "AI Suggestions Generated",
        description: "Your AI pricing suggestions have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setApiError(error.message || "Failed to generate AI pricing suggestions");
      toast({
        title: "Error",
        description: "Failed to generate AI pricing suggestions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSuggestions = () => {
    if (suggestion && onUseSuggestions) {
      onUseSuggestions(suggestion);
      toast({
        title: "Suggestions Applied",
        description: "AI suggestions have been applied to the Pricing Optimizer.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full border border-purple-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Pricing Assistant
          </CardTitle>
          <CardDescription className="text-purple-700">
            Get AI-powered pricing suggestions using our Gemini integration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">


              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business, product, or service" 
                        {...field} 
                        className="resize-none min-h-[100px]"
                      />
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
                    <FormLabel>Current Monthly Price ($)</FormLabel>
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

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI suggestions...
                  </>
                ) : (
                  <>
                    Generate AI Pricing Suggestions
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-4 p-6 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-200 opacity-25"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-600 animate-spin"></div>
              </div>
              <p className="text-purple-700 font-medium">Generating AI pricing suggestions...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          )}
          
          {apiError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">API Error</h4>
                  <p className="text-xs text-red-700 mt-1">{apiError}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {suggestion && (
        <Card className="w-full border-purple-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
            <CardTitle className="text-lg text-purple-800">AI-Generated Pricing Suggestions</CardTitle>
            <CardDescription className="text-purple-700">
              Based on your business description and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Plan Name</p>
                  <p className="font-medium">{suggestion.planName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Target Audience</p>
                  <p className="font-medium">{suggestion.targetAudience}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Suggested Pricing Tiers</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Monthly</span>
                    <span className="font-medium">${suggestion.monthlyPrice}/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded border border-purple-100">
                    <span>Quarterly</span>
                    <span className="font-medium">${suggestion.quarterlyPrice}/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-100">
                    <span>Annual</span>
                    <span className="font-medium">${suggestion.annualPrice}/mo</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">AI Insight</h4>
                <p className="text-sm text-gray-600 italic">"{suggestion.insight}"</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button 
              onClick={handleUseSuggestions}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Use These Suggestions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}