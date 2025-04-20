
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Boost Your SaaS Conversions with <span className="text-primary">Smart Pricing</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Transform how users perceive your subscription options. Our revolutionary approach focuses on discounts rather than plan durations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/pricing">View Pricing <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="bg-accent p-8 rounded-xl">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="font-bold text-xl mb-4">Premium Plan</h3>
                  <p className="text-3xl font-bold mb-1">$49<span className="text-sm text-gray-500">/mo</span></p>
                  
                  <div className="my-6 space-y-3">
                    <div className="font-semibold">Choose your discount:</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span>Standard monthly price</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>15% off for 8 weeks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>30% off for 52 weeks</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Start your trial</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Preview */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-12">Why Choose UpgradeForLess?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Increased Conversions</h3>
                <p className="text-gray-600">
                  Our approach has been proven to increase subscription conversions by up to 4x.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Simple Implementation</h3>
                <p className="text-gray-600">
                  Easy to integrate with your existing system with minimal development work.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Customer Transparency</h3>
                <p className="text-gray-600">
                  Builds trust with customers through clear discount presentation and transparency.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Button asChild size="lg">
                <Link to="/features">Explore All Features</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your pricing strategy?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free trial today and experience the difference in your conversion rates.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth?tab=signup">Start Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-4">UpgradeForLess</h3>
              <p className="text-sm">
                Transforming SaaS pricing strategies to boost conversions and improve customer satisfaction.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} UpgradeForLess. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
