
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import RecoveryForm from '@/components/auth/RecoveryForm';
import { InsighorLogo } from '@/components/auth/InsighorLogo';
import AuthHeadline from '@/components/auth/AuthHeadline';
import { useIsMobile } from '@/hooks/use-mobile';

// Definir os tipos de props aceitos pelo componente Auth
interface AuthProps {
  type: 'login' | 'register' | 'recovery';
}

const Auth: React.FC<AuthProps> = ({ type: initialType }) => {
  // Estado para controlar qual formulário mostrar
  const [currentType, setCurrentType] = useState<'login' | 'register' | 'recovery'>(initialType);
  const isMobile = useIsMobile();
  
  // Funções de navegação entre formulários
  const handleNavigateToLogin = () => setCurrentType('login');
  const handleNavigateToRegister = () => setCurrentType('register');
  const handleNavigateToRecovery = () => setCurrentType('recovery');

  return (
    <div className="flex min-h-screen w-full bg-[#111827]">
      {/* Seção de branding - exibida apenas em telas grandes */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]">
        <AuthHeadline type={currentType} />
      </div>

      {/* Seção de formulário - centralizada */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <InsighorLogo className="h-10 w-auto mx-auto mb-4 sm:h-12 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentType === 'login' && 'Bem-vindo de volta'}
              {currentType === 'register' && 'Crie sua conta'}
              {currentType === 'recovery' && 'Recupere sua senha'}
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/70">
              {currentType === 'login' && 'Acesse sua conta para continuar'}
              {currentType === 'register' && 'Preencha os dados para começar'}
              {currentType === 'recovery' && 'Enviaremos instruções para seu email'}
            </p>
          </div>
          
          {currentType === 'login' && (
            <LoginForm 
              onRegisterClick={handleNavigateToRegister} 
              onRecoveryClick={handleNavigateToRecovery} 
            />
          )}
          {currentType === 'register' && (
            <RegisterForm 
              onLoginClick={handleNavigateToLogin} 
            />
          )}
          {currentType === 'recovery' && (
            <RecoveryForm 
              onLoginClick={handleNavigateToLogin} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
