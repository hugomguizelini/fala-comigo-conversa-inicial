
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";
import { ProblemsList } from "./ProblemsList";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

type ProblemsPanelProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsPanel = ({ issues, suggestions }: ProblemsPanelProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-red-50 dark:bg-red-900/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Possíveis Problemas Identificados
            </CardTitle>
            <CardDescription>
              {issues.length > 0 
                ? `${issues.length} ${issues.length === 1 ? 'problema' : 'problemas'} identificados nas suas campanhas e funil`
                : "Nenhum problema identificado nas suas campanhas e funil"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-full mb-3">
              <AlertTriangle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-medium text-lg mb-1">Tudo em ordem!</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Não identificamos problemas nas suas campanhas. Continue monitorando regularmente.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="issues">
            <TabsList className="hidden">
              <div></div>
            </TabsList>
            <TabsContent value="issues">
              <ProblemsList issues={issues} suggestions={suggestions} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
