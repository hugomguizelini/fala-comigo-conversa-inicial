
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { MetricsType } from "@/hooks/useDashboardData";
import { useIsMobile } from "@/hooks/use-mobile";

type StatisticsCardProps = {
  isLoading: boolean;
  metrics: MetricsType;
  onAnalyzeClick?: () => void;
};

const StatisticsCard = ({ isLoading, metrics, onAnalyzeClick }: StatisticsCardProps) => {
  const isMobile = useIsMobile();
  
  // Calcular score de eficiência com base no CTR, ROAS e CPC
  const calculateEfficiencyScore = () => {
    if (isLoading) return "...";
    
    try {
      const ctrValue = parseFloat((metrics?.ctr?.value || "0%").replace('%', ''));
      const cpcValue = parseFloat((metrics?.cpc?.value || "R$ 0,00").replace('R$ ', '').replace(',', '.'));
      
      // Cálculo simplificado para score de eficiência
      // Quanto maior o CTR e menor o CPC, melhor a eficiência
      let score = 0;
      
      if (ctrValue > 2.0) score += 40; // Bom CTR
      else if (ctrValue > 1.0) score += 20; // CTR médio
      else score += 10; // CTR baixo
      
      if (cpcValue < 1.0) score += 40; // CPC excelente
      else if (cpcValue < 2.5) score += 30; // CPC bom
      else if (cpcValue < 5.0) score += 20; // CPC regular
      else score += 10; // CPC alto
      
      // Classificação
      let rating = "Regular";
      if (score >= 60) rating = "Excelente";
      else if (score >= 50) rating = "Ótimo";
      else if (score >= 40) rating = "Bom";
      
      return { score, rating };
    } catch (error) {
      console.error("Erro ao calcular eficiência:", error);
      return { score: 0, rating: "Indisponível" };
    }
  };
  
  const efficiencyData = calculateEfficiencyScore();

  const safeMetrics = {
    ctr: { value: metrics?.ctr?.value || "0%", variation: metrics?.ctr?.variation || "0%" },
    cpc: { value: metrics?.cpc?.value || "R$ 0,00", variation: metrics?.cpc?.variation || "0%" }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2 sm:pb-6">
        <div>
          <CardTitle className="text-base sm:text-lg">Eficiência da Campanha</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Análise de desempenho e eficiência</CardDescription>
        </div>
        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <div className="w-full h-full rounded-full border-8 border-purple-500/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl sm:text-3xl font-bold">
                {isLoading ? "..." : (typeof efficiencyData === 'object' ? `${efficiencyData.score}%` : "...")}
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h4 className="font-medium text-sm sm:text-base">
              {isLoading ? "Calculando..." : (typeof efficiencyData === 'object' ? `Eficiência ${efficiencyData.rating}` : "Sem dados suficientes")}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Baseado em CTR, custo por clique e taxa de conversão.
            </p>
          </div>
          
          <div className="flex gap-4 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              <ChevronUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{safeMetrics.ctr.value}</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
              <ChevronDown className="h-3 w-3 text-amber-500 mr-1" />
              <span className="text-amber-500">{safeMetrics.cpc.value}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className={`w-full ${isMobile ? "mt-3" : "mt-4"} bg-purple-600 hover:bg-purple-700 ${isMobile ? "text-xs py-3" : ""}`}
          onClick={onAnalyzeClick}
        >
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
          Analisar com IA
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
