
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MonthlyPerformance } from "@/types/dataTypes";
import { useIsMobile } from "@/hooks/use-mobile";

type PerformanceChartProps = {
  chartData: { name: string; impressions: number; clicks: number; conversions: number; cost: number }[];
  timeRange: string;
  setTimeRange: (range: string) => void;
  activeMetric: string;
  setActiveMetric: (metric: string) => void;
  isLoading: boolean;
};

const metricColors = {
  impressions: "#9b87f5",
  clicks: "#4287f5",
  conversions: "#f5a742",
  cost: "#f54242"
};

const PerformanceChart = ({ 
  chartData, 
  timeRange, 
  setTimeRange, 
  activeMetric, 
  setActiveMetric, 
  isLoading 
}: PerformanceChartProps) => {
  const isMobile = useIsMobile();
  
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 pb-2 sm:pb-6">
        <div>
          <CardTitle className="text-base sm:text-lg">Desempenho Mensal</CardTitle>
          <CardDescription>Análise da performance da campanha ao longo do tempo</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Button 
            variant={activeMetric === "impressions" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2"
            onClick={() => setActiveMetric("impressions")}
          >
            Impressões
          </Button>
          <Button 
            variant={activeMetric === "clicks" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2" 
            onClick={() => setActiveMetric("clicks")}
          >
            Cliques
          </Button>
          <Button 
            variant={activeMetric === "conversions" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2"
            onClick={() => setActiveMetric("conversions")}
          >
            Conversões
          </Button>
          <Button 
            variant={activeMetric === "cost" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2"
            onClick={() => setActiveMetric("cost")}
          >
            Custo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[200px] sm:h-[300px] pt-0 sm:pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: isMobile ? 10 : 20, bottom: 5, left: isMobile ? -20 : 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
            <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 30 : 40} />
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
      <CardFooter className="border-t px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row gap-2 sm:gap-0">
        <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto">
          <Button 
            variant={timeRange === "day" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2 flex-1 sm:flex-none"
            onClick={() => setTimeRange("day")}
          >
            1 dia
          </Button>
          <Button 
            variant={timeRange === "week" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2 flex-1 sm:flex-none"
            onClick={() => setTimeRange("week")}
          >
            1 semana
          </Button>
          <Button 
            variant={timeRange === "month" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2 flex-1 sm:flex-none"
            onClick={() => setTimeRange("month")}
          >
            1 mês
          </Button>
          <Button 
            variant={timeRange === "year" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2 flex-1 sm:flex-none"
            onClick={() => setTimeRange("year")}
          >
            1 ano
          </Button>
          <Button 
            variant={timeRange === "all" ? "default" : "outline"} 
            size="xs"
            className="text-[10px] sm:text-xs h-7 px-2 flex-1 sm:flex-none"
            onClick={() => setTimeRange("all")}
          >
            Todo período
          </Button>
        </div>
        <div className="mt-2 sm:mt-0 ml-auto">
          <Button variant="outline" size="xs" className="text-[10px] sm:text-xs h-7 px-2">
            <span>Ver Relatório</span>
            <Download className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PerformanceChart;
