
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartBar, ArrowRight, Trash2 } from "lucide-react";
import { CampaignData } from "@/types/dataTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

type CampaignsTableProps = {
  campaigns: CampaignData[];
  onDataReset?: () => Promise<void>;
};

// Modificada para incluir todas as campanhas, não apenas aquelas com dados "significativos"
const hasMeaningfulData = (campaign: CampaignData): boolean => {
  // Agora retorna true para todas as campanhas, incluindo aquelas com valores zerados
  return true;
};

export const CampaignsTable = ({ campaigns, onDataReset }: CampaignsTableProps) => {
  const isMobile = useIsMobile();
  
  // Filtra as campanhas para mostrar apenas aquelas com dados relevantes
  const meaningfulCampaigns = campaigns.filter(hasMeaningfulData);
  
  const handleResetData = async () => {
    if (onDataReset) {
      try {
        toast.loading("Excluindo dados...");
        await onDataReset();
        toast.success("Todos os dados foram excluídos com sucesso!");
      } catch (error) {
        console.error("Error resetting data:", error);
        toast.error("Erro ao excluir dados. Tente novamente.");
      }
    }
  };

  // Versão mobile - cards em vez de tabela
  if (isMobile) {
    return (
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartBar className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Campanhas Ativas</CardTitle>
            </div>
            
            {onDataReset && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-1" size="xs">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Limpar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir todos os dados</DialogTitle>
                    <DialogDescription>
                      Esta ação excluirá permanentemente todos os dados de campanhas e desempenho mensal. 
                      Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" className="mr-2">Cancelar</Button>
                    <Button variant="destructive" onClick={handleResetData}>
                      Confirmar exclusão
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription className="text-xs">Visão detalhada de todas as suas campanhas</CardDescription>
        </CardHeader>
        
        <CardContent>
          {meaningfulCampaigns.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma campanha encontrada. Faça upload de dados para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {meaningfulCampaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm truncate max-w-[70%]">{campaign.name}</h4>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="text-[10px]">
                      {campaign.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impressões:</span>
                      <span className="font-medium">{campaign.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliques:</span>
                      <span className="font-medium">{campaign.clicks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CTR:</span>
                      <span className="font-medium">{campaign.ctr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversões:</span>
                      <span className="font-medium">{campaign.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPC:</span>
                      <span className="font-medium">{campaign.cpc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custo:</span>
                      <span className="font-medium">{campaign.total_cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROAS:</span>
                      <span className="font-medium">{campaign.roas}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-1 inline-flex items-center justify-center text-xs text-purple-600 hover:underline py-1">
                    <span>Ver detalhes da campanha</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Versão desktop - tabela original
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-primary" />
            Campanhas Ativas
          </CardTitle>
          <CardDescription>Visão detalhada de todas as suas campanhas</CardDescription>
        </div>
        
        {onDataReset && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1" size="sm">
                <Trash2 className="h-4 w-4" />
                Limpar Dados
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir todos os dados</DialogTitle>
                <DialogDescription>
                  Esta ação excluirá permanentemente todos os dados de campanhas e desempenho mensal. 
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" className="mr-2">Cancelar</Button>
                <Button variant="destructive" onClick={handleResetData}>
                  Confirmar exclusão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Impressões</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Conversões</TableHead>
                <TableHead className="text-right">CPC</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meaningfulCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                    Nenhuma campanha encontrada. Faça upload de dados para começar.
                  </TableCell>
                </TableRow>
              ) : (
                meaningfulCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                        {campaign.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.ctr}</TableCell>
                    <TableCell className="text-right">{campaign.conversions}</TableCell>
                    <TableCell className="text-right">{campaign.cpc}</TableCell>
                    <TableCell className="text-right">{campaign.total_cost}</TableCell>
                    <TableCell className="text-right">{campaign.roas}</TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center text-xs text-purple-600 hover:underline">
                        <span>Detalhes</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {meaningfulCampaigns.length > 0 && campaigns.length !== meaningfulCampaigns.length && (
        <CardFooter className="text-sm text-muted-foreground">
          {campaigns.length - meaningfulCampaigns.length} campanhas sem dados relevantes foram ocultadas.
        </CardFooter>
      )}
    </Card>
  );
};
