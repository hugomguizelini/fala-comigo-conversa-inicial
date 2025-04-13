
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  getAnalytics,
  Issue,
  Suggestion
} from "@/services/supabaseService";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";

export const useAnalyticsData = () => {
  const { toast: toastLegacy } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [suggestions, setSuggestions] = useState<{
    campaign: Suggestion[];
    funnel: Suggestion[];
  }>({
    campaign: [],
    funnel: []
  });

  const loadAnalyticsData = async (campaigns: CampaignData[], monthlyData: MonthlyPerformance[]) => {
    try {
      // Verificar se temos dados antes de prosseguir com a análise
      if (campaigns.length === 0) {
        console.log("Sem campanhas para analisar");
        return { success: false };
      }

      console.log("Analisando dados...");
      // Load analytics data
      const analyticsData = await getAnalytics(campaigns, monthlyData);
      console.log("Análise concluída:", analyticsData);
      
      setIssues(analyticsData.issues);
      setSuggestions(analyticsData.suggestions);
      
      return { success: true };
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Erro ao analisar dados. Algumas funcionalidades podem estar limitadas.");
      
      // Não usar fallback de dados no MVP para incentivar a inserção de dados reais
      setIssues([]);
      setSuggestions({ campaign: [], funnel: [] });
      
      return { success: false };
    }
  };

  const resetAnalyticsData = () => {
    setIssues([]);
    setSuggestions({ campaign: [], funnel: [] });
  };

  return {
    issues,
    suggestions,
    loadAnalyticsData,
    resetAnalyticsData
  };
};
