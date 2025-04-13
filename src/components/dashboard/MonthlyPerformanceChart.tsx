
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MonthlyPerformance } from "@/types/dataTypes";

type MonthlyPerformanceChartProps = {
  data: MonthlyPerformance[];
  isLoading: boolean;
  className?: string;
};

const MonthlyPerformanceChart: React.FC<MonthlyPerformanceChartProps> = ({ data, isLoading, className }) => {
  // Preparando dados para o gráfico
  const chartData = data.map(item => ({
    name: `${item.month}/${item.year}`,
    impressions: item.impressions,
    clicks: item.clicks,
    conversions: item.conversions,
    cost: item.cost
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Desempenho Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Nenhum dado disponível</div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressões" />
                <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Cliques" />
                <Line type="monotone" dataKey="conversions" stroke="#ffc658" name="Conversões" />
                <Line type="monotone" dataKey="cost" stroke="#ff8042" name="Custo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyPerformanceChart;
