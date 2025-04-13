
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { ProblemsList } from "./ProblemsList";

type ProblemsPanelProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsPanel = ({ issues, suggestions }: ProblemsPanelProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between bg-red-50 dark:bg-red-900/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Possíveis Problemas Identificados
          </CardTitle>
          <CardDescription>Análise de pontos problemáticos na campanha e funil</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ProblemsList issues={issues} suggestions={suggestions} />
      </CardContent>
    </Card>
  );
};
