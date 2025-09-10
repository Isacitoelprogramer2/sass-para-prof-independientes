"use client";
import Link from "next/link";
import { track } from "@/components/Landing/analytics";

export default function NavBar_1() {
  const links = [
    { href: "#beneficios", label: "Servicios" },
    { href: "#demo", label: "Proyectos" },
    { href: "#planes", label: "Proceso" },
    { href: "#casos", label: "Testimonios" },
    { href: "#contacto", label: "Contacto" },
  ];
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-slate-950/70 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="#" className="text-white font-semibold tracking-tight">
          <span className="text-blue-300">LF</span> · Agenda Online
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm text-blue-200">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-white">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden lg:inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-blue-100 hover:bg-white/10"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 shadow-lg shadow-blue-600/20"
            onClick={() => track("click_nav_cta", { to: "register" })}
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </div>
  );
}
