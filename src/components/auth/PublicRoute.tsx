
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/dashboard/useAuthStatus';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Se estiver carregando, mostra um loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra o conteúdo
  return !isAuthenticated ? <>{children}</> : null;
};

export default PublicRoute;
