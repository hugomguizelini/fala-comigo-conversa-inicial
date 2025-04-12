
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RecoveryFormProps {
  onLoginClick: () => void;
}

const RecoveryForm = ({ onLoginClick }: RecoveryFormProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu e-mail",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria implementada a lógica de recuperação
    setSubmitted(true);
    toast({
      title: "E-mail enviado",
      description: "Instruções de recuperação foram enviadas para seu e-mail",
    });
  };

  if (submitted) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="h-16 w-16 text-[#8B5CF6]" />
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            E-mail enviado
          </h1>
          <p className="text-sm text-white/70 max-w-xs">
            Enviamos instruções de recuperação para {email}. Por favor, verifique sua caixa de entrada.
          </p>
        </div>
        <Button 
          onClick={onLoginClick}
          className="mt-4 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d78f8] hover:to-[#8B5CF6] text-white font-medium shadow-lg shadow-[#8B5CF6]/20"
        >
          Voltar ao login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Recupere sua senha
        </h1>
        <p className="text-sm text-white/70">
          Enviaremos um link para redefinição
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9d78f8] hover:to-[#8B5CF6] text-white font-medium shadow-lg shadow-[#8B5CF6]/20"
        >
          Enviar link de redefinição
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onLoginClick}
            className="text-sm text-white/70 hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Lembrou sua senha? Voltar ao login</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecoveryForm;
