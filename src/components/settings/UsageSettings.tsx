
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UsageSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [usageData, setUsageData] = useState(null);

  useEffect(() => {
    async function fetchUsage() {
      setIsLoading(true);
      if (!user) {
        setUsageData(null);
        setIsLoading(false);
        return;
      }
      try {
        // Fetch usage from Supabase
        const { data, error } = await supabase
          .from("usage")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        setUsageData({
          totalRequests: data.total_requests || 0,
          apiLimit: 20000,
          usage: data.total_requests ? ((data.total_requests / 20000) * 100).toFixed(2) : 0,
          history: data.history || [],
        });
      } catch (err) {
        toast({
          title: "Error loading usage",
          description: err.message || "Could not fetch usage data.",
          variant: "destructive",
        });
        setUsageData(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsage();
  }, [user]);
  const handleGenerateApiKey = () => {
    toast({
      title: "Feature Coming Soon",
      description: "API key generation will be available in a future update.",
    });
  };
  
  if (isLoading) {
    return <p>Loading usage statistics...</p>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Usage & Analytics</h2>
        <p className="text-muted-foreground">Monitor your usage and account limits.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>
            Your current API usage for this billing period.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {usageData.totalRequests.toLocaleString()} / {usageData.apiLimit.toLocaleString()} requests
              </span>
              <span className="font-medium">{usageData.usage}%</span>
            </div>
            <Progress value={usageData.usage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usageData.totalRequests.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{(usageData.totalRequests / 30).toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Daily Average</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{(usageData.apiLimit - usageData.totalRequests).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Monthly Usage History</h4>
            <div className="h-40 w-full bg-muted/50 rounded-md flex items-end justify-between p-2">
              {usageData.history.map((month, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="bg-primary w-8 rounded-t-sm" 
                    style={{ 
                      height: `${(month.requests / 4000) * 100}%`,
                    }}
                  ></div>
                  <span className="text-xs mt-1">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Generate and manage API keys for your account.
        </p>
        
        <Button onClick={handleGenerateApiKey}>
          Generate API Key
        </Button>
        <p className="text-xs text-muted-foreground">
          (This feature is coming soon)
        </p>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Usage Reports</h3>
        <p className="text-sm text-muted-foreground">
          Download detailed reports of your account usage.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start" onClick={() => window.open(`/api/reports/july?user=${user?.id}`)}>
            <LineChart className="h-4 w-4 mr-2" />
            Download July Report
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.open(`/api/reports/q2?user=${user?.id}`)}>
            <LineChart className="h-4 w-4 mr-2" />
            Download Q2 Report
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          (This feature is coming soon)
        </p>
      </div>
    </div>
  );
};

export default UsageSettings;
