
import { ArrowRight, BarChart3, BrainCircuit, LightbulbIcon, Rocket } from "lucide-react";

const AuthHeadline = () => {
  return (
    <div className="relative h-full flex flex-col justify-center bg-gradient-to-br from-[#1A1F2C] to-[#111827]">
      {/* Padrão de fundo estilizado */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full filter blur-3xl" />
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#1EAEDB]/10 rounded-full filter blur-3xl" />
        </div>
        <div className="grid grid-cols-8 h-full opacity-10">
          {Array(64).fill(null).map((_, i) => (
            <div key={i} className="border border-white/5"></div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 px-12 py-16 space-y-12 max-w-xl mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-md border border-white/10">
            <BrainCircuit className="w-4 h-4 mr-2" />
            <span>Inteligência Artificial avançada</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
            Transforme <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#1EAEDB]">insights</span> em 
            <span className="relative ml-3">
              resultados
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 138 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 5.5C36.5 -0.5 104 -0.5 136.5 5.5" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
        </div>

        <p className="text-xl text-white/80 leading-relaxed">
          Potencialize seu marketing com análises preditivas e segmentações avançadas de audiência em tempo real.
        </p>

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-1.5 bg-white/10">
              <LightbulbIcon className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <p className="text-white/70">
              <span className="text-white font-medium">Decisões baseadas em dados</span>{" "}
              com análises preditivas avançadas
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full p-1.5 bg-white/10">
              <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <p className="text-white/70">
              <span className="text-white font-medium">Otimização de campanhas</span>{" "}
              com acompanhamento de métricas em tempo real
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full p-1.5 bg-white/10">
              <Rocket className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <p className="text-white/70">
              <span className="text-white font-medium">Segmentação avançada</span>{" "}
              para atingir a audiência certa no momento ideal
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex -space-x-3">
            <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#1A1F2C]" />
            <img src="https://i.pravatar.cc/100?img=2" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#1A1F2C]" />
            <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-[#1A1F2C]" />
          </div>
          <div className="ml-4">
            <p className="text-white text-sm font-medium">+2.500 profissionais de marketing</p>
            <p className="text-white/60 text-xs">já utilizam o Insighor.AI diariamente</p>
          </div>
        </div>

        <a 
          href="#" 
          className="inline-flex items-center text-sm font-medium text-white group"
        >
          <span>Saiba mais sobre nossa tecnologia</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default AuthHeadline;
