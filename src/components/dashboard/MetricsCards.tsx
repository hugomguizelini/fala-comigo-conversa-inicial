
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricsType } from '@/hooks/useDashboardData';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

type MetricsCardsProps = {
  metrics: MetricsType;
  isLoading: boolean;
};

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, isLoading }) => {
  const getVariationColor = (variation: string) => {
    const numericValue = parseFloat(variation.replace('%', ''));
    if (isNaN(numericValue)) return "text-muted-foreground";
    return numericValue > 0 ? "text-green-600" : numericValue < 0 ? "text-red-600" : "text-muted-foreground";
  };

  const getVariationIcon = (variation: string) => {
    const numericValue = parseFloat(variation.replace('%', ''));
    if (isNaN(numericValue)) return null;
    
    if (numericValue > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    } else if (numericValue < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const formatMetricCard = (label: string, value: string, variation: string) => {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm font-medium">{label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{value}</span>
                {variation !== "0%" && (
                  <div className="flex items-center">
                    {getVariationIcon(variation)}
                    <span className={`text-xs ${getVariationColor(variation)}`}>
                      {variation}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {formatMetricCard("Impressões", metrics.impressions.value, metrics.impressions.variation)}
      {formatMetricCard("Cliques", metrics.clicks.value, metrics.clicks.variation)}
      {formatMetricCard("CTR", metrics.ctr.value, metrics.ctr.variation)}
      {formatMetricCard("Conversões", metrics.conversions.value, metrics.conversions.variation)}
      {formatMetricCard("CPC Médio", metrics.cpc.value, metrics.cpc.variation)}
      {formatMetricCard("Custo Total", metrics.totalCost.value, metrics.totalCost.variation)}
    </div>
  );
};

export default MetricsCards;
