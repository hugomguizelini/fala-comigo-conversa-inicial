
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import DialogHeader from "./chat/DialogHeader";
import SuggestionButtons from "./chat/SuggestionButtons";
import { Message } from "./chat/types";

// Question suggestions to help the user
const QUESTION_SUGGESTIONS = [
  "Quais campanhas têm o pior desempenho?",
  "Como posso melhorar meu CTR?",
  "Qual seria a melhor distribuição de orçamento?",
  "Que mudanças posso fazer para aumentar conversões?",
  "Quais são os principais problemas nas minhas campanhas?"
];

type AiChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAnalysis: GptAnalysisResult | null;
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
  fallbackMode?: boolean;
};

const AiChatDialog: React.FC<AiChatDialogProps> = ({
  open,
  onOpenChange,
  initialAnalysis,
  onSendMessage,
  isLoading,
  fallbackMode = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Initialize with system message and initial analysis if available
  useEffect(() => {
    if (open) {
      // Inicializar mensagens quando o chat é aberto
      let initialMessages: Message[] = [
        {
          role: 'system',
          content: 'Olá! Estou aqui para ajudar com suas campanhas de marketing.',
          timestamp: new Date()
        }
      ];

      // Adicionar a análise se disponível
      if (initialAnalysis && initialAnalysis.analysis) {
        initialMessages.push({
          role: 'assistant',
          content: `Baseado na análise dos seus dados, aqui estão minhas observações principais:\n\n${initialAnalysis.analysis}`,
          timestamp: new Date()
        });
        
        initialMessages.push({
          role: 'assistant',
          content: "Como posso ajudar a melhorar suas campanhas hoje? Você pode me perguntar sobre métricas específicas, solicitar recomendações para campanhas com baixo desempenho, ou pedir sugestões para melhorar o funil de conversão.",
          timestamp: new Date()
        });
      } else {
        // Mensagem padrão se não houver análise
        initialMessages.push({
          role: 'assistant',
          content: 'Estou pronto para ajudar com suas campanhas de marketing. Você pode me perguntar sobre otimização de campanhas, interpretação de métricas, problemas identificados ou solicitar recomendações personalizadas.',
          timestamp: new Date()
        });
      }

      // Adicionar alerta de modo fallback se necessário
      if (fallbackMode) {
        initialMessages.push({
          role: 'system',
          content: '⚠️ **Nota**: Estamos operando em modo de contingência devido a limitações temporárias da API. As respostas serão mais genéricas até que o serviço seja restaurado.',
          timestamp: new Date()
        });
      }

      setMessages(initialMessages);
    }
  }, [open, initialAnalysis, fallbackMode]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      // Get response from API
      const response = await onSendMessage(userMessage);

      // Add assistant response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Desculpe, tive um problema ao processar sua pergunta. Pode tentar novamente?",
        timestamp: new Date()
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] flex flex-col p-0 gap-0 rounded-xl">
        <DialogHeader onClose={() => onOpenChange(false)} fallbackMode={fallbackMode} />
        
        <MessageList messages={messages} fallbackMode={fallbackMode} />
        
        {messages.length === 2 && (
          <SuggestionButtons 
            suggestions={QUESTION_SUGGESTIONS} 
            onSelectSuggestion={handleSelectSuggestion} 
          />
        )}
        
        <MessageInput 
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={sending || isLoading}
          fallbackMode={fallbackMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog;
