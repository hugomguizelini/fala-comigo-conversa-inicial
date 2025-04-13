
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Issue } from "@/types/dataTypes";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type IssuesPanelProps = {
  issues: Issue[];
  isLoading: boolean;
};

const IssuesPanel: React.FC<IssuesPanelProps> = ({ issues, isLoading }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'alto':
        return "bg-red-500 hover:bg-red-600";
      case 'medium':
      case 'médio':
        return "bg-amber-500 hover:bg-amber-600";
      case 'low':
      case 'baixo':
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Problemas Identificados</CardTitle>
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
        ) : issues.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum problema identificado nas suas campanhas.
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="border-b pb-3 last:border-none last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-sm">{issue.issue}</h4>
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{issue.description}</p>
                {issue.affected_campaigns && issue.affected_campaigns.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {issue.affected_campaigns.map((campaign, idx) => (
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

export default IssuesPanel;
