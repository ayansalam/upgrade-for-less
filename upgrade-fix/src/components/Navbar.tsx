import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-primary">
            UpgradeForLess
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-primary">
              Support
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                  Login
                </Button>
                <Button onClick={() => { setShowAuthModal(true); }}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4 pb-4">
              <Link
                to="/features"
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/support"
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                {user ? (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
    </header>
  );
};

export default Navbar; 