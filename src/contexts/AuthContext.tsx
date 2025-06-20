import * as React from 'react';
import { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { PLAN_LIMITS } from '@/config/planLimits';

type Plan = 'Free' | 'Starter' | 'Pro' | 'LTD';
type User = {
  id: string;
  email: string;
  signup_date?: string | null;
  plan: Plan;
  usesThisMonth: number;
  lastResetDate: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  incrementAiUsageCount: () => Promise<boolean>;
  updateUserUsage: (userId: string, usesThisMonth: number, lastResetDate: string) => Promise<void>;
  updateUserPlan: (userId: string, plan: 'Free' | 'Starter' | 'Pro' | 'LTD') => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  signIn: async () => Promise.resolve(),
  signUp: async () => Promise.resolve(),
  signOut: async () => Promise.resolve(),
  incrementAiUsageCount: async () => false,
  updateUserUsage: async () => Promise.resolve(),
  updateUserPlan: async () => Promise.resolve(),
});

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
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, plan, usesThisMonth, lastResetDate, created_at')
            .eq('id', data.session.user.id)
            .single();
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            signup_date: data.session.user.created_at,
            plan: (profile?.plan as Plan) ?? 'Free',
            usesThisMonth: typeof profile?.usesThisMonth === 'number' ? profile.usesThisMonth : 0,
            lastResetDate: typeof profile?.lastResetDate === 'string' ? profile.lastResetDate : new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
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
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, email, plan, usesThisMonth, lastResetDate, created_at')
              .eq('id', session.user.id)
              .single();
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              signup_date: session.user.created_at,
              plan: (profile?.plan as Plan) ?? 'Free',
              usesThisMonth: typeof profile?.usesThisMonth === 'number' ? profile.usesThisMonth : 0,
              lastResetDate: typeof profile?.lastResetDate === 'string' ? profile.lastResetDate : new Date().toISOString(),
            });
          } catch (error) {
            setUser(null);
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
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileError) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            signup_date: data.user.created_at,
            plan: 'Free',
            usesThisMonth: 0,
            lastResetDate: new Date().toISOString(),
          });
        } else if (profile) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            signup_date: data.user.created_at,
            plan: profile.plan as Plan,
            usesThisMonth: profile.usesThisMonth ?? 0,
            lastResetDate: profile.lastResetDate ?? new Date().toISOString(),
          });
        }
      }
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError && profileError.code === 'PGRST116') {
        const nameParts = extractNameFromEmail(email);
        await createOrUpdateProfile(data.user.id, email, nameParts.firstName, nameParts.lastName);
      } else if (profileError) {
        throw profileError;
      }
      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
      });
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) {
        setUser({
          id: user.id,
          email: user.email,
          signup_date: user.created_at,
          plan: 'Free',
          usesThisMonth: 0,
          lastResetDate: new Date().toISOString(),
        });
      } else if (profile) {
        setUser({
          id: user.id,
          email: user.email,
          signup_date: user.created_at,
          plan: profile.plan as Plan,
          usesThisMonth: profile.usesThisMonth ?? 0,
          lastResetDate: profile.lastResetDate ?? new Date().toISOString(),
        });
      }
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use this feature.",
        variant: "destructive",
      });
      return false;
    }
    let currentUses = typeof user.usesThisMonth === 'number' ? user.usesThisMonth : 0;
    let lastReset = new Date(user.lastResetDate);
    const today = new Date();
    if (isNaN(lastReset.getTime())) {
      lastReset = today;
    }
    if (today.getMonth() !== lastReset.getMonth() || today.getFullYear() !== lastReset.getFullYear()) {
      currentUses = 0;
      lastReset = today;
      await updateUserUsage(user.id, currentUses, lastReset.toISOString());
    }
    const planLimit = PLAN_LIMITS[user.plan] ?? Infinity;
    if (planLimit !== Infinity && currentUses >= planLimit) {
      toast({
        title: "Usage limit reached",
        description: `You have used ${currentUses} of your ${planLimit} monthly upgrades. Please upgrade your plan for unlimited access.`,
        variant: "destructive",
      });
      return false;
    }
    const newUses = currentUses + 1;
    await updateUserUsage(user.id, newUses, lastReset.toISOString());
    return true;
  };

  const updateUserUsage = async (userId: string, usesThisMonth: number, lastResetDate: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ usesThisMonth, lastResetDate })
        .eq('id', userId);
      if (error) throw error;
      setUser(prev => prev ? { ...prev, usesThisMonth, lastResetDate } : null);
    } catch (error: any) {
      console.error('Error updating user usage:', error);
      toast({
        title: "Error updating usage",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserPlan = async (userId: string, plan: Plan) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userId);
      if (error) throw error;
      setUser(prev => prev ? { ...prev, plan } : null);
    } catch (error: any) {
      console.error('Error updating user plan:', error);
      toast({
        title: "Error updating plan",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, incrementAiUsageCount, updateUserUsage, updateUserPlan }}>
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
// Utility to extract first and last name from email
function extractNameFromEmail(email: string): { firstName: string; lastName: string } {
  const [first, last] = email.split('@')[0].split('.');
  return {
    firstName: first ? first.charAt(0).toUpperCase() + first.slice(1) : '',
    lastName: last ? last.charAt(0).toUpperCase() + last.slice(1) : '',
  };
}

// Utility to create or update user profile
async function createOrUpdateProfile(userId: string, email: string, firstName: string, lastName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        plan: 'Free', // Default plan on signup
        usesThisMonth: 0,
        lastResetDate: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Error creating or updating profile:', error);
    throw error;
  }
  return data;
}
export { AuthContext };