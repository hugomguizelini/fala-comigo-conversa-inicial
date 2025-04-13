
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

// Interfaces para os tipos de dados
export interface CampaignData {
  id?: string;
  name: string;
  status: string;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  conversion_type?: string;
  cpc: string;
  total_cost: string;
  roas: string;
}

export interface MonthlyPerformance {
  id?: string;
  month: string;
  year: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

// Funções para gerenciar campanhas
export const getCampaigns = async (): Promise<CampaignData[]> => {
  const { data, error } = await supabase
    .from('campaign_data')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
  
  return data || [];
};

export const insertCampaign = async (campaign: CampaignData): Promise<CampaignData> => {
  const { data, error } = await supabase
    .from('campaign_data')
    .insert(campaign)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting campaign:', error);
    throw error;
  }
  
  return data;
};

// Funções para gerenciar dados de desempenho mensal
export const getMonthlyPerformance = async (): Promise<MonthlyPerformance[]> => {
  const { data, error } = await supabase
    .from('monthly_performance')
    .select('*')
    .order('year', { ascending: true });
  
  if (error) {
    console.error('Error fetching monthly performance:', error);
    throw error;
  }
  
  return data || [];
};

export const insertMonthlyPerformance = async (monthlyData: MonthlyPerformance): Promise<MonthlyPerformance> => {
  const { data, error } = await supabase
    .from('monthly_performance')
    .insert(monthlyData)
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting monthly performance:', error);
    throw error;
  }
  
  return data;
};

// Funções para processamento de arquivos
export const processCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Helper para encontrar colunas relevantes no CSV usando diferentes variações de nomes
const findRelevantColumn = (headers: string[], possibleNames: string[]): string | null => {
  const lowerCaseHeaders = headers.map(h => h.toLowerCase().trim());
  
  for (const name of possibleNames) {
    // Busca exata
    const exactIndex = lowerCaseHeaders.indexOf(name.toLowerCase());
    if (exactIndex !== -1) {
      return headers[exactIndex];
    }
    
    // Busca por substring
    for (let i = 0; i < lowerCaseHeaders.length; i++) {
      if (lowerCaseHeaders[i].includes(name.toLowerCase())) {
        return headers[i];
      }
    }
  }
  
  return null;
};

// Função para extrair um valor numérico de uma string, tratando diferentes formatos
const extractNumericValue = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0;
  
  if (typeof value === 'number') return value;
  
  // Remove caracteres não numéricos, exceto ponto e vírgula
  const stringValue = String(value).replace(/[^0-9.,]/g, '');
  
  // Converte vírgula para ponto decimal se necessário
  const normalizedValue = stringValue.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};

// Função para extrair uma string de porcentagem
const extractPercentage = (value: any): string => {
  if (value === null || value === undefined || value === '') return '0%';
  
  const stringValue = String(value);
  if (stringValue.includes('%')) return stringValue;
  
  // Se for um número, converte para string com %
  const numValue = extractNumericValue(value);
  return `${numValue}%`;
};

// Função para extrair valor monetário
const extractMonetaryValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';
  
  const stringValue = String(value);
  if (stringValue.startsWith('R$') || stringValue.startsWith('$')) return stringValue;
  
  // Se for um número, converte para formato monetário
  const numValue = extractNumericValue(value);
  return `R$ ${numValue.toFixed(2)}`;
};

