
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
  const { data: userData } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('monthly_performance')
    .insert({
      ...monthlyData,
      user_id: userData.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting monthly performance:', error);
    throw error;
  }
  
  return data;
};

export const updateMonthlyPerformance = async (id: string, monthlyData: Partial<MonthlyPerformance>): Promise<MonthlyPerformance> => {
  const { data, error } = await supabase
    .from('monthly_performance')
    .update(monthlyData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating monthly performance:', error);
    throw error;
  }
  
  return data;
};

export const deleteMonthlyPerformance = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('monthly_performance')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting monthly performance:', error);
    throw error;
  }
};

// Função adicional para deletar todos os dados mensais
export const deleteMonthlyData = async (): Promise<void> => {
  const { error } = await supabase
    .from('monthly_performance')
    .delete()
    .not('id', 'is', null); // Garante que todas as linhas sejam deletadas
  
  if (error) {
    console.error('Error deleting all monthly performance data:', error);
    throw error;
  }
};
