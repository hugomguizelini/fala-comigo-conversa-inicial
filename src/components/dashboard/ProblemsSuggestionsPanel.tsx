
import React from "react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { ProblemsPanel } from "./problems-suggestions/ProblemsPanel";
import { SuggestionsPanel } from "./problems-suggestions/SuggestionsPanel";

type ProblemsSuggestionsPanelProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsSuggestionsPanel = ({ issues, suggestions }: ProblemsSuggestionsPanelProps) => {
  return (
    <div className="space-y-6">
      <ProblemsPanel issues={issues} suggestions={suggestions} />
      <SuggestionsPanel suggestions={suggestions} />
    </div>
  );
};
