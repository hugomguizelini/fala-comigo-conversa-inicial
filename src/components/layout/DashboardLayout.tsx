
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, Search, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - visible on larger screens */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-xl font-semibold text-sidebar-foreground">Insight</h1>
          </div>
          <SidebarNav />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
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
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <h1 className="text-xl font-semibold text-sidebar-foreground">Insight</h1>
                  </div>
                  <SidebarNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 md:flex-none flex items-center ml-4">
            <h2 className="text-lg font-medium hidden md:block">Welcome Back</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-[250px] pl-8 rounded-full bg-background border border-input"
              />
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1 rounded-full">
              <Search className="h-4 w-4 md:hidden" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1 rounded-full">
              Export
            </Button>
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

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
