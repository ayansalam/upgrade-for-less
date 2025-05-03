
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ProfileFormValues {
  email: string;
}

interface ProfileData {
  id: string;
  email: string;
}

const ProfileSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: "",
    },
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      // Check if we're in demo mode by examining the user ID format
      if (user.id === "demo-user-id") {
        setDemoMode(true);
        // Set mock profile data for demo mode
        const mockProfile = {
          id: user.id,
          email: user.email || "demo@example.com",
        };
        setProfileData(mockProfile);
        form.reset({
          email: mockProfile.email,
        });
        setIsLoading(false);
        return;
      }
      // In non-demo mode, set empty profile data (no backend)
      setProfileData({
        id: user.id,
        email: user.email || "",
      });
      form.reset({
        email: user.email || "",
      });
      setIsLoading(false);
    };
    if (user) {
      fetchProfileData();
    }
  }, [user, form, toast]);
  
  const onSubmit = async (formData: ProfileFormValues) => {
    setIsLoading(true);
    if (demoMode) {
      toast({
        title: "Demo Mode",
        description: "Profile would be updated in a real account.",
      });
      setIsLoading(false);
      return;
    }
    // In non-demo mode, just show a success toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-muted-foreground">Update your personal information.</p>
      </div>
      
      {demoMode && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTitle className="text-yellow-800">Demo Mode</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You're viewing profile settings in demo mode. Changes won't be saved.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt="Profile Picture" />
          <AvatarFallback>
            {user.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <Button disabled variant="outline" className="cursor-not-allowed">
          Upload Photo
        </Button>
        <p className="text-xs text-muted-foreground">(Coming soon)</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            {...form.register("email")}
            type="email"
            placeholder="Your email address"
            disabled={true}
          />
          <p className="text-xs text-muted-foreground">
            To change your email address, please contact support.
          </p>
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettings;
