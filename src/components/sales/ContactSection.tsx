
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBreakpoint } from "@/hooks/use-mobile";
import { toast } from "sonner";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-purple-400" />,
      title: "Email Us",
      description: "Our friendly team is here to help.",
      contact: "hello@insighor.ai",
    },
    {
      icon: <Phone className="h-6 w-6 text-purple-400" />,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm.",
      contact: "+1 (555) 000-0000",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
      title: "Live Chat",
      description: "Available 24/7 for urgent inquiries.",
      contact: "Start a chat",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? "gap-8" : "lg:grid-cols-5 gap-12"}`}>
      {/* Contact Methods */}
      <div className={`${isMobile ? "" : "lg:col-span-2"} space-y-6`}>
        <p className="text-gray-300 mb-8">
          Have questions about our platform or pricing? Want to see how Insighor.AI can help your specific business needs? Our team is ready to assist you.
        </p>
        
        {contactMethods.map((method, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex p-4 rounded-lg bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/10"
          >
            <div className="mr-4 flex-shrink-0">
              {method.icon}
            </div>
            <div>
              <h3 className="font-medium text-white">{method.title}</h3>
              <p className="text-sm text-gray-400">{method.description}</p>
              <p className="text-purple-400 mt-1 font-medium">{method.contact}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className={`${isMobile ? "" : "lg:col-span-3"} bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-xl border border-purple-500/10 p-6`}
      >
        <h3 className="text-xl font-bold mb-6 text-white">Send us a message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-[#161626] border-purple-500/20 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-[#161626] border-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="Your company name"
              value={formData.company}
              onChange={handleInputChange}
              className="bg-[#161626] border-purple-500/20 focus:border-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="How can we help you?"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              className="bg-[#161626] border-purple-500/20 focus:border-purple-500"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 w-full"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            By submitting this form, you agree to our <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactSection;
