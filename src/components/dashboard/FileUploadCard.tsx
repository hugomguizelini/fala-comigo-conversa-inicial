
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  processAndInsertCampaignData, 
  processAndInsertMonthlyData,
} from "@/services/supabaseService";
import { processCsvFile } from "@/services/csvProcessingService";
import { Progress } from "@/components/ui/progress";

type FileUploadCardProps = {
  onFilesProcessed: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const FileUploadCard = ({ onFilesProcessed, isLoading, setIsLoading }: FileUploadCardProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingFile, setProcessingFile] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsLoading(true);
    setProcessingProgress(0);
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setProcessingFile(file.name);
        
        // Update progress based on file position
        setProcessingProgress(Math.round((i / acceptedFiles.length) * 50));
        
        // First process the CSV file to get the data
        const parseResult = await processCsvFile(file);
        
        if (parseResult.errors && parseResult.errors.length > 0) {
          console.error("Error parsing CSV:", parseResult.errors);
          throw new Error(`Erro ao processar ${file.name}: ${parseResult.errors[0].message}`);
        }

        // Update progress after parsing
        setProcessingProgress(Math.round(50 + (i / acceptedFiles.length) * 25));
        
        // Then pass the parsed data to the insertion functions
        if (file.name.includes("campaign") || file.name.includes("campanha")) {
          await processAndInsertCampaignData(parseResult.data);
          toast({
            title: "Arquivo de campanha processado",
            description: `${file.name} foi processado como dados de campanha.`
          });
        } else if (file.name.includes("monthly") || file.name.includes("mensal")) {
          await processAndInsertMonthlyData(parseResult.data);
          toast({
            title: "Arquivo de dados mensais processado",
            description: `${file.name} foi processado como dados mensais.`
          });
        } else {
          await processAndInsertCampaignData(parseResult.data);
          toast({
            title: "Arquivo processado",
            description: `${file.name} foi processado como dados de campanha (padrão).`
          });
        }
        
        // Update progress after insertion
        setProcessingProgress(Math.round(75 + (i / acceptedFiles.length) * 25));
      }
      
      // All files processed, update progress to 100%
      setProcessingProgress(100);
      
      await onFilesProcessed();
      
      setFiles(prev => [...prev, ...acceptedFiles]);
      toast({
        title: "Processamento concluído",
        description: `${acceptedFiles.length} arquivo(s) carregado(s) e processado(s) com sucesso.`,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Erro ao processar arquivos",
        description: error instanceof Error ? error.message : "Verifique o formato dos seus arquivos CSV.",
        variant: "destructive"
      });
    } finally {
      setProcessingFile(null);
      setProcessingProgress(0);
      setIsLoading(false);
    }
  }, [toast, onFilesProcessed, setIsLoading]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: isLoading,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'text/plain': ['.csv', '.txt']
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregar Documentos da Campanha</CardTitle>
        <CardDescription>
          Arraste e solte arquivos CSV com dados de campanhas para análise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              {isLoading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">
                {isLoading ? "Processando..." : isDragActive ? "Solte os arquivos aqui" : "Arraste e solte arquivos CSV com dados da campanha"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Aguarde, estamos processando seus dados..." : "ou clique para navegar pelos arquivos"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Para dados de campanha, use arquivos com "campaign" ou "campanha" no nome.<br/>
                Para dados mensais, use arquivos com "monthly" ou "mensal" no nome.
              </p>
            </div>
          </div>
        </div>
        
        {isLoading && processingFile && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Processando {processingFile}</span>
              <span className="text-sm font-medium">{processingProgress}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Arquivos Carregados</h3>
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border rounded">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
