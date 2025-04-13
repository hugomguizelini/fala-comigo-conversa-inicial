
import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Lightbulb, ChevronRight } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { getImpactClass, getSeverity } from "./utils";
import { Badge } from "@/components/ui/badge";

type IssueItemProps = {
  issue: Issue;
  index: number;
  relatedSuggestions: Suggestion[];
};

// Função para simplificar os nomes das campanhas
const simplifyName = (name: string, maxLength = 15): string => {
  if (name.length <= maxLength) return name;
  
  // Tenta encontrar um separador como hífen ou ponto
  const parts = name.split(/[-_.]/);
  if (parts.length > 1) {
    // Se tem separadores, retorna a última parte significativa
    return parts[parts.length - 1];
  }
  
  // Se não tem separadores, trunca e adiciona ellipsis
  return name.substring(0, maxLength) + "...";
};

export const IssueItem = ({ issue, index, relatedSuggestions }: IssueItemProps) => {
  const severity = getSeverity(issue);

  return (
    <AccordionItem value={`issue-${index}`}>
      <AccordionTrigger className="hover:no-underline px-2 py-3">
        <div className="flex items-center gap-3 w-full text-left">
          <span className={`h-3 w-3 rounded-full flex-shrink-0 ${
            severity === "high" ? "bg-red-500" : 
            severity === "medium" ? "bg-amber-500" : 
            "bg-blue-500"
          }`} />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">{issue.issue}</span>
            <span className="text-xs text-muted-foreground">
              Relacionado a: {issue.related_to} • 
              {issue.affected_campaigns.length} {issue.affected_campaigns.length === 1 ? 'campanha afetada' : 'campanhas afetadas'}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-8 pr-5 pt-2 pb-4">
          <p className="text-sm mb-4">{issue.description}</p>
          
          {/* Campanhas afetadas - exibição simplificada */}
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2">Campanhas afetadas:</h4>
            <div className="flex flex-wrap gap-2">
              {issue.affected_campaigns.slice(0, 5).map((campaign, idx) => (
                <Badge key={idx} variant="outline" className="text-xs py-1">
                  {simplifyName(campaign)}
                </Badge>
              ))}
              {issue.affected_campaigns.length > 5 && (
                <Badge variant="outline" className="text-xs py-1 bg-muted/50">
                  +{issue.affected_campaigns.length - 5} mais
                </Badge>
              )}
            </div>
          </div>
          
          {/* Sugestões relacionadas */}
          {relatedSuggestions.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Sugestões relacionadas:</h4>
              <div className="grid gap-3">
                {relatedSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <h5 className="text-sm font-medium">{suggestion.title}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <span className={`text-xs ${
                        suggestion.type === "campaign"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      } px-2 py-0.5 rounded-full`}>
                        {suggestion.type === "campaign" ? "Campanha" : "Funil"}
                      </span>
                      <span className={`text-xs ${getImpactClass(suggestion.impact)}`}>
                        Impacto {suggestion.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
