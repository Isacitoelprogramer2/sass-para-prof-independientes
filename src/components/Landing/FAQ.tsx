// components/FAQ.tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cardBg } from '@/components/Landing/theme'

const faqs = [
  { q: "¿Cómo puedo pedir una cotización para mi proyecto?", a: "Comenzamos con una consulta gratuita para entender tus objetivos y necesidades. Con esa información preparamos una propuesta clara con costos, tiempos y etapas. La cotización es sin compromiso." },
  { q: "¿Qué incluye el soporte después de entregar el proyecto?", a: "Incluye garantía por fallas, monitoreo para asegurar que todo funcione bien y un canal rápido de atención. También ofrecemos planes de mantenimiento con actualizaciones, copias de seguridad y mejoras continuas." },
  { q: "¿Desarrollan sobre plataformas como WordPress o todo es a medida?", a: "Todo lo hacemos a medida, desde cero con código propio. Esto te da libertad total, mayor rendimiento y escalabilidad. Usamos Firebase en el backend, lo que permite que tu sistema sea seguro, rápido y capaz de manejar datos en tiempo real a medida que tu negocio crece." },
  { q: "¿Cómo protegen los datos y la seguridad del proyecto?", a: "Al usar Firebase, tu proyecto cuenta con:\n\nProtección avanzada contra accesos no autorizados (solo usuarios validados pueden entrar).\n\nCifrado automático: los datos viajan y se guardan de forma segura.\n\nActualizaciones de seguridad en la nube: siempre está protegido sin que tengas que preocuparte por servidores o parches.\nEn pagos online, trabajamos con pasarelas certificadas (ej. Stripe, Mercado Pago) para que la información financiera nunca pase por tus servidores." },
  { q: "¿Quién es dueño del código y del proyecto?", a: "Una vez que el proyecto está pagado, todo el diseño, contenido y código son tuyos. No dependes de plataformas externas ni plugins. Queremos que tengas control total sobre tu solución." },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 text-blue-100 scroll-mt-28"
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Preguntas frecuentes
      </motion.h2>

      <div className="max-w-3xl mx-auto mt-10 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          const panelId = `faq-panel-${i}`
          return (
            <motion.div
              key={i}
              className={`${cardBg} rounded-xl overflow-hidden`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, layout: { type: 'spring', stiffness: 180, damping: 22 } }}
              viewport={{ once: true }}
              layout
            >
              <button
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 group"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-medium text-white/95 group-hover:text-white transition-colors">
                  {faq.q}
                </span>
                <motion.svg
                  className="w-5 h-5 text-blue-200/80 shrink-0 group-hover:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    key="content"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="px-5 pb-5 overflow-hidden"
                    layout
                  >
                    <div className="pt-1 text-blue-300/85 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
