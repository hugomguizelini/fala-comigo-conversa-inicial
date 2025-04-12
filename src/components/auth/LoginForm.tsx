
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Facebook, Github } from "lucide-react";
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

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `Login com ${provider}`,
      description: `Iniciando autenticação com ${provider}...`,
    });
    // Aqui seria implementada a lógica de autenticação social
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-white/50 bg-[#111827]">ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            onClick={() => handleSocialLogin('Google')}
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
            onClick={() => handleSocialLogin('Facebook')}
          >
            <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
            Facebook
          </Button>
        </div>

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
