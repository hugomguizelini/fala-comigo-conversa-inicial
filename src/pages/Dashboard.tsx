
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    // Apenas uma mensagem combinada em vez de várias separadas
    toast.info(
      "Dica: Faça upload de arquivos CSV para visualizar dados no dashboard. Suportamos formatos de campanhas, Meta Ads e outros.",
      {
        description: "Os valores podem estar formatados como '1000', '1.000' ou '1,000'.",
        duration: 8000,
        action: {
          label: "Saiba mais",
          onClick: () => toast.info("Para mais informações, consulte nosso guia de importação de dados.")
        }
      }
    );
  }, []);

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
