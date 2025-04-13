
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStatus } from "@/hooks/dashboard/useAuthStatus";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, AtSign, Phone, MapPin, Building, Mail, Shield, Key, FileText, BellRing } from "lucide-react";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuthStatus();
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: user?.user_metadata?.name || "Usuário Insightor",
    email: user?.email || "usuario@exemplo.com",
    phone: user?.user_metadata?.phone || "",
    company: user?.user_metadata?.company || "Minha Empresa",
    position: user?.user_metadata?.position || "Marketing Manager",
    location: user?.user_metadata?.location || "São Paulo, Brasil",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
    console.log(data);
  }

  return (
    <DashboardLayout>
      <div className={`${isMobile ? 'p-3' : 'p-6'} space-y-4 sm:space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Perfil de Usuário</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size={isMobile ? "sm" : "default"}>Editar Perfil</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} size={isMobile ? "sm" : "default"}>Cancelar</Button>
              <Button onClick={form.handleSubmit(onSubmit)} size={isMobile ? "sm" : "default"}>Salvar Alterações</Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-12">
          {/* Coluna da esquerda com informações do perfil - em mobile fica em cima */}
          <div className="md:col-span-4 space-y-4">
            <Card>
              <CardContent className={`${isMobile ? 'p-4' : 'pt-6'} flex flex-col items-center text-center`}>
                <Avatar className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} mb-4`}>
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-3xl bg-purple-500 text-white">
                    {(user?.user_metadata?.name || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{defaultValues.fullName}</h2>
                <p className="text-muted-foreground">{defaultValues.position}</p>
                <p className="text-muted-foreground">{defaultValues.company}</p>
                <div className="flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{defaultValues.location}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-2">
                <Button variant="outline" className="w-full" size={isMobile ? "sm" : "default"}>Ver Atividades</Button>
                <Button variant="outline" className="w-full" size={isMobile ? "sm" : "default"}>Histórico de Relatórios</Button>
              </CardFooter>
            </Card>

            {!isSmallMobile && (
              <Card>
                <CardHeader className={isMobile ? 'p-4' : ''}>
                  <CardTitle className={isMobile ? 'text-lg' : ''}>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? 'px-4 pb-4' : ''} space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{defaultValues.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{defaultValues.phone || "Não informado"}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna da direita com formulário ou detalhes */}
          <div className="md:col-span-8 space-y-4">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${isSmallMobile ? 'text-xs' : ''}`}>
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  <span className={isSmallMobile ? 'hidden' : ''}>Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className={isSmallMobile ? 'hidden' : ''}>Segurança</span>
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BellRing className="h-4 w-4 mr-2" />
                  <span className={isSmallMobile ? 'hidden' : ''}>Notificações</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader className={isMobile ? 'p-4' : ''}>
                    <CardTitle className={isMobile ? 'text-lg' : ''}>Informações do Perfil</CardTitle>
                    <CardDescription className={isMobile ? 'text-xs' : ''}>
                      Gerencie suas informações pessoais nesta seção.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={isMobile ? 'text-xs' : ''}>Nome Completo</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Seu nome" 
                                  {...field} 
                                  disabled={!isEditing}
                                  className={isMobile ? 'h-9' : ''}
                                />
                              </FormControl>
                              <FormMessage className={isMobile ? 'text-xs' : ''} />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={isMobile ? 'text-xs' : ''}>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="seu.email@exemplo.com" 
                                  {...field} 
                                  disabled={!isEditing}
                                  className={isMobile ? 'h-9' : ''}
                                />
                              </FormControl>
                              <FormMessage className={isMobile ? 'text-xs' : ''} />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={isMobile ? 'text-xs' : ''}>Telefone</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="(11) 99999-9999" 
                                    {...field} 
                                    disabled={!isEditing}
                                    className={isMobile ? 'h-9' : ''}
                                  />
                                </FormControl>
                                <FormMessage className={isMobile ? 'text-xs' : ''} />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={isMobile ? 'text-xs' : ''}>Localização</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Cidade, País" 
                                    {...field} 
                                    disabled={!isEditing}
                                    className={isMobile ? 'h-9' : ''}
                                  />
                                </FormControl>
                                <FormMessage className={isMobile ? 'text-xs' : ''} />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={isMobile ? 'text-xs' : ''}>Empresa</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome da empresa" 
                                    {...field} 
                                    disabled={!isEditing}
                                    className={isMobile ? 'h-9' : ''}
                                  />
                                </FormControl>
                                <FormMessage className={isMobile ? 'text-xs' : ''} />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={isMobile ? 'text-xs' : ''}>Cargo</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Seu cargo" 
                                    {...field} 
                                    disabled={!isEditing}
                                    className={isMobile ? 'h-9' : ''}
                                  />
                                </FormControl>
                                <FormMessage className={isMobile ? 'text-xs' : ''} />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader className={isMobile ? 'p-4' : ''}>
                    <CardTitle className={isMobile ? 'text-lg' : ''}>Segurança</CardTitle>
                    <CardDescription className={isMobile ? 'text-xs' : ''}>
                      Gerencie suas configurações de segurança e acesso.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={`${isMobile ? 'p-4 pt-0' : ''} space-y-4`}>
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className={isMobile ? 'text-xs' : ''}>Senha Atual</Label>
                      <Input id="current-password" type="password" disabled={!isEditing} className={isMobile ? 'h-9' : ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className={isMobile ? 'text-xs' : ''}>Nova Senha</Label>
                      <Input id="new-password" type="password" disabled={!isEditing} className={isMobile ? 'h-9' : ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className={isMobile ? 'text-xs' : ''}>Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" disabled={!isEditing} className={isMobile ? 'h-9' : ''} />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-2`}>Autenticação de Dois Fatores</h3>
                      <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-xs' : ''}`}>Proteja sua conta com uma camada adicional de segurança.</p>
                      <Button variant="outline" className="w-full sm:w-auto" size={isMobile ? "sm" : "default"}>
                        <Key className="mr-2 h-4 w-4" />
                        Configurar 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader className={isMobile ? 'p-4' : ''}>
                    <CardTitle className={isMobile ? 'text-lg' : ''}>Preferências de Notificações</CardTitle>
                    <CardDescription className={isMobile ? 'text-xs' : ''}>
                      Escolha como e quando deseja receber notificações.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={`${isMobile ? 'p-4 pt-0' : ''} space-y-4`}>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-reports" className={isMobile ? 'text-xs' : ''}>Relatórios de desempenho</Label>
                          <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                            Receba relatórios semanais por email
                          </p>
                        </div>
                        <Button variant="outline" size={isMobile ? "xs" : "sm"} disabled={!isEditing}>Ativar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="campaign-alerts" className={isMobile ? 'text-xs' : ''}>Alertas de campanhas</Label>
                          <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                            Notificações sobre mudanças em suas campanhas
                          </p>
                        </div>
                        <Button variant="outline" size={isMobile ? "xs" : "sm"} disabled={!isEditing}>Ativar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="security-alerts" className={isMobile ? 'text-xs' : ''}>Alertas de segurança</Label>
                          <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                            Notificações sobre atividades suspeitas
                          </p>
                        </div>
                        <Button variant="outline" size={isMobile ? "xs" : "sm"} disabled={!isEditing}>Ativar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {!isSmallMobile && (
              <Card>
                <CardHeader className={isMobile ? 'p-4' : ''}>
                  <CardTitle className={isMobile ? 'text-lg' : ''}>Credenciais de Acesso</CardTitle>
                  <CardDescription className={isMobile ? 'text-xs' : ''}>
                    Gerencie suas chaves de API e integrações.
                  </CardDescription>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-4 pt-0' : ''} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Chave de API</h4>
                      <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                        Para integração com outras ferramentas
                      </p>
                    </div>
                    <Button variant="outline" size={isMobile ? "xs" : "sm"}>Gerar Nova Chave</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google Ads</h4>
                      <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                        Conectado em 15/04/2023
                      </p>
                    </div>
                    <Button variant="outline" size={isMobile ? "xs" : "sm"}>Reconectar</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isSmallMobile && (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{defaultValues.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{defaultValues.phone || "Não informado"}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isSmallMobile && (
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Credenciais de Acesso</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Chave de API</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Para integração com outras ferramentas
                      </p>
                      <Button variant="outline" size="xs">Gerar</Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Google Ads</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Conectado em 15/04/2023
                      </p>
                      <Button variant="outline" size="xs">Reconectar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
