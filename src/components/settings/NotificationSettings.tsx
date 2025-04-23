
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
    billingAlerts: true,
    securityAlerts: true,
  });
  
  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const saveNotificationSettings = () => {
    setIsLoading(true);
    
    // In a real implementation, this would save to the database
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        <p className="text-muted-foreground">Manage how and when we contact you.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Email Notifications</h3>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="font-medium">
                  All Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Master toggle for all email notifications
                </p>
              </div>
              <Switch 
                id="emailNotifications" 
                checked={settings.emailNotifications} 
                onCheckedChange={() => handleToggle("emailNotifications")} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails" className="font-medium">
                  Marketing Communications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and offers
                </p>
              </div>
              <Switch 
                id="marketingEmails" 
                checked={settings.marketingEmails} 
                onCheckedChange={() => handleToggle("marketingEmails")} 
                disabled={!settings.emailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="productUpdates" className="font-medium">
                  Product Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when we release new features
                </p>
              </div>
              <Switch 
                id="productUpdates" 
                checked={settings.productUpdates} 
                onCheckedChange={() => handleToggle("productUpdates")} 
                disabled={!settings.emailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="billingAlerts" className="font-medium">
                  Billing Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your billing and subscription
                </p>
              </div>
              <Switch 
                id="billingAlerts" 
                checked={settings.billingAlerts} 
                onCheckedChange={() => handleToggle("billingAlerts")} 
                disabled={!settings.emailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts" className="font-medium">
                  Security Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Important notifications about your account security
                </p>
              </div>
              <Switch 
                id="securityAlerts" 
                checked={settings.securityAlerts} 
                onCheckedChange={() => handleToggle("securityAlerts")} 
                disabled={!settings.emailNotifications}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Communication Frequency</h3>
          <p className="text-sm text-muted-foreground">
            This feature is coming soon. You'll be able to set how often you receive
            communications from us.
          </p>
        </div>
        
        <Button onClick={saveNotificationSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
