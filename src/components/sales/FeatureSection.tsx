
import React from "react";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-mobile";

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
  reverse?: boolean;
  visible: boolean;
  delay?: number;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  icon,
  imageUrl,
  reverse = false,
  visible,
  delay = 0,
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  return (
    <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-2"} gap-12 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        className={`${reverse && !isMobile ? "lg:order-2" : ""}`}
      >
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              {icon}
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{title}</h3>
          <p className="text-gray-300 text-lg">{description}</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.2 }}
        className={`${reverse && !isMobile ? "lg:order-1" : ""}`}
      >
        <div className="relative">
          <div className="rounded-xl overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-900/20">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full object-cover"
              style={{ height: isMobile ? "250px" : "350px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureSection;
