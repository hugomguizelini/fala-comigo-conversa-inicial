
import { useState } from "react";
import dashboardData from "@/data/dashboard-data.json";
import { MetricsType } from "../useDashboardData";
import { formatMetrics } from "./utils";

export const useMetricsData = (campaigns: any[]) => {
  const [metrics, setMetrics] = useState<MetricsType>({
    impressions: { value: "0", variation: "0%" },
    clicks: { value: "0", variation: "0%" },
    ctr: { value: "0%", variation: "0%" },
    conversions: { value: "0", variation: "0%" },
    cpc: { value: "R$ 0,00", variation: "0%" },
    totalCost: { value: "R$ 0,00", variation: "0%" }
  });

  const updateMetrics = () => {
    const formattedMetrics = formatMetrics(campaigns);
    
    if (formattedMetrics) {
      setMetrics(formattedMetrics);
    } else {
      setMetrics(dashboardData.metrics);
    }
  };

  return {
    metrics,
    updateMetrics
  };
};
