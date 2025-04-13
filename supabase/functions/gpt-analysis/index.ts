import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        throw new Error(`OpenAI API error: ${data.error.message}`);
      }

      const analysis = data.choices[0].message.content;

      // Return the analysis
      return new Response(JSON.stringify({
        success: true,
        analysis: analysis,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
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

  // Fazer chamada à API OpenAI
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
      throw new Error(`OpenAI API error: ${data.error.message}`);
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
    throw error;
  }
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
