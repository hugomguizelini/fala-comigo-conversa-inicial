
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, Filter, BarChart, LineChart, PieChart, Share2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReportsSummaryCards from "@/components/reports/ReportsSummaryCards";
import ReportsPerformanceChart from "@/components/reports/ReportsPerformanceChart";
import ReportsCampaignBreakdown from "@/components/reports/ReportsCampaignBreakdown";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

const Reports = () => {
  const [dateRange, setDateRange] = useState<string>("month");
  const [activeChart, setActiveChart] = useState<string>("line");
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  const currentDate = format(new Date(), "MMMM yyyy", { locale: ptBR });

  return (
    <DashboardLayout>
      <div className={`${isMobile ? 'p-2' : 'p-1 sm:p-6'} space-y-4 sm:space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">Relatórios</h1>
          
          <div className="flex flex-wrap items-center gap-2">
            {isSmallMobile ? (
              <div className="flex overflow-x-auto pb-2 w-full gap-2">
                <Button variant="outline" size="xs" className="flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="h-3 w-3" />
                  <span>Período</span>
                </Button>
                
                <Button variant="outline" size="xs" className="flex items-center gap-1 whitespace-nowrap">
                  <Filter className="h-3 w-3" />
                  <span>Filtrar</span>
                </Button>
                
                <Button variant="outline" size="xs" className="flex items-center gap-1 whitespace-nowrap">
                  <Download className="h-3 w-3" />
                  <span>Exportar</span>
                </Button>
                
                <Button variant="outline" size="xs" className="flex items-center gap-1 whitespace-nowrap">
                  <Share2 className="h-3 w-3" />
                  <span>Compartilhar</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Período</span>
                </Button>
                
                <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filtrar</span>
                </Button>
                
                <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </Button>
                
                <Button variant="outline" size={isMobile ? "xs" : "sm"} className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-muted-foreground">
          Dados do período: {currentDate}
        </div>
        
        {/* Cards de resumo */}
        <ReportsSummaryCards />
        
        {/* Tabs para diferentes tipos de relatórios */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className={`${isSmallMobile ? 'flex' : 'grid md:w-auto md:inline-flex grid-cols-3'} h-auto`}>
            <TabsTrigger value="performance" className={`${isSmallMobile ? 'text-xs' : 'py-2'}`}>
              Desempenho
            </TabsTrigger>
            <TabsTrigger value="conversion" className={`${isSmallMobile ? 'text-xs' : 'py-2'}`}>
              Conversão
            </TabsTrigger>
            <TabsTrigger value="audience" className={`${isSmallMobile ? 'text-xs' : 'py-2'}`}>
              Audiência
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
                <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>Relatório de Desempenho</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
                  Análise completa do desempenho das suas campanhas ao longo do tempo.
                </CardDescription>
                
                <div className={`flex ${isMobile ? 'flex-wrap' : 'flex-nowrap'} gap-2 pt-2`}>
                  <Button 
                    variant={activeChart === "line" ? "default" : "outline"} 
                    size={isMobile ? "xs" : "sm"} 
                    onClick={() => setActiveChart("line")}
                  >
                    <LineChart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    Linha
                  </Button>
                  <Button 
                    variant={activeChart === "bar" ? "default" : "outline"} 
                    size={isMobile ? "xs" : "sm"}
                    onClick={() => setActiveChart("bar")}
                  >
                    <BarChart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    Barras
                  </Button>
                  <Button 
                    variant={activeChart === "pie" ? "default" : "outline"} 
                    size={isMobile ? "xs" : "sm"}
                    onClick={() => setActiveChart("pie")}
                  >
                    <PieChart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    Pizza
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className={isMobile ? 'p-3' : ''}>
                <ReportsPerformanceChart chartType={activeChart} dateRange={dateRange} />
              </CardContent>
              
              <CardFooter className={`flex ${isMobile ? 'flex-col-reverse gap-3 p-3' : 'justify-between flex-wrap gap-2'}`}>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                
                <div className={`flex gap-2 ${isMobile ? 'w-full overflow-x-auto pb-2' : ''}`}>
                  <Button 
                    variant={dateRange === "week" ? "secondary" : "outline"} 
                    size={isMobile ? "xs" : "sm"} 
                    onClick={() => setDateRange("week")}
                    className={isMobile ? 'flex-shrink-0' : ''}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant={dateRange === "month" ? "secondary" : "outline"} 
                    size={isMobile ? "xs" : "sm"}
                    onClick={() => setDateRange("month")}
                    className={isMobile ? 'flex-shrink-0' : ''}
                  >
                    30 dias
                  </Button>
                  <Button 
                    variant={dateRange === "year" ? "secondary" : "outline"} 
                    size={isMobile ? "xs" : "sm"}
                    onClick={() => setDateRange("year")}
                    className={isMobile ? 'flex-shrink-0' : ''}
                  >
                    12 meses
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversion" className="mt-4">
            <Card>
              <CardHeader className={isMobile ? 'p-3' : ''}>
                <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>Relatório de Conversão</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
                  Análise das taxas de conversão por campanha e canal.
                </CardDescription>
              </CardHeader>
              
              <CardContent className={isMobile ? 'p-3' : ''}>
                <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-xs' : ''}`}>
                  Dados de conversão ainda não disponíveis. Faça upload dos dados para visualizar este relatório.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="mt-4">
            <Card>
              <CardHeader className={isMobile ? 'p-3' : ''}>
                <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>Relatório de Audiência</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
                  Análise demográfica e comportamental da sua audiência.
                </CardDescription>
              </CardHeader>
              
              <CardContent className={isMobile ? 'p-3' : ''}>
                <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-xs' : ''}`}>
                  Dados de audiência ainda não disponíveis. Faça upload dos dados para visualizar este relatório.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Detalhamento por campanha */}
        <Card>
          <CardHeader className={isMobile ? 'p-3' : ''}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>Detalhamento por Campanha</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
                  Análise detalhada do desempenho individual de cada campanha.
                </CardDescription>
              </div>
              {isMobile && (
                <Button variant="ghost" size="sm" className="text-purple-600">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className={isMobile ? 'p-0 sm:p-3 overflow-x-auto' : ''}>
            <ReportsCampaignBreakdown />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
