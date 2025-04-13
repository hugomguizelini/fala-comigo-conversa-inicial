
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBreakpoint } from "@/hooks/use-mobile";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Marketing Director at TechCorp",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    content: "Insighor.AI has transformed our marketing strategy. We've seen a 42% increase in campaign ROI since implementing their AI recommendations. The insights are incredibly actionable and have helped us connect with our audience in ways we never thought possible.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "CMO at GrowthLabs",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    content: "The competitive intelligence features alone are worth the investment. Being able to benchmark our performance against industry standards has helped us identify key opportunities we were missing. Our team is now more data-driven than ever.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Digital Marketing Manager at E-Shop",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "We've tried several marketing analytics platforms before, but Insighor.AI is in a league of its own. The real-time campaign monitoring has allowed us to make crucial pivots mid-campaign, saving us thousands in ad spend and dramatically improving results.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Founder of AdScale",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    content: "The personalized recommendations are uncannily accurate. It's like having an elite marketing consultant working with you 24/7. Our conversion rates have increased by 28% since implementing Insighor.AI's suggestions.",
    rating: 5,
  },
  {
    name: "Emma Johnson",
    role: "Social Media Director at Fashion Forward",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    content: "As someone who manages multiple campaigns across different platforms, Insighor.AI has been a game-changer. The unified dashboard and AI-driven insights save me hours of analysis and have improved our overall engagement metrics by 35%.",
    rating: 5,
  },
];

const TestimonialSlider: React.FC = () => {
  const breakpoint = useBreakpoint();
  
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {testimonials.map((testimonial, index) => (
          <CarouselItem 
            key={index} 
            className={breakpoint === "xs" ? "pl-4 basis-full" : breakpoint === "sm" ? "pl-4 basis-full sm:basis-1/2" : "pl-4 basis-full sm:basis-1/2 lg:basis-1/3"}
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="h-full bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/10 p-6 rounded-xl shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 text-base">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-8">
        <CarouselPrevious className="position-static mr-2" />
        <CarouselNext className="position-static" />
      </div>
    </Carousel>
  );
};

export default TestimonialSlider;
