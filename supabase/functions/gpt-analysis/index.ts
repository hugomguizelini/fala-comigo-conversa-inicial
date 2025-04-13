
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
  const { message, campaignData, monthlyData, metrics, issues, suggestions, previousMessages = [] } = requestData;
  
  // Construir contexto com os dados disponíveis
  const contextPrompt = `
Você é um assistente especializado em marketing digital, com foco em análise de campanhas publicitárias.

CONTEXTO ATUAL:
${campaignData ? `- Dados de ${campaignData.length} campanhas disponíveis` : '- Não há dados de campanhas disponíveis'}
${monthlyData ? `- Dados de desempenho mensal de ${monthlyData.length} meses disponíveis` : '- Não há dados mensais disponíveis'}
${issues ? `- ${issues.length} problemas identificados nas campanhas` : '- Nenhum problema identificado'}
${suggestions ? `- ${suggestions.campaign?.length || 0} sugestões para campanhas, ${suggestions.funnel?.length || 0} sugestões para funil` : '- Nenhuma sugestão disponível'}

SUAS RESPONSABILIDADES:
1. Ajudar o usuário a entender seus dados de marketing
2. Sugerir melhorias específicas baseadas nos dados disponíveis
3. Responder dúvidas sobre estratégias de marketing digital
4. Fornecer recomendações práticas e acionáveis
5. Sempre ser útil, profissional e direto nas suas respostas

REGRAS:
- Se você não sabe algo, admita isso claramente
- Concentre-se em dados e métricas reais, evite generalidades quando dados específicos estiverem disponíveis
- Priorize sugestões de alto impacto que possam trazer resultados rápidos
- Sempre indique o raciocínio por trás das suas recomendações
- Dê exemplos concretos e instruções passo a passo quando possível
`;

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
      totalCost += campaign.total_cost || 0;
    });
    
    // Identificar melhores e piores campanhas por ROAS se disponível
    const sortedCampaigns = [...campaignData].sort((a, b) => (b.roas || 0) - (a.roas || 0));
    bestCampaigns = sortedCampaigns.slice(0, 2).map(c => c.name);
    worstCampaigns = sortedCampaigns.slice(-2).map(c => c.name);
  }

  // Construir análise de fallback
  return `# Análise de Campanhas (Modo Offline)

## Resumo Geral
Analisamos ${campaignData ? campaignData.length : 0} campanhas com um total de ${totalImpressions} impressões, ${totalClicks} cliques e ${totalConversions} conversões. O custo total foi de ${totalCost.toFixed(2)}.

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

Estruture sua resposta em seções claras.
`;
}
