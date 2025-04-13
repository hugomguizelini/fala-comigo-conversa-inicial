
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";
import { toast } from "sonner";

export type GptAnalysisResult = {
  analysis: string;
  sections: {
    resumoGeral?: string;
    problemasIdentificados?: string;
    oportunidadesOtimizacao?: string;
    acoesRecomendadas?: string;
    tendencias?: string;
  };
};

export const useGptAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GptAnalysisResult | null>(null);

  const runGptAnalysis = async (campaigns: CampaignData[], monthlyData: MonthlyPerformance[]) => {
    if (campaigns.length === 0) {
      toast.error("Não há dados de campanha para análise. Importe dados primeiro.");
      return null;
    }

    setIsLoading(true);
    
    try {
      toast.loading("Analisando dados com IA...");
      
      const { data, error } = await supabase.functions.invoke('gpt-analysis', {
        body: {
          campaignData: campaigns,
          monthlyData: monthlyData,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || "Erro ao analisar dados");
      }
      
      // Processar a análise para extrair seções
      const processedAnalysis = processGptAnalysis(data.analysis);
      
      setAnalysis(processedAnalysis);
      toast.success("Análise de IA concluída!");
      
      return processedAnalysis;
    } catch (error) {
      console.error("Erro na análise de IA:", error);
      toast.error("Falha ao analisar dados com IA. Tente novamente mais tarde.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para processar o texto da análise e extrair seções
  const processGptAnalysis = (analysisText: string): GptAnalysisResult => {
    const sections: GptAnalysisResult['sections'] = {};
    
    // Regex para encontrar seções na resposta
    const resumoMatch = analysisText.match(/# Resumo Geral|## Resumo Geral|Resumo Geral:?\s*\n([\s\S]*?)(?=(?:# |## |$))/i);
    const problemasMatch = analysisText.match(/# Problemas Identificados|## Problemas Identificados|Problemas Identificados:?\s*\n([\s\S]*?)(?=(?:# |## |$))/i);
    const oportunidadesMatch = analysisText.match(/# Oportunidades de Otimização|## Oportunidades de Otimização|Oportunidades de Otimização:?\s*\n([\s\S]*?)(?=(?:# |## |$))/i);
    const acoesMatch = analysisText.match(/# Ações Recomendadas|## Ações Recomendadas|Ações Recomendadas:?\s*\n([\s\S]*?)(?=(?:# |## |$))/i);
    const tendenciasMatch = analysisText.match(/# Tendências|## Tendências|Tendências:?\s*\n([\s\S]*?)(?=(?:# |## |$))/i);
    
    if (resumoMatch && resumoMatch[1]) sections.resumoGeral = resumoMatch[1].trim();
    if (problemasMatch && problemasMatch[1]) sections.problemasIdentificados = problemasMatch[1].trim();
    if (oportunidadesMatch && oportunidadesMatch[1]) sections.oportunidadesOtimizacao = oportunidadesMatch[1].trim();
    if (acoesMatch && acoesMatch[1]) sections.acoesRecomendadas = acoesMatch[1].trim();
    if (tendenciasMatch && tendenciasMatch[1]) sections.tendencias = tendenciasMatch[1].trim();
    
    return {
      analysis: analysisText,
      sections
    };
  };

  const resetAnalysis = () => {
    setAnalysis(null);
  };

  return {
    isLoading,
    analysis,
    runGptAnalysis,
    resetAnalysis
  };
};
