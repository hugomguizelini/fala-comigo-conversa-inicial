
import { useState } from "react";
import { MetricsType } from "../useDashboardData";
import { formatMetrics } from "./utils";

const defaultMetrics: MetricsType = {
  impressions: { value: "0", variation: "0%" },
  clicks: { value: "0", variation: "0%" },
  ctr: { value: "0%", variation: "0%" },
  conversions: { value: "0", variation: "0%" },
  cpc: { value: "R$ 0,00", variation: "0%" },
  totalCost: { value: "R$ 0,00", variation: "0%" }
};

export const useMetricsData = (campaigns: any[]) => {
  const [metrics, setMetrics] = useState<MetricsType>(defaultMetrics);

  const updateMetrics = () => {
    if (!campaigns || campaigns.length === 0) {
      setMetrics(defaultMetrics);
      return;
    }
    
    const formattedMetrics = formatMetrics(campaigns);
    
    if (formattedMetrics) {
      setMetrics(formattedMetrics);
    } else {
      setMetrics(defaultMetrics);
    }
  };

  return {
    metrics,
    updateMetrics
  };
};
