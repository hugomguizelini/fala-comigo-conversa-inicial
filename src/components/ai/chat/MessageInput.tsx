
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type MessageInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
  isLoading: boolean;
  fallbackMode: boolean;
};

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  fallbackMode
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input on component mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={fallbackMode 
              ? "Modo de contingência ativado. Perguntas simples funcionam melhor..."
              : "Digite sua pergunta sobre campanhas, métricas ou otimizações..."
            }
            className={`resize-none min-h-[60px] w-full rounded-md border ${
              fallbackMode ? 'border-amber-300 dark:border-amber-700' : 'border-input'
            } bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
            rows={2}
          />
        </div>
        <Button 
          onClick={onSend} 
          disabled={isLoading || !input.trim()} 
          className={fallbackMode ? "bg-amber-600 hover:bg-amber-700" : "bg-purple-600 hover:bg-purple-700"}
        >
          {isLoading ? (
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
      {fallbackMode && (
        <p className="text-xs text-center mt-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-1 rounded">
          ⚠️ Modo de contingência ativado devido a limitações da API. Respostas simplificadas.
        </p>
      )}
    </div>
  );
};

export default MessageInput;
