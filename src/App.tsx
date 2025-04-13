
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import Auth from './pages/Auth';
import ImportData from './pages/ImportData';
import Architecture from './pages/Architecture';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SalesPage from './pages/SalesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RedirectToDashboard from './pages/RedirectToDashboard';
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
            {/* Sales page as the entry point */}
            <Route path="/" element={<SalesPage />} />

            {/* Authentication check and redirect route */}
            <Route path="/dashboard-redirect" element={<RedirectToDashboard />} />

            {/* Rotas públicas - acessíveis sem autenticação */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Auth type="login" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Auth type="register" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/recovery" 
              element={
                <PublicRoute>
                  <Auth type="recovery" />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <Auth type="login" />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas - requerem autenticação */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/import" 
              element={
                <ProtectedRoute>
                  <ImportData />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/architecture" 
              element={
                <ProtectedRoute>
                  <Architecture />
                </ProtectedRoute>
              } 
            />
            
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
