
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

  // Chamar a IA e processar mensagem
  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoadingChat(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gpt-analysis', {
        body: {
          prompt: message,
          type: 'chat',
        },
      });
      
      if (error) {
        throw error;
      }
      
      return data.response || "Não consegui processar sua pergunta. Tente novamente.";
    } catch (error) {
      console.error("Error processing AI chat:", error);
      return "Desculpe, houve um erro ao processar sua pergunta. Tente novamente mais tarde.";
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Abrir o chat com análise inicial
  const handleOpenChat = (analysis: GptAnalysisResult | null) => {
    setInitialAnalysis(analysis);
    setChatOpen(true);
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
      <DashboardContent onOpenAiChat={handleOpenChat} />
      
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
