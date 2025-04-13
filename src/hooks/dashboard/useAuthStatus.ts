
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
    
    // Configurar listener de eventos de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      // Notificar o usuário sobre eventos de autenticação importantes
      if (event === 'SIGNED_IN') {
        toast.success("Login realizado com sucesso!");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Você foi desconectado");
      }
    });
    
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error checking auth session:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erro ao fazer logout");
    }
  };
  
  return { isAuthenticated, isLoading, user, session, signOut };
};
