
import React from "react";
import { TrendingUp, Target } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { SuggestionItem } from "./SuggestionItem";

type SuggestionsListProps = {
  campaignSuggestions: Suggestion[];
  funnelSuggestions: Suggestion[];
  showHeaders?: boolean;
};

export const SuggestionsList = ({ 
  campaignSuggestions, 
  funnelSuggestions,
  showHeaders = true 
}: SuggestionsListProps) => {
  const hasCampaignSuggestions = campaignSuggestions.length > 0;
  const hasFunnelSuggestions = funnelSuggestions.length > 0;
  
  if (!hasCampaignSuggestions && !hasFunnelSuggestions) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Nenhuma sugestão encontrada com os filtros atuais.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {hasCampaignSuggestions && (
        <div>
          {showHeaders && (
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Otimizações para Campanha
            </h3>
          )}
          <div className="grid gap-4">
            {campaignSuggestions.map((suggestion, index) => (
              <SuggestionItem key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}
      
      {hasFunnelSuggestions && (
        <div>
          {showHeaders && (
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Otimizações para Funil
            </h3>
          )}
          <div className="grid gap-4">
            {funnelSuggestions.map((suggestion, index) => (
              <SuggestionItem key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
