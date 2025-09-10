"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { 
  Home01, 
  Calendar, 
  BookOpen01, 
  Users01, 
  Settings01,
  LifeBuoy01,
  LogOut01 
} from "@untitledui/icons";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { NavItemType } from "@/components/application/app-navigation/config";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navigationItems: NavItemType[] = [
    {
      label: "Inicio",
      href: "/dashboard/inicio",
      icon: Home01,
    },
    {
      label: "Gestión de Citas",
      href: "/dashboard/citas", 
      icon: Calendar,
    },
    {
      label: "Catálogo",
      href: "/dashboard/catalogo",
      icon: BookOpen01,
    },
    {
      label: "Clientes",
      href: "/dashboard/clientes",
      icon: Users01,
    },
    {
      label: "Configuración",
      href: "/dashboard/configuracion",
      icon: Settings01,
    },
  ];

  const footerItems: NavItemType[] = [
    {
      label: "Soporte",
      href: "/soporte",
      icon: LifeBuoy01,
    },
  
  ];

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen bg-secondary">
        <SidebarNavigationSimple
          activeUrl={pathname}
          items={navigationItems}
          footerItems={footerItems}
          showAccountCard={true}
        />
        
        <main className="flex-1 overflow-auto bg-primary">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
