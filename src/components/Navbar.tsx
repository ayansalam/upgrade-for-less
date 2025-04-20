
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
      if (session?.user) {
        checkIsAdmin(session.user.id);
      }
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
      if (session?.user) {
        checkIsAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => authListener?.subscription.unsubscribe();
  }, []);

  const checkIsAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();
    
    setIsAdmin(data?.is_admin || false);
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth");
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/">
            <span className="text-brand font-bold text-2xl">UpgradeForLess</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium hover:text-brand transition-colors">
            Features
          </Link>
          <Link to="/#pricing" className="text-sm font-medium hover:text-brand transition-colors">
            Pricing
          </Link>
          <Link to="/support" className="text-sm font-medium hover:text-brand transition-colors">
            Support
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Start Free Trial</Link>
              </Button>
            </>
          )}
          {user && (
            <>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button size="sm" variant="default" className="bg-brand hover:bg-brand-dark" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
