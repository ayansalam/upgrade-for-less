
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Mail, MessageCircle, Phone } from "lucide-react";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the form data to a backend
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Clear form
    setName("");
    setEmail("");
    setMessage("");
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo Scheduled",
      description: "Our team will contact you to confirm the details.",
    });
  };

  const faqs = [
    {
      question: "How does the discount pricing model work?",
      answer: "Instead of offering monthly vs yearly plans, we present a single monthly plan with optional discount periods. Customers can choose between the standard price, a short-term discount (15% off for 8 weeks), or a long-term discount (30% off for 52 weeks)."
    },
    {
      question: "Can I integrate this with my existing billing system?",
      answer: "Yes, our solution works with most popular billing platforms including Stripe, Chargebee, and Recurly. We provide API documentation and support for custom integrations."
    },
    {
      question: "How do I track the performance of different discount options?",
      answer: "Our admin dashboard provides detailed analytics on conversion rates for each discount option, allowing you to see which option performs best with your audience."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to all features, no credit card required to start."
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Support & Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get help with our platform or schedule a demo to see how we can boost your conversions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Name</label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="message">Message</label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">Send Message</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Demo and Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Demo</CardTitle>
                <CardDescription>See how our platform can work for your business.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>30-minute personalized demonstration</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span>Available weekdays 9am-5pm EST</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleScheduleDemo} className="w-full">Schedule Now</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <span>support@upgradeforless.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  <span>Live chat available on business days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
