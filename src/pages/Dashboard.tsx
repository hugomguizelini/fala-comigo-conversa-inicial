
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    // Informar ao usuário como usar o dashboard
    toast.info(
      "Dica: Faça upload de arquivos CSV para ver os dados no dashboard. Use arquivos com 'campaign' ou 'campanha' no nome para dados de campanhas.",
      { duration: 5000 }
    );
  }, []);

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
