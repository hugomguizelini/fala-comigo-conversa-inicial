
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Settings, Sparkles } from "lucide-react";

type StatisticsCardProps = {
  isLoading: boolean;
};

const StatisticsCard = ({ isLoading }: StatisticsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Estatísticas da Campanha</CardTitle>
          <CardDescription>Nível de desempenho da sua campanha</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full border-8 border-purple-500/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl font-bold">{isLoading ? "..." : "87%"}</div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h4 className="font-medium">Você está quase no limite!</h4>
            <p className="text-sm text-muted-foreground">Você já usou cerca de 87% do seu espaço livre.</p>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+23%</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              <ArrowUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
              <span className="text-red-500">-5%</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
          <Sparkles className="h-4 w-4 mr-2" />
          Analisar com IA
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
