
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona diretamente para o dashboard no MVP
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
    </div>
  );
};

export default RedirectToDashboard;
