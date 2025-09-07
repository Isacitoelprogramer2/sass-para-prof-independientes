import { cardBg } from "@/components/Landing/theme";

export default function HowItWorks() {
  const steps: [string, string][] = [
    ["Diagnóstico (15–20 min)", "Objetivos, servicios, horarios."],
    ["Prototipo (24–72 h)", "Copy + diseño + agenda conectada."],
    ["Publicación & training", "Dominio, analítica, mini-guía de uso."],
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-blue-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Cómo trabajo</h2>
      <p className="text-blue-300/85 mt-2">Listo para captar clientes desde el día 1.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {steps.map(([t, d], i) => (
          <div key={i} className={`${cardBg} rounded-xl p-6`}>
            <div className="text-sm text-blue-300/80 mb-2">Paso {i + 1}</div>
            <h3 className="font-semibold text-white">{t}</h3>
            <p className="text-blue-300/85 mt-1">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
