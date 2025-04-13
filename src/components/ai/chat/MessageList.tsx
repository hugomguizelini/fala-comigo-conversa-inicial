
import React, { useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type MessageListProps = {
  messages: Message[];
  fallbackMode: boolean;
};

const MessageList: React.FC<MessageListProps> = ({ messages, fallbackMode }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
                    ? (fallbackMode ? 'bg-amber-100 dark:bg-amber-800/30' : 'bg-gray-100 dark:bg-gray-800') 
                    : (fallbackMode ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30')
              }`}>
                {message.role === 'user' ? (
                  <User className="h-5 w-5 text-blue-600" />
                ) : (
                  <Bot className={`h-5 w-5 ${fallbackMode ? 'text-amber-600' : 'text-purple-600'}`} />
                )}
              </Avatar>
              
              <div className={`rounded-lg p-3 text-sm ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : message.role === 'system' 
                    ? (fallbackMode ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200')
                    : (fallbackMode ? 'bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700')
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
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
