
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MessageSquare, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SupportPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    toast({
      title: "Message received!",
      description: "We'll get back to you as soon as possible.",
    });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  const scheduleDemo = () => {
    toast({
      title: "Demo requested!",
      description: "Our team will contact you to schedule a demo.",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              We're Here to <span className="text-brand">Help</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our support team is available to answer your questions and help you get the most 
              out of our platform.
            </p>
          </div>
        </section>

        {/* Contact Options Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Mail className="h-10 w-10 text-brand mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Send us an email anytime and we'll respond within 24 hours.
                  </p>
                  <a href="mailto:support@upgradeforless.com" className="text-brand hover:underline">
                    support@upgradeforless.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Phone className="h-10 w-10 text-brand mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Available Monday to Friday, 9am to 5pm EST.
                  </p>
                  <a href="tel:+15551234567" className="text-brand hover:underline">
                    +1 (555) 123-4567
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <MessageSquare className="h-10 w-10 text-brand mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground mb-4">
                    Chat with a support agent in real-time during business hours.
                  </p>
                  <Button onClick={() => toast({ title: "Live chat is currently offline", description: "Please try again during business hours." })}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Schedule Demo Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-brand rounded-lg p-8 md:p-12 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Schedule a Live Demo</h2>
                  <p className="mb-6 opacity-90">
                    See our platform in action with a personalized demonstration from one of our product experts.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <span>30-minute personalized demonstration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <span>Q&A session with a product specialist</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <span>Custom implementation advice for your business</span>
                    </li>
                  </ul>
                  <Button onClick={scheduleDemo} className="bg-white text-brand hover:bg-gray-100">
                    Schedule Demo
                  </Button>
                </div>
                <div className="bg-white p-6 rounded-lg text-gray-800">
                  <h3 className="text-xl font-semibold mb-4 text-center">Demo Request</h3>
                  <form className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Your Name" 
                        className="w-full" 
                        onChange={(e) => toast({ title: "Demo request received", description: "Our team will contact you shortly to schedule a demo." })}
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Your Email" 
                        type="email" 
                        className="w-full" 
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Company Name" 
                        className="w-full" 
                      />
                    </div>
                    <Button 
                      type="button" 
                      className="w-full bg-brand hover:bg-brand-dark"
                      onClick={scheduleDemo}
                    >
                      Request Demo
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have a question or feedback? We'd love to hear from you.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPage;
