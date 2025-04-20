
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-brand font-bold text-2xl">UpgradeForLess</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">
            Home
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">
            Features
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">
            Pricing
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">
            Support
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Log in
          </Button>
          <Button size="sm">
            Start Free Trial
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
