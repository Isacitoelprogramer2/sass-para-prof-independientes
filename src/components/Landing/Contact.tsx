"use client";
import { cardBg } from "@/components/Landing/theme";
import { MailIcon, PhoneIcon, WhatsappIcon } from "@/components/Landing/icons";
import { track } from "@/components/Landing/analytics";

export default function Contact() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    track("form_submit", Object.fromEntries(fd.entries()));
    alert("¡Gracias! Te escribiré en el mismo día laboral.");
  }

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-blue-100 scroll-mt-28">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Contacto</h2>
          <p className="text-blue-300/85 mt-2">
            Al lado de WhatsApp: <span className="text-blue-200">Te leo en minutos (horario laboral)</span>
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://wa.me/51999999999?text=Hola%20quiero%20una%20web%20con%20agenda"
              className="inline-flex items-center gap-2 rounded-full bg-green-600/90 hover:bg-green-600 text-white px-5 py-2.5"
              onClick={() => track("whatsapp_click", { placement: "contact" })}
            >
              <WhatsappIcon />
              WhatsApp
            </a>
            <a href="tel:+51999999999" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-blue-100 hover:bg-white/10">
              <PhoneIcon />
              Llamada
            </a>
            <a href="mailto:hola@tu-dominio.com?subject=Consulta%20web%20con%20agenda" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-blue-100 hover:bg-white/10">
              <MailIcon />
              Email
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className={`${cardBg} rounded-2xl p-6 grid gap-4`}>
          <h3 className="font-semibold text-white">¿Prefieres dejar tus datos?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-blue-300/80">Nombre</span>
              <input name="nombre" required className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-blue-100 placeholder:text-blue-300/40" placeholder="Tu nombre" />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-blue-300/80">Profesión</span>
              <input name="profesion" required className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-blue-100 placeholder:text-blue-300/40" placeholder="Abogado, nutricionista…" />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-blue-300/80">Objetivo principal</span>
            <input name="objetivo" required className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-blue-100 placeholder:text-blue-300/40" placeholder="Reservas, WhatsApp, pagos…" />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-blue-300/80">Disponibilidad preferida</span>
              <input name="disponibilidad" className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-blue-100 placeholder:text-blue-300/40" placeholder="Lun–Vie 9–18, etc." />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-blue-300/80">Canal de contacto</span>
              <select name="canal" className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-blue-100">
                <option>WhatsApp</option>
                <option>Email</option>
                <option>Llamada</option>
              </select>
            </label>
          </div>
          <button type="submit" className="mt-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 shadow-lg shadow-blue-600/20">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
