import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  email: string;
  signup_date?: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  incrementAiUsageCount: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            signup_date: data.session.user.created_at,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          try {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              signup_date: session.user.created_at,
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Set user data immediately after successful login
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          signup_date: data.user.created_at,
        });
      }
      
      // Check if profile exists and create if needed
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        const nameParts = extractNameFromEmail(email);
        await createOrUpdateProfile(data.user.id, email, nameParts.firstName, nameParts.lastName);
      }
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
      });
      
      // Return to ensure the function completes successfully
      return;
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: "Login failed",
        description: err.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("No user returned from signUp");
      setUser({
        id: user.id,
        email: user.email,
        signup_date: user.created_at,
      });
      toast({
        title: "Signup successful",
        description: `Welcome!`,
      });
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message || "An error occurred during signup.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged out successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error signing out",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementAiUsageCount = async (): Promise<boolean> => {
    if (!user) return false;
    const signupDate = user.signup_date ? new Date(user.signup_date) : null;
    if (signupDate) {
      const diffMs = Date.now() - signupDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < 14) {
        return true;
      }
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, incrementAiUsageCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility to extract first and last name from email
function extractNameFromEmail(email: string): { firstName: string; lastName: string } {
  const [first, last] = email.split('@')[0].split('.');
  return {
    firstName: first ? first.charAt(0).toUpperCase() + first.slice(1) : '',
    lastName: last ? last.charAt(0).toUpperCase() + last.slice(1) : '',
  };
}

// Utility to create or update a user profile in Supabase
async function createOrUpdateProfile(id: string, email: string, firstName: string, lastName: string) {
  const { error } = await supabase.from('profiles').upsert({
    id,
    email,
    first_name: firstName,
    last_name: lastName,
  });
  if (error) throw error;
}