import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación | SaaS Pro",
  description: "Inicia sesión o regístrate en nuestra plataforma",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary">
      {children}
    </div>
  );
}
