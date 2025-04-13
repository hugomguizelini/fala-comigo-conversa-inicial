
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Issue } from '@/types/dataTypes';
import { Skeleton } from '@/components/ui/skeleton';

type IssuesPanelProps = {
  issues: Issue[];
  isLoading: boolean;
};

const IssuesPanel: React.FC<IssuesPanelProps> = ({ issues, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Problemas Identificados</span>
            <span className="inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium h-5 px-2 ml-auto">
              {issues.length}
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
        ) : issues.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhum problema identificado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {issues.slice(0, 3).map((issue, index) => (
              <div 
                key={index} 
                className="p-3 border rounded-md bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30"
              >
                <h4 className="font-medium text-sm">{issue.issue}</h4>
                <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
              </div>
            ))}
            {issues.length > 3 && (
              <div className="text-center mt-2">
                <a href="#" className="text-xs text-primary hover:underline">
                  Ver todos os {issues.length} problemas
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IssuesPanel;
