
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

interface ReportsPerformanceChartProps {
  chartType: string;
  dateRange: string;
}

const ReportsPerformanceChart: React.FC<ReportsPerformanceChartProps> = ({ 
  chartType, 
  dateRange 
}) => {
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  // Dados simulados para os gráficos
  const weeklyData = [
    { name: "Seg", impressions: 8400, clicks: 240, conversions: 20, cost: 680 },
    { name: "Ter", impressions: 9300, clicks: 260, conversions: 22, cost: 720 },
    { name: "Qua", impressions: 8900, clicks: 280, conversions: 24, cost: 760 },
    { name: "Qui", impressions: 10200, clicks: 300, conversions: 26, cost: 800 },
    { name: "Sex", impressions: 11000, clicks: 320, conversions: 28, cost: 840 },
    { name: "Sáb", impressions: 9800, clicks: 280, conversions: 24, cost: 760 },
    { name: "Dom", impressions: 8500, clicks: 240, conversions: 20, cost: 680 },
  ];
  
  const monthlyData = [
    { name: "Semana 1", impressions: 58000, clicks: 1840, conversions: 160, cost: 4800 },
    { name: "Semana 2", impressions: 65000, clicks: 1960, conversions: 170, cost: 5300 },
    { name: "Semana 3", impressions: 61000, clicks: 1880, conversions: 165, cost: 5000 },
    { name: "Semana 4", impressions: 69000, clicks: 2100, conversions: 185, cost: 5700 },
  ];
  
  const yearlyData = [
    { name: "Jan", impressions: 240000, clicks: 7200, conversions: 640, cost: 19000 },
    { name: "Fev", impressions: 260000, clicks: 7800, conversions: 680, cost: 20500 },
    { name: "Mar", impressions: 280000, clicks: 8400, conversions: 750, cost: 22000 },
    { name: "Abr", impressions: 310000, clicks: 9300, conversions: 830, cost: 24500 },
    { name: "Mai", impressions: 330000, clicks: 9900, conversions: 880, cost: 26000 },
    { name: "Jun", impressions: 350000, clicks: 10500, conversions: 930, cost: 27500 },
    { name: "Jul", impressions: 370000, clicks: 11100, conversions: 990, cost: 29000 },
    { name: "Ago", impressions: 350000, clicks: 10500, conversions: 930, cost: 27500 },
    { name: "Set", impressions: 330000, clicks: 9900, conversions: 880, cost: 26000 },
    { name: "Out", impressions: 320000, clicks: 9600, conversions: 850, cost: 25000 },
    { name: "Nov", impressions: 300000, clicks: 9000, conversions: 800, cost: 23500 },
    { name: "Dez", impressions: 290000, clicks: 8700, conversions: 780, cost: 23000 },
  ];
  
  // Definir dados baseados no período selecionado
  let chartData;
  switch(dateRange) {
    case "week":
      chartData = weeklyData;
      break;
    case "month":
      chartData = monthlyData;
      break;
    case "year":
      chartData = yearlyData;
      break;
    default:
      chartData = monthlyData;
  }
  
  // Cores para gráficos
  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
  
  // Configuração do gráfico de pizza
  const pieData = [
    { name: 'Impressões', value: chartData.reduce((sum, item) => sum + item.impressions, 0) },
    { name: 'Cliques', value: chartData.reduce((sum, item) => sum + item.clicks, 0) },
    { name: 'Conversões', value: chartData.reduce((sum, item) => sum + item.conversions, 0) * 100 }, // Multiplicado para visualização
    { name: 'Custo', value: chartData.reduce((sum, item) => sum + item.cost, 0) },
  ];

  // Apenas mostrar os campos relevantes em mobile para evitar sobrecarregar o gráfico
  const getVisibleKeys = () => {
    if (isSmallMobile) {
      return ['impressions', 'clicks']; // Apenas 2 métricas para telas muito pequenas
    } else if (isMobile) {
      return ['impressions', 'clicks', 'conversions']; // 3 métricas para telas móveis
    }
    return ['impressions', 'clicks', 'conversions', 'cost']; // Todas as métricas para desktop
  };

  const visibleKeys = getVisibleKeys();
  
  const chartConfig = {
    impressions: { label: "Impressões", theme: { light: "#8B5CF6", dark: "#A78BFA" } },
    clicks: { label: "Cliques", theme: { light: "#EC4899", dark: "#F472B6" } },
    conversions: { label: "Conversões", theme: { light: "#10B981", dark: "#34D399" } },
    cost: { label: "Custo", theme: { light: "#F59E0B", dark: "#FBBF24" } },
  };
  
  const chartHeight = isSmallMobile ? 200 : isMobile ? 250 : 300;
  
  // Renderiza o gráfico adequado com base no tipo selecionado
  const renderChart = () => {
    switch(chartType) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isSmallMobile ? 10 : 12 }}
                height={isSmallMobile ? 20 : undefined}
              />
              <YAxis tick={{ fontSize: isSmallMobile ? 10 : 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  fontSize: isSmallMobile ? '10px' : undefined 
                }}
              />
              <Legend 
                verticalAlign={isSmallMobile ? "top" : "bottom"}
                height={isSmallMobile ? 30 : undefined}
                wrapperStyle={{ fontSize: isSmallMobile ? '10px' : undefined }}
              />
              {visibleKeys.includes('impressions') && (
                <Line type="monotone" dataKey="impressions" stroke={colors[0]} strokeWidth={2} />
              )}
              {visibleKeys.includes('clicks') && (
                <Line type="monotone" dataKey="clicks" stroke={colors[1]} strokeWidth={2} />
              )}
              {visibleKeys.includes('conversions') && (
                <Line type="monotone" dataKey="conversions" stroke={colors[2]} strokeWidth={2} />
              )}
              {visibleKeys.includes('cost') && (
                <Line type="monotone" dataKey="cost" stroke={colors[3]} strokeWidth={2} />
              )}
            </LineChart>
          </ChartContainer>
        );
      case "bar":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isSmallMobile ? 10 : 12 }}
                height={isSmallMobile ? 20 : undefined}
              />
              <YAxis tick={{ fontSize: isSmallMobile ? 10 : 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  fontSize: isSmallMobile ? '10px' : undefined 
                }} 
              />
              <Legend 
                verticalAlign={isSmallMobile ? "top" : "bottom"}
                height={isSmallMobile ? 30 : undefined}
                wrapperStyle={{ fontSize: isSmallMobile ? '10px' : undefined }}
              />
              {visibleKeys.includes('impressions') && (
                <Bar dataKey="impressions" fill={colors[0]} />
              )}
              {visibleKeys.includes('clicks') && (
                <Bar dataKey="clicks" fill={colors[1]} />
              )}
              {visibleKeys.includes('conversions') && (
                <Bar dataKey="conversions" fill={colors[2]} />
              )}
              {visibleKeys.includes('cost') && (
                <Bar dataKey="cost" fill={colors[3]} />
              )}
            </BarChart>
          </ChartContainer>
        );
      case "pie":
        // Filtrar pieData para incluir apenas as keys visíveis
        const filteredPieData = pieData.filter((item, index) => 
          visibleKeys.includes(['impressions', 'clicks', 'conversions', 'cost'][index])
        );
        
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <PieChart>
              <Pie
                data={filteredPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isSmallMobile ? 60 : isMobile ? 80 : 100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  isSmallMobile ? `${percent > 0.1 ? name.substring(0, 1) : ''}` : 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {filteredPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                fontSize: isSmallMobile ? '10px' : undefined 
              }} />
              <Legend 
                verticalAlign="bottom"
                height={isSmallMobile ? 30 : undefined}
                wrapperStyle={{ fontSize: isSmallMobile ? '10px' : undefined }}
              />
            </PieChart>
          </ChartContainer>
        );
      default:
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isSmallMobile ? 10 : 12 }}
                height={isSmallMobile ? 20 : undefined} 
              />
              <YAxis tick={{ fontSize: isSmallMobile ? 10 : 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  fontSize: isSmallMobile ? '10px' : undefined 
                }} 
              />
              <Legend 
                verticalAlign={isSmallMobile ? "top" : "bottom"}
                height={isSmallMobile ? 30 : undefined}
                wrapperStyle={{ fontSize: isSmallMobile ? '10px' : undefined }}
              />
              {visibleKeys.includes('impressions') && (
                <Line type="monotone" dataKey="impressions" stroke={colors[0]} strokeWidth={2} />
              )}
              {visibleKeys.includes('clicks') && (
                <Line type="monotone" dataKey="clicks" stroke={colors[1]} strokeWidth={2} />
              )}
              {visibleKeys.includes('conversions') && (
                <Line type="monotone" dataKey="conversions" stroke={colors[2]} strokeWidth={2} />
              )}
              {visibleKeys.includes('cost') && (
                <Line type="monotone" dataKey="cost" stroke={colors[3]} strokeWidth={2} />
              )}
            </LineChart>
          </ChartContainer>
        );
    }
  };
  
  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
};

export default ReportsPerformanceChart;
