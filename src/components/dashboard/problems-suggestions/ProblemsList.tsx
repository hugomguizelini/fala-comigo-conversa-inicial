
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { IssueItem } from "./IssueItem";

type ProblemsListProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsList = ({ issues, suggestions }: ProblemsListProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {issues.map((issue, index) => (
        <IssueItem 
          key={index} 
          issue={issue} 
          index={index}
          relatedSuggestions={[
            ...suggestions.campaign,
            ...suggestions.funnel
          ].filter(suggestion => 
            (suggestion.target_campaigns && 
              suggestion.target_campaigns.some(campaign => 
                issue.affected_campaigns.includes(campaign)
              )) ||
            (suggestion.target_pages && 
              issue.affected_campaigns.some(campaign => 
                suggestion.target_pages?.some(targetPage => 
                  campaign.includes(targetPage)
                )
              ))
          )}
        />
      ))}
    </Accordion>
  );
};
