
import Papa from "papaparse";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";
import { insertCampaign } from "./campaignService";
import { insertMonthlyPerformance } from "./performanceService";
import { toast } from "sonner";

// Função para extrair valor numérico de uma string formatada
export const extractNumericValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  return parseFloat(valueStr.replace(/[^0-9.-]+/g, "")) || 0;
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

// Normalizar dados de campanhas sem depender de nomes de colunas específicos
const normalizeCampaignData = (row: any): CampaignData => {
  // Mapear campos comuns com seus possíveis nomes alternativos
  const nameField = row.nome || row.name || row.campanha || "Campanha sem nome";
  const statusField = row.status || "active";
  const budgetField = row.budget || row.orçamento || row.orcamento || "R$ 0";
  const impressionsField = row.impressions || row.impressões || row.impressoes || "0";
  const clicksField = row.clicks || row.cliques || "0";
  const ctrField = row.ctr || "0%";
  const conversionsField = row.conversions || row.conversões || row.conversoes || "0";
  const conversionTypeField = row.conversion_type || row.tipo_conversão || row.tipo_conversao || "";
  const cpcField = row.cpc || row.custo_por_clique || "R$ 0,00";
  const totalCostField = row.total_cost || row.custo_total || row.custo || "R$ 0,00";
  const roasField = row.roas || row.retorno || "0%";
  
  return {
    name: String(nameField),
    status: String(statusField),
    budget: extractMonetaryValue(String(budgetField)),
    impressions: extractNumericValue(String(impressionsField)),
    clicks: extractNumericValue(String(clicksField)),
    ctr: extractPercentage(String(ctrField)),
    conversions: extractNumericValue(String(conversionsField)),
    conversion_type: String(conversionTypeField),
    cpc: extractMonetaryValue(String(cpcField)),
    total_cost: extractMonetaryValue(String(totalCostField)),
    roas: extractPercentage(String(roasField))
  };
};

// Função para processar e inserir dados de campanhas
export const processAndInsertCampaignData = async (data: any[]): Promise<CampaignData[]> => {
  try {
    const processedData: CampaignData[] = [];
    
    for (const row of data) {
      const campaignData = normalizeCampaignData(row);
      
      try {
        // Inserir no banco de dados
        const insertedData = await insertCampaign(campaignData);
        processedData.push(insertedData);
        console.log("Campanha inserida:", insertedData);
      } catch (error) {
        console.error("Erro ao inserir campanha específica:", error);
        
        // Em caso de falha no banco, ainda adicionamos ao array processedData
        processedData.push(campaignData);
        
        // Apenas log, não interrompe o fluxo
        console.warn(`Erro ao salvar campanha ${campaignData.name} no banco, mas incluindo na análise local`);
      }
    }
    
    toast.success(`${processedData.length} campanhas importadas com sucesso!`);
    return processedData;
  } catch (error) {
    console.error("Erro ao processar e inserir dados de campanha:", error);
    throw error;
  }
};

// Normalizar dados de desempenho mensal sem depender de nomes de colunas específicos
const normalizeMonthlyData = (row: any): MonthlyPerformance => {
  // Mapear campos comuns com seus possíveis nomes alternativos
  const monthField = row.month || row.mês || row.mes || new Date().toLocaleString('pt-BR', {month: 'short'}).toLowerCase();
  const yearField = row.year || row.ano || new Date().getFullYear();
  const impressionsField = row.impressions || row.impressões || row.impressoes || "0";
  const clicksField = row.clicks || row.cliques || "0";
  const conversionsField = row.conversions || row.conversões || row.conversoes || "0";
  const costField = row.cost || row.custo || "0";
  
  return {
    month: String(monthField),
    year: parseInt(String(yearField)),
    impressions: extractNumericValue(String(impressionsField)),
    clicks: extractNumericValue(String(clicksField)),
    conversions: extractNumericValue(String(conversionsField)),
    cost: extractNumericValue(String(costField))
  };
};

// Função para processar e inserir dados de desempenho mensal
export const processAndInsertMonthlyData = async (data: any[]): Promise<MonthlyPerformance[]> => {
  try {
    const processedData: MonthlyPerformance[] = [];
    
    for (const row of data) {
      const monthlyData = normalizeMonthlyData(row);
      
      try {
        // Inserir no banco de dados
        const insertedData = await insertMonthlyPerformance(monthlyData);
        processedData.push(insertedData);
        console.log("Dados mensais inseridos:", insertedData);
      } catch (error) {
        console.error("Erro ao inserir dados mensais específicos:", error);
        
        // Em caso de falha no banco, ainda adicionamos ao array processedData
        processedData.push(monthlyData);
        
        // Apenas log, não interrompe o fluxo
        console.warn(`Erro ao salvar dados mensais de ${monthlyData.month}/${monthlyData.year} no banco, mas incluindo na análise local`);
      }
    }
    
    toast.success(`${processedData.length} registros mensais importados com sucesso!`);
    return processedData;
  } catch (error) {
    console.error("Erro ao processar e inserir dados mensais:", error);
    throw error;
  }
};
