
// Este arquivo agora serve apenas como ponto de exportação para manter compatibilidade

// Reexporta interfaces de tipos
export type { CampaignData, MonthlyPerformance } from "@/types/dataTypes";

// Reexporta funções de gerenciamento de campanhas
export { 
  getCampaigns,
  insertCampaign
} from "./campaignService";

// Reexporta funções de gerenciamento de desempenho mensal
export { 
  getMonthlyPerformance,
  insertMonthlyPerformance
} from "./performanceService";

// Reexporta funções de processamento de CSV
export {
  processCsvFile,
  processAndInsertCampaignData,
  processAndInsertMonthlyData,
  extractNumericValue,
  extractPercentage,
  extractMonetaryValue
} from "./csvProcessingService";
