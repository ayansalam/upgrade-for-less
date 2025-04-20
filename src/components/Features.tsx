
import { BarChart2, Users, CreditCard, Zap, ShieldCheck, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <BarChart2 className="h-10 w-10 text-brand" />,
    title: "Increased Conversions",
    description: "Our pricing strategy has been proven to increase conversions by up to 4x, helping you grow your business faster."
  },
  {
    icon: <Users className="h-10 w-10 text-brand" />,
    title: "User Psychology",
    description: "Leverage the power of choice architecture and psychological pricing to make decisions easier for your customers."
  },
  {
    icon: <CreditCard className="h-10 w-10 text-brand" />,
    title: "Flexible Payment Options",
    description: "Offer your customers the flexibility they need with multiple payment options and commitment levels."
  },
  {
    icon: <Zap className="h-10 w-10 text-brand" />,
    title: "Quick Implementation",
    description: "Get up and running in minutes with our easy-to-use platform and pre-built templates."
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-brand" />,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security, ensuring peace of mind for you and your customers."
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-brand" />,
    title: "A/B Testing",
    description: "Test different pricing strategies and discount levels to find what works best for your specific audience."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our innovative approach to pricing helps you convert more customers and grow your business.
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
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
