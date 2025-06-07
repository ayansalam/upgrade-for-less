import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Brain, Sparkles, Zap, BarChart, Users, Shield, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AIPricingSuggestionDemo } from "@/components/AIPricingSuggestionDemo";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechFlow",
      content: "The AI pricing suggestions have transformed our conversion rates. We've seen a 32% increase in premium plan signups since implementation.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "CEO at DataSphere",
      content: "UpgradeForLess helped us optimize our pricing strategy in ways we never thought possible. Our customer lifetime value has increased by 40%.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director at CloudNine",
      content: "The transparency in pricing has significantly reduced our churn rate. Our customers appreciate the clear value proposition.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    }
  ];
  
  // Auto-rotate testimonials with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Demo form state
  const [demoProduct, setDemoProduct] = useState({
    name: "Premium SaaS Plan",
    basePrice: 49.99,
    suggestedPrice: 0
  });
  
  // Calculate AI suggestion when component mounts
  useEffect(() => {
    // Simulate AI calculation
    setTimeout(() => {
      setDemoProduct(prev => ({
        ...prev,
        suggestedPrice: 39.99
      }));
    }, 1500);
  }, []);
  
  // FAQ data
  const faqs = [
    {
      question: "How does the AI pricing suggestion work?",
      answer: "Our AI analyzes market trends, customer behavior, and competitive pricing to suggest optimal price points that maximize conversions while maintaining profitability. The system continuously learns from real-world data to improve its suggestions over time."
    },
    {
      question: "Can I integrate this with my existing payment system?",
      answer: "Yes! UpgradeForLess is designed to work seamlessly with all major payment processors and subscription management systems. Our API and pre-built integrations make implementation straightforward."
    },
    {
      question: "How long does it take to see results?",
      answer: "Most customers see significant improvements in conversion rates within the first 30 days. The AI continues to optimize suggestions over time, leading to even better results as more data is collected."
    },
    {
      question: "Is there a free trial available?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to get started."
    }
  ];
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Intersection observer hooks for scroll animations
  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [demoRef, demoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [techRef, techInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Section with Glassmorphism */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div variants={fadeIn} className="inline-block mb-3 bg-primary/10 px-4 py-1 rounded-full">
                <span className="text-primary font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" /> AI-Powered Pricing Optimization
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn} 
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
              >
                Upgrade for Less – Best Deals on Software
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-xl text-gray-600 mb-8">
                Transform your SaaS pricing strategy with intelligent AI recommendations that boost conversions and maximize revenue.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={() => {
                    if (!user) {
                      setShowAuthModal(true);
                    } else {
                      window.location.href = '/dashboard';
                    }
                  }}
                >
                  Try Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                  <Link to="/features">See How It Works</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Plans Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Plans & Pricing</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs. Simple, transparent pricing for every stage of your business.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-gray-50 rounded-xl p-8 shadow border border-gray-100 flex flex-col items-center">
                <h3 className="font-bold text-2xl mb-2">Free</h3>
                <p className="text-3xl font-bold text-primary mb-4">$0<span className="text-base font-normal text-gray-500">/mo</span></p>
                <ul className="text-gray-600 mb-6 space-y-2 text-center">
                  <li>✔️ Basic AI suggestions</li>
                  <li>✔️ Community support</li>
                  <li>✔️ 1 project</li>
                </ul>
                <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20">Get Started</Button>
              </div>
              {/* Pro Plan */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-primary flex flex-col items-center scale-105">
                <h3 className="font-bold text-2xl mb-2">Pro</h3>
                <p className="text-3xl font-bold text-primary mb-4">$49<span className="text-base font-normal text-gray-500">/mo</span></p>
                <ul className="text-gray-600 mb-6 space-y-2 text-center">
                  <li>✔️ Advanced AI suggestions</li>
                  <li>✔️ Email support</li>
                  <li>✔️ Up to 10 projects</li>
                </ul>
                <Button className="w-full bg-primary text-white hover:bg-primary/90">Upgrade</Button>
              </div>
              {/* Business Plan */}
              <div className="bg-gray-50 rounded-xl p-8 shadow border border-gray-100 flex flex-col items-center">
                <h3 className="font-bold text-2xl mb-2">Business</h3>
                <p className="text-3xl font-bold text-primary mb-4">$199<span className="text-base font-normal text-gray-500">/mo</span></p>
                <ul className="text-gray-600 mb-6 space-y-2 text-center">
                  <li>✔️ All Pro features</li>
                  <li>✔️ Dedicated support</li>
                  <li>✔️ Unlimited projects</li>
                </ul>
                <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Pricing Suggestion Feature */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-3 bg-primary/10 px-4 py-1 rounded-full">
                <span className="text-primary font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" /> New Feature
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Pricing Suggestions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Optimize your pricing strategy with intelligent recommendations powered by AI.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AIPricingSuggestionDemo className="max-w-5xl mx-auto" />
            </motion.div>
          </div>
        </section>
        
        {/* 3-Step Process with Scroll Animations */}
        <section 
          ref={processRef} 
          className="py-20 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform makes optimizing your pricing strategy simple and effective.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 z-0"></div>
              
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-lg relative z-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Data Connection" 
                  className="w-full h-40 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-2xl mb-4 text-center">1. Connect Your Data</h3>
                <p className="text-gray-600 text-center">
                  Integrate with your existing systems to provide our AI with the data it needs to understand your business.
                </p>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl p-8 shadow-lg relative z-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="AI Suggestions" 
                  className="w-full h-40 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-2xl mb-4 text-center">2. Receive AI Suggestions</h3>
                <p className="text-gray-600 text-center">
                  Our advanced algorithms analyze your data and provide intelligent pricing recommendations.
                </p>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-lg relative z-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Growth Chart" 
                  className="w-full h-40 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-2xl mb-4 text-center">3. Optimize & Grow</h3>
                <p className="text-gray-600 text-center">
                  Implement the suggestions and watch your conversion rates and revenue grow.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Live Demo Section with Form */}
        <section 
          ref={demoRef}
          className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={demoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Try our interactive demo to see how our AI generates pricing suggestions.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={demoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold mb-6">AI Pricing Demo</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        value={demoProduct.name}
                        onChange={(e) => setDemoProduct({...demoProduct, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label>
                      <input 
                        type="number" 
                        value={demoProduct.basePrice}
                        onChange={(e) => setDemoProduct({...demoProduct, basePrice: parseFloat(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Generate AI Suggestion
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={demoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm p-8 rounded-xl border border-primary/20 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" /> 
                    AI Suggestion Result
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Product</p>
                      <p className="font-medium text-lg">{demoProduct.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Price</p>
                      <p className="font-medium text-lg">${demoProduct.basePrice.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">AI Suggested Price</p>
                      <div className="flex items-center">
                        {demoProduct.suggestedPrice > 0 ? (
                          <p className="font-bold text-2xl text-primary">${demoProduct.suggestedPrice.toFixed(2)}</p>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                            <p className="text-gray-500">Calculating...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {demoProduct.suggestedPrice > 0 && (
                      <div className="bg-green-50 border border-green-100 rounded-md p-4">
                        <p className="text-green-800 text-sm">
                          <strong>AI Analysis:</strong> Based on market trends and customer behavior, we recommend a {((demoProduct.basePrice - demoProduct.suggestedPrice) / demoProduct.basePrice * 100).toFixed(0)}% discount to maximize conversions while maintaining profitability.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Technology Showcase with Fade-in Animations */}
        <section 
          ref={techRef}
          className="py-20 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced AI</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform leverages cutting-edge technologies to deliver accurate pricing recommendations.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Machine Learning" 
                  className="w-full h-32 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-xl mb-3">Machine Learning</h3>
                <p className="text-gray-600">
                  Our algorithms continuously learn from market data and user behavior to improve pricing recommendations over time.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Behavioral Analysis" 
                  className="w-full h-32 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-xl mb-3">Behavioral Analysis</h3>
                <p className="text-gray-600">
                  We analyze how users interact with different pricing options to identify patterns that lead to higher conversion rates.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Secure Integration" 
                  className="w-full h-32 object-cover rounded-lg mb-6 shadow-md"
                />
                <h3 className="font-bold text-xl mb-3">Secure Integration</h3>
                <p className="text-gray-600">
                  Our platform integrates securely with your existing systems, ensuring data privacy and protection at every step.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Carousel */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear from businesses that have transformed their pricing strategy with our AI-powered platform.
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 p-8 md:p-12 relative min-h-[300px]">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ 
                      opacity: activeTestimonial === index ? 1 : 0,
                      x: activeTestimonial === index ? 0 : 50,
                      zIndex: activeTestimonial === index ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`absolute inset-0 p-8 md:p-12 ${activeTestimonial === index ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full mb-6 border-2 border-primary/20 object-cover shadow-md"
                      />
                      <p className="text-xl italic mb-6 text-gray-700">"{testimonial.content}"</p>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8 space-x-4">
                <button 
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Accordion */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our AI pricing platform.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex justify-between items-center w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <div className={`transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-96 p-6 pt-0' : 'max-h-0'}`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section with Background Transition */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your pricing strategy?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of businesses using AI to optimize their pricing and boost conversions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link to="/auth?tab=signup">Start Free Trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => window.location.href = '/dashboard'}
      />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-4">UpgradeForLess</h3>
              <p className="text-sm">
                Transforming SaaS pricing strategies with AI to boost conversions and improve customer satisfaction.
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
