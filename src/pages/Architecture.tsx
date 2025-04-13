import React, { useState, useRef } from "react";
import { InsighorLogo } from "@/components/auth/InsighorLogo";
import { 
  Layers, Database, Users, ArrowRight, Server, 
  LayoutDashboard, Settings, FileText, Monitor,
  CircleUser, BarChart3, LineChart, BrainCircuit, Download,
  LogIn, UserPlus, Home, Bell, MessageSquare, BarChart2,
  PieChart, ShoppingCart, Search, Calendar, Circle,
  CheckCircle, XCircle, ClipboardCheck, ClipboardX, Info,
  ListChecked, ListOrdered, Rocket, Clock, Cpu, Puzzle
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
            
            {/* Nova seção: VALIDAÇÃO DO PROBLEMA */}
            <section id="problem-validation" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">1. VALIDAÇÃO DO PROBLEMA</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      Como validamos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p>Entrevistas em profundidade com 15 potenciais usuários</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p>Pesquisa quantitativa online com 150 respondentes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p>Análise de dados de uso de soluções similares no mercado</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p>Testes de conceito com protótipos de baixa fidelidade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      O que descobrimos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-1" />
                        <p>78% dos usuários reportaram dificuldade em conectar diferentes plataformas de marketing</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-1" />
                        <p>A análise manual de dados consome em média 12 horas semanais dos profissionais</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-1" />
                        <p>Há uma lacuna significativa entre coleta de dados e geração de insights acionáveis</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-1" />
                        <p>Decisões baseadas apenas em experiência pessoal resultam em 35% menos eficiência</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardX className="h-5 w-5 text-primary" />
                      Ajustes realizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-amber-500 mt-1" />
                        <p>Redirecionamos o foco de "visualização" para "automação de análises"</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-amber-500 mt-1" />
                        <p>Simplificamos a jornada do usuário para reduzir a curva de aprendizado</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-amber-500 mt-1" />
                        <p>Priorizamos integrações com as três principais plataformas de marketing</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-amber-500 mt-1" />
                        <p>Removemos recursos inicialmente planejados que se mostraram pouco relevantes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* Nova seção: MVP ESSENCIAL */}
            <section id="mvp-essential" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">2. MVP ESSENCIAL</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Proposta de valor central
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-6">
                    <p className="text-lg mb-4">Nosso MVP resolverá concretamente:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <div>
                          <p>Automatização da coleta e processamento de dados de múltiplas fontes</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <div>
                          <p>Análise inteligente que identifica padrões não óbvios nas campanhas de marketing</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <div>
                          <p>Geração de insights acionáveis com recomendações práticas para otimização</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecked className="h-5 w-5 text-primary" />
                      Funcionalidades prioritárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</div>
                          Integração com plataformas
                        </h3>
                        <p>Conexão simplificada com Google Ads, Facebook Ads e Analytics em poucos cliques</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</div>
                          Análise de desempenho automatizada
                        </h3>
                        <p>IA que processa dados e identifica oportunidades de melhoria com base em padrões históricos</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</div>
                          Recomendações acionáveis
                        </h3>
                        <p>Sugestões práticas de otimização com estimativa de impacto e dificuldade de implementação</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListOrdered className="h-5 w-5 text-primary" />
                      Jornada simplificada do usuário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                      
                      <div className="space-y-6 relative">
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">1</span>
                          </div>
                          <h4 className="text-sm font-medium">Identifica necessidade</h4>
                          <p className="text-sm text-muted-foreground">Problema específico de marketing digital</p>
                        </div>
                        
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">2</span>
                          </div>
                          <h4 className="text-sm font-medium">Acessa a solução</h4>
                          <p className="text-sm text-muted-foreground">Interface intuitiva com onboarding simplificado</p>
                        </div>
                        
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">3</span>
                          </div>
                          <h4 className="text-sm font-medium">Configura parâmetros</h4>
                          <p className="text-sm text-muted-foreground">Conecta contas, define objetivos, configura preferências</p>
                        </div>
                        
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">4</span>
                          </div>
                          <h4 className="text-sm font-medium">Sistema processa com IA</h4>
                          <p className="text-sm text-muted-foreground">Análise de dados, identificação de padrões, geração de insights</p>
                        </div>
                        
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">5</span>
                          </div>
                          <h4 className="text-sm font-medium">Resultado entregue</h4>
                          <p className="text-sm text-muted-foreground">Dashboard com insights e recomendações acionáveis</p>
                        </div>
                        
                        <div className="ml-10 relative">
                          <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">6</span>
                          </div>
                          <h4 className="text-sm font-medium">Feedback/Iteração</h4>
                          <p className="text-sm text-muted-foreground">Usuário aplica recomendações e informa resultados</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* Nova seção: TECNOLOGIA & IMPLEMENTAÇÃO */}
            <section id="tech-implementation" className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">3. TECNOLOGIA & IMPLEMENTAÇÃO</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      IAs e automações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BrainCircuit className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">OpenAI GPT-4o</h3>
                          <p className="text-xs text-muted-foreground">Processamento de linguagem natural e geração das recomendações</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">TensorFlow Decision Forests</h3>
                          <p className="text-xs text-muted-foreground">Análise preditiva e identificação de padrões</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Airflow</h3>
                          <p className="text-xs text-muted-foreground">Orquestração de fluxos de dados e automação</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Puzzle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">APIs nativas</h3>
                          <p className="text-xs text-muted-foreground">Integração direta com plataformas publicitárias</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Redis</h3>
                          <p className="text-xs text-muted-foreground">Cache e processamento em tempo real</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Plano de execução
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg bg-muted/20">
                        <h3 className="font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs">Horas 1-2</div>
                          Configuração do ambiente
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Setup do React + TypeScript frontend
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Configuração do Node.js backend
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Estruturação do banco de dados
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-muted/20">
                        <h3 className="font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs">Horas 3-5</div>
                          Desenvolvimento das integrações básicas
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Implementação das APIs de autenticação
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Conexão com Google Ads e Facebook
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Estruturação do fluxo de dados
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-muted/20">
                        <h3 className="font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs">Horas 6-8</div>
                          Implementação do core de IA
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Configuração do processamento de dados
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Implementação dos modelos de análise
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Testes iniciais do motor de recomendações
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-muted/20">
                        <h3 className="font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs">Horas 9-12</div>
                          Finalização e testes
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Desenvolvimento da interface de usuário
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Testes unitários e integrados
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Preparação para demonstração
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Arquitetura básica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-auto">
                    <div className="min-w-[600px]">
                      <div className="bg-muted p-8 rounded-lg">
                        <div className="flex flex-col gap-6">
                          <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                            <h3 className="font-medium mb-4 flex items-center">
                              <Monitor className="mr-2 h-5 w-5" /> Interface de Usuário (React + TypeScript)
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="border rounded p-2 text-center text-sm">Dashboard</div>
                              <div className="border rounded p-2 text-center text-sm">Análises</div>
                              <div className="border rounded p-2 text-center text-sm">Recomendações</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowRight className="rotate-90 h-8 w-8 text-primary/60" />
                          </div>
                          
                          <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                            <h3 className="font-medium mb-4 flex items-center">
                              <Server className="mr-2 h-5 w-5" /> Camada de Processamento (Node.js)
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="border rounded p-2 text-center text-sm">API Gateway</div>
                              <div className="border rounded p-2 text-center text-sm">Middleware</div>
                              <div className="border rounded p-2 text-center text-sm">Serviços</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <div className="flex items-center justify-center w-full">
                              <div className="w-1/3 h-0.5 bg-primary/30"></div>
                              <ArrowRight className="h-6 w-6 mx-4 text-primary/60" />
                              <div className="w-1/3 h-0.5 bg-primary/30"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                              <h3 className="font-medium mb-4 flex items-center">
                                <BrainCircuit className="mr-2 h-5 w-5" /> Modelos de IA
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="border rounded p-2 text-center text-sm">OpenAI</div>
                                <div className="border rounded p-2 text-center text-sm">TensorFlow</div>
                              </div>
                            </div>
                            
                            <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                              <h3 className="font-medium mb-4 flex items-center">
                                <Layers className="mr-2 h-5 w-5" /> Sistema de Automação
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="border rounded p-2 text-center text-sm">Airflow</div>
                                <div className="border rounded p-2 text-center text-sm">Agendadores</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowRight className="rotate-90 h-8 w-8 text-primary/60 rotate-180" />
                          </div>
                          
                          <div className="border-2 border-primary/50 rounded-lg p-4 bg-background">
                            <h3 className="font-medium mb-4 flex items-center">
                              <Database className="mr-2 h-5 w-5" /> Base de Dados
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="border rounded p-2 text-center text-sm">PostgreSQL</div>
                              <div className="border rounded p-2 text-center text-sm">Redis Cache</div>
                              <div className="border rounded p-2 text-center text-sm">S3 (arquivos)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Mantido o stack tecnológico (movido para o final) */}
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
