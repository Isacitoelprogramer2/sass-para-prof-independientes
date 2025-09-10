"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

export default function AppPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuario autenticado, redirigir al dashboard
        window.location.href = "/dashboard/inicio";
      } else {
        // Usuario no autenticado, redirigir al login
        window.location.href = "/auth/login";
      }
    }
  }, [user, loading]);

  // Mostrar loading mientras se verifica el estado de autenticación
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center space-y-4">
        <LoadingIndicator size="lg" />
        <p className="text-tertiary">Verificando autenticación...</p>
      </div>
    </div>
  );
}
