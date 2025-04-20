
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Upgrade your business with <span className="text-brand">better pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Experience our revolutionary SaaS platform that helps businesses increase conversions 
          by offering smart pricing strategies instead of traditional plan selection.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto">
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
