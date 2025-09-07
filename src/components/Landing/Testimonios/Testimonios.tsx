import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Code2, Sparkles } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  projectType: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "María González",
      role: "CEO",
      company: "TechStartup Inc.",
      content: "El equipo transformó completamente nuestra presencia digital. La nueva plataforma web no solo es visualmente impresionante, sino que aumentó nuestras conversiones en un 150%. Su atención al detalle y experiencia técnica son incomparables.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
      projectType: "E-commerce"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Director de Marketing",
      company: "Innovate Solutions",
      content: "Trabajar con este equipo fue una experiencia excepcional. Entendieron perfectamente nuestra visión y la ejecutaron de manera brillante. El sitio web es rápido, moderno y exactamente lo que necesitábamos para destacar en el mercado.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
      projectType: "SaaS Platform"
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Fundadora",
      company: "Digital Agency Pro",
      content: "La aplicación web que desarrollaron superó todas nuestras expectativas. La interfaz es intuitiva, el rendimiento es excelente y el soporte post-lanzamiento ha sido invaluable. Definitivamente los recomendaría.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
      projectType: "Web Application"
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "CTO",
      company: "FinTech Innovations",
      content: "Su expertise técnico es impresionante. Implementaron soluciones complejas con elegancia y eficiencia. El dashboard que crearon maneja millones de datos sin problemas. Son verdaderos profesionales del desarrollo web.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=7",
      projectType: "Dashboard Analytics"
    }
  ];

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goToTestimonial = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Patrón de grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Lo que dicen nuestros clientes</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Testimonios que
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-100">
              Hablan por Nosotros
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Descubre cómo hemos ayudado a empresas como la tuya a transformar su presencia digital
            y alcanzar resultados extraordinarios
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative max-w-5xl mx-auto">
          <div className={`transition-all duration-500 transform ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
              {/* Quote Icon */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="w-8 h-8 text-white" />
              </div>

              {/* Project Type Badge */}
              <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">{currentTestimonial.projectType}</span>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center mt-8">
                {/* Content */}
                <div className="md:col-span-8">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 italic">
                    "{currentTestimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {currentTestimonial.name}
                    </p>
                    <p className="text-gray-400">
                      {currentTestimonial.role} en {currentTestimonial.company}
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-100 rounded-full blur-2xl opacity-50"></div>
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700 hover:bg-slate-700 transition-all hover:scale-110 group"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700 hover:bg-slate-700 transition-all hover:scale-110 group"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-teal-100'
                  : 'w-3 h-3 bg-slate-600 hover:bg-slate-500'
              } rounded-full`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>

      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
