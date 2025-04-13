
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { SuggestionsList } from "./SuggestionsList";

type SuggestionsPanelProps = {
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const SuggestionsPanel = ({ suggestions }: SuggestionsPanelProps) => {
  const totalSuggestions = suggestions.campaign.length + suggestions.funnel.length;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Sugestões de Otimização
            </CardTitle>
            <CardDescription>
              {totalSuggestions > 0 
                ? `${totalSuggestions} ${totalSuggestions === 1 ? 'sugestão' : 'sugestões'} para melhorar o desempenho de campanhas e funil`
                : "Nenhuma sugestão disponível no momento"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {totalSuggestions === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-full mb-3">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-1">Sem sugestões disponíveis</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Não temos sugestões de otimização no momento. Continue monitorando suas campanhas para futuras recomendações.
            </p>
          </div>
        ) : (
          <SuggestionsList 
            campaignSuggestions={suggestions.campaign || []} 
            funnelSuggestions={suggestions.funnel || []} 
          />
        )}
      </CardContent>
    </Card>
  );
};
