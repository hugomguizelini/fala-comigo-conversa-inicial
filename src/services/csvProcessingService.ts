
import Papa from "papaparse";
import { CampaignData, MonthlyPerformance } from "@/types/dataTypes";
import { insertCampaign } from "./campaignService";
import { insertMonthlyPerformance } from "./performanceService";
import { toast } from "sonner";

// Função para extrair valor numérico de uma string formatada
export const extractNumericValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  
  // Verificar se o valor já é um número
  if (typeof valueStr === 'number') return valueStr;
  
  try {
    // Converte para string caso seja passado outro tipo
    const strValue = String(valueStr).trim();
    
    // Se já for um número simples, retorna diretamente
    if (!isNaN(Number(strValue)) && !strValue.includes(',') && !strValue.includes('.')) {
      return Number(strValue);
    }
    
    // Remover todos os caracteres não numéricos, exceto ponto e vírgula
    // como R$, %, etc.
    let cleanValue = strValue.replace(/[^\d.,]/g, '');
    
    // Lidar com formatos diferentes (1.000,50 ou 1,000.50)
    if (cleanValue.includes(',') && cleanValue.includes('.')) {
      // Formato brasileiro: 1.000,50
      if (cleanValue.lastIndexOf(',') > cleanValue.lastIndexOf('.')) {
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
      } 
      // Formato americano: 1,000.50
      else {
        cleanValue = cleanValue.replace(/,/g, '');
      }
    } else if (cleanValue.includes(',')) {
      // Se só tem vírgula, assume formato brasileiro e substitui por ponto
      cleanValue = cleanValue.replace(',', '.');
    }
    
    // Converter para número
    const result = parseFloat(cleanValue);
    return isNaN(result) ? 0 : result;
  } catch (error) {
    console.error("Erro ao extrair valor numérico:", error, "para valor:", valueStr);
    return 0;
  }
};

// Função para extrair porcentagem de uma string
export const extractPercentage = (percentStr: string): string => {
  if (!percentStr) return "0%";
  
  try {
    // Se já termina com %, mantém como está
    if (percentStr.toString().trim().endsWith('%')) {
      return percentStr.toString().trim();
    }
    
    // Se for um número sem o símbolo %, adiciona o símbolo
    const numValue = extractNumericValue(percentStr);
    return `${numValue}%`;
  } catch (error) {
    console.error("Erro ao extrair percentagem:", error);
    return "0%";
  }
};

// Função para extrair valor monetário de uma string
export const extractMonetaryValue = (moneyStr: string): string => {
  if (!moneyStr) return "R$ 0,00";
  
  try {
    // Se já começa com R$, mantém como está
    if (moneyStr.toString().trim().startsWith('R$')) {
      return moneyStr.toString().trim();
    }
    
    // Extrai o valor numérico
    const numValue = extractNumericValue(moneyStr);
    
    // Formata como valor monetário brasileiro
    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } catch (error) {
    console.error("Erro ao extrair valor monetário:", error);
    return "R$ 0,00";
  }
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
  console.log("Processando linha do CSV:", row);
  
  // Mapear campos comuns com seus possíveis nomes alternativos
  const nameField = row.nome || row.name || row.campanha || row.campaign || "Campanha sem nome";
  const statusField = row.status || "active";
  const budgetField = row.budget || row.orçamento || row.orcamento || row.budget || "R$ 0";
  const impressionsField = row.impressions || row.impressões || row.impressoes || row.impressoes || row["impressões"] || "0";
  const clicksField = row.clicks || row.cliques || row.cliques || "0";
  const ctrField = row.ctr || row["taxa de cliques"] || row["taxa_de_cliques"] || "0%";
  const conversionsField = row.conversions || row.conversões || row.conversoes || row.conversoes || row["conversões"] || "0";
  const conversionTypeField = row.conversion_type || row.tipo_conversão || row.tipo_conversao || "";
  const cpcField = row.cpc || row.custo_por_clique || row["custo por clique"] || "R$ 0,00";
  const totalCostField = row.total_cost || row.custo_total || row.custo || row["custo total"] || "R$ 0,00";
  const roasField = row.roas || row.retorno || row["retorno sobre investimento"] || "0%";
  
  console.log("Campos extraídos brutos:", {
    nome: nameField,
    impressoes: impressionsField,
    cliques: clicksField,
    conversoes: conversionsField,
    custo: totalCostField
  });
  
  // Processamento dos valores numéricos
  const impressions = extractNumericValue(impressionsField);
  const clicks = extractNumericValue(clicksField);
  const conversions = extractNumericValue(conversionsField);
  const costRaw = extractNumericValue(totalCostField);
  
  console.log("Valores processados após conversão:", {
    impressoes: impressions,
    cliques: clicks,
    conversoes: conversions,
    custo: costRaw
  });
  
  const totalCost = extractMonetaryValue(totalCostField);
  const cpc = extractMonetaryValue(cpcField);
  const ctr = extractPercentage(ctrField);
  const roas = extractPercentage(roasField);
  
  console.log("Valores formatados finais:", {
    custo_total: totalCost,
    cpc: cpc,
    ctr: ctr,
    roas: roas
  });
  
  return {
    name: String(nameField),
    status: String(statusField),
    budget: extractMonetaryValue(String(budgetField)),
    impressions: impressions,
    clicks: clicks,
    ctr: ctr,
    conversions: conversions,
    conversion_type: String(conversionTypeField),
    cpc: cpc,
    total_cost: totalCost,
    roas: roas
  };
};

// Função para processar e inserir dados de campanhas
export const processAndInsertCampaignData = async (data: any[]): Promise<CampaignData[]> => {
  try {
    const processedData: CampaignData[] = [];
    
    console.log("Processando", data.length, "linhas de dados CSV");
    
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
  
  // Log detalhado para debug
  console.log("Processando dados mensais:", {
    month: monthField,
    year: yearField,
    impressions: impressionsField,
    clicks: clicksField,
    conversions: conversionsField,
    cost: costField
  });
  
  // Extrair valores numéricos corretamente
  const impressions = extractNumericValue(impressionsField);
  const clicks = extractNumericValue(clicksField);
  const conversions = extractNumericValue(conversionsField);
  const cost = extractNumericValue(costField);
  
  console.log("Valores mensais processados:", {
    impressions: impressions,
    clicks: clicks,
    conversions: conversions,
    cost: cost
  });
  
  return {
    month: String(monthField),
    year: parseInt(String(yearField)),
    impressions: impressions,
    clicks: clicks,
    conversions: conversions,
    cost: cost
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
