
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <div className="bg-background rounded-lg shadow p-6">
          <p className="text-muted-foreground">
            Esta é a página de configurações. Aqui você poderá ajustar as preferências da sua conta e da aplicação.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
