
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/dashboard/useAuthStatus';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Você precisa fazer login para acessar esta página");
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Se estiver carregando, não renderiza nada ainda
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
