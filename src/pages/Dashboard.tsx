
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";
import AiChatDialog from "@/components/ai/AiChatDialog";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState<GptAnalysisResult | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant'|'system', content: string}[]>([]);
  const [chatContext, setChatContext] = useState<any>(null);
  
  // Abrir o chat com análise inicial
  const handleOpenChat = (analysis: GptAnalysisResult | null) => {
    console.log("Abrindo chat com análise:", analysis ? "disponível" : "não disponível");
    setInitialAnalysis(analysis);
    setChatOpen(true);
    
    // Armazenar o contexto atual para o chat
    if (chatContext === null) {
      // Será preenchido na primeira mensagem
      setChatContext({});
    }
  };

  // Função para enviar mensagem para a Edge Function
  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoadingChat(true);
    
    try {
      // Preparar o payload com a mensagem e contexto
      const payload = {
        type: 'chat',
        message: message,
        previousMessages: chatMessages,
        ...chatContext
      };

      // Chamar a função edge
      const { data, error } = await supabase.functions.invoke('gpt-analysis', {
        body: payload
      });
      
      if (error) {
        console.error("Erro ao processar mensagem:", error);
        throw new Error(`Falha ao processar mensagem: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || "Erro desconhecido no processamento da mensagem");
      }
      
      // Adicionar a nova mensagem ao histórico
      const newUserMessage = { role: 'user' as const, content: message };
      const newAssistantMessage = { role: 'assistant' as const, content: data.reply };
      setChatMessages(prev => [...prev, newUserMessage, newAssistantMessage]);
      
      return data.reply;
    } catch (error) {
      console.error("Erro no chat:", error);
      toast.error("Ocorreu um erro ao processar sua mensagem. Tente novamente.");
      return "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.";
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Atualizar o contexto do chat quando necessário
  const updateChatContext = (campaigns, monthlyData, metrics, issues, suggestions) => {
    setChatContext({
      campaignData: campaigns,
      monthlyData: monthlyData,
      metrics: metrics,
      issues: issues,
      suggestions: suggestions
    });
  };

  useEffect(() => {
    // Toast de boas-vindas com duração definida
    toast.info(
      "Bem-vindo ao Dashboard de Análise de Campanhas",
      {
        description: "Faça upload de arquivos CSV para visualizar insights e otimizações personalizadas para suas campanhas.",
        duration: 5000, // Reduzido para 5 segundos
        action: {
          label: "Explorar recursos",
          onClick: () => toast.info(
            "Novos recursos disponíveis!",
            {
              description: "Análise avançada com IA, filtros de impacto, e sugestões inteligentes baseadas em regras de gestores experientes de tráfego.",
              duration: 4000 // Também com duração reduzida
            }
          )
        }
      }
    );
  }, []);

  return (
    <DashboardLayout>
      <DashboardContent 
        onOpenAiChat={handleOpenChat} 
        onUpdateChatContext={updateChatContext}
      />
      
      <AiChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        initialAnalysis={initialAnalysis}
        onSendMessage={handleSendMessage}
        isLoading={isLoadingChat}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
