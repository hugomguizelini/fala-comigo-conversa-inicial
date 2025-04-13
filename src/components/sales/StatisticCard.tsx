
import React from "react";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-mobile";

interface StatisticCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  visible: boolean;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ value, label, icon, delay = 0, visible }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/10 rounded-xl p-6 flex flex-col items-center text-center hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
        {icon}
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        {value}
      </h3>
      <p className="text-sm md:text-base text-gray-300">{label}</p>
    </motion.div>
  );
};

export default StatisticCard;
