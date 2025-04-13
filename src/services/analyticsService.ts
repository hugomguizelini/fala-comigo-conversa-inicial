
import { CampaignData, MonthlyPerformance, Issue, Suggestion } from "@/types/dataTypes";

// Função para detectar campanhas com baixo CTR
export const detectLowCTRCampaigns = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  const lowCTRCampaigns = campaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return ctrValue < 1.0; // CTR abaixo de 1%
  });
  
  if (lowCTRCampaigns.length > 0) {
    const issue: Issue = {
      issue: "CTR abaixo da média do setor",
      description: "Estas campanhas estão com taxa de cliques abaixo do recomendado para o setor (1%). Considere revisar os criativos e segmentação.",
      related_to: "CTR",
      affected_campaigns: lowCTRCampaigns.map(c => c.name),
      severity: "medium"
    };
    
    issues.push(issue);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  return issues;
};

// Função para detectar orçamentos mal distribuídos
export const detectBudgetDistributionIssues = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  // Campanhas com alto ROAS
  const highROASCampaigns = campaigns.filter(campaign => {
    const roasValue = parseFloat(campaign.roas.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return roasValue > 5.0; // ROAS acima de 5
  });
  
  // Campanhas com baixo orçamento entre as de alto ROAS
  const highROASWithLowBudget = highROASCampaigns.filter(campaign => {
    const budgetValue = parseFloat(campaign.budget.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return budgetValue < 1000; // Orçamento menor que R$ 1.000
  });
  
  if (highROASWithLowBudget.length > 0) {
    const issue: Issue = {
      issue: "Campanhas de alto retorno com baixo orçamento",
      description: "Estas campanhas têm um ROAS elevado mas orçamento baixo. Considere aumentar o investimento nestas campanhas para maximizar os resultados.",
      related_to: "Orçamento",
      affected_campaigns: highROASWithLowBudget.map(c => c.name),
      severity: "high"
    };
    
    issues.push(issue);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  return issues;
};

// Função para detectar tendências negativas
export const detectNegativeTrends = async (performanceData: MonthlyPerformance[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  if (performanceData.length < 3) return issues; // Necessário pelo menos 3 meses para análise
  
  // Ordenar por data
  const sortedData = [...performanceData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const monthOrder = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
    return monthOrder[a.month.toLowerCase() as keyof typeof monthOrder] - monthOrder[b.month.toLowerCase() as keyof typeof monthOrder];
  });
  
  // Verificar tendência de conversões dos últimos 3 meses
  const last3Months = sortedData.slice(-3);
  
  if (
    last3Months.length === 3 &&
    last3Months[2].conversions < last3Months[1].conversions && 
    last3Months[1].conversions < last3Months[0].conversions
  ) {
    const issue: Issue = {
      issue: "Queda constante nas conversões",
      description: `Nos últimos 3 meses (${last3Months.map(d => d.month).join(', ')}), houve uma queda constante no número de conversões. Recomendamos uma análise detalhada do funil e das campanhas ativas.`,
      related_to: "Conversões",
      affected_campaigns: ["Todas as campanhas"],
      severity: "high"
    };
    
    issues.push(issue);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  return issues;
};

// Função para gerar sugestões com base nas campanhas
export const generateCampaignSuggestions = async (campaigns: CampaignData[]): Promise<Suggestion[]> => {
  const suggestions: Suggestion[] = [];
  
  // Identificar campanhas com alto custo e baixa conversão
  const highCostLowConversion = campaigns.filter(campaign => {
    const costValue = parseFloat(campaign.total_cost.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return costValue > 1000 && campaign.conversions < 5;
  });
  
  if (highCostLowConversion.length > 0) {
    const suggestion: Suggestion = {
      title: "Revisar segmentação de campanhas de alto custo",
      description: "Campanhas com alto investimento e baixa conversão precisam de ajustes na segmentação de público-alvo para melhorar a eficiência.",
      type: "campaign",
      impact: "alto",
      target_campaigns: highCostLowConversion.map(c => c.name)
    };
    
    suggestions.push(suggestion);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  // Sugestões de teste A/B para campanhas de médio desempenho
  const mediumPerformanceCampaigns = campaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return ctrValue >= 1.0 && ctrValue < 2.0;
  });
  
  if (mediumPerformanceCampaigns.length > 0) {
    const suggestion: Suggestion = {
      title: "Implementar testes A/B em criativos",
      description: "Campanhas com CTR médio podem se beneficiar de testes A/B para encontrar novos criativos e mensagens que ressoem melhor com o público-alvo.",
      type: "campaign",
      impact: "médio",
      target_campaigns: mediumPerformanceCampaigns.map(c => c.name)
    };
    
    suggestions.push(suggestion);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  return suggestions;
};

// Função para gerar sugestões de otimização de funil
export const generateFunnelSuggestions = async (performanceData: MonthlyPerformance[]): Promise<Suggestion[]> => {
  const suggestions: Suggestion[] = [];
  
  if (performanceData.length === 0) return suggestions;
  
  // Calcular taxa média de conversão (conversões / cliques)
  const totalClicks = performanceData.reduce((sum, data) => sum + data.clicks, 0);
  const totalConversions = performanceData.reduce((sum, data) => sum + data.conversions, 0);
  
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  
  if (conversionRate < 2) {
    // Taxa de conversão menor que 2%
    const suggestion: Suggestion = {
      title: "Otimização de páginas de destino",
      description: "A taxa de conversão geral está abaixo de 2%. Recomendamos revisão das páginas de destino para melhorar a experiência do usuário e reduzir a taxa de rejeição.",
      type: "funnel",
      impact: "alto",
      target_pages: ["Página inicial", "Páginas de produto", "Checkout"]
    };
    
    suggestions.push(suggestion);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
    
    // Sugestão adicional para páginas de captura
    const capturePageSuggestion: Suggestion = {
      title: "Simplificar formulários de captura",
      description: "Formulários complexos podem estar reduzindo sua taxa de conversão. Considere simplificar campos e implementar preenchimento automático.",
      type: "funnel",
      impact: "médio",
      target_pages: ["Formulários de contato", "Páginas de cadastro"]
    };
    
    suggestions.push(capturePageSuggestion);
    // Removemos a tentativa de inserir no banco para evitar erros de RLS
  }
  
  return suggestions;
};

// Função principal para analisar todos os dados e gerar insights
export const analyzeAllData = async (campaigns: CampaignData[], performanceData: MonthlyPerformance[]): Promise<{
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
}> => {
  // Detectar problemas
  const ctrIssues = await detectLowCTRCampaigns(campaigns);
  const budgetIssues = await detectBudgetDistributionIssues(campaigns);
  const trendIssues = await detectNegativeTrends(performanceData);
  
  const allIssues = [...ctrIssues, ...budgetIssues, ...trendIssues];
  
  // Gerar sugestões
  const campaignSuggestions = await generateCampaignSuggestions(campaigns);
  const funnelSuggestions = await generateFunnelSuggestions(performanceData);
  
  return {
    issues: allIssues,
    suggestions: {
      campaign: campaignSuggestions,
      funnel: funnelSuggestions
    }
  };
};

// Função para carregar problemas e sugestões já existentes ou analisar dados novamente
export const getAnalytics = async (campaigns: CampaignData[], performanceData: MonthlyPerformance[]): Promise<{
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
}> => {
  try {
    // Como estamos enfrentando problemas com RLS, vamos sempre executar a análise sob demanda
    return await analyzeAllData(campaigns, performanceData);
  } catch (error) {
    console.error("Erro ao buscar ou analisar dados:", error);
    // Em caso de erro, retorne dados vazios
    return {
      issues: [],
      suggestions: {
        campaign: [],
        funnel: []
      }
    };
  }
};
