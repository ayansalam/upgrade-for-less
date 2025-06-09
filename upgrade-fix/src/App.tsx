import './index.css'; // ✅ Tailwind styles applied
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
// import { EnvTest } from '@/components/EnvTest';

// Page imports
import Index from "@/pages/index";
import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";
import Support from "@/pages/Support";
import Features from "@/pages/Features";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Documentation from "@/pages/Documentation";
import AccountSettings from "@/pages/AccountSettings";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Careers from "@/pages/Careers";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import Checkout from "@/pages/Checkout";
import PaymentStatus from "@/pages/PaymentStatus";

function App() {
  return (
    <>
      <Navbar />
      {/* Removed EnvTest component */}
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/support" element={<Support />} />
        
        {/* Auth & Account */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<AccountSettings />} />
        
        {/* Payment routes */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        
        {/* Info pages */}
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/careers" element={<Careers />} />
        
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        
        {/* 404 - Keep this last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App; 