
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PreferenceSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    timezone: "America/Los_Angeles",
    dashboardView: "default",
    autoSave: true,
    compactMode: false,
  });
  
  const handleChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const savePreferences = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="text-muted-foreground">Customize your experience.</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handleChange("theme", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the appearance of the application.
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handleChange("language", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred language.
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => handleChange("timezone", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All times will be displayed in your selected timezone.
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="dashboardView">Default Dashboard View</Label>
            <Select
              value={preferences.dashboardView}
              onValueChange={(value) => handleChange("dashboardView", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="dashboardView">
                <SelectValue placeholder="Select dashboard view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your default dashboard layout.
            </p>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold">Interface Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave" className="font-medium">
                  Auto-save Changes
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save changes as you make them
                </p>
              </div>
              <Switch 
                id="autoSave" 
                checked={preferences.autoSave} 
                onCheckedChange={() => handleToggle("autoSave")} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactMode" className="font-medium">
                  Compact Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use a more compact interface layout
                </p>
              </div>
              <Switch 
                id="compactMode" 
                checked={preferences.compactMode} 
                onCheckedChange={() => handleToggle("compactMode")} 
              />
            </div>
          </div>
        </div>
        
        <Button onClick={savePreferences} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceSettings;
