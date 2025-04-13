import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-mobile";

const SalesHero: React.FC = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  
  const scrollToNextSection = () => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={heroRef} 
      id="hero" 
      className="min-h-screen flex flex-col justify-center pt-20 pb-10 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(108, 43, 217, 0.2) 0%, transparent 25%),
          radial-gradient(circle at 80% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 30%)
        `,
      }}
    >
      <div className={`container mx-auto ${isMobile ? "px-4" : "px-8"} relative z-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Potencialize seu Marketing
              </span>
              <br />
              <span className="text-white">
                Com Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
              Transforme sua estratégia de marketing com insights de IA em tempo real, recomendações baseadas em dados e otimização automática de campanhas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                onClick={() => navigate('/register')}
              >
                Comece de Graça <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size={isMobile ? "default" : "lg"} 
                variant="outline" 
                className="border-purple-400 text-purple-200 hover:bg-purple-900/20"
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-2 text-gray-400 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-[#0f0f1a] overflow-hidden"
                    style={{ zIndex: 5 - i }}
                  >
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                      alt="Usuário" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm">
                <span className="text-purple-400 font-medium">1.200+</span> profissionais de marketing entraram no último mês
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className={isMobile ? "mt-10" : ""}
          >
            <div className="relative">
              <div className="bg-[#171727] rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-purple-900/20">
                <div className="bg-[#1e1e2f] p-3 flex items-center border-b border-gray-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="mx-auto pr-12 text-xs text-gray-400">
                    Insighor.AI - Marketing Intelligence Dashboard
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070" 
                  alt="Dashboard Preview" 
                  className="w-full object-cover"
                  style={{ height: isMobile ? "300px" : "400px" }}
                />
              </div>
              
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.button
          onClick={scrollToNextSection}
          className="flex items-center text-gray-400 hover:text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="mr-2 text-sm">Role para Baixo</span>
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default SalesHero;
