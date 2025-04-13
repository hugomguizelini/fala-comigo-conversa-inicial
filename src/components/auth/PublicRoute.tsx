
import { useEffect, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/dashboard/useAuthStatus';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Só redirecionamos quando temos certeza de que o usuário está autenticado
    if (!isLoading && isAuthenticated) {
      console.log("Usuário autenticado, redirecionando para o dashboard");
      setShouldRedirect(true);
      // Adicionamos um pequeno delay para garantir que todos os estados foram atualizados
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
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

  // Se estiver autenticado e pronto para redirecionar, não mostramos nada para evitar flash
  if (shouldRedirect) {
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
