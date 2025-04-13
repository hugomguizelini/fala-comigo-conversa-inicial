
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, Filter, BarChart, LineChart, PieChart, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReportsSummaryCards from "@/components/reports/ReportsSummaryCards";
import ReportsPerformanceChart from "@/components/reports/ReportsPerformanceChart";
import ReportsCampaignBreakdown from "@/components/reports/ReportsCampaignBreakdown";

const Reports = () => {
  const [dateRange, setDateRange] = useState<string>("month");
  const [activeChart, setActiveChart] = useState<string>("line");
  
  const currentDate = format(new Date(), "MMMM yyyy", { locale: ptBR });

  return (
    <DashboardLayout>
      <div className="p-1 sm:p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-purple-600">Relatórios</h1>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Período</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Dados do período: {currentDate}
        </div>
        
        {/* Cards de resumo */}
        <ReportsSummaryCards />
        
        {/* Tabs para diferentes tipos de relatórios */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto">
            <TabsTrigger value="performance" className="py-2">Desempenho</TabsTrigger>
            <TabsTrigger value="conversion" className="py-2">Conversão</TabsTrigger>
            <TabsTrigger value="audience" className="py-2">Audiência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Relatório de Desempenho</CardTitle>
                <CardDescription>
                  Análise completa do desempenho das suas campanhas ao longo do tempo.
                </CardDescription>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant={activeChart === "line" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setActiveChart("line")}
                  >
                    <LineChart className="h-4 w-4 mr-1" />
                    Linha
                  </Button>
                  <Button 
                    variant={activeChart === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveChart("bar")}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Barras
                  </Button>
                  <Button 
                    variant={activeChart === "pie" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveChart("pie")}
                  >
                    <PieChart className="h-4 w-4 mr-1" />
                    Pizza
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <ReportsPerformanceChart chartType={activeChart} dateRange={dateRange} />
              </CardContent>
              
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <div className="text-sm text-muted-foreground">
                  Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={dateRange === "week" ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setDateRange("week")}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant={dateRange === "month" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setDateRange("month")}
                  >
                    30 dias
                  </Button>
                  <Button 
                    variant={dateRange === "year" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setDateRange("year")}
                  >
                    12 meses
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversion" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Conversão</CardTitle>
                <CardDescription>
                  Análise das taxas de conversão por campanha e canal.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Dados de conversão ainda não disponíveis. Faça upload dos dados para visualizar este relatório.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Audiência</CardTitle>
                <CardDescription>
                  Análise demográfica e comportamental da sua audiência.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Dados de audiência ainda não disponíveis. Faça upload dos dados para visualizar este relatório.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Detalhamento por campanha */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Campanha</CardTitle>
            <CardDescription>
              Análise detalhada do desempenho individual de cada campanha.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <ReportsCampaignBreakdown />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
