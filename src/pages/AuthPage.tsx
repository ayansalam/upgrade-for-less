
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });
    return () => authListener?.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Successfully logged in!" });
      setLoading(false);
      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Check your email to confirm your account." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Log In" : "Sign Up"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Log In" : "Sign Up")}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button
            type="button"
            variant="link"
            className="text-brand"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

