import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, Menu, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStatus } from "@/hooks/dashboard/useAuthStatus";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuthStatus();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Você foi desconectado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Por favor, tente novamente.");
    }
  };

  return <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <h1 className="text-xl font-semibold text-sidebar-foreground">Insightor.AI</h1>
          </div>
          <SidebarNav />
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-14 sm:h-16 border-b flex items-center justify-between px-3 sm:px-4 bg-background">
          <div className="md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar w-64 p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold">I</span>
                      </div>
                      <h1 className="text-xl font-semibold text-sidebar-foreground">Insightor.AI</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <SidebarNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 md:flex-none flex items-center ml-2">
            <h2 className="text-base sm:text-lg font-medium hidden md:block">Dashboard</h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/30 pb-6">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    </div>;
}
