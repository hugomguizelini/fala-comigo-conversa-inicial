
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart2, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Relatórios",
    href: "/reports",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Perfil",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  }
];

export default function SidebarNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href || (pathname === "/" && item.href === "/")
              ? "bg-primary/10 text-primary"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          <div className="w-5 flex justify-center">
            {item.icon}
          </div>
          <span className="truncate">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
