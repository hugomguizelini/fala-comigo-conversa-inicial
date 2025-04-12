
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onRegisterClick: () => void;
  onRecoveryClick: () => void;
}

const LoginForm = ({ onRegisterClick, onRecoveryClick }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria implementada a lógica de autenticação
    toast({
      title: "Login realizado",
      description: "Você foi autenticado com sucesso!",
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Bem-vindo ao Insighor.AI
        </h1>
        <p className="text-sm text-white/70">
          A inteligência artificial a serviço do seu marketing
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm text-white/70">
              Lembrar de mim
            </Label>
          </div>
          <button
            type="button"
            onClick={onRecoveryClick}
            className="text-sm text-[#8B5CF6] hover:text-[#9d78f8] hover:underline transition-colors"
          >
            Esqueceu sua senha?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d78f8] hover:to-[#8B5CF6] text-white font-medium shadow-lg shadow-[#8B5CF6]/20"
        >
          Entrar
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Não tem uma conta? <span className="text-[#8B5CF6] hover:underline">Cadastre-se</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
