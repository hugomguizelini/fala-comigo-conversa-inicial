
import React, { useState } from "react";
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

type DashboardContentProps = {
  onOpenAiChat?: (analysis: GptAnalysisResult | null) => void;
};

export default function DashboardContent({ onOpenAiChat }: DashboardContentProps) {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [activeMetric, setActiveMetric] = useState<string>("impressions");
  
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

  // Define the chart data type
  type ChartDataType = { 
    name: string; 
    impressions: number; 
    clicks: number; 
    conversions: number; 
    cost: number 
  }[];
  
  // Transform data for the chart
  const chartData: ChartDataType = monthlyData.map((item) => ({
    name: item.month, // Map 'month' to 'name' for chart labels
    impressions: item.impressions,
    clicks: item.clicks,
    conversions: item.conversions,
    cost: item.cost
  }));

  // Formatação da data da última atualização
  const formattedLastUpdate = lastLoadTime 
    ? format(lastLoadTime, "'Última atualização em' dd 'de' MMMM', às' HH:mm", {locale: ptBR})
    : "Dados não carregados";

  // Função para resetar todos os dados
  const handleResetData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await resetAllData();
      // Recarregar a página após limpar os dados para redefini-los
      await loadData();
    } catch (error) {
      console.error("Error resetting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplificando esta função para apenas abrir o chat sem executar análise
  const handleOpenChat = () => {
    if (onOpenAiChat) {
      // Passamos a análise existente ou null
      onOpenAiChat(gptAnalysis);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Dashboard de Campanhas</h1>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search"
              placeholder="Pesquisar..."
              className="h-10 w-[250px] rounded-md border border-input bg-background pl-8 pr-4 text-sm"
            />
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filtrar</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => loadData()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isLoading ? "Carregando..." : "Atualizar"}</span>
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {formattedLastUpdate}
      </div>
      
      <MetricsTable metrics={metrics} />
      
      <GptAnalysisPanel 
        isLoading={isAiLoading}
        analysis={gptAnalysis}
        onAnalyze={runAiAnalysis}
        onChat={handleOpenChat}
      />
      
      <ProblemsSuggestionsPanel 
        issues={issues || []}
        suggestions={suggestions || {campaign: [], funnel: []}}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {chartData.length > 0 ? (
          <PerformanceChart
            chartData={chartData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            activeMetric={activeMetric}
            setActiveMetric={setActiveMetric}
            isLoading={isLoading}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-center text-muted-foreground mb-4">
              Nenhum dado de desempenho mensal disponível.
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Faça upload de um arquivo CSV com dados mensais para visualizar o gráfico.
            </p>
          </div>
        )}

        <StatisticsCard 
          isLoading={isLoading} 
          metrics={metrics} 
          onAnalyzeClick={handleOpenChat}
        />
      </div>

      <CampaignsTable 
        campaigns={campaigns} 
        onDataReset={handleResetData}
      />

      <FileUploadCard
        onFilesProcessed={loadData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <FeatureCards />
    </div>
  );
}
