
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    // First toast message about uploading CSV
    toast.info(
      "Dica: Faça upload de arquivos CSV para ver os dados no dashboard. Use arquivos com 'campaign' ou 'campanha' no nome para dados de campanhas."
    );
    
    // Second toast message about data display
    setTimeout(() => {
      toast.info(
        "Caso os dados não apareçam após o upload, verifique se o arquivo CSV tem o formato correto com colunas como 'nome', 'impressões', 'cliques', etc."
      );
    }, 5500);
    
    // Third toast message about numeric format
    setTimeout(() => {
      toast.info(
        "Os valores numéricos podem ser formatados como '1000', '1.000' ou '1,000'. Valores monetários podem incluir 'R$'."
      );
    }, 11000);
    
    // Fourth toast message about Meta Ads format (new)
    setTimeout(() => {
      toast.info(
        "Para arquivos de relatório do Meta Ads, os dados serão mapeados automaticamente usando as colunas padrão do Meta."
      );
    }, 16500);
  }, []);

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
