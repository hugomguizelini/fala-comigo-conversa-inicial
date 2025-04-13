
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type SuggestionsPanelProps = {
  suggestions: {
    campaign: any[];
    funnel: any[];
  };
  isLoading: boolean;
};

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions, isLoading }) => {
  // Combinando sugestões de campanha e funil
  const allSuggestions = [
    ...(suggestions.campaign || []).map(s => ({ ...s, type: 'campaign' })),
    ...(suggestions.funnel || []).map(s => ({ ...s, type: 'funnel' }))
  ];

  // Ordenando por impacto
  const sortedSuggestions = [...allSuggestions].sort((a, b) => {
    const impactOrder = { alto: 3, médio: 2, baixo: 1 };
    return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
  });

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'alto':
        return "bg-green-500 hover:bg-green-600";
      case 'médio':
        return "bg-blue-500 hover:bg-blue-600";
      case 'baixo':
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'campaign':
        return "Campanha";
      case 'funnel':
        return "Funil";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <CardTitle className="text-lg">Sugestões de Otimização</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : sortedSuggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhuma sugestão de otimização disponível.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSuggestions.slice(0, 5).map((suggestion, index) => (
              <div key={index} className="border-b pb-3 last:border-none last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <div className="flex gap-1">
                    <Badge variant="outline">{getTypeLabel(suggestion.type)}</Badge>
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                {suggestion.target_campaigns && suggestion.target_campaigns.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {suggestion.target_campaigns.map((campaign, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {campaign}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsPanel;
