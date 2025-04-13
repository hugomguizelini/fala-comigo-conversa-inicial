
import { useEffect } from "react";
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
  const { isAuthenticated } = useAuthStatus();
  const { campaigns, monthlyData, isLoading, setIsLoading, loadCampaignData } = useCampaignData();
  const { metrics, updateMetrics } = useMetricsData(campaigns);
  const { issues, suggestions, loadAnalyticsData, resetAnalyticsData } = useAnalyticsData();
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const campaignResult = await loadCampaignData();
      
      if (campaignResult.success) {
        updateMetrics();
        await loadAnalyticsData(campaignResult.campaigns, campaignResult.monthlyData);
      }
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
    isAuthenticated
  };
};
