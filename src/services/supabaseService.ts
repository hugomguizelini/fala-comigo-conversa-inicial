
// Este arquivo agora serve apenas como ponto de exportação para manter compatibilidade

// Reexporta interfaces de tipos
export type { CampaignData, MonthlyPerformance } from "@/types/dataTypes";

// Reexporta funções de gerenciamento de campanhas
export { 
  getCampaigns,
  insertCampaign,
  updateCampaign,
  deleteCampaign
} from "./campaignService";

// Reexporta funções de gerenciamento de desempenho mensal
export { 
  getMonthlyPerformance,
  insertMonthlyPerformance,
  updateMonthlyPerformance,
  deleteMonthlyPerformance
} from "./performanceService";

// Reexporta funções de gerenciamento de problemas identificados
export type { Issue } from "./issuesService";
export {
  getIssues,
  insertIssue,
  updateIssue,
  deleteIssue
} from "./issuesService";

// Reexporta funções de gerenciamento de sugestões de otimização
export type { Suggestion } from "./suggestionsService";
export {
  getSuggestions,
  insertSuggestion,
  updateSuggestion,
  deleteSuggestion
} from "./suggestionsService";

// Reexporta funções de análise de dados
export {
  analyzeAllData,
  getAnalytics,
  detectLowCTRCampaigns,
  detectBudgetDistributionIssues,
  detectNegativeTrends,
  generateCampaignSuggestions,
  generateFunnelSuggestions
} from "./analyticsService";

// Reexporta funções de processamento de CSV
export {
  processCsvFile,
  processAndInsertCampaignData,
  processAndInsertMonthlyData,
  extractNumericValue,
  extractPercentage,
  extractMonetaryValue
} from "./csvProcessingService";
