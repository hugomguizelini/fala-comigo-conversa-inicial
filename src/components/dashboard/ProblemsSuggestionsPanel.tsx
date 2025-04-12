
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Lightbulb, ArrowRight, TrendingDown, TrendingUp, Target } from "lucide-react";

type Issue = {
  issue: string;
  description: string;
  relatedTo: string;
  affectedCampaigns: string[];
};

type Suggestion = {
  title: string;
  description: string;
  impact: string;
  targetCampaigns?: string[];
  targetPages?: string[];
  targetAudience?: string;
};

type OptimizationSuggestions = {
  campaign: Suggestion[];
  funnel: Suggestion[];
};

type ProblemsSuggestionsPanelProps = {
  issues: Issue[];
  suggestions: OptimizationSuggestions;
};

export const ProblemsSuggestionsPanel = ({ issues, suggestions }: ProblemsSuggestionsPanelProps) => {
  const getSeverity = (issue: Issue) => {
    if (issue.relatedTo === "Conversões") return "high";
    if (issue.relatedTo === "CPC") return "high";
    return "medium";
  };
  
  const getImpactClass = (impact: string) => {
    switch(impact.toLowerCase()) {
      case "alto": return "text-red-500";
      case "médio": return "text-amber-500";
      case "baixo": return "text-blue-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
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
          <Accordion type="single" collapsible className="w-full">
            {issues.map((issue, index) => {
              const severity = getSeverity(issue);
              return (
                <AccordionItem key={index} value={`issue-${index}`}>
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
                      <span className="text-xs text-muted-foreground ml-3">Relacionado a: {issue.relatedTo}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-5 pr-5 pt-2 pb-4">
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      
                      {/* Campanhas afetadas */}
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Campanhas afetadas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {issue.affectedCampaigns.map((campaign, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {campaign}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sugestões relacionadas */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Sugestões relacionadas</h4>
                        {[...suggestions.campaign, ...suggestions.funnel]
                          .filter(suggestion => 
                            (suggestion.targetCampaigns && 
                             suggestion.targetCampaigns.some(campaign => 
                               issue.affectedCampaigns.includes(campaign)
                             )) ||
                            (suggestion.targetPages && 
                             issue.affectedCampaigns.some(campaign => 
                               campaign.includes(suggestion.targetPages?.some(page => campaign.includes(page)) ? page : '')
                             ))
                          )
                          .map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-2 mb-3">
                              <div className="mt-0.5">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">{suggestion.title}</h5>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs ${
                                    suggestion.targetCampaigns 
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                                      : suggestion.targetPages 
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  } px-2 py-0.5 rounded-full`}>
                                    {suggestion.targetCampaigns ? "Campanha" : 
                                     suggestion.targetPages ? "Funil" : "Ambos"}
                                  </span>
                                  <span className={`text-xs ${getImpactClass(suggestion.impact)}`}>
                                    Impacto {suggestion.impact}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between bg-green-50 dark:bg-green-900/20">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Sugestões de Otimização
            </CardTitle>
            <CardDescription>Recomendações para melhorar o desempenho da campanha e do funil</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Otimizações para Campanha
              </h3>
              <div className="space-y-3">
                {suggestions.campaign.map((suggestion, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
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
                    {suggestion.targetCampaigns && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Campanhas alvo:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.targetCampaigns.map((campaign, idx) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
                              {campaign.split('-').pop()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Otimizações para Funil
              </h3>
              <div className="space-y-3">
                {suggestions.funnel.map((suggestion, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
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
                    {suggestion.targetPages && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Páginas alvo:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.targetPages.map((page, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                              {page}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {suggestion.targetAudience && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Público-alvo:</p>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                          {suggestion.targetAudience}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
