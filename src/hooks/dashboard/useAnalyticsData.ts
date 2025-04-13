
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Issue, Suggestion } from "@/types/dataTypes";
import { analyzeAllData } from "@/services/analyticsService";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";

// Dados de fallback para quando não há análises disponíveis
const fallbackIssues: Issue[] = [
  {
    issue: "Baixo CTR em campanhas principais",
    description: "Algumas campanhas estão com taxa de cliques abaixo do esperado para o setor.",
    related_to: "CTR",
    affected_campaigns: ["Campanha de Remarketing", "Campanha de Marca"],
    severity: "medium"
  }
];

const fallbackSuggestions = {
  campaign: [
    {
      id: "1",
      title: "Otimizar segmentação de público",
      description: "Refinar a segmentação para alcançar audiências mais relevantes e aumentar a taxa de conversão.",
      type: "campaign",
      impact: "alto",
      target_campaigns: ["Campanha de Produto"]
    }
  ],
  funnel: [
    {
      id: "2",
      title: "Melhorar páginas de destino",
      description: "As páginas de destino atuais apresentam alta taxa de rejeição. Recomendamos otimizá-las.",
      type: "funnel",
      impact: "médio",
      target_pages: ["Página de produto", "Página de checkout"]
    }
  ]
};

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
      // Usamos a análise direta sem inserir no banco para contornar problemas de RLS
      const analyticsData = await analyzeAllData(campaigns, monthlyData);
      console.log("Análise concluída:", analyticsData);
      
      setIssues(analyticsData.issues);
      setSuggestions(analyticsData.suggestions);
      
      return { success: true };
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Erro ao analisar dados. Usando análises predefinidas.");
      
      // Usar dados de fallback para demonstração
      setIssues(fallbackIssues);
      setSuggestions(fallbackSuggestions);
      
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
