"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cardBg } from "@/components/Landing/theme";
import { track } from "@/components/Landing/analytics";

export default function Demo() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) track("view_demo", { via: "button" });
  }, [show]);

  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) track("view_demo", { via: "scroll" });
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="demo" ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-blue-100 scroll-mt-28">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Así reservarán contigo en menos de 30 segundos</h2>
          <p className="text-blue-300/85 mt-2">Simula la experiencia real: elegir horario, dejar datos y confirmar.</p>
          <div className="mt-5 flex gap-3">
            <button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 shadow-lg shadow-blue-600/20" onClick={() => setShow(true)}>
              Probar demo
            </button>
            <a href="#contacto" className="rounded-full border border-white/15 px-6 py-3 text-blue-100 hover:bg-white/10">
              Quiero esto en mi web
            </a>
          </div>
        </div>
        <div className={`${cardBg} rounded-2xl p-3`}>
          {!show ? (
            <button className="relative w-full aspect-video rounded-xl overflow-hidden group" onClick={() => setShow(true)} aria-label="Reproducir demo">
              <Image src="/demo-poster.jpg" alt="Demo de reserva" fill className="object-cover opacity-80 group-hover:opacity-100 transition" sizes="(min-width: 1024px) 600px, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-white/15 border border-white/20 px-4 py-2 text-white">Ver demo</span>
              </div>
            </button>
          ) : (
            <div className="w-full aspect-video rounded-xl overflow-hidden">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/oHg5SJYRHA0" title="Demo interactiva" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
