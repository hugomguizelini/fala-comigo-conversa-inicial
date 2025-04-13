
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        
        // Setup listener for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          setIsAuthenticated(!!session);
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return { isAuthenticated, isLoading };
};
