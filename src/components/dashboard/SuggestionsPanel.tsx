
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type SuggestionsPanelProps = {
  suggestions: {
    campaign: any[];
    funnel: any[];
  };
  isLoading: boolean;
};

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions, isLoading }) => {
  const totalSuggestions = suggestions.campaign.length + suggestions.funnel.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>Sugestões de Otimização</span>
            <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium h-5 px-2 ml-auto">
              {totalSuggestions}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : totalSuggestions === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhuma sugestão encontrada</p>
          </div>
        ) : (
          <Tabs defaultValue="campaign">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="campaign">Campanhas</TabsTrigger>
              <TabsTrigger value="funnel">Funil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaign">
              <div className="space-y-2">
                {suggestions.campaign.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-md bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        suggestion.impact === "alto" 
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}>
                        {suggestion.impact}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                ))}
                {suggestions.campaign.length > 3 && (
                  <div className="text-center mt-2">
                    <a href="#" className="text-xs text-primary hover:underline">
                      Ver todas as {suggestions.campaign.length} sugestões
                    </a>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="funnel">
              <div className="space-y-2">
                {suggestions.funnel.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        suggestion.impact === "alto" 
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}>
                        {suggestion.impact}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                ))}
                {suggestions.funnel.length > 3 && (
                  <div className="text-center mt-2">
                    <a href="#" className="text-xs text-primary hover:underline">
                      Ver todas as {suggestions.funnel.length} sugestões
                    </a>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsPanel;
