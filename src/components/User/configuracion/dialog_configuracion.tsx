'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Star01, Zap } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { useUsuario } from '@/hooks/use-usuario';
import { useAuth } from '@/hooks/use-auth';

interface ConfiguracionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfiguracionModal({ isOpen, onClose }: ConfiguracionModalProps) {
  const { usuario, loading: usuarioLoading } = useUsuario();
  const { user: authUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Número de WhatsApp para soporte (debería venir de una variable de entorno o configuración)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || "+1234567890"; // Reemplazar con el número real

  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      
      // Enfocar el modal para capturar eventos de teclado
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // No renderizar nada si no está abierto
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Solo cerrar si el click es directamente en el overlay, no en el modal
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevenir que el clic en el modal se propague al overlay
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleUpgradeToPremium = () => {
    // Redirigir al chat de WhatsApp
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const currentPlan = usuario?.datosCuenta.plan || 'BASICO';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="configuracion-modal-title"
    >
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={handleModalClick}
        className="relative w-full max-w-2xl bg-primary-solid rounded-lg shadow-2xl transform transition-all duration-300"
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <div>
            <h2 id="configuracion-modal-title" className="text-2xl font-semibold text-text-primary">
              Plan de Suscripción
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-fg-quaternary hover:text-fg-quaternary_hover hover:bg-bg-secondary_hover rounded-md transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Básico */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${
              currentPlan === 'BASICO' 
                ? 'border-border-brand bg-bg-brand-soft ring-2 ring-border-brand/20' 
                : 'border-border-primary bg-bg-secondary'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Básico</h3>
                {currentPlan === 'BASICO' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-bg-brand text-text-brand">
                    Plan Actual
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-text-primary">$0</span>
                <span className="text-text-secondary">/mes</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Hasta 50 clientes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Hasta 100 citas mensuales</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Notificaciones básicas</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Soporte por correo electrónico</span>
                </li>
              </ul>
              
              <Button 
                color="secondary" 
                className="w-full"
                disabled={currentPlan === 'BASICO'}
              >
                {currentPlan === 'BASICO' ? 'Plan Actual' : 'Seleccionar Plan'}
              </Button>
            </div>
            
            {/* Plan Premium */}
            <div className={`border rounded-xl p-6 transition-all duration-300 relative ${
              currentPlan === 'PREMIUM' 
                ? 'border-border-brand bg-bg-brand-soft ring-2 ring-border-brand/20' 
                : 'border-border-primary bg-bg-secondary'
            }`}>
              {currentPlan === 'PREMIUM' && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-bg-brand text-text-brand px-3 py-1 rounded-full text-sm font-medium">
                  Plan Actual
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Premium</h3>
                <Star01 className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-text-primary">$29</span>
                <span className="text-text-secondary">/mes</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Clientes ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Citas ilimitadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Recordatorios automáticos</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Soporte prioritario 24/7</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Reportes avanzados</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-text-primary">Integración con Google Calendar</span>
                </li>
              </ul>
              
              {currentPlan === 'BASICO' ? (
                <Button 
                  color="primary" 
                  className="w-full"
                  onClick={handleUpgradeToPremium}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Actualizar a Premium
                </Button>
              ) : (
                <Button 
                  color="secondary" 
                  className="w-full"
                  disabled={currentPlan === 'PREMIUM'}
                >
                  Plan Actual
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-bg-secondary rounded-lg">
            <h4 className="font-medium text-text-primary mb-2">¿Necesitas ayuda?</h4>
            <p className="text-sm text-text-secondary mb-3">
              ¿Tienes preguntas sobre nuestros planes? Nuestro equipo de soporte está disponible para ayudarte.
            </p>
            <Button
              color="secondary"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            >
              Contactar Soporte
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border-primary bg-bg-secondary rounded-b-lg">
          <Button color="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}