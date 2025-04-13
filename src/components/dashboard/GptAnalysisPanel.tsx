
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lightbulb, AlertTriangle, LineChart, ArrowRight, MessageSquare } from "lucide-react";
import { GptAnalysisResult } from "@/hooks/dashboard/useGptAnalysis";
import ReactMarkdown from 'react-markdown';

type GptAnalysisPanelProps = {
  isLoading: boolean;
  analysis: GptAnalysisResult | null;
  onAnalyze: () => void;
  onChat?: (analysis: GptAnalysisResult | null) => void;
};

const GptAnalysisPanel: React.FC<GptAnalysisPanelProps> = ({ 
  isLoading, 
  analysis, 
  onAnalyze,
  onChat
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between bg-purple-50 dark:bg-purple-900/20">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Análise Avançada com IA
          </CardTitle>
          <CardDescription>
            Análise inteligente dos seus dados de marketing com recomendações personalizadas
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!analysis ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Descubra insights valiosos em seus dados</h3>
              <p className="text-muted-foreground">
                Utilize a IA para analisar suas campanhas, identificar problemas e receber recomendações personalizadas.
              </p>
            </div>
            <Button 
              onClick={onAnalyze} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? "Analisando..." : "Analisar com IA"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="resumo" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="problemas">Problemas</TabsTrigger>
                <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
                <TabsTrigger value="acoes">Ações</TabsTrigger>
                <TabsTrigger value="tendencias">Tendências</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resumo" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Resumo Geral</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {analysis.sections.resumoGeral ? (
                    <ReactMarkdown>{analysis.sections.resumoGeral}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nenhum resumo disponível.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="problemas" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium">Problemas Identificados</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {analysis.sections.problemasIdentificados ? (
                    <ReactMarkdown>{analysis.sections.problemasIdentificados}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nenhum problema identificado.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="oportunidades" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-medium">Oportunidades de Otimização</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {analysis.sections.oportunidadesOtimizacao ? (
                    <ReactMarkdown>{analysis.sections.oportunidadesOtimizacao}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma oportunidade identificada.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="acoes" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Ações Recomendadas</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {analysis.sections.acoesRecomendadas ? (
                    <ReactMarkdown>{analysis.sections.acoesRecomendadas}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma ação recomendada.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tendencias" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Tendências Observadas</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {analysis.sections.tendencias ? (
                    <ReactMarkdown>{analysis.sections.tendencias}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma tendência identificada.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => onChat && onChat(analysis)}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 dark:border-purple-900 dark:hover:bg-purple-900/20"
              >
                <MessageSquare className="h-4 w-4 text-purple-500" />
                Conversar com IA
              </Button>
              
              <Button 
                onClick={onAnalyze} 
                variant="outline"
                disabled={isLoading}
                className="flex items-center"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isLoading ? "Atualizando análise..." : "Atualizar análise"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GptAnalysisPanel;
