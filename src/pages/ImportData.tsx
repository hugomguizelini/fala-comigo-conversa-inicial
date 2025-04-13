
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { processCsvFile, processAndInsertCampaignData, processAndInsertMonthlyData } from '@/services/csvProcessingService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ImportData = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('campaign');
  const { toast } = useToast();
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    }
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo CSV para importar."
      });
      return;
    }

    setIsUploading(true);
    try {
      const parseResult = await processCsvFile(selectedFile);
      
      if (parseResult.errors.length > 0) {
        throw new Error(`Erro ao processar CSV: ${parseResult.errors[0].message}`);
      }
      
      if (parseResult.data.length === 0) {
        throw new Error('O arquivo CSV não contém dados');
      }

      if (activeTab === 'campaign') {
        const insertedData = await processAndInsertCampaignData(parseResult.data);
        toast({
          title: "Dados importados com sucesso!",
          description: `${insertedData.length} campanhas foram importadas.`,
        });
      } else {
        const insertedData = await processAndInsertMonthlyData(parseResult.data);
        toast({
          title: "Dados importados com sucesso!",
          description: `${insertedData.length} registros de desempenho mensal foram importados.`,
        });
      }
      
      // Limpar após o sucesso
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro durante upload:", error);
      toast({
        variant: "destructive",
        title: "Erro ao importar dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Importar Dados</CardTitle>
            <CardDescription>
              Faça upload de arquivos CSV para importar dados de campanhas ou desempenho mensal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="campaign">Campanhas</TabsTrigger>
                <TabsTrigger value="monthly">Desempenho Mensal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="campaign" className="pt-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Formato esperado para dados de campanhas:</h3>
                  <p className="text-sm text-muted-foreground">
                    nome, status, orçamento, impressões, cliques, ctr, conversões, tipo_conversão, cpc, custo_total, roas
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="pt-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Formato esperado para dados de desempenho mensal:</h3>
                  <p className="text-sm text-muted-foreground">
                    mês, ano, impressões, cliques, conversões, custo
                  </p>
                </div>
              </TabsContent>
              
              <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer mt-4 hover:border-primary/50 transition-colors">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-lg font-medium">
                    {selectedFile ? selectedFile.name : 'Arraste um arquivo CSV ou clique para selecionar'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Apenas arquivos CSV são suportados
                  </p>
                </div>
              </div>
              
              {selectedFile && (
                <div className="mt-4 flex items-center space-x-2 p-2 bg-muted rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              )}
              
              <Button 
                className="w-full mt-6" 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? 'Importando dados...' : 'Importar'}
              </Button>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ImportData;
