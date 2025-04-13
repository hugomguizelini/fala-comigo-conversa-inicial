
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCampaigns, 
  getMonthlyPerformance,
  CampaignData,
  MonthlyPerformance,
  getAnalytics,
  Issue,
  Suggestion,
  FallbackIssue,
  FallbackSuggestion
} from "@/services/supabaseService";
import dashboardData from "@/data/dashboard-data.json";
import { supabase } from "@/integrations/supabase/client";

export type MetricsType = {
  impressions: { value: string; variation: string };
  clicks: { value: string; variation: string };
  ctr: { value: string; variation: string };
  conversions: { value: string; variation: string };
  cpc: { value: string; variation: string };
  totalCost: { value: string; variation: string };
};

// Helper function to validate impact values
const validateImpact = (impact: string): "alto" | "médio" | "baixo" => {
  if (impact === "alto" || impact === "médio" || impact === "baixo") {
    return impact as "alto" | "médio" | "baixo";
  }
  return "médio";
};

export const useDashboardData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [suggestions, setSuggestions] = useState<{
    campaign: Suggestion[];
    funnel: Suggestion[];
  }>({
    campaign: [],
    funnel: []
  });
  const [metrics, setMetrics] = useState<MetricsType>({
    impressions: { value: "0", variation: "0%" },
    clicks: { value: "0", variation: "0%" },
    ctr: { value: "0%", variation: "0%" },
    conversions: { value: "0", variation: "0%" },
    cpc: { value: "R$ 0,00", variation: "0%" },
    totalCost: { value: "R$ 0,00", variation: "0%" }
  });
  
  // Verificar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Configurar listener de mudanças de autenticação
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
        if (event === 'SIGNED_IN') {
          loadData(); // Recarregar dados quando o usuário fizer login
        } else if (event === 'SIGNED_OUT') {
          // Limpar dados ao fazer logout
          setCampaigns([]);
          setMonthlyData([]);
          setIssues([]);
          setSuggestions({ campaign: [], funnel: [] });
          setMetrics({
            impressions: { value: "0", variation: "0%" },
            clicks: { value: "0", variation: "0%" },
            ctr: { value: "0%", variation: "0%" },
            conversions: { value: "0", variation: "0%" },
            cpc: { value: "R$ 0,00", variation: "0%" },
            totalCost: { value: "R$ 0,00", variation: "0%" }
          });
        }
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Verificar autenticação
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        toast({
          title: "Usuário não autenticado",
          description: "Faça login para carregar seus dados.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const campaignData = await getCampaigns();
      const monthlyPerformanceData = await getMonthlyPerformance();
      
      setCampaigns(campaignData);
      setMonthlyData(monthlyPerformanceData);
      
      if (campaignData.length > 0) {
        const totalImpressions = campaignData.reduce((sum, campaign) => sum + campaign.impressions, 0);
        const totalClicks = campaignData.reduce((sum, campaign) => sum + campaign.clicks, 0);
        const totalConversions = campaignData.reduce((sum, campaign) => sum + campaign.conversions, 0);
        
        const totalCost = campaignData.reduce((sum, campaign) => {
          const costValue = parseFloat(campaign.total_cost?.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
          return sum + costValue;
        }, 0);
        
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
        
        setMetrics({
          impressions: { value: totalImpressions.toLocaleString(), variation: "+12%" },
          clicks: { value: totalClicks.toLocaleString(), variation: "+8%" },
          ctr: { value: `${ctr.toFixed(2)}%`, variation: "+5%" },
          conversions: { value: totalConversions.toLocaleString(), variation: "+15%" },
          cpc: { value: `R$ ${cpc.toFixed(2)}`, variation: "-3%" },
          totalCost: { value: `R$ ${totalCost.toFixed(2)}`, variation: "+7%" }
        });
      } else {
        setMetrics(dashboardData.metrics);
      }
      
      // Carregar problemas e sugestões
      const analyticsData = await getAnalytics(campaignData, monthlyPerformanceData);
      setIssues(analyticsData.issues);
      setSuggestions(analyticsData.suggestions);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setMetrics(dashboardData.metrics);
      
      // Converter os dados de exemplo para o formato correto das interfaces
      const fallbackIssues: Issue[] = (dashboardData.identifiedIssues as FallbackIssue[]).map(issue => ({
        issue: issue.issue,
        description: issue.description,
        related_to: issue.relatedTo,
        affected_campaigns: issue.affectedCampaigns,
        severity: 'medium' // Valor padrão para compatibilidade
      }));
      
      const fallbackCampaignSuggestions: Suggestion[] = (dashboardData.optimizationSuggestions.campaign as FallbackSuggestion[]).map(suggestion => ({
        title: suggestion.title,
        description: suggestion.description,
        type: 'campaign',
        impact: validateImpact(suggestion.impact),
        target_campaigns: suggestion.targetCampaigns
      }));
      
      const fallbackFunnelSuggestions: Suggestion[] = (dashboardData.optimizationSuggestions.funnel as FallbackSuggestion[]).map(suggestion => ({
        title: suggestion.title,
        description: suggestion.description,
        type: 'funnel',
        impact: validateImpact(suggestion.impact),
        target_pages: suggestion.targetPages,
        target_audience: suggestion.targetAudience
      }));
      
      setIssues(fallbackIssues);
      setSuggestions({
        campaign: fallbackCampaignSuggestions,
        funnel: fallbackFunnelSuggestions
      });
      
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  return {
    isLoading,
    setIsLoading,
    campaigns,
    monthlyData,
    metrics,
    issues,
    suggestions,
    loadData,
    isAuthenticated
  };
};
