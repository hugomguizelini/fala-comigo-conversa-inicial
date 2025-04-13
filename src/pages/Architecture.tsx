import React, { useState, useRef } from "react";
import { InsighorLogo } from "@/components/auth/InsighorLogo";
import { 
  Layers, Database, Users, ArrowRight, Server, 
  LayoutDashboard, Settings, FileText, Monitor,
  CircleUser, BarChart3, LineChart, BrainCircuit, Download,
  LogIn, UserPlus, Home, Bell, MessageSquare, BarChart2,
  PieChart, ShoppingCart, Search, Calendar, Circle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Architecture = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    try {
      setIsGeneratingPDF(true);
      toast("Gerando PDF, por favor aguarde...");

      // Hide header completely during PDF generation
      const header = document.querySelector("header");
      const origHeaderStyle = header ? header.style.display : "flex";
      if (header) header.style.display = "none";
      
      // Capture current theme state to ensure we keep dark mode for PDF
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.classList.contains("dark") ? "dark" : "light";
      
      // Ensure dark mode is enabled for PDF generation
      if (currentTheme !== "dark") {
        htmlElement.classList.add("dark");
      }
      
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#1A1F2C", // Match dark theme background
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });
      
      // Restore header visibility
      if (header) header.style.display = origHeaderStyle;
      
      // Restore original theme if needed
      if (currentTheme !== "dark") {
        htmlElement.classList.remove("dark");
      }
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageHeight = 295; // A4 height in mm
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save("insightor-arquitetura.pdf");
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <InsighorLogo className="h-8 w-auto" />
              <span className="font-bold text-xl">INSIGHTOR.AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2" 
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                id="download-button"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? "Gerando..." : "Baixar PDF"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/")}
                id="back-button"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </header>
        
        <main className="container py-8" ref={contentRef}>
          <div className="mx-auto max-w-5xl space-y-12 pb-16">
            <section className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Arquitetura e Fluxo</h1>
                <p className="text-muted-foreground text-lg">
                  Documentação completa da arquitetura, componentes e fluxos do sistema Insightor.AI
                </p>
              </div>
              <Separator />
            </section>
            
            <section id="overview" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Visão Geral do Projeto</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Insightor.AI</CardTitle>
                  <CardDescription>Plataforma de análise e otimização de campanhas de marketing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    O Insightor.AI é uma plataforma avançada que utiliza inteligência artificial para analisar, monitorar 
                    e otimizar campanhas de marketing digital. A plataforma conecta-se a diversas fontes de dados, 
                    processa métricas complexas e fornece insights acionáveis para melhorar o desempenho das campanhas.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col items-center p-4 rounded-lg border bg-muted/50">
                      <BrainCircuit className="h-12 w-12 text-primary mb-2" />
                      <h3 className="font-medium text-center">IA para Análise</h3>
                      <p className="text-sm text-center text-muted-foreground mt-2">
                        Algoritmos de IA para identificar padrões e oportunidades
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg border bg-muted/50">
                      <BarChart3 className="h-12 w-12 text-primary mb-2" />
                      <h3 className="font-medium text-center">Métricas Detalhadas</h3>
                      <p className="text-sm text-center text-muted-foreground mt-2">
                        Visualização avançada de dados de performance
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg border bg-muted/50">
                      <LineChart className="h-12 w-12 text-primary mb-2" />
                      <h3 className="font-medium text-center">Otimização Contínua</h3>
                      <p className="text-sm text-center text-muted-foreground mt-2">
                        Sugestões proativas para melhorar resultados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section id="architecture" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Arquitetura do Sistema</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Diagrama de Arquitetura</CardTitle>
                  <CardDescription>Visão técnica dos componentes do sistema</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="w-full min-w-[800px]">
                    <div className="bg-muted p-8 rounded-lg">
                      <div className="flex flex-col gap-6">
                        <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                          <h3 className="font-medium mb-4 flex items-center">
                            <Monitor className="mr-2 h-5 w-5" /> Frontend (React + TypeScript)
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border rounded p-2 text-center text-sm">Auth UI</div>
                            <div className="border rounded p-2 text-center text-sm">Dashboard</div>
                            <div className="border rounded p-2 text-center text-sm">Relatórios</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="rotate-90 h-8 w-8 text-primary/60" />
                        </div>
                        
                        <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                          <h3 className="font-medium mb-4 flex items-center">
                            <Server className="mr-2 h-5 w-5" /> API e Processamento (Node.js)
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border rounded p-2 text-center text-sm">Auth API</div>
                            <div className="border rounded p-2 text-center text-sm">Analytics API</div>
                            <div className="border rounded p-2 text-center text-sm">Motores de IA</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="rotate-90 h-8 w-8 text-primary/60" />
                        </div>
                        
                        <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                          <h3 className="font-medium mb-4 flex items-center">
                            <Database className="mr-2 h-5 w-5" /> Armazenamento de Dados
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="border rounded p-2 text-center text-sm">PostgreSQL</div>
                            <div className="border rounded p-2 text-center text-sm">Redis Cache</div>
                            <div className="border rounded p-2 text-center text-sm">Armazenamento de Arquivos</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="rotate-90 h-8 w-8 text-primary/60" />
                        </div>
                        
                        <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                          <h3 className="font-medium mb-4 flex items-center">
                            <Layers className="mr-2 h-5 w-5" /> Integrações Externas
                          </h3>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="border rounded p-2 text-center text-sm">Google Ads</div>
                            <div className="border rounded p-2 text-center text-sm">Facebook Ads</div>
                            <div className="border rounded p-2 text-center text-sm">Analytics</div>
                            <div className="border rounded p-2 text-center text-sm">Email</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section id="user-flows" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Fluxos do Usuário</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Autenticação</CardTitle>
                  <CardDescription>Processo de autenticação e onboarding</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="w-full min-w-[600px]">
                    <div className="flex items-center justify-between">
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Login</div>
                      <ArrowRight className="h-5 w-5" />
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Verificação</div>
                      <ArrowRight className="h-5 w-5" />
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Dashboard</div>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Cadastro</div>
                      <ArrowRight className="h-5 w-5" />
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Onboarding</div>
                      <ArrowRight className="h-5 w-5" />
                      <div className="border-2 rounded-lg p-3 w-40 text-center bg-background">Dashboard</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Análise de Campanhas</CardTitle>
                  <CardDescription>Processo de análise e otimização</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="w-full min-w-[700px]">
                    <div className="flex flex-wrap gap-4">
                      <div className="border-2 rounded-lg p-3 w-32 text-center bg-background">
                        Conexão com Plataformas
                      </div>
                      <ArrowRight className="h-5 w-5 self-center" />
                      <div className="border-2 rounded-lg p-3 w-32 text-center bg-background">
                        Importação de Dados
                      </div>
                      <ArrowRight className="h-5 w-5 self-center" />
                      <div className="border-2 rounded-lg p-3 w-32 text-center bg-background">
                        Análise de Métricas
                      </div>
                      <ArrowRight className="h-5 w-5 self-center" />
                      <div className="border-2 rounded-lg p-3 w-32 text-center bg-background">
                        Sugestões de Otimização
                      </div>
                      <ArrowRight className="h-5 w-5 self-center" />
                      <div className="border-2 rounded-lg p-3 w-32 text-center bg-background">
                        Implementação
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section id="screens" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Telas do Sistema</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mapa de Telas</CardTitle>
                    <CardDescription>Visão geral das telas do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Primeiro grupo - Autenticação */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <CircleUser className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Autenticação</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <LogIn className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Tela de Login</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <UserPlus className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Tela de Cadastro</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Circle className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Recuperação de Senha</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Interfaces de autenticação com opções de login, cadastro e recuperação de senha
                          </p>
                        </div>
                        
                        {/* Segundo grupo - Dashboard */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Dashboard</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Home className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Página Inicial</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <BarChart2 className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Resumo de KPIs</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Bell className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Alertas</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Área principal com visão geral de métricas e acesso rápido a funcionalidades essenciais
                          </p>
                        </div>
                        
                        {/* Terceiro grupo - Relatórios */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Relatórios</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <PieChart className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Análise de Campanhas</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <LineChart className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Desempenho no Tempo</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <FileText className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Exportações</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Relatórios detalhados com filtros avançados e análises comparativas
                          </p>
                        </div>
                        
                        {/* Quarto grupo - Configurações */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Settings className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Configurações</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <CircleUser className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Perfil do Usuário</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Users className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Gestão de Time</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Layers className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Integrações</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Configurações de conta, preferências e integrações com plataformas
                          </p>
                        </div>
                        
                        {/* Quinto grupo - Campanhas */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Campanhas</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Calendar className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Calendário de Campanhas</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <BarChart3 className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Monitoramento</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <Search className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Explorador</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Gestão e monitoramento de campanhas de marketing nos diversos canais
                          </p>
                        </div>
                        
                        {/* Sexto grupo - Suporte */}
                        <div className="space-y-6 border-2 border-primary/30 p-4 rounded-lg bg-background/80">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Suporte</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <MessageSquare className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Chat de Suporte</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <FileText className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">Base de Conhecimento</span>
                            </div>
                            
                            <div className="flex items-center gap-2 border border-muted p-3 rounded-md bg-background">
                              <BrainCircuit className="h-4 w-4 text-primary/80" />
                              <span className="text-sm">IA de Ajuda</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            Recursos de suporte incluindo chat ao vivo e documentação de ajuda
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Fluxos Entre Telas</CardTitle>
                    <CardDescription>Diagrama de interação entre as principais áreas do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-6">
                      <div className="relative w-full min-h-[400px] overflow-x-auto">
                        {/* Diagrama de fluxo principal */}
                        <div className="flex flex-col items-center justify-center gap-8">
                          {/* Autenticação */}
                          <div className="flex flex-col items-center">
                            <div className="border-2 border-primary/50 rounded-lg px-6 py-3 bg-background flex items-center gap-2 font-medium">
                              <CircleUser className="h-4 w-4" />
                              <span>Autenticação</span>
                            </div>
                            <ArrowRight className="rotate-90 h-6 w-6 my-2 text-primary/60" />
                          </div>
                          
                          {/* Dashboard e subfluxos */}
                          <div className="flex flex-col items-center">
                            <div className="border-2 border-primary/50 rounded-lg px-6 py-3 bg-background flex items-center gap-2 font-medium">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Dashboard Principal</span>
                            </div>
                            
                            {/* Conexões a partir do Dashboard */}
                            <div className="mt-8 grid grid-cols-3 gap-x-24 gap-y-12">
                              {/* Relatórios */}
                              <div className="flex flex-col items-center">
                                <ArrowRight className="rotate-90 -mt-8 h-6 w-6 text-primary/60" />
                                <div className="border-2 border-primary/30 rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>Relatórios</span>
                                </div>
                                <div className="mt-4 flex gap-4">
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Análises</div>
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Exportação</div>
                                </div>
                              </div>
                              
                              {/* Campanhas */}
                              <div className="flex flex-col items-center">
                                <ArrowRight className="rotate-90 -mt-8 h-6 w-6 text-primary/60" />
                                <div className="border-2 border-primary/30 rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                                  <ShoppingCart className="h-4 w-4" />
                                  <span>Campanhas</span>
                                </div>
                                <div className="mt-4 flex gap-4">
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Criação</div>
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Monitoramento</div>
                                </div>
                              </div>
                              
                              {/* Configurações */}
                              <div className="flex flex-col items-center">
                                <ArrowRight className="rotate-90 -mt-8 h-6 w-6 text-primary/60" />
                                <div className="border-2 border-primary/30 rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                                  <Settings className="h-4 w-4" />
                                  <span>Configurações</span>
                                </div>
                                <div className="mt-4 flex gap-4">
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Perfil</div>
                                  <div className="border rounded px-2 py-1 text-xs bg-background">Integrações</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Legenda do diagrama */}
                        <div className="mt-8 border-t pt-4">
                          <h4 className="text-sm font-medium mb-2">Legenda:</h4>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-primary/50 rounded-sm"></div>
                              <span>Tela Principal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-primary/30 rounded-sm"></div>
                              <span>Área Secundária</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ArrowRight className="h-3 w-3 text-primary/60" />
                              <span>Fluxo de Navegação</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section id="backend-flows" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Fluxos de Backend</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Processamento de Dados</CardTitle>
                  <CardDescription>Fluxo de ETL e análise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <ol className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <div>
                          <h4 className="font-medium">Coleta de Dados</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Conexão via APIs com plataformas de ads e analytics para extração periódica de métricas
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <div>
                          <h4 className="font-medium">Processamento</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Normalização, limpeza e agregação de dados em formatos padronizados
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <div>
                          <h4 className="font-medium">Análise por IA</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Algoritmos de machine learning para identificar padrões, anomalias e oportunidades
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">4</div>
                        <div>
                          <h4 className="font-medium">Geração de Insights</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Conversão de análises em sugestões práticas e acionáveis
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">5</div>
                        <div>
                          <h4 className="font-medium">Armazenamento</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Persistência em banco de dados e cache para acesso otimizado
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Segurança e Autenticação</CardTitle>
                  <CardDescription>Fluxo de segurança do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <div className="min-w-[600px]">
                      <div className="bg-muted p-6 rounded-lg">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="font-medium text-center mb-2">Autenticação</h4>
                            <ul className="space-y-2">
                              <li className="border bg-card rounded-md p-2 text-sm">JWT Tokens</li>
                              <li className="border bg-card rounded-md p-2 text-sm">OAuth 2.0</li>
                              <li className="border bg-card rounded-md p-2 text-sm">2FA</li>
                              <li className="border bg-card rounded-md p-2 text-sm">Refresh Tokens</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-medium text-center mb-2">Proteção de Dados</h4>
                            <ul className="space-y-2">
                              <li className="border bg-card rounded-md p-2 text-sm">Criptografia em Trânsito (SSL/TLS)</li>
                              <li className="border bg-card rounded-md p-2 text-sm">Criptografia em Repouso</li>
                              <li className="border bg-card rounded-md p-2 text-sm">Mascaramento de Dados Sensíveis</li>
                              <li className="border bg-card rounded-md p-2 text-sm">Backups Criptografados</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section id="tech-stack" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">Stack Tecnológico</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frontend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        React + TypeScript
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Tailwind CSS
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Shadcn UI
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        React Query
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Recharts
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Backend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Node.js + TypeScript
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Express.js
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Supabase
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Prisma ORM
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        JWT Auth
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Infraestrutura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        PostgreSQL
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Redis
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Docker
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        AWS/Vercel
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        CI/CD Pipeline
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
        
        <footer className="border-t">
          <div className="container flex h-16 items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Insightor.AI. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Architecture;
