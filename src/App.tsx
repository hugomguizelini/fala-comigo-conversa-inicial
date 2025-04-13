
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import Auth from './pages/Auth';
import RedirectToDashboard from './pages/RedirectToDashboard';
import ImportData from './pages/ImportData';
import Architecture from './pages/Architecture';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';  // Atualizado o import
import './App.css';

// Inicializar o cliente de consulta para React Query
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Para o MVP, substituímos a rota de login pelo redirecionamento */}
            <Route path="/login" element={<RedirectToDashboard />} />
            {/* Ajuste para o Auth component, passando a prop dentro do elemento Auth */}
            <Route path="/register" element={<Auth type="register" />} />
            <Route path="/recovery" element={<Auth type="recovery" />} />
            
            {/* Rota de login explícita para acessar a página de autenticação */}
            <Route path="/auth" element={<Auth type="login" />} />
            
            {/* Rotas do dashboard - sem proteção para o MVP */}
            <Route path="/" element={<Dashboard />} />  {/* Atualizado o componente */}
            <Route path="/import" element={<ImportData />} />
            <Route path="/architecture" element={<Architecture />} />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

