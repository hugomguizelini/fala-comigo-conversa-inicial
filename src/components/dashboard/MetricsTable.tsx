
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Target, ArrowRight, Eye, MousePointer, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type MetricsProps = {
  metrics: {
    impressions?: { value: string; variation: string };
    clicks?: { value: string; variation: string };
    ctr?: { value: string; variation: string };
    conversions?: { value: string; variation: string };
    cpc?: { value: string; variation: string };
    totalCost?: { value: string; variation: string };
  };
};

export const MetricsTable = ({ metrics = {} }: MetricsProps) => {
  const isMobile = useIsMobile();
  
  // Helper para determinar se uma variação é positiva ou negativa
  const getVariationStatus = (variation: string = "0%") => {
    return variation.startsWith('+') ? "increase" : variation.startsWith('-') ? "decrease" : "neutral";
  };

  // Garantir valores padrão para métricas indefinidas
  const safeMetrics = {
    impressions: metrics.impressions || { value: "0", variation: "0%" },
    clicks: metrics.clicks || { value: "0", variation: "0%" },
    ctr: metrics.ctr || { value: "0%", variation: "0%" },
    conversions: metrics.conversions || { value: "0", variation: "0%" },
    cpc: metrics.cpc || { value: "R$ 0,00", variation: "0%" },
    totalCost: metrics.totalCost || { value: "R$ 0,00", variation: "0%" }
  };

  const metricsData = [
    {
      name: "Impressões",
      value: safeMetrics.impressions.value,
      change: safeMetrics.impressions.variation,
      status: getVariationStatus(safeMetrics.impressions.variation),
      icon: <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />,
      description: "Total de vezes que seus anúncios foram exibidos"
    },
    {
      name: "Cliques",
      value: safeMetrics.clicks.value,
      change: safeMetrics.clicks.variation,
      status: getVariationStatus(safeMetrics.clicks.variation),
      icon: <MousePointer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />,
      description: "Total de cliques em seus anúncios"
    },
    {
      name: "CTR",
      value: safeMetrics.ctr.value,
      change: safeMetrics.ctr.variation,
      status: getVariationStatus(safeMetrics.ctr.variation),
      icon: <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />,
      description: "Taxa de cliques (Cliques / Impressões)"
    },
    {
      name: "Conversões",
      value: safeMetrics.conversions.value,
      change: safeMetrics.conversions.variation,
      status: getVariationStatus(safeMetrics.conversions.variation),
      icon: <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />,
      description: "Total de ações completadas após cliques"
    },
    {
      name: "CPC",
      value: safeMetrics.cpc.value,
      change: safeMetrics.cpc.variation,
      status: getVariationStatus(safeMetrics.cpc.variation),
      icon: <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />,
      description: "Custo por clique médio"
    },
    {
      name: "Custo Total",
      value: safeMetrics.totalCost.value,
      change: safeMetrics.totalCost.variation,
      status: getVariationStatus(safeMetrics.totalCost.variation),
      icon: <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />,
      description: "Total gasto na campanha"
    }
  ];

  // Versão mobile para exibir como cards individuais em vez de tabela
  if (isMobile) {
    return (
      <Card>
        <CardHeader className="py-4 px-4">
          <CardTitle className="text-base">Métricas Detalhadas</CardTitle>
          <CardDescription className="text-xs">Análise individual de cada métrica</CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-2">
          {metricsData.map((metric, index) => (
            <div key={metric.name} className={`p-3 rounded-lg border ${index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}`}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {metric.status === "increase" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-green-500" />
                  ) : metric.status === "decrease" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                  ) : null}
                  <span className={`text-xs ${metric.status === "increase" ? "text-green-500" : metric.status === "decrease" ? "text-red-500" : ""}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-base font-bold">{metric.value}</div>
                <button className="inline-flex items-center text-xs text-purple-600 hover:underline">
                  <span>Analisar</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Versão desktop - tabela original
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Métricas Detalhadas</CardTitle>
          <CardDescription>Análise individual de cada métrica da campanha</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Variação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metricsData.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="flex items-center gap-2 font-medium">
                  {metric.icon}
                  {metric.name}
                </TableCell>
                <TableCell>{metric.value}</TableCell>
                <TableCell className="flex items-center gap-1">
                  {metric.status === "increase" ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : metric.status === "decrease" ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span className={metric.status === "increase" ? "text-green-500" : metric.status === "decrease" ? "text-red-500" : ""}>
                    {metric.change}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{metric.description}</TableCell>
                <TableCell className="text-right">
                  <button className="inline-flex items-center text-xs text-purple-600 hover:underline">
                    <span>Analisar</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
