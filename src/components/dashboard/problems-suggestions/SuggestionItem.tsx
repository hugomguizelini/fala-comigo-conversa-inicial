
import React from "react";
import { ArrowRight, Target, ChartLine, Users, ArrowUpRight, HelpCircle } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { getImpactClass } from "./utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  // Definir ícone com base no tipo de sugestão
  const renderIcon = () => {
    if (suggestion.title.toLowerCase().includes("segmentação")) {
      return <Users className="h-4 w-4 text-blue-500" />;
    } else if (suggestion.title.toLowerCase().includes("teste")) {
      return <Target className="h-4 w-4 text-purple-500" />;
    } else if (suggestion.title.toLowerCase().includes("orçamento")) {
      return <ChartLine className="h-4 w-4 text-green-500" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'alto':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"; 
      case 'médio':
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case 'baixo':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-card border shadow-sm p-4 rounded-lg hover:border-primary/20 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {renderIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-1">{suggestion.title}</h4>
          <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <span className={cn("text-xs flex items-center px-2 py-0.5 rounded-full", getImpactBadge(suggestion.impact))}>
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="text-xs h-7 px-2">
                    <span>Implementar</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Aplicar esta sugestão às suas campanhas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {suggestion.target_campaigns && suggestion.target_campaigns.length > 0 && (
            <div className="mt-3 pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Campanhas alvo:
              </p>
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
      </div>
    </div>
  );
};
