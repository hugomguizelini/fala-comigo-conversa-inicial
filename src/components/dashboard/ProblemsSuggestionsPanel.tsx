
import React, { useState } from "react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { ProblemsPanel } from "./problems-suggestions/ProblemsPanel";
import { SuggestionsPanel } from "./problems-suggestions/SuggestionsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Lightbulb } from "lucide-react";

type ProblemsSuggestionsPanelProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsSuggestionsPanel = ({ issues, suggestions }: ProblemsSuggestionsPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("problems");
  
  // Calcular o número total de problemas e sugestões para exibir nos badges
  const totalIssues = issues.length;
  const totalSuggestions = suggestions.campaign.length + suggestions.funnel.length;
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="problems" className="flex justify-center items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Problemas</span>
            {totalIssues > 0 && (
              <span className="ml-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
                {totalIssues}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex justify-center items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>Sugestões</span>
            {totalSuggestions > 0 && (
              <span className="ml-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                {totalSuggestions}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="problems">
          <ProblemsPanel issues={issues} suggestions={suggestions} />
        </TabsContent>
        <TabsContent value="suggestions">
          <SuggestionsPanel suggestions={suggestions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
