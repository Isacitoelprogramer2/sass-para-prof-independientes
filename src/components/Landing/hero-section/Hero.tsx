"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MockDashboard from './MockDashboard';



export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/30 blur-[120px] animate-pulse"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div 
          className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse animation-delay-2000"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.div 
          className="absolute -bottom-40 left-1/2 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse animation-delay-4000"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        
        {/* Interactive Glow Effect */}
        <div 
          className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-white/10 blur-[100px] transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 150}px`,
            top: `${mousePosition.y - 150}px`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left Column - Text Content */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Badge */}
            <motion.div 
              className="mb-8 inline-flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-500/10 px-4 py-2 text-sm font-medium text-white border border-white/10 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Diseño, funcionalidad y resultados excepcionales 
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="font-extrabold text-5xl lg:text-6xl tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Soluciones web a medida para
              </span>
              <span className="block bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent">
                 impulsar tu negocio
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Especializados en desarrollo de sitios web, ecommerce, SaaS y ERP personalizados
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <motion.button 
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative">Cotizar</span>
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
              
              <motion.button 
                className="group inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 13-5.1V19l7-7z"/>
                </svg>
                Ver proyectos
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Dashboard Mock */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-10 -right-10 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-500 opacity-20 blur-xl animate-pulse"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            <motion.div 
              className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500 to-blue-500 opacity-20 blur-xl animate-pulse animation-delay-2000"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
            
            {/* Dashboard Component */}
            <motion.div 
              className="relative transform transition-transform duration-500 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <MockDashboard />
            </motion.div>

            {/* Floating Stats */}
            <motion.div 
              className="absolute top-20 -left-2 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10 p-3 animate-float"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Conversión de clientes</p>
                  <p className="text-sm font-bold text-white">+100%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10 p-3 animate-float animation-delay-2000"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tiempo ahorrado</p>
                  <p className="text-sm font-bold text-white">12h/semana</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
