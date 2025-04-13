
import { supabase } from "@/integrations/supabase/client";
import { Suggestion } from "@/types/dataTypes";

// Helper function to validate impact values
const validateImpact = (impact: string): "alto" | "médio" | "baixo" => {
  if (impact === "alto" || impact === "médio" || impact === "baixo") {
    return impact;
  }
  // Default to "médio" if the value doesn't match expected values
  console.warn(`Impact value "${impact}" is not valid, defaulting to "médio"`);
  return "médio";
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
  
  // Map the data and ensure type safety for all fields
  const typedData = data?.map(item => ({
    ...item,
    type: item.type as 'campaign' | 'funnel',
    impact: validateImpact(item.impact)
  })) || [];
  
  return typedData;
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
  
  return {
    ...data,
    type: data.type as 'campaign' | 'funnel',
    impact: validateImpact(data.impact)
  };
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
  
  return {
    ...data,
    type: data.type as 'campaign' | 'funnel',
    impact: validateImpact(data.impact)
  };
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
