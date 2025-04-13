
import React from "react";
import { ArrowRight } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { getImpactClass } from "./utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SuggestionItemProps = {
  suggestion: Suggestion;
};

// Função para simplificar os nomes das campanhas
const simplifyName = (name: string): string => {
  const parts = name.split(/[-_.]/);
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return name.length > 15 ? name.substring(0, 15) + "..." : name;
};

export const SuggestionItem = ({ suggestion }: SuggestionItemProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors">
      <h4 className="text-sm font-medium mb-1">{suggestion.title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs flex items-center ${getImpactClass(suggestion.impact)}`}>
            Impacto {suggestion.impact}
          </span>
          
          {suggestion.type && (
            <span className={`text-xs ${
              suggestion.type === "campaign" 
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            } px-2 py-0.5 rounded-full`}>
              {suggestion.type === "campaign" ? "Campanha" : "Funil"}
            </span>
          )}
        </div>
        
        <Button size="sm" variant="ghost" className="text-xs text-purple-600 h-auto p-1">
          <span>Implementar</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      {suggestion.target_campaigns && suggestion.target_campaigns.length > 0 && (
        <div className="mt-3 pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Campanhas alvo:</p>
          <div className="flex flex-wrap gap-1">
            <TooltipProvider>
              {suggestion.target_campaigns.slice(0, 3).map((campaign, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
                      {simplifyName(campaign)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{campaign}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {suggestion.target_campaigns.length > 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      +{suggestion.target_campaigns.length - 3} mais
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs max-w-[250px]">
                      {suggestion.target_campaigns.slice(3).join(", ")}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {suggestion.target_pages && suggestion.target_pages.length > 0 && (
        <div className="mt-3 pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Páginas alvo:</p>
          <div className="flex flex-wrap gap-1">
            {suggestion.target_pages.map((page, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {page}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {suggestion.target_audience && (
        <div className="mt-3 pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Público-alvo:</p>
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
            {suggestion.target_audience}
          </span>
        </div>
      )}
    </div>
  );
};
