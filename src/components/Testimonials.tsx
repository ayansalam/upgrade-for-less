
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "After implementing this pricing strategy, our yearly subscription rate increased by nearly 300%. The psychological framing made all the difference.",
    author: "Sarah Johnson",
    role: "CEO, TechFlow SaaS",
    avatar: "/placeholder.svg"
  },
  {
    quote: "Our customers found it much easier to make decisions with this approach. The simplified choice architecture led to faster conversions.",
    author: "Michael Chen",
    role: "Marketing Director, DataWise",
    avatar: "/placeholder.svg"
  },
  {
    quote: "This pricing model helped us increase our average revenue per user by 42% within just three months of implementation.",
    author: "Emma Rodriguez",
    role: "Product Manager, CloudServices",
    avatar: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from businesses that have transformed their subscription conversions using our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-16 h-16 rounded-full mb-4 bg-gray-100 p-2"
                  />
                  <blockquote className="text-gray-700 mb-4">"{testimonial.quote}"</blockquote>
                  <cite className="not-italic">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </cite>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
