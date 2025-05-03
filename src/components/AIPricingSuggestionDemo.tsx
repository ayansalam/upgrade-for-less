import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePricingSuggestions, extractJsonFromResponse } from '@/api/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

interface AIPricingSuggestionDemoProps {
  className?: string;
}

export function AIPricingSuggestionDemo({ className }: AIPricingSuggestionDemoProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    businessDescription: 'We offer a project management SaaS for small businesses with task tracking, team collaboration, and reporting features.',
    monthlyPrice: 29.99,
    businessGoal: 'Increase conversion rate and reduce churn'
  });
  
  const [suggestion, setSuggestion] = useState<{
    monthlyPrice: number | null;
    weeklyDiscount: number | null;
    annualDiscount: number | null;
    insight: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyPrice' ? parseFloat(value) : value
    }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the actual Gemini API
      const response = await generatePricingSuggestions({
        businessDescription: formData.businessDescription,
        monthlyPrice: formData.monthlyPrice,
        businessGoal: formData.businessGoal
      });
      
      // Extract and process the JSON response
      const jsonData = extractJsonFromResponse(response);
      
      setSuggestion({
        monthlyPrice: jsonData.monthlyPrice || formData.monthlyPrice,
        weeklyDiscount: jsonData.weeklyDiscount || 15, // Default 15% discount for 8-week
        annualDiscount: jsonData.annualDiscount || 25, // Default 25% discount for annual
        insight: jsonData.insight || 'Based on your business details, we recommend optimizing your pricing strategy to improve conversions and revenue.'
      });
    } catch (err: any) {
      console.error('Error generating pricing suggestions:', err);
      setError(err.message || 'Failed to generate AI pricing suggestions');
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Component logic ends here

  return (
    <>
      <div className={`bg-white rounded-xl shadow-xl overflow-hidden ${className}`}>
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">AI Pricing Suggestion</h3>
          </div>
          <p className="mt-2 text-gray-600">Get intelligent pricing recommendations powered by AI integration</p>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                  <Textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Monthly Price ($)</label>
                  <Input
                    type="number"
                    name="monthlyPrice"
                    value={formData.monthlyPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Goal</label>
                  <Input
                    name="businessGoal"
                    value={formData.businessGoal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setShowAuthModal(true);
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : !user ? (
                    <>
                      Get AI Suggestion
                      <Lock className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Get AI Suggestion <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Results Display */}
            <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl p-6 border border-primary/20">
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Pricing Recommendation
              </h4>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-gray-500">Analyzing your business data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
                  <p className="text-red-500 font-medium mb-2">Error</p>
                  <p className="text-gray-600">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-primary text-primary hover:bg-primary/5"
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : suggestion ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Monthly Price</p>
                      <p className="font-bold text-xl text-primary">${suggestion.monthlyPrice?.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">8-Week Discount</p>
                      <p className="font-bold text-xl text-primary">{suggestion.weeklyDiscount}%</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Annual Discount</p>
                      <p className="font-bold text-xl text-primary">{suggestion.annualDiscount}%</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">AI Insight</p>
                    <p className="text-sm">{suggestion.insight}</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                      Apply This Pricing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-gray-500 mb-2">Fill out the form and click "Get AI Suggestion" to receive personalized pricing recommendations.</p>
                  <p className="text-sm text-gray-400">Our AI analyzes your business details to optimize pricing for maximum conversions and revenue.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}