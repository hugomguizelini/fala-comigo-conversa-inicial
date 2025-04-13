
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
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between bg-green-50 dark:bg-green-900/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Sugestões de Otimização
          </CardTitle>
          <CardDescription>Recomendações para melhorar o desempenho da campanha e do funil</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <SuggestionsList 
          campaignSuggestions={suggestions.campaign || []} 
          funnelSuggestions={suggestions.funnel || []} 
        />
      </CardContent>
    </Card>
  );
};