// Função para processar e inserir dados de campanhas do CSV com mapeamento inteligente
export const processAndInsertCampaignData = async (file: File): Promise<CampaignData[]> => {
  try {
    const parsedData = await processCsvFile(file);
    if (parsedData.length === 0) {
      console.error('Arquivo CSV vazio ou inválido');
      throw new Error('Arquivo CSV vazio ou inválido');
    }
    
    // Obtém os cabeçalhos do CSV
    const headers = Object.keys(parsedData[0]);
    console.log('CSV Headers:', headers);
    
    // Define mapeamentos de possíveis nomes de colunas
    const columnMappings = {
      name: ['name', 'nome', 'campaign', 'campanha', 'campaign_name', 'nome_campanha', 'title', 'título'],
      status: ['status', 'estado', 'situação', 'situacao'],
      budget: ['budget', 'orçamento', 'orcamento', 'verba'],
      impressions: ['impressions', 'impressões', 'impressoes', 'views', 'visualizações', 'visualizacoes', 'impres'],
      clicks: ['clicks', 'cliques', 'clics', 'click', 'clique'],
      ctr: ['ctr', 'taxa_de_clique', 'taxa de clique', 'click_rate', 'click rate', 'taxa', 'rate'],
      conversions: ['conversions', 'conversões', 'conversoes', 'conv', 'conversão', 'conversao'],
      conversion_type: ['conversion_type', 'tipo_conversao', 'tipo de conversão', 'tipo de conversao', 'tipo_de_conversao'],
      cpc: ['cpc', 'custo_por_clique', 'custo por clique', 'cost_per_click', 'cost per click'],
      total_cost: ['total_cost', 'custo_total', 'custo total', 'cost', 'custo', 'gasto', 'spend', 'valor', 'value'],
      roas: ['roas', 'retorno', 'return', 'roi', 'retorno_investimento', 'retorno sobre investimento']
    };
    
    // Encontra as colunas relevantes no CSV
    const columnMap: Record<string, string | null> = {};
    for (const [key, possibleNames] of Object.entries(columnMappings)) {
      columnMap[key] = findRelevantColumn(headers, possibleNames);
    }
    
    console.log('Mapeamento de colunas:', columnMap);
    
    const campaignData = parsedData.map(row => {
      // Função auxiliar para obter valor de uma coluna mapeada
      const getColumnValue = (key: string, defaultValue: any = ''): any => {
        const columnName = columnMap[key];
        return columnName ? row[columnName] : defaultValue;
      };
      
      return {
        name: getColumnValue('name', 'Campanha sem nome'),
        status: getColumnValue('status', 'active'),
        budget: getColumnValue('budget', '0'),
        impressions: extractNumericValue(getColumnValue('impressions', 0)),
        clicks: extractNumericValue(getColumnValue('clicks', 0)),
        ctr: extractPercentage(getColumnValue('ctr', '0%')),
        conversions: extractNumericValue(getColumnValue('conversions', 0)),
        conversion_type: getColumnValue('conversion_type', ''),
        cpc: extractMonetaryValue(getColumnValue('cpc', 'R$ 0,00')),
        total_cost: extractMonetaryValue(getColumnValue('total_cost', 'R$ 0,00')),
        roas: extractPercentage(getColumnValue('roas', '0%'))
      };
    });

    console.log('Dados processados:', campaignData);

    const insertPromises = campaignData.map(campaign => insertCampaign(campaign));
    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error processing campaign data:', error);
    throw error;
  }
};

// Função para processar e inserir dados de desempenho mensal do CSV com mapeamento inteligente
export const processAndInsertMonthlyData = async (file: File): Promise<MonthlyPerformance[]> => {
  try {
    const parsedData = await processCsvFile(file);
    if (parsedData.length === 0) {
      throw new Error('Arquivo CSV vazio ou inválido');
    }
    
    // Obtém os cabeçalhos do CSV
    const headers = Object.keys(parsedData[0]);
    
    // Define mapeamentos de possíveis nomes de colunas
    const columnMappings = {
      month: ['month', 'mês', 'mes', 'período', 'periodo', 'date', 'data'],
      year: ['year', 'ano', 'yr'],
      impressions: ['impressions', 'impressões', 'impressoes', 'views', 'visualizações', 'visualizacoes'],
      clicks: ['clicks', 'cliques', 'clics', 'click', 'clique'],
      conversions: ['conversions', 'conversões', 'conversoes', 'conv', 'conversão', 'conversao'],
      cost: ['cost', 'custo', 'gasto', 'spend', 'valor', 'value', 'total_cost', 'custo_total']
    };
    
    // Encontra as colunas relevantes no CSV
    const columnMap: Record<string, string | null> = {};
    for (const [key, possibleNames] of Object.entries(columnMappings)) {
      columnMap[key] = findRelevantColumn(headers, possibleNames);
    }
    
    console.log('Mapeamento de colunas mensais:', columnMap);
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const monthlyData = parsedData.map(row => {
      // Função auxiliar para obter valor de uma coluna mapeada
      const getColumnValue = (key: string, defaultValue: any = ''): any => {
        const columnName = columnMap[key];
        return columnName ? row[columnName] : defaultValue;
      };
      
      // Tenta extrair mês e ano da data se disponível
      let month = getColumnValue('month', '');
      let year = extractNumericValue(getColumnValue('year', new Date().getFullYear()));
      
      // Se o mês parece ser uma data, tenta extrair mês e ano dela
      if (month && (month.includes('/') || month.includes('-'))) {
        try {
          const date = new Date(month);
          if (!isNaN(date.getTime())) {
            month = monthNames[date.getMonth()];
            // Se não encontramos o ano em outra coluna, use o da data
            if (year === 0) {
              year = date.getFullYear();
            }
          }
        } catch (e) {
          // Falha ao analisar a data, mantenha os valores originais
        }
      } else if (typeof month === 'number' && month >= 1 && month <= 12) {
        // Se o mês é um número, converta para nome
        month = monthNames[month - 1];
      }
      
      // Certifique-se que o mês é uma string válida
      if (!month || typeof month !== 'string') {
        month = 'Janeiro'; // Valor padrão
      }
      
      return {
        month: month,
        year: year || 2023,
        impressions: extractNumericValue(getColumnValue('impressions', 0)),
        clicks: extractNumericValue(getColumnValue('clicks', 0)),
        conversions: extractNumericValue(getColumnValue('conversions', 0)),
        cost: extractNumericValue(getColumnValue('cost', 0))
      };
    });

    console.log('Dados mensais processados:', monthlyData);

    const insertPromises = monthlyData.map(monthData => insertMonthlyPerformance(monthData));
    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error processing monthly data:', error);
    throw error;
  }
};
