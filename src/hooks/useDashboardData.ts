
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useAuthStatus } from "./dashboard/useAuthStatus";
import { useCampaignData } from "./dashboard/useCampaignData";
import { useMetricsData } from "./dashboard/useMetricsData";
import { useAnalyticsData } from "./dashboard/useAnalyticsData";
import { useGptAnalysis, GptAnalysisResult } from "./dashboard/useGptAnalysis";
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
  const { isLoading: isAiLoading, analysis: gptAnalysis, runGptAnalysis } = useGptAnalysis();
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

  const runAiAnalysis = async () => {
    try {
      return await runGptAnalysis(campaigns, monthlyData);
    } catch (error) {
      console.error("Error running AI analysis:", error);
      toast.error("Erro ao executar análise de IA. Tente novamente mais tarde.");
      return null;
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
    isAiLoading,
    setIsLoading,
    campaigns,
    monthlyData,
    metrics,
    issues,
    suggestions,
    gptAnalysis,
    loadData,
    runAiAnalysis,
    isAuthenticated,
    lastLoadTime
  };
};
