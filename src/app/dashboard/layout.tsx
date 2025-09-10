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
} from "@untitledui/icons";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-dashboard";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { ProfileModalProvider } from "@/contexts/profile-modal-context";
import { PerfilModalWrapper } from "@/components/User/perfil/perfil-modal-wrapper";

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
      <ProfileModalProvider>
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
          
          {/* Renderizar el modal de perfil en el layout */}
          {/* El modal se montará aquí pero se renderizará en el body usando portal */}
          <PerfilModalWrapper />
        </div>
      </ProfileModalProvider>
    </AuthGuard>
  );
}
