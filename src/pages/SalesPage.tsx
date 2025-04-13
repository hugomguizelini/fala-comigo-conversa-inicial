import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Check, Star, Shield, Users, Award, Gift, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-mobile";
import SalesHero from "@/components/sales/SalesHero";
import FeatureSection from "@/components/sales/FeatureSection";
import TestimonialSlider from "@/components/sales/TestimonialSlider";
import PricingSection from "@/components/sales/PricingSection";
import StatisticCard from "@/components/sales/StatisticCard";
import FaqSection from "@/components/sales/FaqSection";
import ContactSection from "@/components/sales/ContactSection";
import SalesFooter from "@/components/sales/SalesFooter";
import SalesHeader from "@/components/sales/SalesHeader";

const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Intersection observer for animation
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    Object.keys(sectionsRef.current).forEach((key) => {
      const section = sectionsRef.current[key];
      if (section) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(key));
            }
          },
          { threshold: 0.2 }
        );
        
        observer.observe(section);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const addSectionRef = (id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      sectionsRef.current[id] = ref;
    }
  };

  // Estatísticas atualizadas
  const statistics = [
    { 
      value: "3.200+", 
      label: "Campanhas de Marketing Otimizadas",
      icon: <Gift className="h-8 w-8 text-purple-500" />
    },
    { 
      value: "84%", 
      label: "Melhoria Média de Conversão",
      icon: <Award className="h-8 w-8 text-purple-500" /> 
    },
    { 
      value: "12M+", 
      label: "Gastos em Anúncios Analisados",
      icon: <Shield className="h-8 w-8 text-purple-500" /> 
    },
    { 
      value: "28,3%", 
      label: "Aumento de Retorno sobre Investimento",
      icon: <Users className="h-8 w-8 text-purple-500" /> 
    },
  ];

  // Recursos atualizados
  const features = [
    {
      title: "Análise de Marketing por IA",
      description: "Algoritmos avançados analisam seus dados de marketing, identificando padrões que humanos podem perder e fornecendo insights acionáveis.",
      icon: <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10.5V8.25C21 6.18 19.32 4.5 17.25 4.5H16.5V4.125C16.5 2.679 15.321 1.5 13.875 1.5H10.125C8.679 1.5 7.5 2.679 7.5 4.125V4.5H6.75C4.68 4.5 3 6.18 3 8.25V18.75C3 20.82 4.68 22.5 6.75 22.5H17.25C19.32 22.5 21 20.82 21 18.75V18M16.5 1.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 1.5V9M12 10.5V19.5M18 15H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1600"
    },
    {
      title: "Monitoramento de Campanhas em Tempo Real",
      description: "Acompanhe o desempenho de suas campanhas de marketing em tempo real, permitindo ajustes imediatos e otimização.",
      icon: <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1600"
    },
    {
      title: "Recomendações Personalizadas por IA",
      description: "Obtenha sugestões personalizadas adaptadas aos seus objetivos específicos de marketing, público-alvo e referências do setor.",
      icon: <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5699 18.5001V14.6001M15.5699 9.45007V5.55007M15.5699 14.6001C15.5699 13.1601 16.4999 12.0001 17.5599 12.0001C18.6299 12.0001 19.5599 13.1601 19.5599 14.6001C19.5599 16.0401 18.6299 17.2001 17.5599 17.2001C16.4999 17.2001 15.5699 16.0401 15.5699 14.6001ZM15.5699 9.45007C15.5699 8.01007 16.4999 6.85007 17.5599 6.85007C18.6299 6.85007 19.5599 8.01007 19.5599 9.45007C19.5599 10.8901 18.6299 12.0501 17.5599 12.0501C16.4999 12.0501 15.5699 10.8901 15.5699 9.45007Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.44 12H9.66C10.56 12 11.29 12.73 11.29 13.63C11.29 14.53 10.56 15.26 9.66 15.26H7.22C6.32 15.26 5.59 15.99 5.59 16.89C5.59 17.79 6.32 18.52 7.22 18.52H12.44M8.89 18.52V19.61M8.89 11.03V9.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1600"
    },
    {
      title: "Inteligência Competitiva",
      description: "Compare seu desempenho com concorrentes e padrões do setor para se manter à frente das tendências de mercado.",
      icon: <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 22H21M5 8.5C5 5.87 7.13 3.75 9.76 3.75C11.17 3.75 12.4 4.38 13.24 5.38C14.08 4.38 15.3 3.75 16.71 3.75C19.34 3.75 21.47 5.87 21.47 8.5C21.47 9.8 21 11 20.17 11.9C19.09 13.07 17.13 14.38 14.41 16.31L13.24 17.16L12.06 16.31C9.34 14.38 7.38 13.07 6.3 11.9C5.48 11 5 9.8 5 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1600"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white min-h-screen">
      {/* Cabeçalho */}
      <SalesHeader />
      
      {/* Seção Hero */}
      <section ref={(ref) => addSectionRef('hero', ref as HTMLDivElement)} className="relative">
        <SalesHero />
      </section>
      
      {/* Seção de Estatísticas */}
      <section 
        ref={(ref) => addSectionRef('statistics', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"}`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={visibleSections.has('statistics') ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Transformando Marketing com IA
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Nossa plataforma ajudou milhares de empresas a alcançarem resultados sem precedentes através de inteligência de marketing por IA.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <StatisticCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={index * 0.1}
                visible={visibleSections.has('statistics')}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Seção de Recursos */}
      <section 
        ref={(ref) => addSectionRef('features', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"} bg-[#12121e]`}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={visibleSections.has('features') ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Recursos Poderosos
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Descubra como nossa plataforma alimentada por IA pode transformar sua estratégia de marketing e impulsionar resultados excepcionais.
            </p>
          </div>
          
          <div className="space-y-32">
            {features.map((feature, index) => (
              <FeatureSection
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                imageUrl={feature.imageUrl}
                reverse={index % 2 !== 0}
                visible={visibleSections.has('features')}
                delay={index * 0.2}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Seção de Depoimentos */}
      <section 
        ref={(ref) => addSectionRef('testimonials', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"}`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={visibleSections.has('testimonials') ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Não confie apenas em nossa palavra. Veja o que profissionais de marketing e empresas alcançaram com a Insighor.AI.
            </p>
          </div>
          
          <TestimonialSlider />
        </motion.div>
      </section>

      {/* Seção de Preços */}
      <section 
        ref={(ref) => addSectionRef('pricing', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"} bg-[#12121e]`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={visibleSections.has('pricing') ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Preços Simples e Transparentes
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal para as necessidades do seu negócio. Sem taxas escondidas, sem surpresas.
            </p>
          </div>
          
          <PricingSection />
        </motion.div>
      </section>

      {/* Seção CTA */}
      <section 
        ref={(ref) => addSectionRef('cta', ref as HTMLDivElement)} 
        className="py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={visibleSections.has('cta') ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`max-w-5xl mx-auto text-center relative z-10 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8"}`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Pronto para Transformar seu Marketing?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Junte-se a milhares de empresas que já estão aproveitando o poder da IA para otimizar campanhas de marketing e impulsionar o crescimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size={breakpoint === "xs" ? "xs" : "lg"} 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
              onClick={() => navigate('/register')}
            >
              Comece de Graça <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size={breakpoint === "xs" ? "xs" : "lg"} 
              variant="outline" 
              className="border-purple-400 text-purple-200 hover:bg-purple-900/20"
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Seção de Perguntas Frequentes */}
      <section 
        ref={(ref) => addSectionRef('faq', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"} bg-[#12121e]`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={visibleSections.has('faq') ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Perguntas Frequentes
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Encontre respostas para perguntas comuns sobre nossa plataforma, preços e recursos.
            </p>
          </div>
          
          <FaqSection />
        </motion.div>
      </section>

      {/* Seção de Contato */}
      <section 
        ref={(ref) => addSectionRef('contact', ref as HTMLDivElement)} 
        className={`py-20 ${breakpoint === "xs" || breakpoint === "sm" ? "px-4" : "px-8 md:px-12 lg:px-24"}`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={visibleSections.has('contact') ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Entre em Contato
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Tem dúvidas ou precisa de consultoria personalizada? Nossa equipe está aqui para ajudar.
            </p>
          </div>
          
          <ContactSection />
        </motion.div>
      </section>

      {/* Rodapé */}
      <SalesFooter />
    </div>
  );
};

export default SalesPage;
