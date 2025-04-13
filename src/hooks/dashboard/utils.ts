
import { Suggestion, FallbackSuggestion } from "@/types/dataTypes";

// Helper function to validate impact values
export const validateImpact = (impact: string): "alto" | "médio" | "baixo" => {
  if (impact === "alto" || impact === "médio" || impact === "baixo") {
    return impact as "alto" | "médio" | "baixo";
  }
  return "médio";
};

// Helper function to format metrics for display
export const formatMetrics = (campaigns: any[]) => {
  if (campaigns.length === 0) return null;
  
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  
  const totalCost = campaigns.reduce((sum, campaign) => {
    const costValue = parseFloat(campaign.total_cost?.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + costValue;
  }, 0);
  
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
  
  return {
    impressions: { value: totalImpressions.toLocaleString(), variation: "+12%" },
    clicks: { value: totalClicks.toLocaleString(), variation: "+8%" },
    ctr: { value: `${ctr.toFixed(2)}%`, variation: "+5%" },
    conversions: { value: totalConversions.toLocaleString(), variation: "+15%" },
    cpc: { value: `R$ ${cpc.toFixed(2)}`, variation: "-3%" },
    totalCost: { value: `R$ ${totalCost.toFixed(2)}`, variation: "+7%" }
  };
};

// Helper function to convert fallback suggestions to proper format
export const formatFallbackSuggestions = (
  campaignSuggestions: FallbackSuggestion[], 
  funnelSuggestions: FallbackSuggestion[]
) => {
  const formattedCampaignSuggestions = campaignSuggestions.map(suggestion => ({
    title: suggestion.title,
    description: suggestion.description,
    type: 'campaign' as const,
    impact: validateImpact(suggestion.impact),
    target_campaigns: suggestion.targetCampaigns
  }));
  
  const formattedFunnelSuggestions = funnelSuggestions.map(suggestion => ({
    title: suggestion.title,
    description: suggestion.description,
    type: 'funnel' as const,
    impact: validateImpact(suggestion.impact),
    target_pages: suggestion.targetPages,
    target_audience: suggestion.targetAudience
  }));
  
  return {
    campaign: formattedCampaignSuggestions,
    funnel: formattedFunnelSuggestions
  };
};
