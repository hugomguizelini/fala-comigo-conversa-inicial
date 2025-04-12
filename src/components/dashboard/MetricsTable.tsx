
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Target, ArrowRight, Eye, MousePointer, CreditCard } from "lucide-react";

type Metric = {
  name: string;
  value: string | number;
  change: number;
  status: "increase" | "decrease" | "neutral";
  icon: React.ReactNode;
  description: string;
};

const metrics: Metric[] = [
  {
    name: "Impressões",
    value: "240.8K",
    change: 12.5,
    status: "increase",
    icon: <Eye className="h-4 w-4 text-green-500" />,
    description: "Total de vezes que seus anúncios foram exibidos"
  },
  {
    name: "Cliques",
    value: "12.4K",
    change: 8.2,
    status: "increase",
    icon: <MousePointer className="h-4 w-4 text-blue-500" />,
    description: "Total de cliques em seus anúncios"
  },
  {
    name: "CTR",
    value: "5.2%",
    change: -1.8,
    status: "decrease",
    icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
    description: "Taxa de cliques (Cliques / Impressões)"
  },
  {
    name: "Conversões",
    value: "2.8K",
    change: 15.3,
    status: "increase",
    icon: <Target className="h-4 w-4 text-purple-500" />,
    description: "Total de ações completadas após cliques"
  },
  {
    name: "CPC",
    value: "R$ 2,45",
    change: -3.2,
    status: "increase",
    icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
    description: "Custo por clique médio"
  },
  {
    name: "Custo Total",
    value: "R$ 30.4K",
    change: 5.7,
    status: "increase",
    icon: <CreditCard className="h-4 w-4 text-red-500" />,
    description: "Total gasto na campanha"
  },
];

export const MetricsTable = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Métricas Detalhadas</CardTitle>
          <CardDescription>Análise individual de cada métrica da campanha</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Variação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="flex items-center gap-2 font-medium">
                  {metric.icon}
                  {metric.name}
                </TableCell>
                <TableCell>{metric.value}</TableCell>
                <TableCell className="flex items-center gap-1">
                  {metric.status === "increase" ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : metric.status === "decrease" ? (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span className={metric.status === "increase" ? "text-green-500" : metric.status === "decrease" ? "text-red-500" : ""}>
                    {metric.change}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{metric.description}</TableCell>
                <TableCell className="text-right">
                  <button className="inline-flex items-center text-xs text-purple-600 hover:underline">
                    <span>Analisar</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
