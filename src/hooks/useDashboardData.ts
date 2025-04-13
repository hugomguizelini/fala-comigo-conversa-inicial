
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useAuthStatus } from "./dashboard/useAuthStatus";
import { useCampaignData } from "./dashboard/useCampaignData";
import { useMetricsData } from "./dashboard/useMetricsData";
import { useAnalyticsData } from "./dashboard/useAnalyticsData";

export type MetricsType = {
  impressions: { value: string; variation: string };
  clicks: { value: string; variation: string };
  ctr: { value: string; variation: string };
  conversions: { value: string; variation: string };
  cpc: { value: string; variation: string };
  totalCost: { value: string; variation: string };
};

export const useDashboardData = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStatus();
  const { campaigns, monthlyData, isLoading, setIsLoading, loadCampaignData } = useCampaignData();
  const { metrics, updateMetrics } = useMetricsData(campaigns);
  const { issues, suggestions, loadAnalyticsData, resetAnalyticsData } = useAnalyticsData();
  const [lastLoadTime, setLastLoadTime] = useState<Date | null>(null);
  
  const loadData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      toast({
        title: "Carregando dados",
        description: "Aguarde enquanto buscamos os dados mais recentes."
      });
      
      const campaignResult = await loadCampaignData();
      
      if (campaignResult.success) {
        updateMetrics();
        await loadAnalyticsData(campaignResult.campaigns, campaignResult.monthlyData);
        
        setLastLoadTime(new Date());
        
        toast({
          title: "Dados atualizados",
          description: "Os dados do dashboard foram atualizados com sucesso."
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível atualizar os dados. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      resetAnalyticsData();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    updateMetrics();
  }, [campaigns]);

  return {
    isLoading,
    setIsLoading,
    campaigns,
    monthlyData,
    metrics,
    issues,
    suggestions,
    loadData,
    isAuthenticated,
    lastLoadTime
  };
};
