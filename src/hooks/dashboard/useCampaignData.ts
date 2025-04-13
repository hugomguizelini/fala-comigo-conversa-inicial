
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCampaigns, 
  getMonthlyPerformance,
  CampaignData,
  MonthlyPerformance
} from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";

export const useCampaignData = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      // Check authentication
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        toast({
          title: "Usuário não autenticado",
          description: "Faça login para carregar seus dados.",
          variant: "destructive"
        });
        setIsLoading(false);
        return { success: false };
      }
      
      const campaignData = await getCampaigns();
      const monthlyPerformanceData = await getMonthlyPerformance();
      
      setCampaigns(campaignData);
      setMonthlyData(monthlyPerformanceData);
      
      return { 
        success: true, 
        campaigns: campaignData, 
        monthlyData: monthlyPerformanceData 
      };
    } catch (error) {
      console.error("Error loading campaign data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de campanhas.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    monthlyData,
    isLoading,
    setIsLoading,
    loadCampaignData
  };
};
