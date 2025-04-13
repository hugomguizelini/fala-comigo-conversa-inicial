
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface CampaignData {
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  cpc: string;
  cost: string;
  change: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

const ReportsCampaignBreakdown = () => {
  // Dados simulados de campanhas
  const campaignData: CampaignData[] = [
    {
      name: "Campanha de Verão 2023",
      status: "ativa",
      impressions: 423650,
      clicks: 12450,
      ctr: "2.94%",
      conversions: 845,
      cpc: "R$ 1,25",
      cost: "R$ 15.562,50",
      change: {
        value: 12.4,
        direction: 'up',
      },
    },
    {
      name: "Promoção Fim de Semana",
      status: "ativa",
      impressions: 312800,
      clicks: 9850,
      ctr: "3.15%",
      conversions: 720,
      cpc: "R$ 1,10",
      cost: "R$ 10.835,00",
      change: {
        value: 8.7,
        direction: 'up',
      },
    },
    {
      name: "Novos Produtos 2023",
      status: "pausada",
      impressions: 195400,
      clicks: 5680,
      ctr: "2.91%",
      conversions: 390,
      cpc: "R$ 1,35",
      cost: "R$ 7.668,00",
      change: {
        value: 2.3,
        direction: 'down',
      },
    },
    {
      name: "Remarketing Clientes",
      status: "ativa",
      impressions: 278500,
      clicks: 10250,
      ctr: "3.68%",
      conversions: 890,
      cpc: "R$ 0,95",
      cost: "R$ 9.737,50",
      change: {
        value: 15.8,
        direction: 'up',
      },
    },
    {
      name: "Black Friday Antecipada",
      status: "encerrada",
      impressions: 158900,
      clicks: 6280,
      ctr: "3.95%",
      conversions: 530,
      cpc: "R$ 1,15",
      cost: "R$ 7.222,00",
      change: {
        value: 0,
        direction: 'neutral',
      },
    },
  ];

  // Renderiza o indicador de variação
  const renderChangeIndicator = (change: { value: number; direction: 'up' | 'down' | 'neutral' }) => {
    if (change.direction === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>{change.value}%</span>
        </div>
      );
    } else if (change.direction === 'down') {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span>{change.value}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>-</span>
        </div>
      );
    }
  };

  // Renderiza o badge de status
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'pausada':
        return <Badge className="bg-amber-500">Pausada</Badge>;
      case 'encerrada':
        return <Badge className="bg-gray-500">Encerrada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="w-full overflow-auto">
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
            <TableHead className="text-right">Variação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignData.map((campaign, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{renderStatus(campaign.status)}</TableCell>
              <TableCell className="text-right">{campaign.impressions.toLocaleString()}</TableCell>
              <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
              <TableCell className="text-right">{campaign.ctr}</TableCell>
              <TableCell className="text-right">{campaign.conversions.toLocaleString()}</TableCell>
              <TableCell className="text-right">{campaign.cpc}</TableCell>
              <TableCell className="text-right">{campaign.cost}</TableCell>
              <TableCell className="text-right">{renderChangeIndicator(campaign.change)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsCampaignBreakdown;
