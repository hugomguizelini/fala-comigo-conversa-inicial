
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
