
import { CampaignData, MonthlyPerformance, Issue, Suggestion } from "@/types/dataTypes";

// Função para detectar campanhas com baixo CTR
export const detectLowCTRCampaigns = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  // CTR abaixo de 1% para campanhas padrão
  const lowCTRCampaigns = campaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return ctrValue < 1.0;
  });
  
  if (lowCTRCampaigns.length > 0) {
    const issue: Issue = {
      issue: "CTR abaixo da média do setor",
      description: "Estas campanhas estão com taxa de cliques abaixo do recomendado para o setor (1%). Considere revisar os criativos e segmentação.",
      related_to: "CTR",
      affected_campaigns: lowCTRCampaigns.map(c => c.name || ''),
      severity: "medium"
    };
    
    issues.push(issue);
  }
  
  // CTR abaixo de 2% para campanhas de remarketing (que normalmente têm CTR mais alto)
  const lowCTRRemarketingCampaigns = campaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return ctrValue < 2.0 && campaign.name.toLowerCase().includes('remarketing');
  });
  
  if (lowCTRRemarketingCampaigns.length > 0) {
    const issue: Issue = {
      issue: "CTR de remarketing abaixo do esperado",
      description: "Campanhas de remarketing normalmente têm CTR acima de 2%. Suas campanhas de remarketing estão com desempenho abaixo do esperado, o que pode indicar problemas de segmentação ou creative fatigue.",
      related_to: "CTR Remarketing",
      affected_campaigns: lowCTRRemarketingCampaigns.map(c => c.name || ''),
      severity: "high"
    };
    
    issues.push(issue);
  }
  
  return issues;
};

