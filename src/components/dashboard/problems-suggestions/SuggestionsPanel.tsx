
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lightbulb, Filter, TrendingUp, Target, ChevronDown } from "lucide-react";
import { Suggestion } from "@/types/dataTypes";
import { SuggestionsList } from "./SuggestionsList";
import { SuggestionItem } from "./SuggestionItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SuggestionsPanelProps = {
  suggestions: {
    campaign: Suggestion[];
    funnel: Suggestion[];
  };
};

export const SuggestionsPanel = ({ suggestions }: SuggestionsPanelProps) => {
  const totalSuggestions = suggestions.campaign.length + suggestions.funnel.length;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string[]>(["alto", "médio", "baixo"]);
  
  // Filtrar sugestões com base no impacto selecionado
  const filterSuggestions = (sugs: Suggestion[]) => {
    return sugs.filter(s => impactFilter.includes(s.impact.toLowerCase()));
  };
  
  const filteredCampaignSuggestions = filterSuggestions(suggestions.campaign);
  const filteredFunnelSuggestions = filterSuggestions(suggestions.funnel);
  const totalFilteredSuggestions = filteredCampaignSuggestions.length + filteredFunnelSuggestions.length;
  
  const handleImpactFilterChange = (impact: string) => {
    setImpactFilter(current =>
      current.includes(impact)
        ? current.filter(i => i !== impact)
        : [...current, impact]
    );
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Sugestões de Otimização
            </CardTitle>
            <CardDescription>
              {totalSuggestions > 0 
                ? `${totalFilteredSuggestions} de ${totalSuggestions} ${totalSuggestions === 1 ? 'sugestão' : 'sugestões'} para melhorar o desempenho`
                : "Nenhuma sugestão disponível no momento"}
            </CardDescription>
          </div>
          
          {totalSuggestions > 0 && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filtrar
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filtrar por impacto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={impactFilter.includes("alto")}
                    onCheckedChange={() => handleImpactFilterChange("alto")}
                  >
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      Alto impacto
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={impactFilter.includes("médio")}
                    onCheckedChange={() => handleImpactFilterChange("médio")}
                  >
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                      Médio impacto
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={impactFilter.includes("baixo")}
                    onCheckedChange={() => handleImpactFilterChange("baixo")}
                  >
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                      Baixo impacto
                    </span>
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {totalSuggestions === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-full mb-3">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium text-lg mb-1">Sem sugestões disponíveis</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Não temos sugestões de otimização no momento. Continue monitorando suas campanhas para futuras recomendações.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                Todas ({filteredCampaignSuggestions.length + filteredFunnelSuggestions.length})
              </TabsTrigger>
              <TabsTrigger value="campaign">
                Campanhas ({filteredCampaignSuggestions.length})
              </TabsTrigger>
              <TabsTrigger value="funnel">
                Funil ({filteredFunnelSuggestions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <SuggestionsList
                campaignSuggestions={filteredCampaignSuggestions}
                funnelSuggestions={filteredFunnelSuggestions}
                showHeaders={true}
              />
            </TabsContent>
            
            <TabsContent value="campaign" className="mt-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Otimizações para Campanha
                </h3>
                <div className="grid gap-4 md:grid-cols-1">
                  {filteredCampaignSuggestions.map((suggestion, index) => (
                    <SuggestionItem key={index} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="funnel" className="mt-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Otimizações para Funil
                </h3>
                <div className="grid gap-4 md:grid-cols-1">
                  {filteredFunnelSuggestions.map((suggestion, index) => (
                    <SuggestionItem key={index} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      {totalFilteredSuggestions === 0 && totalSuggestions > 0 && (
        <CardFooter className="text-center text-sm text-muted-foreground border-t bg-muted/50 py-3">
          Nenhuma sugestão encontrada com os filtros atuais. Tente ajustar seus filtros.
        </CardFooter>
      )}
    </Card>
  );
};
