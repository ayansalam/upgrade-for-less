import { AnimatedCard, AnimatedButton } from "./ui/AnimatedComponents";

export default function AnimatedDemo() {
  return (
    <div className="space-y-8 p-8">
      {/* Basic Card with Button */}
      <AnimatedCard className="p-6 max-w-md mx-auto" delay={0.1}>
        <h2 className="text-2xl font-bold mb-2">Welcome to Upgrade For Less</h2>
        <p className="text-gray-600 mb-4">
          Find the best deals on tech upgrades and save money while staying up to date.
        </p>
        <AnimatedButton delay={0.3} className="w-full">
          Get Started
        </AnimatedButton>
      </AnimatedCard>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Smart Search",
            description: "Find exactly what you need with our intelligent search system",
            delay: 0.2
          },
          {
            title: "Best Deals",
            description: "Compare prices across multiple vendors to get the best value",
            delay: 0.3
          },
          {
            title: "Expert Reviews",
            description: "Make informed decisions with our detailed product reviews",
            delay: 0.4
          }
        ].map((feature, index) => (
          <AnimatedCard 
            key={index}
            className="p-6"
            delay={feature.delay}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <AnimatedButton 
              variant="outline"
              delay={feature.delay + 0.1}
              className="w-full"
            >
              Learn More
            </AnimatedButton>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
} 