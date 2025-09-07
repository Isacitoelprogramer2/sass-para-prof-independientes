import { cardBg } from "@/components/Landing/theme";
import { Palette, Wrench, Rocket, HeadphonesIcon, Zap, Shield } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function PAS() {
  const solutions = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Soluciones Hechas a Medida, No Plantillas",
      description: "Desarrollamos desde cero según tus necesidades específicas, garantizando que tu presencia digital sea única y refleje la esencia de tu marca.",
      benefit: "Destaca entre la competencia con una solución exclusiva",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Soporte Continuo y Evolución",
      description: "Ofrecemos mantenimiento preventivo y evolutivo post-implementación, adaptándonos a tus crecientes necesidades.",
      benefit: "Tu solución siempre estará actualizada y optimizada",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Tecnología de Vanguardia con Escalabilidad",
      description: "Utilizamos arquitecturas modernas y escalables que crecen contigo, evitando costosas migraciones futuras.",
      benefit: "Prepara tu negocio para el crecimiento sin límites",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const problems = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      text: "Mensajes sueltos, citas perdidas, respuestas tardías"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      text: "Pérdida de tiempo valioso y clientes potenciales"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-green-400" />,
      text: "Web con agenda en vivo, WhatsApp 1-clic y formularios inteligentes"
    }
  ];

  // Refs para la detección de scroll
  const headerRef = useRef(null);
  const solutionsRef = useRef(null);
  const ctaRef = useRef(null);

  // Verificar si los elementos están en la vista
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isSolutionsInView = useInView(solutionsRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Transformamos Tu Problema en
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> Solución</span>
        </motion.h2>
        <motion.p
          className="text-blue-200/80 text-lg max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Identificamos tus desafíos y los convertimos en oportunidades de crecimiento digital
        </motion.p>
      </motion.div>

      {/* Solutions Section */}
      <motion.div
        ref={solutionsRef}
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={isSolutionsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        
        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isSolutionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                   style={{
                     background: `linear-gradient(135deg, ${solution.gradient.split(' ')[1]} 0%, ${solution.gradient.split(' ')[3]} 100%)`
                   }}
              />
              
              <div className={`relative ${cardBg} backdrop-blur-sm border border-blue-800/20 rounded-2xl p-8 h-full hover:border-blue-800/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20`}>
                {/* Icon con fondo blur minimalista duo tono azul/blanco */}
                <motion.div
                  className="inline-flex p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(255,255,255,0.7) 100%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isSolutionsInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  {solution.icon}
                </motion.div>
                
                {/* Content */}
                <motion.h4
                  className="text-xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isSolutionsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  {solution.title}
                </motion.h4>
                
                <motion.p
                  className="text-blue-200/80 mb-6 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isSolutionsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  {solution.description}
                </motion.p>
                
                {/* Benefit Badge */}
                <motion.div
                  className="pt-6 border-t border-blue-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isSolutionsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <p className="text-sm font-medium text-blue-100">
                      <span className="text-blue-300">Beneficio clave:</span> {solution.benefit}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        ref={ctaRef}
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div
          className={`${cardBg} backdrop-blur-sm border border-blue-500/20 rounded-2xl p-10 max-w-3xl mx-auto`}
          initial={{ opacity: 0, y: 20 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.h3
            className="text-2xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 1.0 }}
          >
            ¿Listo para transformar tu negocio?
          </motion.h3>
          <motion.p
            className="text-blue-200/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 1.1 }}
          >
            Agenda una consulta gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos digitales
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isCtaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comenzar Ahora →
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
