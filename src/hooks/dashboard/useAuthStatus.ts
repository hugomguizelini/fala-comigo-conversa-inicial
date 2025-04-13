
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Verificar sessão atual primeiro
    const checkCurrentSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking auth session:", error);
          throw error;
        }
        console.log("Current session:", currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
      } catch (error) {
        console.error("Error in checkCurrentSession:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Configurar listener de eventos de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      // Notificar o usuário sobre eventos de autenticação importantes
      if (event === 'SIGNED_IN') {
        toast.success("Login realizado com sucesso!");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Você foi desconectado");
      } else if (event === 'USER_UPDATED') {
        toast.success("Perfil atualizado com sucesso");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info("Recuperação de senha solicitada");
      }
    });
    
    checkCurrentSession();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erro ao fazer logout");
    }
  };
  
  return { isAuthenticated, isLoading, user, session, signOut };
};
