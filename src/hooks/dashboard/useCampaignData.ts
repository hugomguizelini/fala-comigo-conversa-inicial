
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { getCampaigns } from "@/services/campaignService";
import { getMonthlyPerformance } from "@/services/performanceService";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";

export const useCampaignData = () => {
  const { toast: toastLegacy } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      // No MVP, não verificamos autenticação para facilitar o acesso
      console.log("Carregando dados de campanhas...");
      const campaignData = await getCampaigns();
      console.log(`${campaignData.length} campanhas carregadas`);
      
      console.log("Carregando dados mensais...");
      const monthlyPerformanceData = await getMonthlyPerformance();
      console.log(`${monthlyPerformanceData.length} registros mensais carregados`);
      
      setCampaigns(campaignData);
      setMonthlyData(monthlyPerformanceData);
      
      return { 
        success: true, 
        campaigns: campaignData, 
        monthlyData: monthlyPerformanceData 
      };
    } catch (error) {
      console.error("Error loading campaign data:", error);
      return { success: false, campaigns: [], monthlyData: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    monthlyData,
    isLoading,
    setIsLoading,
    loadCampaignData
  };
};
