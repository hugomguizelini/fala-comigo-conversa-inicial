
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricsType } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, BarChart, CreditCard, DollarSign, Users } from "lucide-react";

type MetricsCardsProps = {
  metrics: MetricsType;
  isLoading: boolean;
};

const MetricsCards = ({ metrics, isLoading }: MetricsCardsProps) => {
  const getVariationIcon = (variation: string) => {
    if (variation.includes('-')) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  };

  const metricsData = [
    {
      title: "Impressões",
      value: metrics.impressions.value,
      variation: metrics.impressions.variation,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Cliques",
      value: metrics.clicks.value,
      variation: metrics.clicks.variation,
      icon: <BarChart className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "CTR",
      value: metrics.ctr.value,
      variation: metrics.ctr.variation,
      icon: <ArrowUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Conversões",
      value: metrics.conversions.value,
      variation: metrics.conversions.variation,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "CPC",
      value: metrics.cpc.value,
      variation: metrics.cpc.variation,
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Custo Total",
      value: metrics.totalCost.value,
      variation: metrics.totalCost.variation,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricsData.map((metric, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                {metric.icon}
                <span className="text-sm font-medium">{metric.title}</span>
              </div>
              {getVariationIcon(metric.variation)}
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.variation} comparado ao período anterior
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
