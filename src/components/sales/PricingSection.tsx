
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBreakpoint } from "@/hooks/use-mobile";

const PricingSection: React.FC = () => {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and solo marketers.",
      price: annual ? 49 : 59,
      features: [
        "AI Marketing Analytics",
        "Campaign Performance Tracking",
        "Basic Recommendations",
        "5 Marketing Campaigns",
        "Email Support",
      ],
      popular: false,
      cta: "Start with Starter",
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses and marketing teams.",
      price: annual ? 99 : 119,
      features: [
        "Everything in Starter",
        "Advanced AI Recommendations",
        "Competitive Intelligence",
        "Unlimited Marketing Campaigns",
        "Custom Reports",
        "Priority Support",
      ],
      popular: true,
      cta: "Choose Professional",
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex marketing needs.",
      price: "Custom",
      features: [
        "Everything in Professional",
        "Custom AI Models",
        "API Access",
        "Dedicated Account Manager",
        "Premium Support 24/7",
        "Custom Integrations",
        "Onboarding & Training",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-2 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-2 rounded-lg">
          <Label htmlFor="billing-toggle" className={`text-sm ${annual ? "text-gray-400" : "text-white"}`}>Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={annual}
            onCheckedChange={setAnnual}
            className="data-[state=checked]:bg-purple-500"
          />
          <Label htmlFor="billing-toggle" className={`text-sm ${annual ? "text-white" : "text-gray-400"}`}>
            Yearly <span className="text-purple-400 text-xs">Save 20%</span>
          </Label>
        </div>
      </div>
      
      <div className={`grid grid-cols-1 ${isMobile ? "gap-8" : "md:grid-cols-3 gap-6"}`}>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl overflow-hidden relative ${
              plan.popular ? "border-2 border-purple-500 shadow-lg shadow-purple-500/20" : "border border-purple-500/20"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-medium px-3 py-1 rounded-bl">
                Most Popular
              </div>
            )}
            
            <div className="p-6 bg-gradient-to-br from-purple-900/10 to-pink-900/10 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6">
                {typeof plan.price === "number" ? (
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-1 mb-1">/{annual ? "year" : "month"}</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                      : "bg-transparent border border-purple-500/50 hover:bg-purple-900/20 text-white"
                  }`}
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-gray-400 text-sm">
          All plans come with a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