// Função para detectar orçamentos mal distribuídos
export const detectBudgetDistributionIssues = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  // Campanhas com alto ROAS
  const highROASCampaigns = campaigns.filter(campaign => {
    const roasValue = parseFloat(campaign.roas?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return roasValue > 5.0; // ROAS acima de 5
  });
  
  // Campanhas com baixo orçamento entre as de alto ROAS
  const highROASWithLowBudget = highROASCampaigns.filter(campaign => {
    const budgetValue = parseFloat(campaign.budget?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return budgetValue < 1000; // Orçamento menor que R$ 1.000
  });
  
  if (highROASWithLowBudget.length > 0) {
    const issue: Issue = {
      issue: "Campanhas de alto retorno com baixo orçamento",
      description: "Estas campanhas têm um ROAS elevado mas orçamento baixo. Considere aumentar o investimento nestas campanhas para maximizar os resultados.",
      related_to: "Orçamento",
      affected_campaigns: highROASWithLowBudget.map(c => c.name || ''),
      severity: "high"
    };
    
    issues.push(issue);
  }
  
  // Campanhas com alto CPC e baixo ROAS (gastos ineficientes)
  const highCpcLowRoasCampaigns = campaigns.filter(campaign => {
    const cpcValue = parseFloat(campaign.cpc?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    const roasValue = parseFloat(campaign.roas?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return cpcValue > 5.0 && roasValue < 2.0; // CPC alto e ROAS baixo
  });
  
  if (highCpcLowRoasCampaigns.length > 0) {
    const issue: Issue = {
      issue: "Alto custo por clique com baixo retorno",
      description: "Estas campanhas têm um custo por clique elevado e baixo retorno sobre o investimento. Recomendamos revisar urgentemente a segmentação e os lances para reduzir o CPC ou considerar pausar estas campanhas.",
      related_to: "CPC",
      affected_campaigns: highCpcLowRoasCampaigns.map(c => c.name || ''),
      severity: "high"
    };
    
    issues.push(issue);
  }
  
  // Detectar desequilíbrio de orçamento entre campanhas similares
  const campaignCategories: Record<string, CampaignData[]> = {};
  
  // Agrupar campanhas por categoria (baseado em padrões de nomenclatura)
  campaigns.forEach(campaign => {
    const nameParts = campaign.name.split(/[-_\s]/);
    if (nameParts.length > 0) {
      const category = nameParts[0].toLowerCase();
      if (!campaignCategories[category]) {
        campaignCategories[category] = [];
      }
      campaignCategories[category].push(campaign);
    }
  });
  
  // Analisar distribuição de orçamento por categoria
  Object.keys(campaignCategories).forEach(category => {
    const categoryCampaigns = campaignCategories[category];
    if (categoryCampaigns.length > 1) {
      // Calcular média de ROAS na categoria
      const roasValues = categoryCampaigns
        .map(c => parseFloat(c.roas?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0'))
        .filter(v => !isNaN(v));
      
      const avgROAS = roasValues.reduce((sum, val) => sum + val, 0) / roasValues.length;
      
      // Identificar campanhas com ROAS acima da média mas orçamento abaixo da média
      const budgetValues = categoryCampaigns
        .map(c => parseFloat(c.budget?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0'))
        .filter(v => !isNaN(v));
        
      const avgBudget = budgetValues.reduce((sum, val) => sum + val, 0) / budgetValues.length;
      
      const unbalancedCampaigns = categoryCampaigns.filter(campaign => {
        const roasValue = parseFloat(campaign.roas?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
        const budgetValue = parseFloat(campaign.budget?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
        return roasValue > avgROAS * 1.2 && budgetValue < avgBudget * 0.8; // ROAS 20% acima da média, orçamento 20% abaixo
      });
      
      if (unbalancedCampaigns.length > 0) {
        const issue: Issue = {
          issue: `Desequilíbrio de orçamento em campanhas de ${category}`,
          description: `Algumas campanhas da categoria "${category}" têm desempenho acima da média (ROAS) mas estão recebendo menos orçamento. Considere redistribuir o orçamento para maximizar o retorno.`,
          related_to: "Distribuição de Orçamento",
          affected_campaigns: unbalancedCampaigns.map(c => c.name || ''),
          severity: "medium"
        };
        
        issues.push(issue);
      }
    }
  });
  
  return issues;
};

// Função para detectar campanhas com alta taxa de impressão mas poucos cliques (relevância baixa)
export const detectLowRelevanceCampaigns = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  const lowRelevanceCampaigns = campaigns.filter(campaign => {
    return campaign.impressions > 10000 && campaign.clicks < 100;
  });
  
  if (lowRelevanceCampaigns.length > 0) {
    const issue: Issue = {
      issue: "Baixa relevância em campanhas de alto volume",
      description: "Estas campanhas têm um alto número de impressões mas poucos cliques, indicando baixa relevância dos anúncios para o público-alvo. Considere revisar os criativos e a segmentação.",
      related_to: "Relevância",
      affected_campaigns: lowRelevanceCampaigns.map(c => c.name || ''),
      severity: "medium"
    };
    
    issues.push(issue);
  }
  
  return issues;
};

// Função para detectar problemas de sazonalidade
export const detectSeasonalityIssues = async (performanceData: MonthlyPerformance[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  if (performanceData.length < 6) return issues; // Precisamos de pelo menos 6 meses de dados
  
  // Ordenar por data
  const sortedData = [...performanceData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const monthOrder: Record<string, number> = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
    return (monthOrder[a.month.toLowerCase()] || 0) - (monthOrder[b.month.toLowerCase()] || 0);
  });
  
  // Identificar meses sazonais (comparando com o mesmo mês do ano anterior, se disponível)
  const currentYearData = sortedData.filter(d => d.year === sortedData[sortedData.length - 1].year);
  const previousYearData = sortedData.filter(d => d.year === sortedData[sortedData.length - 1].year - 1);
  
  if (previousYearData.length > 0 && currentYearData.length > 0) {
    // Encontrar meses com queda significativa ano a ano
    const monthsWithIssues: string[] = [];
    
    currentYearData.forEach(currentMonth => {
      const previousYearMonth = previousYearData.find(d => d.month === currentMonth.month);
      if (previousYearMonth) {
        // Verificar se houve queda de pelo menos 30% nas conversões
        const conversionDrop = previousYearMonth.conversions > 0 ? 
          (previousYearMonth.conversions - currentMonth.conversions) / previousYearMonth.conversions : 0;
        
        if (conversionDrop > 0.3) {
          monthsWithIssues.push(currentMonth.month);
        }
      }
    });
    
    if (monthsWithIssues.length > 0) {
      const issue: Issue = {
        issue: "Queda sazonal em desempenho",
        description: `Detectamos uma queda significativa nas conversões nos meses de ${monthsWithIssues.join(', ')} em comparação com o ano anterior. Isso pode indicar problemas sazonais que precisam de atenção especial.`,
        related_to: "Sazonalidade",
        affected_campaigns: ["Todas as campanhas"],
        severity: "medium"
      };
      
      issues.push(issue);
    }
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
    const monthOrder: Record<string, number> = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
    return (monthOrder[a.month.toLowerCase()] || 0) - (monthOrder[b.month.toLowerCase()] || 0);
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
  }
  
  // Verificar tendência de aumento no CPC (custo por clique está aumentando)
  if (last3Months.length === 3) {
    const avgCpc = last3Months.map(m => m.cost / (m.clicks || 1)); // Custo médio por clique por mês
    
    if (avgCpc[2] > avgCpc[1] && avgCpc[1] > avgCpc[0] && avgCpc[2] > avgCpc[0] * 1.2) {
      const issue: Issue = {
        issue: "Aumento constante no custo por clique",
        description: `Nos últimos 3 meses, o CPC médio aumentou consistentemente, com um aumento total de ${Math.round((avgCpc[2] / avgCpc[0] - 1) * 100)}%. Isso pode indicar aumento da concorrência ou problemas de qualidade dos anúncios.`,
        related_to: "CPC",
        affected_campaigns: ["Todas as campanhas"],
        severity: "medium"
      };
      
      issues.push(issue);
    }
  }
  
  return issues;
};

// Função para gerar sugestões com base nas campanhas
export const generateCampaignSuggestions = async (campaigns: CampaignData[]): Promise<Suggestion[]> => {
  const suggestions: Suggestion[] = [];
  
  // Identificar campanhas com alto custo e baixa conversão
  const highCostLowConversion = campaigns.filter(campaign => {
    const costValue = parseFloat(campaign.total_cost?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
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
  }
  
  // Sugestões de teste A/B para campanhas de médio desempenho
  const mediumPerformanceCampaigns = campaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
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
  }
  
  // Sugestão para otimização de ofertas em campanhas com alto volume mas baixa conversão
  const highVolumeWithLowConversion = campaigns.filter(campaign => {
    return campaign.impressions > 20000 && campaign.conversions < 10;
  });
  
  if (highVolumeWithLowConversion.length > 0) {
    const suggestion: Suggestion = {
      title: "Otimizar estratégia de ofertas",
      description: "Estas campanhas têm alto volume de impressões mas poucas conversões. Considere mudar a estratégia de lance para 'Maximizar conversões' ou 'CPA target' em vez de 'Maximizar cliques'.",
      type: "campaign",
      impact: "alto",
      target_campaigns: highVolumeWithLowConversion.map(c => c.name)
    };
    
    suggestions.push(suggestion);
  }
  
  // Sugestão para revisão de palavras-chave para campanhas de search
  const potentialSearchCampaigns = campaigns.filter(campaign => {
    return campaign.name.toLowerCase().includes("search") || 
           campaign.name.toLowerCase().includes("pesquisa") || 
           campaign.name.toLowerCase().includes("keyword");
  });
  
  if (potentialSearchCampaigns.length > 0) {
    const lowPerformingSearchCampaigns = potentialSearchCampaigns.filter(campaign => {
      const ctrValue = parseFloat(campaign.ctr?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
      return ctrValue < 1.5; // CTR abaixo de 1.5% para campanhas de pesquisa é considerado baixo
    });
    
    if (lowPerformingSearchCampaigns.length > 0) {
      const suggestion: Suggestion = {
        title: "Refinar lista de palavras-chave",
        description: "Suas campanhas de pesquisa têm CTR abaixo da média do setor. Recomendamos revisar as palavras-chave, removendo termos de baixo desempenho e adicionando termos negativos para reduzir impressões irrelevantes.",
        type: "campaign",
        impact: "alto",
        target_campaigns: lowPerformingSearchCampaigns.map(c => c.name)
      };
      
      suggestions.push(suggestion);
    }
  }
  
  // Sugestão para implementação de audiências semelhantes (lookalike)
  const highConversionCampaigns = campaigns.filter(campaign => {
    return campaign.conversions > 20;
  });
  
  if (highConversionCampaigns.length > 0) {
    const suggestion: Suggestion = {
      title: "Criar audiências semelhantes (lookalike)",
      description: "Suas campanhas de alto desempenho podem servir como base para criar audiências semelhantes. Crie audiências lookalike com 1-3% de similaridade baseadas nos usuários que converteram nestas campanhas.",
      type: "campaign",
      impact: "médio",
      target_campaigns: highConversionCampaigns.map(c => c.name),
      target_audience: "Lookalike 1-3% de similaridade"
    };
    
    suggestions.push(suggestion);
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
    
    // Sugestão adicional para páginas de captura
    const capturePageSuggestion: Suggestion = {
      title: "Simplificar formulários de captura",
      description: "Formulários complexos podem estar reduzindo sua taxa de conversão. Considere simplificar campos e implementar preenchimento automático.",
      type: "funnel",
      impact: "médio",
      target_pages: ["Formulários de contato", "Páginas de cadastro"]
    };
    
    suggestions.push(capturePageSuggestion);
  }
  
  // Verificar se há tendência de queda na taxa de conversão ao longo do tempo
  if (performanceData.length >= 3) {
    // Ordenar por data
    const sortedData = [...performanceData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder: Record<string, number> = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
      return (monthOrder[a.month.toLowerCase()] || 0) - (monthOrder[b.month.toLowerCase()] || 0);
    });
    
    const last3Months = sortedData.slice(-3);
    const conversionRates = last3Months.map(month => 
      month.clicks > 0 ? (month.conversions / month.clicks) * 100 : 0
    );
    
    if (conversionRates[2] < conversionRates[1] && conversionRates[1] < conversionRates[0]) {
      const suggestion: Suggestion = {
        title: "Implementar testes de velocidade e UX",
        description: "A taxa de conversão tem caído consistentemente nos últimos meses. Recomendamos realizar testes de usabilidade e velocidade para identificar possíveis problemas técnicos ou de experiência do usuário.",
        type: "funnel",
        impact: "alto",
        target_pages: ["Todas as páginas do funil de conversão"]
      };
      
      suggestions.push(suggestion);
    }
  }
  
  // Sugestão para implementação de remarketing no funil
  const abandonmentSuggestion: Suggestion = {
    title: "Implementar remarketing para abandono de carrinho",
    description: "O remarketing para usuários que abandonaram o carrinho pode recuperar vendas perdidas. Configure campanhas específicas que mostrem os produtos abandonados com incentivos para conclusão da compra.",
    type: "funnel",
    impact: "alto",
    target_pages: ["Página de carrinho", "Checkout"]
  };
  
  suggestions.push(abandonmentSuggestion);
  
  // Sugestão para implementação de chatbot ou suporte ao vivo
  const supportSuggestion: Suggestion = {
    title: "Adicionar suporte ao vivo nas páginas de alta intenção",
    description: "Oferecer suporte ao vivo (chat) nas páginas de produto e checkout pode aumentar a taxa de conversão ao esclarecer dúvidas dos clientes no momento crítico de decisão.",
    type: "funnel",
    impact: "médio",
    target_pages: ["Páginas de produto", "Checkout", "Páginas de pricing"]
  };
  
  suggestions.push(supportSuggestion);
  
  // Sugestão para otimização de layout mobile
  const mobileSuggestion: Suggestion = {
    title: "Otimizar experiência mobile do checkout",
    description: "Grande parte dos abandonos de carrinho ocorre em dispositivos móveis. Simplifique o processo de checkout em telas pequenas e garanta que os formulários sejam fáceis de preencher em smartphones.",
    type: "funnel",
    impact: "alto",
    target_pages: ["Checkout mobile"]
  };
  
  suggestions.push(mobileSuggestion);
  
  return suggestions;
};

// Função para detectar problemas de segmentação demográfica
export const detectSegmentationIssues = async (campaigns: CampaignData[]): Promise<Issue[]> => {
  const issues: Issue[] = [];
  
  // Esta é uma análise simplificada que poderia ser expandida com dados demográficos reais
  // Aqui, apenas identificamos campanhas que têm nome sugestivo de público específico mas desempenho ruim
  
  const potentialDemographicCampaigns = campaigns.filter(campaign => {
    const name = campaign.name.toLowerCase();
    return name.includes("idade") || name.includes("age") || 
           name.includes("fem") || name.includes("masc") || 
           name.includes("homem") || name.includes("mulher") ||
           name.includes("jovem") || name.includes("senior");
  });
  
  const lowPerformingDemoCampaigns = potentialDemographicCampaigns.filter(campaign => {
    const ctrValue = parseFloat(campaign.ctr?.replace(/[^0-9.,]/g, '')?.replace(',', '.') || '0');
    return ctrValue < 0.8; // CTR muito baixo para campanhas demográficas
  });
  
  if (lowPerformingDemoCampaigns.length > 0) {
    const issue: Issue = {
      issue: "Segmentação demográfica ineficiente",
      description: "Campanhas direcionadas a segmentos demográficos específicos estão com desempenho abaixo do esperado. Considere revisar os critérios de segmentação ou os criativos para melhor ressoar com estes públicos.",
      related_to: "Segmentação",
      affected_campaigns: lowPerformingDemoCampaigns.map(c => c.name || ''),
      severity: "medium"
    };
    
    issues.push(issue);
  }
  
  return issues;
};

// Função principal para analisar todos os dados e gerar insights
export const analyzeAllData = async (campaigns: CampaignData[], performanceData: MonthlyPerformance[]): Promise<{
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
}> => {
  try {
    // Detectar problemas
    const ctrIssues = await detectLowCTRCampaigns(campaigns);
    const budgetIssues = await detectBudgetDistributionIssues(campaigns);
    const trendIssues = await detectNegativeTrends(performanceData);
    const relevanceIssues = await detectLowRelevanceCampaigns(campaigns);
    const seasonalityIssues = await detectSeasonalityIssues(performanceData);
    const segmentationIssues = await detectSegmentationIssues(campaigns);
    
    const allIssues = [...ctrIssues, ...budgetIssues, ...trendIssues, ...relevanceIssues, ...seasonalityIssues, ...segmentationIssues];
    
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
  } catch (error) {
    console.error("Erro na análise de dados:", error);
    // Em caso de erro, retornar dados vazios
    return {
      issues: [],
      suggestions: {
        campaign: [],
        funnel: []
      }
    };
  }
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
