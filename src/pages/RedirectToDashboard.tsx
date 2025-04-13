
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/dashboard/useAuthStatus';

const RedirectToDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    if (!isLoading) {
      // Se estiver autenticado, redireciona para o dashboard
      // Se não estiver, redireciona para a página de login
      navigate(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [navigate, isAuthenticated, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
    </div>
  );
};

export default RedirectToDashboard;
