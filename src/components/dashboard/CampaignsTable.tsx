
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

type CampaignsTableProps = {
  campaigns: CampaignData[];
  onDataReset?: () => Promise<void>;
};

// Função para verificar se uma campanha possui dados relevantes
const hasMeaningfulData = (campaign: CampaignData): boolean => {
  return campaign.impressions > 0 || campaign.clicks > 0 || campaign.conversions > 0;
};

export const CampaignsTable = ({ campaigns, onDataReset }: CampaignsTableProps) => {
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
                    Nenhuma campanha com dados relevantes encontrada. Faça upload de dados para começar.
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
