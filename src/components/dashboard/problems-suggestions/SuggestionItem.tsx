
import React from "react";
import { ArrowRight } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { getImpactClass } from "./utils";

type SuggestionItemProps = {
  suggestion: Suggestion;
};

export const SuggestionItem = ({ suggestion }: SuggestionItemProps) => {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <h4 className="text-sm font-medium">{suggestion.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs ${getImpactClass(suggestion.impact)}`}>
          Impacto {suggestion.impact}
        </span>
        <button className="text-xs text-purple-600 flex items-center">
          Implementar <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>
      
      {suggestion.target_campaigns && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Campanhas alvo:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {suggestion.target_campaigns.map((campaign, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
                {campaign.split('-').pop()}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {suggestion.target_pages && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Páginas alvo:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {suggestion.target_pages.map((page, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {page}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {suggestion.target_audience && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Público-alvo:</p>
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
            {suggestion.target_audience}
          </span>
        </div>
      )}
    </div>
  );
};
