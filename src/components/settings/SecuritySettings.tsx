
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettings = ({ user }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (formData: PasswordFormValues) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "Failed to update your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // In a real implementation, this would involve either:
    // 1. Calling an admin function to delete the user
    // 2. Marking the user as deleted in the database
    // For now, we'll just show a toast
    
    toast({
      title: "Account Deletion Requested",
      description: "This feature is not fully implemented. Please contact support to delete your account.",
    });
    
    setShowDeleteDialog(false);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Security Settings</h2>
        <p className="text-muted-foreground">Manage your account's security.</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...form.register("currentPassword")}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...form.register("newPassword")}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword")}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Switch id="twoFactor" disabled aria-label="Toggle two-factor authentication" />
        </div>
        <p className="text-xs text-muted-foreground">(Coming soon)</p>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Sessions</h3>
        <Button variant="outline" disabled>
          View Active Sessions
        </Button>
        <p className="text-xs text-muted-foreground">(Coming soon)</p>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Delete Account</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all your data.
        </p>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          Delete Account
        </Button>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SecuritySettings;
