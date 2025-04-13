
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User, Facebook } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RegisterFormProps {
  onLoginClick: () => void;
}

const RegisterForm = ({ onLoginClick }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = (password: string): number => {
    if (!password) return 0;
    
    let score = 0;
    // Comprimento mínimo
    if (password.length >= 8) score += 1;
    // Contém números
    if (/\d/.test(password)) score += 1;
    // Contém letras maiúsculas e minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    // Contém caracteres especiais
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    return score;
  };

  const getPasswordStrengthText = (strength: number): string => {
    switch (strength) {
      case 0: return "Fraca";
      case 1: return "Fraca";
      case 2: return "Média";
      case 3: return "Boa";
      case 4: return "Forte";
      default: return "";
    }
  };

  const getPasswordStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0: return "bg-red-500/50";
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-green-400";
      case 4: return "bg-green-500";
      default: return "";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não correspondem");
      return;
    }
    
    if (passwordStrength(password) < 2) {
      toast.error("Por favor, use uma senha mais forte");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
      
      // Automaticamente volta para a tela de login após 3 segundos
      setTimeout(() => {
        onLoginClick();
      }, 3000);
      
    } catch (error: any) {
      console.error("Registro error:", error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: "google" | "facebook") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      
      if (error) {
        throw error;
      }
      
      // O redirecionamento é tratado pelo Supabase OAuth
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(`Erro ao cadastrar com ${provider}`);
    }
  };

  const strength = passwordStrength(password);

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Crie sua conta no Insighor.AI
        </h1>
        <p className="text-sm text-white/70">
          Potencialize suas campanhas com insights inteligentes
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={() => handleSocialRegister('google')}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={() => handleSocialRegister('facebook')}
        >
          <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
          Facebook
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-white/50 bg-[#111827]">ou preencha os campos</span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              type="text"
              placeholder="Nome completo"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              type="email"
              placeholder="Seu e-mail"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {password && (
            <div className="space-y-1">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${getPasswordStrengthColor(strength)}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                Força da senha: <span className="text-white">{getPasswordStrengthText(strength)}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-white/50">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="text-[#8B5CF6] hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-[#8B5CF6] hover:underline">
            Política de Privacidade
          </a>
          .
        </p>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d78f8] hover:to-[#8B5CF6] text-white font-medium shadow-lg shadow-[#8B5CF6]/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Criando...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onLoginClick}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Já tem uma conta? <span className="text-[#8B5CF6] hover:underline">Faça login</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
