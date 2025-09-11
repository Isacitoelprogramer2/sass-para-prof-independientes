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
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={handleModalClick}
        className="relative w-full max-w-4xl bg-primary-solid rounded-lg shadow-2xl transform transition-all duration-300"
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <div>
            <h2 id="modal-title" className="text-2xl font-semibold text-text-primary">Mi Perfil</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Gestiona tu información personal y de negocio
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

        {/* Tabs */}
        <div className="border-b border-border-primary">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'personal'
                  ? 'border-border-brand text-text-brand-secondary'
                  : 'border-transparent text-text-tertiary hover:text-text-secondary_hover hover:border-border-secondary'
              }`}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('negocio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'negocio'
                  ? 'border-border-brand text-text-brand-secondary'
                  : 'border-transparent text-text-tertiary hover:text-text-secondary_hover hover:border-border-secondary'
              }`}
            >
              Información del Negocio
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <PerfilDelUsuario 
                usuario={usuario}
                onSave={handleSave}
                loading={loading}
                saving={saving}
              />
            </div>
          )}
          
          {activeTab === 'negocio' && (
            <div className="space-y-6">
              <InfoDelNegocio
                usuario={usuario}
                onSave={handleSave}
                loading={loading}
                saving={saving}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border-primary bg-bg-secondary rounded-b-lg">
          <Button color="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
