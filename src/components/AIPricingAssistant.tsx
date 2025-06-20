import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Loader2, ArrowRight, AlertCircle, Lock, AlertTriangle,
} from "lucide-react";
import { generatePricingSuggestions, extractJsonFromResponse } from "@/api/gemini";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { Link } from "react-router-dom";

interface AIPricingSuggestion {
  planName: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  targetAudience: string;
  businessGoal: string;
  insight: string;
}

interface AIPricingFormValues {
  businessDescription: string;
  monthlyPrice: number;
  businessGoal: string;
}

export function AIPricingAssistant({
  onUseSuggestions,
}: {
  onUseSuggestions?: (suggestions: AIPricingSuggestion) => void;
}) {
  const { toast } = useToast();
  const { user, incrementAiUsageCount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AIPricingSuggestion | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

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

      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to use the AI Pricing Assistant.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const incrementSuccess = await incrementAiUsageCount();
      if (!incrementSuccess) {
        setShowUpgradePrompt(true);
        setIsLoading(false);
        return;
      }

      const response = await generatePricingSuggestions(data);
      const jsonData = extractJsonFromResponse(response);

      const monthlyPrice = jsonData.monthlyPrice || data.monthlyPrice;
      const weeklyDiscount = jsonData.weeklyDiscount || 15;
      const annualDiscount = jsonData.annualDiscount || 30;

      setSuggestion({
        planName: jsonData.planName || "AI Generated Plan",
        monthlyPrice,
        quarterlyPrice: monthlyPrice * (1 - weeklyDiscount / 100),
        annualPrice: monthlyPrice * (1 - annualDiscount / 100),
        targetAudience: jsonData.targetAudience || "Businesses looking to optimize pricing",
        businessGoal: jsonData.businessGoal || data.businessGoal,
        insight: jsonData.insight || "AI-generated pricing strategy based on your inputs.",
      });

      toast({
        title: "AI Suggestions Generated",
        description: "Your AI pricing suggestions have been generated successfully.",
      });
    } catch (error: any) {
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
    <>
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 space-y-4 text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Usage Limit Reached!</CardTitle>
            <CardDescription className="text-gray-700">
              You have used all your AI pricing assistant generations for this month.
            </CardDescription>
            <p className="text-gray-800 font-medium">
              Upgrade your plan to continue generating unlimited pricing suggestions.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowUpgradePrompt(false)}>
                Close
              </Button>
              <Link to="/pricing">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
      <div className="space-y-6">
        <Card className="w-full border border-purple-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
            <CardTitle className="flex items-center gap-2 text-xl text-purple-800">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Pricing Assistant
            </CardTitle>
            <CardDescription className="text-purple-700">
              Get AI-powered pricing suggestions using our AI integration
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
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          min="0"
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
                      <FormControl>
                        <Input placeholder="e.g., Increase recurring revenue by 20%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Pricing Suggestions
                </Button>
              </form>
            </Form>

            {apiError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Error: {apiError}</span>
              </div>
            )}

            {!user && (
              <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span>Login to use the AI Pricing Assistant.</span>
                <AuthModal isOpen={false} onClose={() => {}}>
                  <Button variant="link" className="ml-2 p-0 h-auto">
                    Login / Sign Up
                  </Button>
                </AuthModal>
              </div>
            )}

            {suggestion && (
              <div className="mt-6 p-4 border border-purple-300 rounded-lg bg-purple-50 space-y-3">
                <h3 className="text-lg font-semibold text-purple-800">AI Pricing Suggestion:</h3>
                <p><strong>Plan Name:</strong> {suggestion.planName}</p>
                <p><strong>Monthly Price:</strong> ${suggestion.monthlyPrice.toFixed(2)}</p>
                <p><strong>Quarterly Price:</strong> ${suggestion.quarterlyPrice.toFixed(2)}</p>
                <p><strong>Annual Price:</strong> ${suggestion.annualPrice.toFixed(2)}</p>
                <p><strong>Target Audience:</strong> {suggestion.targetAudience}</p>
                <p><strong>Business Goal:</strong> {suggestion.businessGoal}</p>
                <p><strong>Insight:</strong> {suggestion.insight}</p>
                {onUseSuggestions && (
                  <Button onClick={handleUseSuggestions} className="mt-3">
                    Use These Suggestions <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {showUpgradePrompt && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>
                  You've reached your AI usage limit.{" "}
                  <Link to="/pricing" className="underline">
                    Upgrade your plan
                  </Link>{" "}
                  for unlimited access.
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            AI-powered insights for smarter pricing strategies.
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default AIPricingAssistant;
