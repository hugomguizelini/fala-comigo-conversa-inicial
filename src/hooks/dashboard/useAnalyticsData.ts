
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAnalytics,
  Issue,
  Suggestion,
  FallbackIssue,
  FallbackSuggestion
} from "@/services/supabaseService";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";
import dashboardData from "@/data/dashboard-data.json";
import { formatFallbackSuggestions } from "./utils";

// Helper function to validate issue severity
const validateIssues = (fallbackIssues: FallbackIssue[]): Issue[] => {
  return fallbackIssues.map(issue => ({
    issue: issue.issue,
    description: issue.description,
    related_to: issue.relatedTo,
    affected_campaigns: issue.affectedCampaigns,
    severity: 'medium' // Default value for compatibility
  }));
};

export const useAnalyticsData = () => {
  const { toast } = useToast();
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
      // Load analytics data
      const analyticsData = await getAnalytics(campaigns, monthlyData);
      setIssues(analyticsData.issues);
      setSuggestions(analyticsData.suggestions);
      
      return { success: true };
    } catch (error) {
      console.error("Error loading analytics data:", error);
      
      // Convert example data to correct format
      const fallbackIssues = validateIssues(dashboardData.identifiedIssues as FallbackIssue[]);
      const fallbackSuggestions = formatFallbackSuggestions(
        dashboardData.optimizationSuggestions.campaign as FallbackSuggestion[],
        dashboardData.optimizationSuggestions.funnel as FallbackSuggestion[]
      );
      
      setIssues(fallbackIssues);
      setSuggestions(fallbackSuggestions);
      
      toast({
        title: "Erro ao carregar análises",
        description: "Não foi possível carregar as análises de campanha.",
        variant: "destructive"
      });
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
