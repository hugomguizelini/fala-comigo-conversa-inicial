
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
    
    // Second toast message about data display, removing the 'delay' property
    setTimeout(() => {
      toast.info(
        "Caso os dados não apareçam após o upload, verifique se o arquivo CSV tem o formato correto com colunas como 'nome', 'impressões', 'cliques', etc."
      );
    }, 5500);
  }, []);

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
