
import { supabase } from "@/integrations/supabase/client";

export type Suggestion = {
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
};

export const getSuggestions = async (): Promise<Suggestion[]> => {
  const { data, error } = await supabase
    .from('optimization_suggestions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
  
  return data || [];
};

export const insertSuggestion = async (suggestion: Suggestion): Promise<Suggestion> => {
  const { data, error } = await supabase
    .from('optimization_suggestions')
    .insert({
      ...suggestion,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting suggestion:', error);
    throw error;
  }
  
  return data;
};

export const updateSuggestion = async (id: string, suggestion: Partial<Suggestion>): Promise<Suggestion> => {
  const { data, error } = await supabase
    .from('optimization_suggestions')
    .update(suggestion)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating suggestion:', error);
    throw error;
  }
  
  return data;
};

export const deleteSuggestion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('optimization_suggestions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting suggestion:', error);
    throw error;
  }
};
