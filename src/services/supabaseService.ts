
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

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

// Funções para gerenciar campanhas
export const getCampaigns = async (): Promise<CampaignData[]> => {
  const { data, error } = await supabase
    .from('campaign_data')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
  
  return data || [];
};

export const insertCampaign = async (campaign: CampaignData): Promise<CampaignData> => {
  const { data, error } = await supabase
    .from('campaign_data')
    .insert(campaign)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting campaign:', error);
    throw error;
  }
  
  return data;
};

// Funções para gerenciar dados de desempenho mensal
export const getMonthlyPerformance = async (): Promise<MonthlyPerformance[]> => {
  const { data, error } = await supabase
    .from('monthly_performance')
    .select('*')
    .order('year', { ascending: true });
  
  if (error) {
    console.error('Error fetching monthly performance:', error);
    throw error;
  }
  
  return data || [];
};

export const insertMonthlyPerformance = async (monthlyData: MonthlyPerformance): Promise<MonthlyPerformance> => {
  const { data, error } = await supabase
    .from('monthly_performance')
    .insert(monthlyData)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting monthly performance:', error);
    throw error;
  }
  
  return data;
};

// Funções para processamento de arquivos
export const processCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Função para processar e inserir dados de campanhas do CSV
export const processAndInsertCampaignData = async (file: File): Promise<CampaignData[]> => {
  try {
    const parsedData = await processCsvFile(file);
    
    const campaignData = parsedData.map(row => {
      return {
        name: row.name || row.campaign_name || 'Unnamed Campaign',
        status: row.status || 'active',
        budget: row.budget || '0',
        impressions: parseInt(row.impressions || '0', 10),
        clicks: parseInt(row.clicks || '0', 10),
        ctr: row.ctr || '0%',
        conversions: parseInt(row.conversions || '0', 10),
        conversion_type: row.conversion_type || '',
        cpc: row.cpc || '0',
        total_cost: row.total_cost || row.cost || '0',
        roas: row.roas || '0'
      };
    });

    const insertPromises = campaignData.map(campaign => insertCampaign(campaign));
    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error processing campaign data:', error);
    throw error;
  }
};

// Função para processar e inserir dados de desempenho mensal do CSV
export const processAndInsertMonthlyData = async (file: File): Promise<MonthlyPerformance[]> => {
  try {
    const parsedData = await processCsvFile(file);
    
    const monthlyData = parsedData.map(row => {
      // Extrair mês e ano dos dados
      const date = new Date(row.date || row.month || '');
      
      return {
        month: row.month || date.toLocaleString('default', { month: 'long' }) || 'Janeiro',
        year: parseInt(row.year || date.getFullYear() || '2023', 10),
        impressions: parseInt(row.impressions || '0', 10),
        clicks: parseInt(row.clicks || '0', 10),
        conversions: parseInt(row.conversions || '0', 10),
        cost: parseFloat(row.cost || '0')
      };
    });

    const insertPromises = monthlyData.map(monthData => insertMonthlyPerformance(monthData));
    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error processing monthly data:', error);
    throw error;
  }
};
