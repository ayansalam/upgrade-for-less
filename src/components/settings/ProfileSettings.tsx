
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

const ProfileSettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfileData(data);
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchProfileData();
    }
  }, [user, form, toast]);
  
  const onSubmit = async (formData: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq("id", user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-muted-foreground">Update your personal information.</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt="Profile Picture" />
          <AvatarFallback>
            {profileData?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <Button disabled variant="outline" className="cursor-not-allowed">
          Upload Photo
        </Button>
        <p className="text-xs text-muted-foreground">(Coming soon)</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...form.register("firstName")}
              placeholder="Your first name"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...form.register("lastName")}
              placeholder="Your last name"
              disabled={isLoading}
            />
          </div>
        </div>
        
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
