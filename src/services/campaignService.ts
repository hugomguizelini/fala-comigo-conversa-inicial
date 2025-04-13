
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
  const { data: userData } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('campaign_data')
    .insert({
      ...campaign,
      user_id: userData.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting campaign:', error);
    throw error;
  }
  
  return data;
};

export const updateCampaign = async (id: string, campaign: Partial<CampaignData>): Promise<CampaignData> => {
  const { data, error } = await supabase
    .from('campaign_data')
    .update(campaign)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
  
  return data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('campaign_data')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};
