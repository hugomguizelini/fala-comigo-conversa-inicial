
import React, { useState, useEffect } from "react";
import { ArrowUp, Search, Filter, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricsTable } from "./MetricsTable";
import { ProblemsSuggestionsPanel } from "./ProblemsSuggestionsPanel";
import { CampaignsTable } from "./CampaignsTable";
import PerformanceChart from "./PerformanceChart";
import StatisticsCard from "./StatisticsCard";
import FileUploadCard from "./FileUploadCard";
import FeatureCards from "./FeatureCards";
import GptAnalysisPanel from "./GptAnalysisPanel";
import { useDashboardData } from "@/hooks/useDashboardData";
import { resetAllData } from "@/services/dataResetService";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardContentProps = {
  onOpenAiChat?: (analysis: GptAnalysisResult | null) => void;
  onUpdateChatContext?: (campaigns: any[], monthlyData: any[], metrics: any, issues: any[], suggestions: any) => void;
};

export default function DashboardContent({
  onOpenAiChat,
  onUpdateChatContext
}: DashboardContentProps) {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [activeMetric, setActiveMetric] = useState<string>("impressions");
  const isMobile = useIsMobile();

  const {
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
  } = useDashboardData();

  useEffect(() => {
    if (onUpdateChatContext && campaigns.length > 0) {
      onUpdateChatContext(campaigns, monthlyData, metrics, issues, suggestions);
    }
  }, [campaigns, monthlyData, metrics, issues, suggestions, onUpdateChatContext]);

  type ChartDataType = {
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  }[];

  const chartData: ChartDataType = monthlyData.map(item => ({
    name: item.month,
    impressions: item.impressions,
    clicks: item.clicks,
    conversions: item.conversions,
    cost: item.cost
  }));

  const formattedLastUpdate = lastLoadTime ? format(lastLoadTime, "'Última atualização em' dd 'de' MMMM', às' HH:mm", {
    locale: ptBR
  }) : "Dados não carregados";

  const handleResetData = async (): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await resetAllData();
      await loadData();
    } catch (error) {
      console.error("Error resetting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAndOpenChat = async () => {
    if (!onOpenAiChat) return;
    try {
      if (gptAnalysis) {
        onOpenAiChat(gptAnalysis);
      } else {
        onOpenAiChat(null);
      }
    } catch (error) {
      console.error("Erro ao preparar chat:", error);
      onOpenAiChat(null);
    }
  };

  const handleOpenChat = () => {
    if (onOpenAiChat) {
      onOpenAiChat(gptAnalysis);
    }
  };

  return <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className={`text-2xl sm:text-3xl font-bold mx-0 px-0 ${isMobile ? "mt-4 mb-2" : "my-[30px]"} text-purple-600`}>
          Insights com IA
        </h1>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex items-center flex-1 sm:flex-none">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input type="search" placeholder="Pesquisar..." className="h-9 sm:h-10 w-full sm:w-[250px] rounded-md border border-input bg-background pl-8 pr-4 text-sm" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Filtrar</span>
            </Button>
            
            <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1" onClick={() => loadData()} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="text-xs sm:text-sm">{isLoading ? "Carregando..." : "Atualizar"}</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-xs sm:text-sm text-muted-foreground">
        {formattedLastUpdate}
      </div>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <MetricsTable metrics={metrics} />
      </div>
      
      <GptAnalysisPanel isLoading={isAiLoading} analysis={gptAnalysis} onAnalyze={runAiAnalysis} onChat={handleOpenChat} />
      
      <ProblemsSuggestionsPanel issues={issues || []} suggestions={suggestions || {
        campaign: [],
        funnel: []
      }} />
      
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {chartData.length > 0 ? 
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 md:overflow-visible md:px-0 md:mx-0">
            <PerformanceChart 
              chartData={chartData} 
              timeRange={timeRange} 
              setTimeRange={setTimeRange} 
              activeMetric={activeMetric} 
              setActiveMetric={setActiveMetric} 
              isLoading={isLoading} 
            />
          </div>
          : 
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <p className="text-center text-muted-foreground mb-4">
              Nenhum dado de desempenho mensal disponível.
            </p>
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Faça upload de um arquivo CSV com dados mensais para visualizar o gráfico.
            </p>
          </div>
        }

        <StatisticsCard isLoading={isLoading} metrics={metrics} onAnalyzeClick={handleOpenChat} />
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <CampaignsTable campaigns={campaigns} onDataReset={handleResetData} />
      </div>

      <FileUploadCard onFilesProcessed={loadData} isLoading={isLoading} setIsLoading={setIsLoading} />

      <FeatureCards />
    </div>;
}
