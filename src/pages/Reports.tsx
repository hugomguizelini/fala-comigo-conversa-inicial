
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
        
        <div className="bg-background rounded-lg shadow p-6">
          <p className="text-muted-foreground">
            Esta é a página de relatórios. Aqui você poderá visualizar análises detalhadas das suas campanhas.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
