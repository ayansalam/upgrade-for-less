import * as React from 'react';
import PricingSection from '@/pages/PricingSection';
import { motion } from 'framer-motion';
import { Zap, Shield, CreditCard, ArrowRight, CheckCircle, ChevronRight, BarChart, Lock } from 'lucide-react';
import { Link } from "react-router-dom";
// Remove: import Image from 'next/image';

const features = [
  {
    title: "Smart Upgrade Analysis",
    description: "Get AI-powered recommendations on when and how to upgrade your software and systems.",
    icon: <ChevronRight className="h-6 w-6" />,
  },
  {
    title: "Cost Optimization",
    description: "Save up to 40% on your upgrade costs with our intelligent pricing strategies.",
    icon: <ChevronRight className="h-6 w-6" />,
  },
  {
    title: "Real-time Monitoring",
    description: "Track your upgrade progress and costs in real-time with detailed analytics.",
    icon: <ChevronRight className="h-6 w-6" />,
  },
] as const;

const testimonials = [
  {
    content: "UpgradeForLess has helped us save over 35% on our annual software upgrade costs. The platform is intuitive and the recommendations are spot-on.",
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "The AI-powered recommendations have been a game-changer for our upgrade strategy. We're now much more efficient with our IT budget.",
    name: "Michael Chen",
    role: "IT Director",
    company: "GrowthCo",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "The real-time monitoring and cost tracking features have given us unprecedented visibility into our upgrade spending.",
    name: "Emily Rodriguez",
    role: "Operations Manager",
    company: "ScaleUp",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
] as const;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const workflowSteps = [
  {
    step: "1",
    title: "Choose a Plan",
    description: "Select from our flexible plans designed to fit your budget and business goals. From startups to enterprises, we have the right upgrade package for you.",
    icon: <CreditCard className="w-12 h-12 text-primary" />,
    image: "https://illustrations.popsy.co/purple/product-launch.svg",
  },
  {
    step: "2",
    title: "Pay with Cashfree",
    description: "Make secure payments using Cashfree's trusted platform. Your transactions are protected with bank-grade security and encryption.",
    icon: <Lock className="w-12 h-12 text-primary" />, 
    image: "/images/illustrations/secure-payment.svg",
  },
  {
    step: "3",
    title: "Get Instant Access",
    description: "Access your premium tools and upgrades immediately after payment. No waiting period - start optimizing your software costs right away.",
    icon: <Zap className="w-12 h-12 text-primary" />, 
    image: "/images/illustrations/instant-access.svg",
  },
  {
    step: "4",
    title: "Grow Smarter",
    description: "Save up to 40% on your software costs while accessing premium features. Scale your business without breaking the bank.",
    icon: <BarChart className="w-12 h-12 text-primary" />, 
    image: "/images/illustrations/growth.svg",
  },
];

export default function LandingPage() {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white pt-16 md:pt-24 lg:pt-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block text-primary">Upgrade Smarter,</span>
              <span className="block">Pay Less</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Powerful tools and affordable plans built for modern teams. Save money while getting the best upgrades for your business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth"
                className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 inline-block h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="text-lg font-semibold text-gray-700 hover:text-primary"
              >
                View Pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="mt-16 bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {['Trusted by 10,000+ companies', '99.9% Uptime', '24/7 Support', 'Free Forever Plan'].map((stat) => (
                <motion.div 
                  key={stat}
                  variants={fadeIn}
                  className="flex items-center justify-center text-sm font-medium text-gray-600"
                >
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  {stat}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to upgrade smarter
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides all the tools you need to make informed upgrade decisions
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              How Upgrade for Less Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get started in minutes with our simple four-step process
            </p>
          </motion.div>

          <div className="mt-16 space-y-16">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${
                  index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  <div className={`lg:col-start-${index % 2 === 0 ? '1' : '2'}`}>
                    <div className="relative">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-8">
                        {step.icon}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className={`mt-10 lg:mt-0 lg:col-start-${index % 2 === 0 ? '2' : '1'}`}>
                    <div className="relative lg:pl-12">
                      <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none">
                        <div className="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden">
                          <Image
                            className="absolute inset-0 h-full w-full object-cover"
                            src={step.image}
                            alt={step.title}
                            width={400}
                            height={300}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-primary/0 mix-blend-multiply" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connector Line (except for last item) */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-8 w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-600 transition-colors duration-200"
            >
              Get Started Now
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by businesses worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Here's what our customers have to say about their experience
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeIn}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="mt-6 text-base text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start saving?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-50">
              Join thousands of businesses already saving money with our platform
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/auth"
                className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-primary shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 inline-block h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/support" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} UpgradeForLess. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
