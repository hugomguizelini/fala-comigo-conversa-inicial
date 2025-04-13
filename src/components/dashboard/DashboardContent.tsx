
import React, { useState } from "react";
import { ArrowUp, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { MetricsTable } from "./MetricsTable";
import { ProblemsSuggestionsPanel } from "./ProblemsSuggestionsPanel";
import { CampaignsTable } from "./CampaignsTable";
import PerformanceChart from "./PerformanceChart";
import StatisticsCard from "./StatisticsCard";
import FileUploadCard from "./FileUploadCard";
import FeatureCards from "./FeatureCards";
import { useDashboardData } from "@/hooks/useDashboardData";

// Importando dados do dashboard para uso temporário
import dashboardData from "@/data/dashboard-data.json";

export default function DashboardContent() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [activeMetric, setActiveMetric] = useState<string>("impressions");
  
  const {
    isLoading,
    setIsLoading,
    campaigns,
    monthlyData,
    metrics,
    issues,
    suggestions,
    loadData,
    isAuthenticated
  } = useDashboardData();

  // Define the chart data type
  type ChartDataType = { 
    name: string; 
    impressions: number; 
    clicks: number; 
    conversions: number; 
    cost: number 
  }[];
  
  // Transform both monthlyData and fallback data to ensure they match ChartDataType
  const chartData: ChartDataType = monthlyData.length > 0 
    ? monthlyData.map((item) => ({
        name: item.month, // Map 'month' to 'name' for chart labels
        impressions: item.impressions,
        clicks: item.clicks,
        conversions: item.conversions,
        cost: item.cost
      }))
    : (dashboardData.monthlyPerformance.data as any[]).map(item => ({
        name: item.month, // Também transformamos os dados de fallback
        impressions: item.impressions,
        clicks: item.clicks,
        conversions: item.conversions,
        cost: item.cost
      }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo{isAuthenticated ? "" : " (Modo Demonstração)"}</h1>
        
        <div className="flex items-center gap-3">
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
          
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={loadData}>
            <Download className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
        </div>
      </div>
      
      <MetricsTable metrics={metrics} />
      
      <ProblemsSuggestionsPanel 
        issues={issues || dashboardData.identifiedIssues}
        suggestions={suggestions || dashboardData.optimizationSuggestions}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceChart
          chartData={chartData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          activeMetric={activeMetric}
          setActiveMetric={setActiveMetric}
          isLoading={isLoading}
        />

        <StatisticsCard isLoading={isLoading} />
      </div>

      <CampaignsTable campaigns={campaigns} />

      <FileUploadCard
        onFilesProcessed={loadData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <FeatureCards />
    </div>
  );
}
