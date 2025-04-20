
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart2, Users, CheckCircle, Zap, ShieldCheck, CreditCard } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <BarChart2 className="h-10 w-10 text-brand" />,
      title: "Increased Conversions",
      description: "Boost conversion rates by up to 4x with our intelligent discount framing approach, helping you grow your business faster.",
      details: "Our discount framing strategy presents subscription options in a way that highlights value rather than commitment duration. By focusing on the discount, users are more likely to select longer commitment periods."
    },
    {
      icon: <Users className="h-10 w-10 text-brand" />,
      title: "User Psychology",
      description: "Leverage psychological pricing principles that make decisions easier for your customers.",
      details: "Through extensive A/B testing, we've discovered that reframing subscription choices as discounts rather than monthly/yearly plans makes the decision process more approachable for customers."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-brand" />,
      title: "Flexible Payment Options",
      description: "Offer your customers choice without overwhelming them with too many options.",
      details: "Instead of forcing customers to choose between monthly and yearly billing cycles, we present a single base plan with optional discount tiers, making the selection process more straightforward."
    },
    {
      icon: <Zap className="h-10 w-10 text-brand" />,
      title: "Quick Implementation",
      description: "Get up and running with our pricing strategy in minutes with minimal code changes.",
      details: "Our platform integrates seamlessly with your existing payment infrastructure, requiring minimal development resources to implement and maintain."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-brand" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your payment data is always protected.",
      details: "We implement industry-standard security protocols and regular security audits to ensure all payment and customer data remains secure and compliant with regulations."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-brand" />,
      title: "A/B Testing",
      description: "Continuously optimize your pricing strategy with built-in testing capabilities.",
      details: "Our platform provides tools to test different discount tiers and messaging to find the optimal configuration for your specific audience and product."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              How <span className="text-brand">UpgradeForLess</span> Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our innovative approach to subscription pricing helps businesses increase conversions 
              by focusing on discount psychology rather than traditional plan selection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/#pricing">View Pricing</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/support">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our approach is based on psychological research and extensive testing to optimize 
                conversion rates for subscription-based businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">The Traditional Approach</h3>
                <p className="mb-4">
                  Most subscription businesses offer a choice between monthly and yearly plans, highlighting 
                  the savings on yearly plans. While this works for some users, it creates an either/or decision 
                  that can lead to decision paralysis.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-8">
                  <p className="font-medium">Traditional Model:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Monthly Plan: $29/month</li>
                    <li>Annual Plan: $290/year (Save $58)</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mb-4">The UpgradeForLess Approach</h3>
                <p className="mb-4">
                  Instead of presenting an either/or choice, we present a single base price with discount 
                  options. This reframes the decision from "monthly vs. yearly" to "how much discount 
                  do I want?"
                </p>
                <div className="bg-brand-light p-4 rounded-lg border border-brand">
                  <p className="font-medium">Our Reframed Model:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Base Price: $29/month with no commitment</li>
                    <li>15% Discount: $24.65/month for 8 weeks</li>
                    <li>30% Discount: $20.30/month for 52 weeks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to implement our psychological pricing strategy and boost your conversions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="text-sm text-gray-600">
                    {feature.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to increase your conversions?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join businesses that have boosted subscription sign-ups with our innovative pricing strategy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-brand hover:bg-gray-100 w-full sm:w-auto" asChild>
                <Link to="/auth">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link to="/support">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
