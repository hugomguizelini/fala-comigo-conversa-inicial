
// Interfaces para os tipos de dados
export interface CampaignData {
  id?: string;
  name: string;
  status: string;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  conversion_type?: string;
  cpc: string;
  total_cost: string;
  roas: string;
}

export interface MonthlyPerformance {
  id?: string;
  month: string;
  year: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}
