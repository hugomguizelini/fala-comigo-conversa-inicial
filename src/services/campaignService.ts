
import { supabase } from "@/integrations/supabase/client";
import { CampaignData } from "@/types/dataTypes";

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
