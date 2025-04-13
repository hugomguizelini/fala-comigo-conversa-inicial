
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoginCredentialsForm from "./form/LoginCredentialsForm";
import SocialLoginButtons from "./social/SocialLoginButtons";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoginFormProps {
  onRegisterClick: () => void;
  onRecoveryClick: () => void;
}

const LoginForm = ({ onRegisterClick, onRecoveryClick }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Tentando fazer login com:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Login bem-sucedido:", data);
      // Login bem-sucedido, o redirecionamento é tratado pelo componente PublicRoute
    } catch (error: any) {
      console.error("Login error details:", error);
      
      // Tratamento de erros específicos
      if (error.message.includes("Invalid login")) {
        setErrorMessage("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (error.message.includes("Email not confirmed")) {
        setErrorMessage("Por favor, confirme seu email antes de fazer login.");
      } else if (error.message.includes("network")) {
        setErrorMessage("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        setErrorMessage(error.message || "Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      setErrorMessage(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        throw error;
      }
      
      // O redirecionamento é tratado pelo Supabase OAuth
      console.log("Social login initiated:", data);
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setErrorMessage(`Erro ao fazer login com ${provider}. Tente novamente.`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="space-y-1 sm:space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Bem-vindo ao Insighor.AI
        </h1>
        <p className="text-xs sm:text-sm text-white/70">
          A inteligência artificial a serviço do seu marketing
        </p>
      </div>

      <LoginCredentialsForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        errorMessage={errorMessage}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onRecoveryClick={onRecoveryClick}
        onRegisterClick={onRegisterClick}
      />

      <SocialLoginButtons onSocialLogin={handleSocialLogin} />
    </div>
  );
};

export default LoginForm;
