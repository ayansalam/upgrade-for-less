import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Upgrade Your Business for Less
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Get premium software upgrades and digital tools at unbeatable prices.
            Save up to 70% on your business essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 