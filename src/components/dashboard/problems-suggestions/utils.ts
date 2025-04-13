
import { Issue } from "@/types/dataTypes";

export const getSeverity = (issue: Issue) => {
  if (issue.related_to === "Conversões") return "high";
  if (issue.related_to === "CPC") return "high";
  return "medium";
};

export const getImpactClass = (impact: string) => {
  switch(impact.toLowerCase()) {
    case "alto": return "text-red-500";
    case "médio": return "text-amber-500";
    case "baixo": return "text-blue-500";
    default: return "text-muted-foreground";
  }
};
