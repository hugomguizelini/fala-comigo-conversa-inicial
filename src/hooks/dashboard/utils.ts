
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
  if (!campaigns || campaigns.length === 0) return null;
  
  try {
    const totalImpressions = campaigns.reduce((sum, campaign) => {
      return sum + (Number(campaign?.impressions) || 0);
    }, 0);
    
    const totalClicks = campaigns.reduce((sum, campaign) => {
      return sum + (Number(campaign?.clicks) || 0);
    }, 0);
    
    const totalConversions = campaigns.reduce((sum, campaign) => {
      return sum + (Number(campaign?.conversions) || 0);
    }, 0);
    
    const totalCost = campaigns.reduce((sum, campaign) => {
      if (!campaign?.total_cost) return sum;
      const costValue = parseFloat(
        campaign.total_cost.replace(/[^0-9.,]/g, '')
          .replace(',', '.') || '0'
      );
      return sum + (isNaN(costValue) ? 0 : costValue);
    }, 0);
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    
    return {
      impressions: { 
        value: totalImpressions.toLocaleString(), 
        variation: "+0%" // No futuro, calcular variação real
      },
      clicks: { 
        value: totalClicks.toLocaleString(), 
        variation: "+0%" 
      },
      ctr: { 
        value: `${ctr.toFixed(2)}%`, 
        variation: "+0%" 
      },
      conversions: { 
        value: totalConversions.toLocaleString(), 
        variation: "+0%" 
      },
      cpc: { 
        value: `R$ ${cpc.toFixed(2)}`, 
        variation: "+0%" 
      },
      totalCost: { 
        value: `R$ ${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        variation: "+0%" 
      }
    };
  } catch (error) {
    console.error("Erro ao formatar métricas:", error);
    return null;
  }
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
