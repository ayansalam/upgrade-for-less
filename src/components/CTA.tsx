
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const CTA = () => {
  const { toast } = useToast();

  const handleScheduleDemo = () => {
    toast({
      title: "Demo requested!",
      description: "Our team will contact you shortly to schedule a demo.",
    });
  };

  return (
    <section className="py-20 bg-brand text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your subscription conversions?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of businesses that have already increased their revenue with our innovative pricing strategy.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="default" className="bg-white text-brand hover:bg-gray-100" asChild>
            <Link to="/auth">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleScheduleDemo}>
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
