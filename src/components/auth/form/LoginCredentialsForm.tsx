
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import FormInputWithIcon from "./FormInputWithIcon";
import ErrorAlert from "./ErrorAlert";

interface LoginCredentialsFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  errorMessage: string | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onRecoveryClick: () => void;
  onRegisterClick: () => void;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  errorMessage,
  isLoading,
  onSubmit,
  onRecoveryClick,
  onRegisterClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorAlert message={errorMessage} />

      <div className="space-y-2">
        <FormInputWithIcon
          icon={Mail}
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <FormInputWithIcon
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />
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
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
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
  );
};

export default LoginCredentialsForm;
