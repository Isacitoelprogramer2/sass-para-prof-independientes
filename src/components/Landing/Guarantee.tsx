import { cardBg } from "@/components/Landing/theme";

export default function Guarantee() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-blue-100">
      <div className={`${cardBg} rounded-2xl p-6 sm:p-8`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Garantía / Riesgo inverso</h2>
        <p className="text-blue-300/90 mt-3">
          “Ajustes gratis por 14 días” · “Si no quedas conforme, no avanzamos al siguiente hito.”
        </p>
      </div>
    </section>
  );
}
