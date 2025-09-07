"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de inicio
    router.replace("/dashboard/inicio");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-solid mx-auto"></div>
        <p className="mt-2 text-secondary">Cargando dashboard...</p>
      </div>
    </div>
  );
}
