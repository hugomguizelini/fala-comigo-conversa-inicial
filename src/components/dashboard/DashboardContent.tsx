import React, { useState, useCallback, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Search, Download, Upload, FileText, Settings, Sparkles, Filter, ChartBar } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { MetricsTable } from "./MetricsTable";
import { ProblemsSuggestionsPanel } from "./ProblemsSuggestionsPanel";
import { CampaignsTable } from "./CampaignsTable";
import { 
  getCampaigns, 
  getMonthlyPerformance, 
  processAndInsertCampaignData, 
  processAndInsertMonthlyData,
  CampaignData,
  MonthlyPerformance
} from "@/services/supabaseService";

// Importando dados do dashboard para uso temporário
import dashboardData from "@/data/dashboard-data.json";

export default function DashboardContent() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [timeRange, setTimeRange] = useState<string>("month");
  const [activeMetric, setActiveMetric] = useState<string>("impressions");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [metrics, setMetrics] = useState({
    impressions: { value: "0", variation: "0%" },
    clicks: { value: "0", variation: "0%" },
    ctr: { value: "0%", variation: "0%" },
    conversions: { value: "0", variation: "0%" },
    cpc: { value: "R$ 0,00", variation: "0%" },
    totalCost: { value: "R$ 0,00", variation: "0%" }
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
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
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    try {
      for (const file of acceptedFiles) {
        if (file.name.includes("campaign") || file.name.includes("campanha")) {
          await processAndInsertCampaignData(file);
        } else if (file.name.includes("monthly") || file.name.includes("mensal")) {
          await processAndInsertMonthlyData(file);
        } else {
          await processAndInsertCampaignData(file);
        }
      }
      
      await loadData();
      
      setFiles(prev => [...prev, ...acceptedFiles]);
      toast({
        title: "Arquivo processado com sucesso",
        description: `${acceptedFiles.length} arquivo(s) carregado(s) e processado(s).`,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Erro ao processar arquivos",
        description: "Verifique o formato dos seus arquivos CSV.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const metricColors = {
    impressions: "#9b87f5",
    clicks: "#4287f5",
    conversions: "#f5a742",
    cost: "#f54242"
  };

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <div className="font-semibold mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="grid grid-cols-2 gap-2 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-mono text-right">
                {entry.name === "cost" 
                  ? `R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = monthlyData.length > 0 ? monthlyData.map(item => ({
    name: item.month,
    impressions: item.impressions,
    clicks: item.clicks,
    conversions: item.conversions,
    cost: item.cost
  })) : dashboardData.monthlyPerformance.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo</h1>
        
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
        issues={dashboardData.identifiedIssues}
        suggestions={dashboardData.optimizationSuggestions}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Desempenho Mensal</CardTitle>
              <CardDescription>Análise da performance da campanha ao longo do tempo</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeMetric === "impressions" ? "default" : "outline"} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveMetric("impressions")}
              >
                Impressões
              </Button>
              <Button 
                variant={activeMetric === "clicks" ? "default" : "outline"} 
                size="sm"
                className="text-xs" 
                onClick={() => setActiveMetric("clicks")}
              >
                Cliques
              </Button>
              <Button 
                variant={activeMetric === "conversions" ? "default" : "outline"} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveMetric("conversions")}
              >
                Conversões
              </Button>
              <Button 
                variant={activeMetric === "cost" ? "default" : "outline"} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveMetric("cost")}
              >
                Custo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderCustomTooltip} />
                <Bar 
                  dataKey={activeMetric} 
                  fill={metricColors[activeMetric as keyof typeof metricColors]} 
                  radius={[4, 4, 0, 0]} 
                  name={activeMetric === "impressions" ? "Impressões" : 
                       activeMetric === "clicks" ? "Cliques" :
                       activeMetric === "conversions" ? "Conversões" : "Custo"}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === "day" ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setTimeRange("day")}
                >
                  1 dia
                </Button>
                <Button 
                  variant={timeRange === "week" ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setTimeRange("week")}
                >
                  1 semana
                </Button>
                <Button 
                  variant={timeRange === "month" ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setTimeRange("month")}
                >
                  1 mês
                </Button>
                <Button 
                  variant={timeRange === "year" ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setTimeRange("year")}
                >
                  1 ano
                </Button>
                <Button 
                  variant={timeRange === "all" ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setTimeRange("all")}
                >
                  Todo período
                </Button>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <span>Ver Relatório Completo</span>
                <Download className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Estatísticas da Campanha</CardTitle>
              <CardDescription>Nível de desempenho da sua campanha</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full border-8 border-purple-500/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-bold">{isLoading ? "..." : "87%"}</div>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h4 className="font-medium">Você está quase no limite!</h4>
                <p className="text-sm text-muted-foreground">Você já usou cerca de 87% do seu espaço livre.</p>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+23%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  <ArrowUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  <span className="text-red-500">-5%</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Analisar com IA
            </Button>
          </CardContent>
        </Card>
      </div>

      <CampaignsTable campaigns={campaigns} />

      <Card>
        <CardHeader>
          <CardTitle>Carregar Documentos da Campanha</CardTitle>
          <CardDescription>
            Arraste e solte arquivos CSV com dados de campanhas para análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium">
                  {isLoading ? "Processando..." : isDragActive ? "Solte os arquivos aqui" : "Arraste e solte arquivos CSV com dados da campanha"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? "Aguarde, estamos processando seus dados..." : "ou clique para navegar pelos arquivos"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Para dados de campanha, use arquivos com "campaign" ou "campanha" no nome.<br/>
                  Para dados mensais, use arquivos com "monthly" ou "mensal" no nome.
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Arquivos Carregados</h3>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Estatísticas Completas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Explore estatísticas hist��ricas detalhadas para identificar tendências e padrões de longo prazo da campanha.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Painéis Personalizáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Crie painéis personalizados para focar nas métricas e KPIs da campanha que mais importam.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Relatórios Automáticos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Gere relatórios detalhados da campanha automaticamente, garantindo precisão e economizando tempo valioso.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
