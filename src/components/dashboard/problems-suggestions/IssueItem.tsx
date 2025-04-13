
import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { getImpactClass, getSeverity } from "./utils";

type IssueItemProps = {
  issue: Issue;
  index: number;
  relatedSuggestions: Suggestion[];
};

export const IssueItem = ({ issue, index, relatedSuggestions }: IssueItemProps) => {
  const severity = getSeverity(issue);

  return (
    <AccordionItem value={`issue-${index}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          {severity === "high" ? (
            <span className="h-2 w-2 rounded-full bg-red-500" />
          ) : severity === "medium" ? (
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          )}
          <span>{issue.issue}</span>
          <span className="text-xs text-muted-foreground ml-3">Relacionado a: {issue.related_to}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-5 pr-5 pt-2 pb-4">
          <p className="text-sm text-muted-foreground">{issue.description}</p>
          
          {/* Campanhas afetadas */}
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2">Campanhas afetadas:</h4>
            <div className="flex flex-wrap gap-2">
              {issue.affected_campaigns.map((campaign, idx) => (
                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {campaign}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sugestões relacionadas */}
          {relatedSuggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Sugestões relacionadas</h4>
              {relatedSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2 mb-3">
                  <div className="mt-0.5">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{suggestion.title}</h5>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${
                        suggestion.target_campaigns 
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                          : suggestion.target_pages 
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      } px-2 py-0.5 rounded-full`}>
                        {suggestion.target_campaigns ? "Campanha" : 
                         suggestion.target_pages ? "Funil" : "Ambos"}
                      </span>
                      <span className={`text-xs ${getImpactClass(suggestion.impact)}`}>
                        Impacto {suggestion.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
