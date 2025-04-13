
import Papa from "papaparse";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";
import { insertCampaign } from "./campaignService";
import { insertMonthlyPerformance } from "./performanceService";
import { toast } from "sonner";

// Função para extrair valor numérico de uma string formatada
export const extractNumericValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  return parseFloat(valueStr.replace(/[^0-9.-]+/g, ""));
};

// Função para extrair porcentagem de uma string
export const extractPercentage = (percentStr: string): string => {
  if (!percentStr) return "0%";
  return percentStr.trim();
};

// Função para extrair valor monetário de uma string
export const extractMonetaryValue = (moneyStr: string): string => {
  if (!moneyStr) return "R$ 0,00";
  return moneyStr.trim();
};

// Função para processar arquivo CSV
export const processCsvFile = (file: File): Promise<Papa.ParseResult<any>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Função para processar e inserir dados de campanhas
export const processAndInsertCampaignData = async (data: any[]): Promise<CampaignData[]> => {
  try {
    const processedData: CampaignData[] = [];
    
    for (const row of data) {
      const campaignData: CampaignData = {
        name: row.nome || row.name || "",
        status: row.status || "active",
        budget: extractMonetaryValue(row.budget || row.orçamento || "R$ 0"),
        impressions: extractNumericValue(row.impressions || row.impressões || "0"),
        clicks: extractNumericValue(row.clicks || row.cliques || "0"),
        ctr: extractPercentage(row.ctr || "0%"),
        conversions: extractNumericValue(row.conversions || row.conversões || "0"),
        conversion_type: row.conversion_type || row.tipo_conversão || "",
        cpc: extractMonetaryValue(row.cpc || "R$ 0"),
        total_cost: extractMonetaryValue(row.total_cost || row.custo_total || "R$ 0"),
        roas: extractPercentage(row.roas || "0%")
      };
      
      try {
        // Inserir no banco de dados
        const insertedData = await insertCampaign(campaignData);
        processedData.push(insertedData);
        console.log("Campanha inserida:", insertedData);
      } catch (error) {
        console.error("Erro ao inserir campanha específica:", error);
        toast.error(`Erro ao processar campanha: ${campaignData.name}`);
      }
    }
    
    toast.success(`${processedData.length} campanhas importadas com sucesso!`);
    return processedData;
  } catch (error) {
    console.error("Erro ao processar e inserir dados de campanha:", error);
    throw error;
  }
};

// Função para processar e inserir dados de desempenho mensal
export const processAndInsertMonthlyData = async (data: any[]): Promise<MonthlyPerformance[]> => {
  try {
    const processedData: MonthlyPerformance[] = [];
    
    for (const row of data) {
      const monthlyData: MonthlyPerformance = {
        month: row.month || row.mês || "",
        year: parseInt(row.year || row.ano || new Date().getFullYear()),
        impressions: extractNumericValue(row.impressions || row.impressões || "0"),
        clicks: extractNumericValue(row.clicks || row.cliques || "0"),
        conversions: extractNumericValue(row.conversions || row.conversões || "0"),
        cost: extractNumericValue(row.cost || row.custo || "0")
      };
      
      try {
        // Inserir no banco de dados
        const insertedData = await insertMonthlyPerformance(monthlyData);
        processedData.push(insertedData);
        console.log("Dados mensais inseridos:", insertedData);
      } catch (error) {
        console.error("Erro ao inserir dados mensais específicos:", error);
        toast.error(`Erro ao processar dados do mês: ${monthlyData.month}`);
      }
    }
    
    toast.success(`${processedData.length} registros mensais importados com sucesso!`);
    return processedData;
  } catch (error) {
    console.error("Erro ao processar e inserir dados mensais:", error);
    throw error;
  }
};
