import { useState } from "react";
import { 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedInput, 
  AnimatedDialog,
  AnimatedList 
} from "./ui/animations/AnimatedComponents";

export default function AnimatedComponentsDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const features = [
    {
      title: "Smart Search",
      description: "Find exactly what you need with our intelligent search system",
      animationVariant: "fadeInUp"
    },
    {
      title: "Best Deals",
      description: "Compare prices across multiple vendors to get the best value",
      animationVariant: "slideInLeft"
    },
    {
      title: "Expert Reviews",
      description: "Make informed decisions with our detailed product reviews",
      animationVariant: "slideInRight"
    }
  ];

  const listItems = [
    <div key="1" className="p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-semibold">List Item 1</h3>
      <p className="text-muted-foreground">Description for item 1</p>
    </div>,
    <div key="2" className="p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-semibold">List Item 2</h3>
      <p className="text-muted-foreground">Description for item 2</p>
    </div>,
    <div key="3" className="p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-semibold">List Item 3</h3>
      <p className="text-muted-foreground">Description for item 3</p>
    </div>
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <AnimatedCard 
        className="p-8 text-center"
        animationVariant="scaleInBounce"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Upgrade For Less</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Discover the best deals on tech upgrades and save money while staying up to date.
        </p>
        <div className="flex gap-4 justify-center">
          <AnimatedButton 
            animationVariant="fadeInUp"
            delay={0.2}
            buttonVariant="default"
            className="px-8"
          >
            Get Started
          </AnimatedButton>
          <AnimatedButton 
            animationVariant="fadeInUp"
            delay={0.3}
            buttonVariant="outline"
            className="px-8"
          >
            Learn More
          </AnimatedButton>
        </div>
      </AnimatedCard>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto space-y-4">
        <AnimatedInput 
          animationVariant="fadeInDown"
          placeholder="Search for products..."
          className="w-full"
        />
        <AnimatedButton 
          animationVariant="scaleIn"
          buttonVariant="secondary"
          className="w-full"
        >
          Search
        </AnimatedButton>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <AnimatedCard 
            key={index}
            className="p-6"
            animationVariant={feature.animationVariant as any}
            delay={index * 0.1}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground mb-4">{feature.description}</p>
            <AnimatedButton 
              animationVariant="scaleInBounce"
              buttonVariant="outline"
              delay={index * 0.1 + 0.2}
              className="w-full"
            >
              Learn More
            </AnimatedButton>
          </AnimatedCard>
        ))}
      </div>

      {/* Animated List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Staggered List Animation</h2>
        <AnimatedList
          items={listItems}
          className="space-y-4"
          delay={0.2}
        />
      </div>

      {/* Dialog Demo */}
      <div className="text-center">
        <AnimatedButton
          animationVariant="scaleInBounce"
          buttonVariant="default"
          onClick={() => setIsDialogOpen(true)}
        >
          Open Dialog
        </AnimatedButton>

        <AnimatedDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          animationVariant="scaleIn"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p className="text-muted-foreground">
              This is an animated dialog that scales in and out smoothly.
            </p>
            <AnimatedButton
              animationVariant="fadeInUp"
              buttonVariant="default"
              onClick={() => setIsDialogOpen(false)}
              className="w-full"
            >
              Close Dialog
            </AnimatedButton>
          </div>
        </AnimatedDialog>
      </div>
    </div>
  );
} 