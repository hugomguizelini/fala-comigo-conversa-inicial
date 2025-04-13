import React, { useRef, useState } from "react";
import { InsighorLogo } from "@/components/auth/InsighorLogo";
import { 
  Layers, Database, Users, ArrowRight, Server, 
  LayoutDashboard, Settings, FileText, Monitor,
  CircleUser, BarChart3, LineChart, BrainCircuit, Download,
  LogIn, UserPlus, Home, Bell, MessageSquare, BarChart2,
  PieChart, ShoppingCart, Search, Calendar, Circle,
  CheckCircle, XCircle, ClipboardCheck, ClipboardX, Info,
  ListCheck, ListOrdered, Rocket, Clock, Cpu, Puzzle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// Remove the ThemeProvider import since we're already wrapped in ThemeProvider in App.tsx
import { useTheme } from "@/contexts/ThemeContext";

const Architecture = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // Get theme from context instead of creating a new provider
  const { theme } = useTheme();

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
    // Remove the ThemeProvider wrapper since it's already provided in App.tsx
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
      
      <main className="container pt-6 pb-16" ref={contentRef}>
        <div className="mx-auto max-w-5xl">
          <section className="mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Arquitetura e Fluxo</h1>
              <p className="text-muted-foreground">
                Documentação da arquitetura, componentes e fluxos do sistema Insightor.AI
              </p>
            </div>
            <Separator className="my-4" />
          </section>
          
          <Tabs defaultValue="problem" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="problem">1. Validação do Problema</TabsTrigger>
              <TabsTrigger value="mvp">2. MVP Essencial</TabsTrigger>
              <TabsTrigger value="tech">3. Tecnologia & Implementação</TabsTrigger>
            </TabsList>
            
            {/* TAB 1: VALIDAÇÃO DO PROBLEMA */}
            <TabsContent value="problem" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      Como validamos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>Entrevistas com 15 potenciais usuários</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>Pesquisa quantitativa com 150 respondentes</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>Análise de dados de soluções similares</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p>Testes com protótipos de baixa fidelidade</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-primary" />
                      O que descobrimos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p>78% têm dificuldade em conectar plataformas</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p>Análise manual consome 12h semanais</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p>Lacuna entre coleta e insights acionáveis</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p>Decisões sem dados: 35% menos eficiência</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ClipboardX className="h-5 w-5 text-primary" />
                      Ajustes realizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p>De "visualização" para "automação"</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p>Simplificação da jornada do usuário</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p>Priorização de 3 integrações principais</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p>Remoção de recursos pouco relevantes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* TAB 2: MVP ESSENCIAL */}
            <TabsContent value="mvp" className="space-y-4">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Rocket className="h-5 w-5 text-primary" />
                    Proposta de valor central
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm mb-2">Nosso MVP resolverá concretamente:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
                        <p className="text-sm">Automatização da coleta e processamento de dados de múltiplas fontes</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                        <p className="text-sm">Análise inteligente que identifica padrões não óbvios nas campanhas</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
                        <p className="text-sm">Geração de insights acionáveis com recomendações práticas</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ListCheck className="h-5 w-5 text-primary" />
                      Funcionalidades prioritárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <h3 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs">1</div>
                        Integração com plataformas
                      </h3>
                      <p className="text-xs">Conexão com Google Ads, Facebook Ads e Analytics em poucos cliques</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <h3 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs">2</div>
                        Análise de desempenho automática
                      </h3>
                      <p className="text-xs">IA que processa dados e identifica oportunidades de melhoria</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <h3 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-xs">3</div>
                        Recomendações acionáveis
                      </h3>
                      <p className="text-xs">Sugestões práticas com estimativa de impacto e dificuldade</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ListOrdered className="h-5 w-5 text-primary" />
                      Jornada simplificada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
                      
                      <div className="space-y-3 relative">
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">1</span>
                          </div>
                          <h4 className="text-xs font-medium">Identifica necessidade</h4>
                          <p className="text-xs text-muted-foreground">Problema de marketing digital</p>
                        </div>
                        
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">2</span>
                          </div>
                          <h4 className="text-xs font-medium">Acessa a solução</h4>
                          <p className="text-xs text-muted-foreground">Interface com onboarding simplificado</p>
                        </div>
                        
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">3</span>
                          </div>
                          <h4 className="text-xs font-medium">Configura parâmetros</h4>
                          <p className="text-xs text-muted-foreground">Conecta contas, define objetivos</p>
                        </div>
                        
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">4</span>
                          </div>
                          <h4 className="text-xs font-medium">Sistema processa com IA</h4>
                          <p className="text-xs text-muted-foreground">Análise, identificação de padrões</p>
                        </div>
                        
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">5</span>
                          </div>
                          <h4 className="text-xs font-medium">Resultado entregue</h4>
                          <p className="text-xs text-muted-foreground">Dashboard com insights</p>
                        </div>
                        
                        <div className="ml-7 relative">
                          <div className="absolute -left-7 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs">
                            <span className="text-xs text-primary-foreground font-medium">6</span>
                          </div>
                          <h4 className="text-xs font-medium">Feedback/Iteração</h4>
                          <p className="text-xs text-muted-foreground">Aplica e informa resultados</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* TAB 3: TECNOLOGIA & IMPLEMENTAÇÃO */}
            <TabsContent value="tech" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      IAs e automações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
                        <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium">OpenAI GPT-4o</h3>
                          <p className="text-[10px] text-muted-foreground">NLP e recomendações</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
                        <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium">TensorFlow</h3>
                          <p className="text-[10px] text-muted-foreground">Análise preditiva</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
                        <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium">Airflow</h3>
                          <p className="text-[10px] text-muted-foreground">Orquestração</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
                        <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Puzzle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium">APIs Nativas</h3>
                          <p className="text-[10px] text-muted-foreground">Integrações</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Plano de execução
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="p-2 border rounded-lg bg-muted/20">
                        <h3 className="text-xs font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px]">H 1-2</div>
                          Setup ambiente
                        </h3>
                        <div className="mt-1 text-[10px] flex gap-2">
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> React</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Node.js</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> BD</span>
                        </div>
                      </div>
                      
                      <div className="p-2 border rounded-lg bg-muted/20">
                        <h3 className="text-xs font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px]">H 3-5</div>
                          Integrações
                        </h3>
                        <div className="mt-1 text-[10px] flex gap-2">
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Auth</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Ads</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Fluxo</span>
                        </div>
                      </div>
                      
                      <div className="p-2 border rounded-lg bg-muted/20">
                        <h3 className="text-xs font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px]">H 6-8</div>
                          Core de IA
                        </h3>
                        <div className="mt-1 text-[10px] flex gap-2">
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Dados</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Modelos</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Testes</span>
                        </div>
                      </div>
                      
                      <div className="p-2 border rounded-lg bg-muted/20">
                        <h3 className="text-xs font-medium flex items-center gap-2">
                          <div className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px]">H 9-12</div>
                          UI e testes
                        </h3>
                        <div className="mt-1 text-[10px] flex gap-2">
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Interface</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Test</span>
                          <span className="flex items-center"><CheckCircle className="h-2.5 w-2.5 text-green-500 mr-0.5" /> Demo</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5 text-primary" />
                    Arquitetura básica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-auto">
                    <div className="min-w-[500px]">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex flex-col gap-4">
                          <div className="border rounded-lg p-2 bg-background">
                            <h3 className="text-xs font-medium mb-1 flex items-center">
                              <Monitor className="mr-1 h-3 w-3" /> UI (React + TS)
                            </h3>
                            <div className="grid grid-cols-3 gap-1">
                              <div className="border rounded p-1 text-center text-[10px]">Dashboard</div>
                              <div className="border rounded p-1 text-center text-[10px]">Análises</div>
                              <div className="border rounded p-1 text-center text-[10px]">Config</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowRight className="rotate-90 h-4 w-4 text-primary/60" />
                          </div>
                          
                          <div className="border rounded-lg p-2 bg-background">
                            <h3 className="text-xs font-medium mb-1 flex items-center">
                              <Server className="mr-1 h-3 w-3" /> Processamento (Node.js)
                            </h3>
                            <div className="grid grid-cols-3 gap-1">
                              <div className="border rounded p-1 text-center text-[10px]">API</div>
                              <div className="border rounded p-1 text-center text-[10px]">Middleware</div>
                              <div className="border rounded p-1 text-center text-[10px]">Serviços</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <div className="flex items-center justify-center w-full">
                              <div className="w-1/3 h-0.5 bg-primary/30"></div>
                              <ArrowRight className="h-3 w-3 mx-2 text-primary/60" />
                              <div className="w-1/3 h-0.5 bg-primary/30"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="border rounded-lg p-2 bg-background">
                              <h3 className="text-xs font-medium mb-1 flex items-center">
                                <BrainCircuit className="mr-1 h-3 w-3" /> Modelos IA
                              </h3>
                              <div className="flex gap-1">
                                <div className="border rounded p-1 text-center text-[10px] flex-1">GPT</div>
                                <div className="border rounded p-1 text-center text-[10px] flex-1">TF</div>
                              </div>
                            </div>
                            
                            <div className="border rounded-lg p-2 bg-background">
                              <h3 className="text-xs font-medium mb-1 flex items-center">
                                <Cpu className="mr-1 h-3 w-3" /> Automação
                              </h3>
                              <div className="flex gap-1">
                                <div className="border rounded p-1 text-center text-[10px] flex-1">Airflow</div>
                                <div className="border rounded p-1 text-center text-[10px] flex-1">Jobs</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowRight className="rotate-90 h-4 w-4 text-primary/60 rotate-180" />
                          </div>
                          
                          <div className="border rounded-lg p-2 bg-background">
                            <h3 className="text-xs font-medium mb-1 flex items-center">
                              <Database className="mr-1 h-3 w-3" /> Base de Dados
                            </h3>
                            <div className="grid grid-cols-3 gap-1">
                              <div className="border rounded p-1 text-center text-[10px]">PostgreSQL</div>
                              <div className="border rounded p-1 text-center text-[10px]">Redis</div>
                              <div className="border rounded p-1 text-center text-[10px]">S3</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
  );
};

export default Architecture;
