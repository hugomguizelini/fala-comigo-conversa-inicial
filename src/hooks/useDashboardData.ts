
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
    // Armazenar o ID do toast para poder removê-lo depois
    const loadingToastId = toast.loading("Carregando dados...", {
      duration: 30000, // timeout máximo para garantir que o toast não fique preso
    });
    
    try {
      // Carregar dados independentemente do status de autenticação para o MVP
      const campaignResult = await loadCampaignData();
      
      if (campaignResult.success) {
        updateMetrics();
        
        // Garantir que a análise é executada mesmo que falhe a inserção no banco
        await loadAnalyticsData(campaignResult.campaigns, campaignResult.monthlyData);
        
        setLastLoadTime(new Date());
        
        // Remover o toast de carregamento e mostrar o de sucesso
        toast.dismiss(loadingToastId);
        toast.success("Dados atualizados com sucesso!", { duration: 3000 });
      } else {
        // Remover o toast de carregamento e mostrar o de erro
        toast.dismiss(loadingToastId);
        toast.error("Erro ao carregar dados.", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Remover o toast de carregamento e mostrar o de erro
      toast.dismiss(loadingToastId);
      toast.error("Erro ao carregar dados. Tente novamente mais tarde.", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const runAiAnalysis = async () => {
    const analysisToastId = toast.loading("Executando análise de IA...", { 
      duration: 30000 // timeout máximo para garantir que o toast não fique preso
    });
    
    try {
      const result = await runGptAnalysis(campaigns, monthlyData);
      toast.dismiss(analysisToastId);
      
      if (result) {
        toast.success("Análise concluída com sucesso!", { duration: 3000 });
      }
      
      return result;
    } catch (error) {
      console.error("Error running AI analysis:", error);
      toast.dismiss(analysisToastId);
      toast.error("Erro ao executar análise de IA. Tente novamente mais tarde.", { duration: 3000 });
      return null;
    }
  };
  
  useEffect(() => {
    // No MVP, carregamos os dados independentemente da autenticação
    loadData();
  }, []);
  
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      updateMetrics();
      // Adicionar análise automática quando campanhas forem carregadas
      loadAnalyticsData(campaigns, monthlyData);
    }
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
