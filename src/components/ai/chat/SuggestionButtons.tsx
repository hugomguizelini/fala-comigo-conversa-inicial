
import React from "react";
import { Button } from "@/components/ui/button";

type SuggestionButtonsProps = {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
};

const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ 
  suggestions, 
  onSelectSuggestion 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 mb-4">
      <p className="text-sm text-center text-muted-foreground mb-2">Experimente perguntar:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((question, idx) => (
          <Button 
            key={idx}
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => onSelectSuggestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionButtons;
