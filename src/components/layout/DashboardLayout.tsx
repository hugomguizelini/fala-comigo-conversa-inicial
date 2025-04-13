
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const handleLogout = () => {
    navigate("/");
  };
  return <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - visible on larger screens */}
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar w-64 p-0">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">I</span>
                    </div>
                    <h1 className="text-xl font-semibold text-sidebar-foreground">Insightor.AI</h1>
                  </div>
                  <SidebarNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 md:flex-none flex items-center ml-2">
            <h2 className="text-lg font-medium hidden md:block">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main content - modificado para ter overflow-y-auto e pb-6 para padding no final */}
        <main className="flex-1 overflow-y-auto bg-muted/30 pb-6">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    </div>;
}
