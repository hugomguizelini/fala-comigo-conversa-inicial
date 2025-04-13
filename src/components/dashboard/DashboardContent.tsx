import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, AlertTriangle, BarChart3 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import MetricsCards from "./MetricsCards";
import { CampaignsTable } from "./CampaignsTable";
import MonthlyPerformanceChart from "./MonthlyPerformanceChart";
import IssuesPanel from "./IssuesPanel";
import SuggestionsPanel from "./SuggestionsPanel";
import GptAnalysisPanel from "./GptAnalysisPanel";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import { deleteCampaignData } from "@/services/campaignService";
import { deleteMonthlyData } from "@/services/performanceService";

type DashboardContentProps = {
  onOpenAiChat: (analysis: GptAnalysisResult | null) => void;
  onUpdateChatContext?: (campaigns: any[], monthlyData: any[], metrics: any, issues: any[], suggestions: any) => void;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  onOpenAiChat,
  onUpdateChatContext
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    isLoading, 
    isAiLoading,
    campaigns, 
    monthlyData, 
    metrics, 
    issues, 
    suggestions, 
    gptAnalysis,
    loadData,
    runAiAnalysis,
    lastLoadTime
  } = useDashboardData();

  // Atualizar o contexto do chat quando os dados mudarem
  useEffect(() => {
    if (onUpdateChatContext && campaigns.length > 0) {
      onUpdateChatContext(campaigns, monthlyData, metrics, issues, suggestions);
    }
  }, [campaigns, monthlyData, metrics, issues, suggestions, onUpdateChatContext]);

  const handleImportClick = () => {
    navigate("/import");
  };

  const handleResetData = async () => {
    try {
      await deleteCampaignData();
      await deleteMonthlyData();
      await loadData();
      return true;
    } catch (error) {
      console.error("Error resetting data:", error);
      return false;
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (campaigns.length === 0) {
      toast.error("Não há dados para analisar. Importe dados primeiro.");
      return;
    }
    
    const result = await runAiAnalysis();
    // Não abrimos o chat automaticamente, apenas quando o usuário clicar no botão
  };

  const handleOpenChat = () => {
    onOpenAiChat(gptAnalysis);
  };

  const hasData = campaigns.length > 0;

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho das suas campanhas de marketing digital
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex" 
            onClick={handleImportClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar Dados
          </Button>
          
          <Button 
            onClick={handleOpenChat}
            className="bg-purple-600 hover:bg-purple-700 hidden md:flex"
            size="sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Consultar IA
          </Button>
        </div>
      </div>

      {!hasData && !isLoading && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Nenhum dado encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4 mt-2">
              Você ainda não importou nenhum dado de campanha. Importe dados para visualizar métricas e análises.
            </p>
            <Button onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Dados
            </Button>
          </div>
        </div>
      )}

      {hasData && (
        <>
          <TabsContent value="overview" className="space-y-6">
            <MetricsCards metrics={metrics} isLoading={isLoading} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MonthlyPerformanceChart 
                data={monthlyData} 
                isLoading={isLoading} 
                className="md:col-span-2"
              />
              <IssuesPanel issues={issues} isLoading={isLoading} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <SuggestionsPanel 
                suggestions={suggestions} 
                isLoading={isLoading} 
              />
              <GptAnalysisPanel 
                isLoading={isAiLoading} 
                analysis={gptAnalysis}
                onAnalyze={handleAnalyzeWithAI}
                onChat={handleOpenChat}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-6">
            <CampaignsTable 
              campaigns={campaigns} 
              onDataReset={handleResetData}
            />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <IssuesPanel issues={issues} isLoading={isLoading} />
              <SuggestionsPanel suggestions={suggestions} isLoading={isLoading} />
            </div>
            <GptAnalysisPanel 
              isLoading={isAiLoading} 
              analysis={gptAnalysis}
              onAnalyze={handleAnalyzeWithAI}
              onChat={handleOpenChat}
            />
          </TabsContent>
        </>
      )}

      {lastLoadTime && (
        <div className="text-xs text-muted-foreground text-right">
          Última atualização: {lastLoadTime.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
