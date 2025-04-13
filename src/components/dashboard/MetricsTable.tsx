
import React, { useState } from "react";
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
import { ArrowUp, ArrowDown, TrendingUp, Target, ArrowRight, Eye, MousePointer, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  // Estado para controle dos filtros
  const [filters, setFilters] = useState({
    showAll: true,
    showPositive: false,
    showNegative: false,
    showNeutral: false,
  });

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
      icon: <Eye className="h-4 w-4 text-green-500" />,
      description: "Total de vezes que seus anúncios foram exibidos"
    },
    {
      name: "Cliques",
      value: safeMetrics.clicks.value,
      change: safeMetrics.clicks.variation,
      status: getVariationStatus(safeMetrics.clicks.variation),
      icon: <MousePointer className="h-4 w-4 text-blue-500" />,
      description: "Total de cliques em seus anúncios"
    },
    {
      name: "CTR",
      value: safeMetrics.ctr.value,
      change: safeMetrics.ctr.variation,
      status: getVariationStatus(safeMetrics.ctr.variation),
      icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
      description: "Taxa de cliques (Cliques / Impressões)"
    },
    {
      name: "Conversões",
      value: safeMetrics.conversions.value,
      change: safeMetrics.conversions.variation,
      status: getVariationStatus(safeMetrics.conversions.variation),
      icon: <Target className="h-4 w-4 text-purple-500" />,
      description: "Total de ações completadas após cliques"
    },
    {
      name: "CPC",
      value: safeMetrics.cpc.value,
      change: safeMetrics.cpc.variation,
      status: getVariationStatus(safeMetrics.cpc.variation),
      icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
      description: "Custo por clique médio"
    },
    {
      name: "Custo Total",
      value: safeMetrics.totalCost.value,
      change: safeMetrics.totalCost.variation,
      status: getVariationStatus(safeMetrics.totalCost.variation),
      icon: <CreditCard className="h-4 w-4 text-red-500" />,
      description: "Total gasto na campanha"
    }
  ];

  // Filtrar métricas com base nos filtros selecionados
  const filteredMetrics = metricsData.filter(metric => {
    if (filters.showAll) return true;
    if (filters.showPositive && metric.status === "increase") return true;
    if (filters.showNegative && metric.status === "decrease") return true;
    if (filters.showNeutral && metric.status === "neutral") return true;
    return false;
  });

  // Manipulador para alternar filtros
  const toggleFilter = (filterName: string) => {
    if (filterName === 'showAll') {
      setFilters({
        showAll: true,
        showPositive: false,
        showNegative: false,
        showNeutral: false
      });
    } else {
      setFilters(prev => ({
        ...prev,
        showAll: false,
        [filterName]: !prev[filterName as keyof typeof prev]
      }));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Métricas Detalhadas</CardTitle>
          <CardDescription>Análise individual de cada métrica da campanha</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtrar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem 
              checked={filters.showAll}
              onCheckedChange={() => toggleFilter('showAll')}
            >
              Todas métricas
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
              checked={filters.showPositive}
              onCheckedChange={() => toggleFilter('showPositive')}
              disabled={filters.showAll}
            >
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3.5 w-3.5 text-green-500" />
                Positivas
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filters.showNegative}
              onCheckedChange={() => toggleFilter('showNegative')}
              disabled={filters.showAll}
            >
              <span className="flex items-center gap-1">
                <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                Negativas
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filters.showNeutral}
              onCheckedChange={() => toggleFilter('showNeutral')}
              disabled={filters.showAll}
            >
              <span>Sem variação</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            {filteredMetrics.map((metric) => (
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
