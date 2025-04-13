
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

type MetricsProps = {
  metrics: {
    impressions: { value: string; variation: string };
    clicks: { value: string; variation: string };
    ctr: { value: string; variation: string };
    conversions: { value: string; variation: string };
    cpc: { value: string; variation: string };
    totalCost: { value: string; variation: string };
  };
};

export const MetricsTable = ({ metrics }: MetricsProps) => {
  // Helper para determinar se uma variação é positiva ou negativa
  const getVariationStatus = (variation: string) => {
    return variation.startsWith('+') ? "increase" : variation.startsWith('-') ? "decrease" : "neutral";
  };

  const metricsData = [
    {
      name: "Impressões",
      value: metrics.impressions.value,
      change: metrics.impressions.variation,
      status: getVariationStatus(metrics.impressions.variation),
      icon: <Eye className="h-4 w-4 text-green-500" />,
      description: "Total de vezes que seus anúncios foram exibidos"
    },
    {
      name: "Cliques",
      value: metrics.clicks.value,
      change: metrics.clicks.variation,
      status: getVariationStatus(metrics.clicks.variation),
      icon: <MousePointer className="h-4 w-4 text-blue-500" />,
      description: "Total de cliques em seus anúncios"
    },
    {
      name: "CTR",
      value: metrics.ctr.value,
      change: metrics.ctr.variation,
      status: getVariationStatus(metrics.ctr.variation),
      icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
      description: "Taxa de cliques (Cliques / Impressões)"
    },
    {
      name: "Conversões",
      value: metrics.conversions.value,
      change: metrics.conversions.variation,
      status: getVariationStatus(metrics.conversions.variation),
      icon: <Target className="h-4 w-4 text-purple-500" />,
      description: "Total de ações completadas após cliques"
    },
    {
      name: "CPC",
      value: metrics.cpc.value,
      change: metrics.cpc.variation,
      status: getVariationStatus(metrics.cpc.variation),
      icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
      description: "Custo por clique médio"
    },
    {
      name: "Custo Total",
      value: metrics.totalCost.value,
      change: metrics.totalCost.variation,
      status: getVariationStatus(metrics.totalCost.variation),
      icon: <CreditCard className="h-4 w-4 text-red-500" />,
      description: "Total gasto na campanha"
    }
  ];

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
