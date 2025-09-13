'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import PerfilDelUsuario from './perfil_del_usuario';
import InfoDelNegocio from './info_del_negocio';
import { useUsuario } from '@/hooks/use-usuario';
import { Usuario } from '@/types/usuario';

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowSuccess?: (title?: string, message?: string) => void;
  onShowError?: (title?: string, message?: string) => void;
}

type TabType = 'personal' | 'negocio';

export default function PerfilModal({ isOpen, onClose, onShowSuccess, onShowError }: PerfilModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { usuario, loading, saving, guardarUsuario } = useUsuario();
  const [hasChanges, setHasChanges] = useState(false);

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

  const handleSave = async (
    datos: Partial<Usuario>, 
    archivos?: { fotoPerfil?: File; fotoPortada?: File }
  ) => {
    try {
      await guardarUsuario(datos, archivos);
      setHasChanges(false);
      // Mostrar modal de confirmación de éxito
      if (onShowSuccess) {
        onShowSuccess(
          "¡Cambios guardados!",
          "Tu información se ha actualizado correctamente."
        );
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      // Mostrar modal de confirmación de error
      if (onShowError) {
        onShowError(
          "Error al guardar",
          "No se pudieron guardar los cambios. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleGlobalSave = async () => {
    // Esta función se llama desde el botón "Guardar Cambios" del footer
    // Por ahora, solo mostramos un mensaje ya que cada componente maneja su propio guardado
    if (onShowSuccess) {
      onShowSuccess(
        "Información guardada",
        "Los cambios se guardan automáticamente desde cada sección."
      );
    }
  };

  return (
    // Overlay con padding mejorado
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal más ancho y con mejor estructura */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={handleModalClick}
        className="relative w-[100vh] bg-primary-solid rounded-2xl shadow-2xl transition-all duration-300 max-h-[90vh] flex flex-col"
        role="document"
      >
        {/* Header con espacio para el botón de cerrar */}
        <div className="relative flex items-start justify-between p-6 sm:p-8 border-b border-border-primary shrink-0">
          <div className="pr-12">
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-semibold text-text-primary">
              Mi Perfil
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">
              Gestiona tu información personal y de negocio
            </p>
          </div>

          {/* Botón cerrar con posición mejorada */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2.5 text-fg-quaternary hover:text-fg-quaternary_hover hover:bg-bg-secondary_hover rounded-lg transition-all duration-200 group"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Tabs de navegación */}
        <div className="flex border-b border-border-primary px-6 sm:px-8 shrink-0">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-3 text-sm sm:text-base font-medium transition-all duration-200 border-b-2 -mb-px ${
              activeTab === 'personal'
                ? 'text-text-primary border-brand-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-secondary'
            }`}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('negocio')}
            className={`px-4 py-3 text-sm sm:text-base font-medium transition-all duration-200 border-b-2 -mb-px ml-4 sm:ml-8 ${
              activeTab === 'negocio'
                ? 'text-text-primary border-brand-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-secondary'
            }`}
          >
            Información del Negocio
          </button>
        </div>

        {/* Content con scroll mejorado */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Grid layout para pantallas grandes */}
            <div className="w-full max-w-7xl mx-auto">
              {activeTab === 'personal' && (
                <div className="animate-fadeIn">
                  <PerfilDelUsuario 
                    usuario={usuario}
                    onSave={handleSave}
                    loading={loading}
                    saving={saving}
                  />
                </div>
              )}

              {activeTab === 'negocio' && (
                <div className="animate-fadeIn">
                  <InfoDelNegocio
                    usuario={usuario}
                    onSave={handleSave}
                    loading={loading}
                    saving={saving}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 sm:p-8 border-t border-border-primary bg-bg-secondary rounded-b-2xl shrink-0">
          <div className="text-xs sm:text-sm text-text-secondary">
            {hasChanges && (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-warning-solid rounded-full animate-pulse"></span>
                Tienes cambios sin guardar
              </span>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              color="secondary" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cerrar
            </Button>
            {hasChanges && (
              <Button 
                color="primary" 
                onClick={handleGlobalSave}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}