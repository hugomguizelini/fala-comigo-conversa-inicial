
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartBar, ArrowRight } from "lucide-react";

type Campaign = {
  name: string;
  status: string;
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  conversionType: string;
  cpc: string;
  totalCost: string;
  roas: string;
};

type CampaignsTableProps = {
  campaigns: Campaign[];
};

export const CampaignsTable = ({ campaigns }: CampaignsTableProps) => {
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
              {campaigns.map((campaign) => (
                <TableRow key={campaign.name}>
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
                  <TableCell className="text-right">{campaign.totalCost}</TableCell>
                  <TableCell className="text-right">{campaign.roas}</TableCell>
                  <TableCell className="text-right">
                    <button className="inline-flex items-center text-xs text-purple-600 hover:underline">
                      <span>Detalhes</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
