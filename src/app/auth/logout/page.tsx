"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(firebaseAuth);
        window.location.href = "/auth/login";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // En caso de error, redirigir al login de todas formas
        window.location.href = "/auth/login";
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center space-y-4">
        <LoadingIndicator size="lg" />
        <p className="text-tertiary">Cerrando sesión...</p>
      </div>
    </div>
  );
}
