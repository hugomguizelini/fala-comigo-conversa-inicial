
import React from "react";
import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles, AlertTriangle } from "lucide-react";

type DialogHeaderProps = {
  onClose: () => void;
  fallbackMode: boolean;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ onClose, fallbackMode }) => {
  return (
    <UIDialogHeader className="p-4 border-b relative">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${fallbackMode ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} flex items-center justify-center`}>
          {fallbackMode ? (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          ) : (
            <Sparkles className="h-5 w-5 text-purple-600" />
          )}
        </div>
        <DialogTitle>
          {fallbackMode ? 'Assistente de Marketing (Modo Contingência)' : 'Assistente de Marketing IA'}
        </DialogTitle>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="h-8 w-8 absolute right-4 top-4"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </Button>
    </UIDialogHeader>
  );
};

export default DialogHeader;
