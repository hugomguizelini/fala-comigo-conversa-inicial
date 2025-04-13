
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import Auth from './pages/Auth';
import RedirectToDashboard from './pages/RedirectToDashboard';
import ImportData from './pages/ImportData';
import Architecture from './pages/Architecture';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

// Inicializar o cliente de consulta para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduzir tentativas para evitar notificações repetidas
      staleTime: 30000 // Dados são considerados "frescos" por 30 segundos
    },
  },
});

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
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
