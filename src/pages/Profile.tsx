
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Perfil</h1>
        
        <div className="bg-background rounded-lg shadow p-6">
          <p className="text-muted-foreground">
            Esta é a página de perfil do usuário. Aqui você poderá gerenciar suas informações pessoais e configurações de conta.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
