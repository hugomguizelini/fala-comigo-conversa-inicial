
import { supabase } from "@/integrations/supabase/client";
import { MonthlyPerformance } from "@/types/dataTypes";

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
