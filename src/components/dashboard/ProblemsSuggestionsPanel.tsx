
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Lightbulb, ArrowRight, TrendingDown, TrendingUp, Target } from "lucide-react";
import { Issue, Suggestion } from "@/types/dataTypes";

type ProblemsSuggestionsPanelProps = {
  issues: Issue[];
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const ProblemsSuggestionsPanel = ({ issues, suggestions }: ProblemsSuggestionsPanelProps) => {
  const getSeverity = (issue: Issue) => {
    if (issue.related_to === "Conversões") return "high";
    if (issue.related_to === "CPC") return "high";
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
  
  // Adicionando verificação para evitar erros quando suggestions.campaign ou suggestions.funnel forem undefined
  const campaignSuggestions = suggestions?.campaign || [];
  const funnelSuggestions = suggestions?.funnel || [];

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
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Sugestões relacionadas</h4>
                        {[...campaignSuggestions, ...funnelSuggestions]
                          .filter(suggestion => 
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
                {campaignSuggestions.map((suggestion, index) => (
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
                    {suggestion.target_campaigns && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Campanhas alvo:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.target_campaigns.map((campaign, idx) => (
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
                {funnelSuggestions.map((suggestion, index) => (
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
                    {suggestion.target_pages && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Páginas alvo:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.target_pages.map((page, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                              {page}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {suggestion.target_audience && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Público-alvo:</p>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                          {suggestion.target_audience}
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
