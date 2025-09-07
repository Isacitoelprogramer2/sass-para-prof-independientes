"use client";
import { track } from "@/components/Landing/analytics";
import { WhatsappIcon } from "@/components/Landing/icons";

export default function Floating() {
  return (
    <>
      {/* CTA Sticky inferior (mobile y desktop) */}
  <div className="fixed inset-x-0 bottom-4 z-40 px-3 sm:px-0">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-xl rounded-full bg-slate-900/90 backdrop-blur border border-white/10 shadow-2xl shadow-blue-900/30 flex items-center gap-2 p-2">
            <a
              href="#contacto"
              className="flex-1 inline-flex justify-center items-center rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2"
              onClick={() => track("click_sticky_cta", { to: "contacto" })}
            >
              Agenda una llamada
            </a>
            <a href="#planes" className="inline-flex justify-center items-center rounded-full border border-white/15 px-4 py-2 text-blue-100 hover:bg-white/10">
              Ver planes
            </a>
          </div>
        </div>
      </div>

      {/* Botón flotante WhatsApp (no invasivo) */}
      <a
        href="https://wa.me/51999999999?text=Hola%20tengo%20una%20duda%20rápida"
        aria-label="Abrir WhatsApp"
        className="fixed right-4 bottom-24 sm:bottom-6 z-40 rounded-full p-3 bg-green-600 text-white shadow-xl hover:bg-green-500"
        onClick={() => track("whatsapp_click", { placement: "floating" })}
      >
        <WhatsappIcon className="w-6 h-6" />
      </a>
    </>
  );
}
