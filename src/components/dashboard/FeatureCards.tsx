
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, Layout, FileSpreadsheet } from "lucide-react";

const FeatureCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-purple-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Estatísticas Completas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">
            Explore estatísticas históricas detalhadas para identificar tendências e padrões de longo prazo da campanha.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Painéis Personalizáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">
            Crie painéis personalizados para focar nas métricas e KPIs da campanha que mais importam.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Relatórios Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">
            Gere relatórios detalhados da campanha automaticamente, garantindo precisão e economizando tempo valioso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCards;
