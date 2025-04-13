
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import RecoveryForm from '@/components/auth/RecoveryForm';
import { InsighorLogo } from '@/components/auth/InsighorLogo';
import AuthHeadline from '@/components/auth/AuthHeadline';

// Definir os tipos de props aceitos pelo componente Auth
interface AuthProps {
  type: 'login' | 'register' | 'recovery';
}

const Auth: React.FC<AuthProps> = ({ type: initialType }) => {
  // Estado para controlar qual formulário mostrar
  const [currentType, setCurrentType] = useState<'login' | 'register' | 'recovery'>(initialType);
  
  // Funções de navegação entre formulários
  const handleNavigateToLogin = () => setCurrentType('login');
  const handleNavigateToRegister = () => setCurrentType('register');
  const handleNavigateToRecovery = () => setCurrentType('recovery');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Seção de formulário - menor em telas grandes */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md">
          <InsighorLogo className="mb-8 h-12 w-auto" />
          <AuthHeadline type={currentType} />
          
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

      {/* Seção de background/branding - oculta em telas pequenas */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] items-center justify-center">
        <div className="max-w-md text-white p-12">
          <h2 className="text-3xl font-bold mb-4">Transforme dados em decisões</h2>
          <p className="text-lg opacity-90">
            Com o Insighor, analise seus dados de marketing e descubra insights valiosos para melhorar suas campanhas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
