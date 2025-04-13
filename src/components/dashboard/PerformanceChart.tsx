
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MonthlyPerformance } from "@/types/dataTypes";

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
  );
};

export default PerformanceChart;
