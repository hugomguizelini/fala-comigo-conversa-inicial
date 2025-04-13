
import React from "react";
import { TrendingUp, Target, ArrowRight } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { SuggestionItem } from "./SuggestionItem";

type SuggestionsListProps = {
  campaignSuggestions: Suggestion[];
  funnelSuggestions: Suggestion[];
};

export const SuggestionsList = ({ campaignSuggestions, funnelSuggestions }: SuggestionsListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-500" />
          Otimizações para Campanha
        </h3>
        <div className="space-y-3">
          {campaignSuggestions.map((suggestion, index) => (
            <SuggestionItem key={index} suggestion={suggestion} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          Otimizações para Funil
        </h3>
        <div className="space-y-3">
          {funnelSuggestions.map((suggestion, index) => (
            <SuggestionItem key={index} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
};
