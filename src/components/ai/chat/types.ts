
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type AiChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAnalysis: GptAnalysisResult | null;
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
  fallbackMode?: boolean;
};

// Adicionando um tipo para o contexto do chat
export type ChatContext = {
  campaignData?: any[] | null;
  monthlyData?: any[] | null;
  metrics?: any | null;
  issues?: any[] | null;
  suggestions?: any | null;
};
