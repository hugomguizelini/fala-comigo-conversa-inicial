
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    toast.info(
      "Bem-vindo ao Dashboard de Análise de Campanhas",
      {
        description: "Faça upload de arquivos CSV para visualizar insights e otimizações personalizadas para suas campanhas.",
        duration: 8000,
        action: {
          label: "Explorar recursos",
          onClick: () => toast.info(
            "Novos recursos disponíveis!",
            {
              description: "Análise avançada com IA, filtros de impacto, e sugestões inteligentes baseadas em regras de gestores experientes de tráfego."
            }
          )
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
