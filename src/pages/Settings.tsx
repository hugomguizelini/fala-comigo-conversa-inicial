
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuthStatus } from "@/hooks/dashboard/useAuthStatus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings as SettingsIcon, Palette, Bell, Database, Share2, LogOut, Trash2, Monitor, Calendar, Globe, Moon, Sun, Newspaper } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuthStatus();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso");
    navigate("/login");
  };

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso");
  };

  const handleDeleteAccount = () => {
    toast.error("Esta funcionalidade ainda não está disponível");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
        </div>

        <Tabs defaultValue="aparencia" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="aparencia">
              <Palette className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              <Newspaper className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="integracoes">
              <Share2 className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="conta">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Aparência */}
          <TabsContent value="aparencia">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tema</CardTitle>
                  <CardDescription>
                    Escolha o tema de sua preferência para a interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup className="grid grid-cols-3 gap-4" defaultValue={theme}>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="light" className="sr-only" onClick={() => theme !== "light" && toggleTheme()} />
                      <Sun className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Claro</span>
                    </Label>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="dark" className="sr-only" onClick={() => theme !== "dark" && toggleTheme()} />
                      <Moon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Escuro</span>
                    </Label>
                    <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value="system" className="sr-only" />
                      <Monitor className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Sistema</span>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Idioma e Região</CardTitle>
                  <CardDescription>
                    Escolha seu idioma e fuso horário preferidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="pt-BR">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select defaultValue="America/Sao_Paulo">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-4)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+1)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de Data</Label>
                    <Select defaultValue="dd/MM/yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Selecione o formato de data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-reports" className="font-medium">Relatórios semanais</Label>
                        <p className="text-sm text-muted-foreground">Receba um resumo semanal do desempenho das campanhas</p>
                      </div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-alerts" className="font-medium">Alertas de desempenho</Label>
                        <p className="text-sm text-muted-foreground">Notificações quando métricas estiverem fora do esperado</p>
                      </div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-news" className="font-medium">Novidades e dicas</Label>
                        <p className="text-sm text-muted-foreground">Receba dicas de otimização e novidades da plataforma</p>
                      </div>
                      <Button variant="outline" size="sm">Desativar</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">No Aplicativo</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-campaigns" className="font-medium">Campanhas</Label>
                        <p className="text-sm text-muted-foreground">Atualizações sobre o status de suas campanhas</p>
                      </div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-comments" className="font-medium">Comentários e menções</Label>
                        <p className="text-sm text-muted-foreground">Quando você for mencionado em comentários</p>
                      </div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-system" className="font-medium">Sistema</Label>
                        <p className="text-sm text-muted-foreground">Atualizações e manutenções da plataforma</p>
                      </div>
                      <Button variant="outline" size="sm">Ativar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Relatórios</CardTitle>
                <CardDescription>
                  Personalize seus relatórios e exportações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferências de Exibição</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-chart">Tipo de gráfico padrão</Label>
                    <Select defaultValue="line">
                      <SelectTrigger id="default-chart">
                        <SelectValue placeholder="Selecione o tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Linha</SelectItem>
                        <SelectItem value="bar">Barra</SelectItem>
                        <SelectItem value="pie">Pizza</SelectItem>
                        <SelectItem value="area">Área</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-period">Período padrão</Label>
                    <Select defaultValue="30d">
                      <SelectTrigger id="default-period">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="90d">90 dias</SelectItem>
                        <SelectItem value="1y">1 ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-grouping">Agrupamento de dados</Label>
                    <Select defaultValue="day">
                      <SelectTrigger id="data-grouping">
                        <SelectValue placeholder="Selecione o agrupamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Por hora</SelectItem>
                        <SelectItem value="day">Por dia</SelectItem>
                        <SelectItem value="week">Por semana</SelectItem>
                        <SelectItem value="month">Por mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Exportação</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Formato padrão de exportação</Label>
                    <Select defaultValue="xlsx">
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-reports">Relatórios automáticos por email</Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="weekly-report" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <Label htmlFor="weekly-report" className="leading-none">Relatório semanal (segunda-feira)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="monthly-report" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <Label htmlFor="monthly-report" className="leading-none">Relatório mensal (primeiro dia do mês)</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrações */}
          <TabsContent value="integracoes">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Conecte-se com suas plataformas e serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Google Ads */}
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google Ads</h3>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Gerenciar</Button>
                  </div>

                  {/* Facebook Ads */}
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Facebook Ads</h3>
                        <p className="text-sm text-muted-foreground">Não conectado</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>

                  {/* LinkedIn Ads */}
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn Ads</h3>
                        <p className="text-sm text-muted-foreground">Não conectado</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>

                  {/* Google Analytics */}
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google Analytics</h3>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Gerenciar</Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Chave de API</h3>
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="api-key">Sua chave de API</Label>
                      <Input id="api-key" type="password" value="api-xxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Mostrar</Button>
                      <Button>Regenerar</Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Esta chave permite a integração da plataforma com seus sistemas. Mantenha-a em segurança.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conta */}
          <TabsContent value="conta">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Plano e Assinatura</CardTitle>
                  <CardDescription>
                    Detalhes sobre seu plano atual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Plano Pro</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Ativo</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Renovação em 15/05/2023</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Campanhas</span>
                      <span className="text-sm font-medium">15 de 20</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline">Ver histórico de faturas</Button>
                    <Button>Gerenciar plano</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Conta</CardTitle>
                  <CardDescription>
                    Opções avançadas para sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Membros da Equipe</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gerencie quem tem acesso à sua conta
                    </p>
                    <Button variant="outline">
                      Gerenciar membros
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-2 text-destructive">Zona de Perigo</h3>
                    <div className="space-y-4">
                      <div>
                        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Desconectar
                        </Button>
                      </div>
                      <div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir minha conta
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atenção: Esta ação não pode ser desfeita.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
