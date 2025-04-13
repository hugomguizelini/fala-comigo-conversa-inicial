
import { supabase } from "@/integrations/supabase/client";

export const resetAllData = async (): Promise<void> => {
  try {
    // Deletar todos os dados de campanhas
    const { error: campaignError } = await supabase
      .from('campaign_data')
      .delete()
      .not('id', 'is', null); // Garante que todas as linhas sejam deletadas
    
    if (campaignError) {
      console.error("Erro ao excluir dados de campanhas:", campaignError);
      throw campaignError;
    }
    
    // Deletar todos os dados de desempenho mensal
    const { error: monthlyError } = await supabase
      .from('monthly_performance')
      .delete()
      .not('id', 'is', null);
    
    if (monthlyError) {
      console.error("Erro ao excluir dados de desempenho mensal:", monthlyError);
      throw monthlyError;
    }
    
    // Limpar problemas e sugestões também
    await supabase.from('identified_issues').delete().not('id', 'is', null);
    await supabase.from('optimization_suggestions').delete().not('id', 'is', null);
    
    console.log("Todos os dados foram excluídos com sucesso");
    
    return;
  } catch (error) {
    console.error("Erro ao resetar dados:", error);
    throw error;
  }
};
