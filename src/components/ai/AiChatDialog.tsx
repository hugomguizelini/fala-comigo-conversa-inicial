
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, X, Sparkles } from "lucide-react";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type AiChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAnalysis: GptAnalysisResult | null;
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
};

const AiChatDialog: React.FC<AiChatDialogProps> = ({
  open,
  onOpenChange,
  initialAnalysis,
  onSendMessage,
  isLoading
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

      setMessages(initialMessages);
    }
  }, [open, initialAnalysis]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Sugestões de perguntas para ajudar o usuário
  const questionSuggestions = [
    "Quais campanhas têm o pior desempenho?",
    "Como posso melhorar meu CTR?",
    "Qual seria a melhor distribuição de orçamento?",
    "Que mudanças posso fazer para aumentar conversões?",
    "Quais são os principais problemas nas minhas campanhas?"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] flex flex-col p-0 gap-0 rounded-xl">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <DialogTitle>Assistente de Marketing IA</DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 h-[400px]">
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex gap-3 max-w-[85%] ${
                    message.role === 'user' 
                      ? 'flex-row-reverse' 
                      : ''
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${
                    message.role === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : message.role === 'system' 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : 'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Bot className="h-5 w-5 text-purple-600" />
                    )}
                  </Avatar>
                  
                  <div className={`rounded-lg p-3 text-sm ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.role === 'system' 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}>
                    {message.role === 'assistant' || message.role === 'system' ? (
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <div className="text-[10px] text-right mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {messages.length === 2 && (
              <div className="mt-2 mb-4">
                <p className="text-sm text-center text-muted-foreground mb-2">Experimente perguntar:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {questionSuggestions.map((question, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setInput(question);
                        inputRef.current?.focus();
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta sobre campanhas, métricas ou otimizações..."
                className="resize-none min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={2}
              />
            </div>
            <Button 
              onClick={handleSend} 
              disabled={sending || !input.trim() || isLoading} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              {sending || isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isLoading && (
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Processando sua mensagem...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog;
