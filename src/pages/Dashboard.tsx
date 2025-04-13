
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";
import AiChatDialog from "@/components/ai/AiChatDialog";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState<GptAnalysisResult | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  // Abrir o chat com análise inicial
  const handleOpenChat = (analysis: GptAnalysisResult | null) => {
    console.log("Abrindo chat com análise:", analysis ? "disponível" : "não disponível");
    setInitialAnalysis(analysis);
    setChatOpen(true);
  };

  // Função simulada para o envio de mensagem (sem fazer chamadas reais à API)
  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoadingChat(true);
    
    try {
      // Simulando uma pequena demora para parecer mais realista
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resposta simulada
      return "Esta é uma resposta simulada para demonstrar a interface do chat. Em uma implementação completa, esta mensagem viria da API.";
    } finally {
      setIsLoadingChat(false);
    }
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
