
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sistema de fallback para quando a API da OpenAI falhar
const fallbackResponses = {
  greeting: "Olá! Sou o assistente de marketing de fallback. A API da OpenAI está temporariamente indisponível, mas posso oferecer algumas sugestões gerais sobre marketing digital.",
  campaign: "Com base em análises padrão de campanhas, geralmente recomendamos verificar seu CTR, otimizar segmentação e testar diferentes criativos.",
  budget: "Para otimização de orçamento, considere redistribuir recursos de campanhas de baixo desempenho para as que apresentam melhores resultados de ROAS.",
  funnel: "Para melhorar seu funil de conversão, verifique onde ocorrem os maiores abandonos e otimize essas etapas específicas.",
  default: "Estamos enfrentando uma limitação temporária na análise em tempo real. Por favor, tente novamente mais tarde ou consulte as sugestões no painel de problemas e oportunidades."
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error("API key for OpenAI not found");
    }

    // Verificar o tipo de solicitação - análise completa ou mensagem de chat
    if (requestData.type === 'chat') {
      return await handleChatMessage(requestData, openaiApiKey, corsHeaders);
    } else {
      // Análise padrão (comportamento original)
      const { campaignData, monthlyData } = requestData;
      const prompt = generateAnalysisPrompt(campaignData, monthlyData);
      
      try {
        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'Você é um especialista em marketing digital. Analise os dados de campanhas e performance mensal fornecidos para extrair insights valiosos, detectar problemas e sugerir otimizações. Foque em ROI, CTR, orçamento e conversões. Estruture sua resposta em seções claras: "Resumo Geral", "Problemas Identificados", "Oportunidades de Otimização" e "Ações Recomendadas".' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 1500,
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          console.error("OpenAI API error:", data.error);
          // Usar fallback para análise
          const fallbackAnalysis = generateFallbackAnalysis(campaignData, monthlyData);
          
          return new Response(JSON.stringify({
            success: true,
            analysis: fallbackAnalysis,
            fromFallback: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const analysis = data.choices[0].message.content;

        // Return the analysis
        return new Response(JSON.stringify({
          success: true,
          analysis: analysis,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error("Error calling OpenAI:", error);
        // Usar fallback para análise em caso de erro
        const fallbackAnalysis = generateFallbackAnalysis(campaignData, monthlyData);
          
        return new Response(JSON.stringify({
          success: true,
          analysis: fallbackAnalysis,
          fromFallback: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fromFallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Nova função para processar mensagens de chat com contexto dos dados
async function handleChatMessage(requestData, openaiApiKey, corsHeaders) {
  const { 
    message, 
    campaignData, 
    monthlyData, 
    metrics, 
    issues, 
    suggestions, 
    previousMessages = [] 
  } = requestData;
  
  // Log de depuração para verificar se os dados de contexto estão chegando
  console.log("Contexto recebido:", {
    temMessage: Boolean(message),
    temCampaignData: Boolean(campaignData && campaignData.length > 0),
    temMonthlyData: Boolean(monthlyData && monthlyData.length > 0),
    temMetrics: Boolean(metrics),
    temIssues: Boolean(issues && issues.length > 0),
    temSuggestions: Boolean(suggestions),
    temPreviousMessages: Boolean(previousMessages && previousMessages.length > 0)
  });
  
  // Construir contexto com os dados disponíveis
  let contextPrompt = `
Você é um assistente especializado em marketing digital, com foco em análise de campanhas publicitárias.

INSTRUÇÕES IMPORTANTES:
- Responda sempre em português do Brasil
- Seja direto e claro nas suas respostas
- Forneça insights úteis baseados nos dados disponíveis
- Se solicitado um detalhe específico que não está nos dados, diga que não tem essa informação
- Use os dados reais para embasar suas respostas

CONTEXTO ATUAL:
`;

  // Adicionar detalhes dos dados disponíveis
  if (campaignData && campaignData.length > 0) {
    contextPrompt += `
- Dados de ${campaignData.length} campanhas disponíveis 
- Nomes das campanhas: ${campaignData.map(c => c.name).join(', ')}
- Métricas disponíveis: impressões, cliques, CTR, conversões, CPC, custo total, ROAS
`;

    // Adicionar algumas estatísticas gerais
    const totalImpressions = campaignData.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaignData.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaignData.reduce((sum, c) => sum + c.conversions, 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "N/A";
    
    contextPrompt += `
- Métricas totais: ${totalImpressions} impressões, ${totalClicks} cliques, ${totalConversions} conversões, CTR médio de ${avgCTR}%
`;

    // Adicionar informações sobre as campanhas com melhor e pior desempenho
    if (campaignData.length > 1) {
      const sortedByCTR = [...campaignData].sort((a, b) => {
        const ctrA = parseFloat(a.ctr.replace('%', ''));
        const ctrB = parseFloat(b.ctr.replace('%', ''));
        return ctrB - ctrA;
      });
      
      contextPrompt += `
- Campanha com melhor CTR: ${sortedByCTR[0].name} (${sortedByCTR[0].ctr})
- Campanha com pior CTR: ${sortedByCTR[sortedByCTR.length - 1].name} (${sortedByCTR[sortedByCTR.length - 1].ctr})
`;
    }
  } else {
    contextPrompt += `- Não há dados de campanhas disponíveis\n`;
  }
  
  if (monthlyData && monthlyData.length > 0) {
    contextPrompt += `- Dados de desempenho mensal de ${monthlyData.length} meses disponíveis\n`;
    
    // Adicionar tendências se houver dados suficientes
    if (monthlyData.length > 1) {
      // Ordenar por data
      const sortedMonthly = [...monthlyData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        const monthOrder = { 'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11 };
        return monthOrder[a.month.toLowerCase().substring(0, 3)] - monthOrder[b.month.toLowerCase().substring(0, 3)];
      });
      
      const first = sortedMonthly[0];
      const last = sortedMonthly[sortedMonthly.length - 1];
      
      const clicksTrend = last.clicks > first.clicks ? "crescente" : "decrescente";
      const conversionsTrend = last.conversions > first.conversions ? "crescente" : "decrescente";
      
      contextPrompt += `
- Tendência de cliques: ${clicksTrend}
- Tendência de conversões: ${conversionsTrend}
`;
    }
  } else {
    contextPrompt += `- Não há dados mensais disponíveis\n`;
  }
  
  if (issues && issues.length > 0) {
    contextPrompt += `- ${issues.length} problemas identificados nas campanhas:\n`;
    issues.forEach(issue => {
      contextPrompt += `  * ${issue.issue}: ${issue.description}\n`;
    });
  } else {
    contextPrompt += `- Nenhum problema identificado\n`;
  }
  
  if (suggestions) {
    const campaignSuggestions = suggestions.campaign || [];
    const funnelSuggestions = suggestions.funnel || [];
    
    if (campaignSuggestions.length > 0 || funnelSuggestions.length > 0) {
      contextPrompt += `- Sugestões disponíveis:\n`;
      
      campaignSuggestions.forEach(s => {
        contextPrompt += `  * Para campanhas: ${s.title} - ${s.description}\n`;
      });
      
      funnelSuggestions.forEach(s => {
        contextPrompt += `  * Para funil: ${s.title} - ${s.description}\n`;
      });
    } else {
      contextPrompt += `- Nenhuma sugestão disponível\n`;
    }
  } else {
    contextPrompt += `- Nenhuma sugestão disponível\n`;
  }

  // Formatar histórico de mensagens para o API
  const formattedMessages = [
    { role: 'system', content: contextPrompt },
    ...previousMessages.map(pm => ({ role: pm.role, content: pm.content })),
    { role: 'user', content: message }
  ];

  // Fazer chamada à API OpenAI com tratamento de erro
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
      // Usar resposta de fallback com base no conteúdo da pergunta
      const fallbackReply = generateFallbackChatReply(message);
      
      return new Response(JSON.stringify({
        success: true,
        reply: fallbackReply,
        fromFallback: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const assistantReply = data.choices[0].message.content;

    // Retornar mensagem
    return new Response(JSON.stringify({
      success: true,
      reply: assistantReply,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in chat processing:", error);
    // Usar resposta de fallback com base no conteúdo da pergunta
    const fallbackReply = generateFallbackChatReply(message);
    
    return new Response(JSON.stringify({
      success: true,
      reply: fallbackReply,
      fromFallback: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Função para gerar respostas de fallback para o chat
function generateFallbackChatReply(message) {
  message = message.toLowerCase();
  
  if (message.includes("olá") || message.includes("oi") || message.includes("bom dia") || message.includes("boa tarde") || message.includes("boa noite")) {
    return fallbackResponses.greeting;
  } else if (message.includes("campanha") || message.includes("anúncio") || message.includes("ads")) {
    return fallbackResponses.campaign;
  } else if (message.includes("orçamento") || message.includes("gasto") || message.includes("investimento") || message.includes("custo")) {
    return fallbackResponses.budget;
  } else if (message.includes("funil") || message.includes("conversão") || message.includes("conversões")) {
    return fallbackResponses.funnel;
  } else {
    return `${fallbackResponses.default}\n\nSua pergunta foi sobre: "${message}". Por favor, tente novamente mais tarde quando nossos serviços estiverem totalmente operacionais.`;
  }
}

// Função para gerar análise de fallback quando a API falha
function generateFallbackAnalysis(campaignData, monthlyData) {
  // Calcular algumas métricas básicas para personalizar o fallback
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalCost = 0;
  let worstCampaigns = [];
  let bestCampaigns = [];

  if (campaignData && campaignData.length > 0) {
    // Somar totais
    campaignData.forEach(campaign => {
      totalImpressions += campaign.impressions || 0;
      totalClicks += campaign.clicks || 0;
      totalConversions += campaign.conversions || 0;
      totalCost += parseFloat(campaign.total_cost.replace(/[^0-9.-]+/g,"")) || 0;
    });
    
    // Identificar melhores e piores campanhas por CTR
    const sortedCampaigns = [...campaignData].sort((a, b) => {
      const ctrA = parseFloat(a.ctr.replace('%', ''));
      const ctrB = parseFloat(b.ctr.replace('%', ''));
      return ctrB - ctrA;
    });
    
    bestCampaigns = sortedCampaigns.slice(0, 2).map(c => c.name);
    worstCampaigns = sortedCampaigns.slice(-2).map(c => c.name);
  }

  // Construir análise de fallback
  return `# Análise de Campanhas (Modo Offline)

## Resumo Geral
Analisamos ${campaignData ? campaignData.length : 0} campanhas com um total de ${totalImpressions} impressões, ${totalClicks} cliques e ${totalConversions} conversões. O custo total foi de R$ ${totalCost.toFixed(2)}.

## Problemas Identificados
- Algumas campanhas podem estar com desempenho abaixo do ideal
- Possível necessidade de otimização de segmentação
- Taxas de conversão podem ser melhoradas em algumas campanhas

## Oportunidades de Otimização
- Revisar as campanhas menos eficientes para identificar problemas específicos
- Considerar realocação de orçamento para campanhas com melhor ROAS
- Testar diferentes variações de criativos para melhorar o engajamento

## Ações Recomendadas
1. Analisar em detalhes as métricas das campanhas de menor desempenho
2. Verificar segmentação e palavras-chave para melhorar a qualidade do tráfego
3. Implementar testes A/B para otimizar taxa de conversão
4. Revisar estratégia de orçamento e considerar ajustes baseados no ROAS

*Observação: Esta é uma análise gerada em modo offline devido a limitações temporárias dos serviços de IA. Para análises mais detalhadas e personalizadas, tente novamente mais tarde.*`;
}

// Função para gerar o prompt para o GPT-4
function generateAnalysisPrompt(campaignData, monthlyData) {
  // Formatar os dados das campanhas para melhor legibilidade
  const formattedCampaignData = campaignData.map(campaign => {
    return {
      nome: campaign.name,
      status: campaign.status,
      impressoes: campaign.impressions,
      cliques: campaign.clicks,
      ctr: campaign.ctr,
      conversoes: campaign.conversions,
      cpc: campaign.cpc,
      custoTotal: campaign.total_cost,
      roas: campaign.roas,
      orcamento: campaign.budget
    };
  });

  // Formatar os dados mensais
  const formattedMonthlyData = monthlyData.map(month => {
    return {
      mes: month.month,
      ano: month.year,
      impressoes: month.impressions,
      cliques: month.clicks,
      conversoes: month.conversions,
      custo: month.cost
    };
  });

  // Estruturar o prompt com os dados formatados
  return `
Analise os seguintes dados de campanhas de marketing digital:

## Dados das Campanhas:
${JSON.stringify(formattedCampaignData, null, 2)}

## Desempenho Mensal:
${JSON.stringify(formattedMonthlyData, null, 2)}

Forneça uma análise detalhada cobrindo:
1. Resumo geral do desempenho das campanhas
2. Identificação de problemas específicos (baixo CTR, alto CPC, ROAS inadequado, etc.)
3. Oportunidades de otimização e realocação de orçamento
4. Ações recomendadas em ordem de prioridade
5. Tendências observadas nos dados mensais

Estruture sua resposta em seções claras e responda em português do Brasil.
`;
}
