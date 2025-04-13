
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useAuthStatus } from "./dashboard/useAuthStatus";
import { useCampaignData } from "./dashboard/useCampaignData";
import { useMetricsData } from "./dashboard/useMetricsData";
import { useAnalyticsData } from "./dashboard/useAnalyticsData";
import { toast } from "sonner";
import { Issue, Suggestion } from "@/types/dataTypes";

export type MetricsType = {
  impressions: { value: string; variation: string };
  clicks: { value: string; variation: string };
  ctr: { value: string; variation: string };
  conversions: { value: string; variation: string };
  cpc: { value: string; variation: string };
  totalCost: { value: string; variation: string };
};

export const useDashboardData = () => {
  const { isAuthenticated } = useAuthStatus();
  const { campaigns, monthlyData, isLoading, setIsLoading, loadCampaignData } = useCampaignData();
  const { metrics, updateMetrics } = useMetricsData(campaigns);
  const { issues, suggestions, loadAnalyticsData } = useAnalyticsData();
  const [lastLoadTime, setLastLoadTime] = useState<Date | null>(null);
  
  const loadData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      toast.loading("Carregando dados...");
      
      // Carregar dados independentemente do status de autenticação para o MVP
      const campaignResult = await loadCampaignData();
      
      if (campaignResult.success) {
        updateMetrics();
        await loadAnalyticsData(campaignResult.campaigns, campaignResult.monthlyData);
        
        setLastLoadTime(new Date());
        
        toast.success("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // No MVP, carregamos os dados independentemente da autenticação
    loadData();
  }, []);
  
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
