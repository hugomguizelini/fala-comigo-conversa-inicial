
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Lightbulb, ArrowRight, TrendingDown, TrendingUp, Target } from "lucide-react";

type Problem = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  relatedMetric: string;
};

type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  relatedProblem: string;
  relatedArea: "campanha" | "funil" | "ambos";
};

const problems: Problem[] = [
  {
    id: "p1",
    title: "Taxa de cliques em queda",
    description: "A CTR diminuiu 1.8% em comparação ao período anterior, indicando possível perda de relevância dos anúncios.",
    severity: "medium",
    relatedMetric: "CTR",
  },
  {
    id: "p2",
    title: "Custo por clique elevado",
    description: "Embora o CPC tenha diminuído, o valor ainda está acima do ideal para o setor, afetando o ROI da campanha.",
    severity: "high",
    relatedMetric: "CPC",
  },
  {
    id: "p3",
    title: "Taxa de conversão abaixo do esperado",
    description: "Embora as conversões tenham aumentado em número, a taxa de conversão (conversões/cliques) está abaixo do benchmark do setor.",
    severity: "high",
    relatedMetric: "Conversões",
  }
];

const suggestions: Suggestion[] = [
  {
    id: "s1",
    title: "Revisar textos e criativos dos anúncios",
    description: "Atualize os textos e imagens dos anúncios para melhorar a relevância e aumentar o CTR. Teste diferentes chamadas para ação e propostas de valor.",
    impact: "high",
    relatedProblem: "p1",
    relatedArea: "campanha",
  },
  {
    id: "s2",
    title: "Segmentar audiência com mais precisão",
    description: "Refine os critérios de segmentação para atingir pessoas com maior probabilidade de interesse no produto, diminuindo o CPC e aumentando a relevância.",
    impact: "high",
    relatedProblem: "p2",
    relatedArea: "campanha",
  },
  {
    id: "s3",
    title: "Otimizar página de destino",
    description: "Melhore a experiência de usuário e velocidade de carregamento da página de destino. Certifique-se que a proposta de valor está clara e que há um caminho óbvio para a conversão.",
    impact: "high",
    relatedProblem: "p3",
    relatedArea: "funil",
  },
  {
    id: "s4",
    title: "Implementar remarketing para visitantes",
    description: "Crie campanhas específicas para pessoas que visitaram o site mas não converteram. Ofereça incentivos para completarem a ação desejada.",
    impact: "medium",
    relatedProblem: "p3",
    relatedArea: "ambos",
  },
  {
    id: "s5",
    title: "Ajustar lances por palavra-chave",
    description: "Revise os lances por palavras-chave, aumentando em termos que geram mais conversões e diminuindo ou pausando os que geram cliques mas poucas conversões.",
    impact: "medium",
    relatedProblem: "p2",
    relatedArea: "campanha",
  }
];

export const ProblemsSuggestionsPanel = () => {
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
            {problems.map((problem) => (
              <AccordionItem key={problem.id} value={problem.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    {problem.severity === "high" ? (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    ) : problem.severity === "medium" ? (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <span>{problem.title}</span>
                    <span className="text-xs text-muted-foreground ml-3">Relacionado a: {problem.relatedMetric}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-5 pr-5 pt-2 pb-4">
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                    
                    {/* Suggestions related to this problem */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Sugestões relacionadas</h4>
                      {suggestions
                        .filter(suggestion => suggestion.relatedProblem === problem.id)
                        .map(suggestion => (
                          <div key={suggestion.id} className="flex items-start gap-2 mb-3">
                            <div className="mt-0.5">
                              <Lightbulb className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium">{suggestion.title}</h5>
                              <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs ${
                                  suggestion.relatedArea === "campanha" 
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
                                    : suggestion.relatedArea === "funil" 
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                } px-2 py-0.5 rounded-full`}>
                                  {suggestion.relatedArea === "campanha" ? "Campanha" : 
                                   suggestion.relatedArea === "funil" ? "Funil" : "Ambos"}
                                </span>
                                <span className={`text-xs ${
                                  suggestion.impact === "high" 
                                    ? "text-red-500" 
                                    : suggestion.impact === "medium" 
                                      ? "text-amber-500"
                                      : "text-blue-500"
                                }`}>
                                  Impacto {suggestion.impact === "high" ? "alto" : suggestion.impact === "medium" ? "médio" : "baixo"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
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
                {suggestions
                  .filter(s => s.relatedArea === "campanha" || s.relatedArea === "ambos")
                  .map(s => (
                    <div key={s.id} className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${
                          s.impact === "high" ? "text-red-500" : 
                          s.impact === "medium" ? "text-amber-500" : "text-blue-500"
                        }`}>
                          Impacto {s.impact === "high" ? "alto" : s.impact === "medium" ? "médio" : "baixo"}
                        </span>
                        <button className="text-xs text-purple-600 flex items-center">
                          Implementar <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
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
                {suggestions
                  .filter(s => s.relatedArea === "funil" || s.relatedArea === "ambos")
                  .map(s => (
                    <div key={s.id} className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${
                          s.impact === "high" ? "text-red-500" : 
                          s.impact === "medium" ? "text-amber-500" : "text-blue-500"
                        }`}>
                          Impacto {s.impact === "high" ? "alto" : s.impact === "medium" ? "médio" : "baixo"}
                        </span>
                        <button className="text-xs text-purple-600 flex items-center">
                          Implementar <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
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
