
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import RecoveryForm from "@/components/auth/RecoveryForm";
import { InsighorLogo } from "@/components/auth/InsighorLogo";
import AuthHeadline from "@/components/auth/AuthHeadline";

const Auth = () => {
  const [authView, setAuthView] = useState<"login" | "register" | "recovery">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#111827] flex items-stretch">
      {/* Lado esquerdo - Formulários */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-center mb-8">
            <InsighorLogo className="h-16 w-auto" />
          </div>

          <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {authView === "login" && (
              <LoginForm 
                onRegisterClick={() => setAuthView("register")}
                onRecoveryClick={() => setAuthView("recovery")} 
              />
            )}
            {authView === "register" && (
              <RegisterForm 
                onLoginClick={() => setAuthView("login")} 
              />
            )}
            {authView === "recovery" && (
              <RecoveryForm 
                onLoginClick={() => setAuthView("login")} 
              />
            )}
          </div>
          
          <div className="text-center text-white/50 text-xs mt-8">
            © 2025 Insighor.AI. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Lado direito - Headline */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthHeadline />
      </div>
      
      {/* Elementos de fundo (visíveis apenas na versão mobile) */}
      <div className="absolute top-0 left-0 w-full h-full lg:hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8B5CF6]/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#1EAEDB]/10 rounded-full filter blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Auth;
