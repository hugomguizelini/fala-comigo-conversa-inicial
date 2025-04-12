
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default Index;
