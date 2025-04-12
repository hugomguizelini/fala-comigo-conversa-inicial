
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, BarChart2, Settings, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Relatórios",
    href: "/dashboard/reports",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Documentos",
    href: "/dashboard/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Calendário",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function SidebarNav() {
  const pathname = window.location.pathname;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
