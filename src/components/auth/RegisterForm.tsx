
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não correspondem",
        description: "Por favor, verifique se as senhas digitadas são iguais",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordStrength(password) < 2) {
      toast({
        title: "Senha fraca",
        description: "Por favor, use uma senha mais forte",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria implementada a lógica de registro
    toast({
      title: "Conta criada",
      description: "Sua conta foi criada com sucesso!",
    });
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
        >
          Criar conta
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
