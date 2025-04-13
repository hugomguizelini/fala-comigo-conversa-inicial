
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

// Adicionando interfaces para problemas e sugestões
export interface Issue {
  id?: string;
  user_id?: string;
  issue: string;
  description: string;
  related_to: string;
  affected_campaigns: string[];
  severity: string;
  created_at?: string;
  updated_at?: string;
}

export interface Suggestion {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  type: 'campaign' | 'funnel';
  impact: 'alto' | 'médio' | 'baixo';
  target_campaigns?: string[] | null;
  target_pages?: string[] | null;
  target_audience?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface para os dados de exemplo do dashboard
export interface FallbackIssue {
  issue: string;
  description: string;
  relatedTo: string;
  affectedCampaigns: string[];
}

export interface FallbackSuggestion {
  title: string;
  description: string;
  impact: string;
  targetCampaigns?: string[];
  targetPages?: string[];
  targetAudience?: string;
}
