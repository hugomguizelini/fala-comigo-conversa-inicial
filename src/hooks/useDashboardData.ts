
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCampaigns, 
  getMonthlyPerformance,
  CampaignData,
  MonthlyPerformance
} from "@/services/supabaseService";
import dashboardData from "@/data/dashboard-data.json";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [metrics, setMetrics] = useState<MetricsType>({
    impressions: { value: "0", variation: "0%" },
    clicks: { value: "0", variation: "0%" },
    ctr: { value: "0%", variation: "0%" },
    conversions: { value: "0", variation: "0%" },
    cpc: { value: "R$ 0,00", variation: "0%" },
    totalCost: { value: "R$ 0,00", variation: "0%" }
  });
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const campaignData = await getCampaigns();
      const monthlyPerformanceData = await getMonthlyPerformance();
      
      setCampaigns(campaignData);
      setMonthlyData(monthlyPerformanceData);
      
      if (campaignData.length > 0) {
        const totalImpressions = campaignData.reduce((sum, campaign) => sum + campaign.impressions, 0);
        const totalClicks = campaignData.reduce((sum, campaign) => sum + campaign.clicks, 0);
        const totalConversions = campaignData.reduce((sum, campaign) => sum + campaign.conversions, 0);
        
        const totalCost = campaignData.reduce((sum, campaign) => {
          const costValue = parseFloat(campaign.total_cost.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
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
    } catch (error) {
      console.error("Error loading data:", error);
      setMetrics(dashboardData.metrics);
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
    loadData();
  }, []);

  return {
    isLoading,
    setIsLoading,
    campaigns,
    monthlyData,
    metrics,
    loadData,
  };
};
