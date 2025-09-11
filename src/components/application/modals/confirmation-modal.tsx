"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "./modal";
import { cx } from "@/utils/cx";

// Icono de check personalizado para la confirmación
const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className} 
    aria-hidden="true"
  >
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Icono de error personalizado
const ErrorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className} 
    aria-hidden="true"
  >
    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Propiedades para el modal de confirmación
 */
interface ConfirmationModalProps {
  /** Estado que controla si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Tipo de notificación: success o error */
  type?: "success" | "error";
  /** Título del modal */
  title?: string;
  /** Mensaje descriptivo del modal */
  message?: string;
  /** Texto personalizado para el botón de cerrar */
  closeButtonText?: string;
  /** Contenido personalizado adicional */
  children?: ReactNode;
  /** Función opcional que se ejecuta al cerrar */
  onConfirm?: () => void;
}

/**
 * Modal de confirmación para mostrar notificaciones de éxito o error
 * Muestra un mensaje de confirmación cuando se han guardado cambios correctamente o si hay errores
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  closeButtonText = "Aceptar",
  children,
  onConfirm,
}: ConfirmationModalProps) {
  
  // Configuración basada en el tipo de notificación
  // Configuración basada en el tipo de notificación y soporte dark mode
  const config = {
    success: {
      title: title || "¡Cambios guardados!",
      message: message || "Los cambios se han guardado correctamente.",
      iconBgColor: "bg-success-100 dark:bg-success-900",
      iconColor: "text-success-600 dark:text-success-300",
      buttonColor: "bg-success-600 hover:bg-success-700 focus:ring-success-600 dark:bg-success-700 dark:hover:bg-success-600 dark:focus:ring-success-700",
      icon: CheckIcon,
    },
    error: {
      title: title || "Error al guardar",
      message: message || "Ha ocurrido un error. Inténtalo de nuevo.",
      iconBgColor: "bg-error-100 dark:bg-error-900",
      iconColor: "text-error-600 dark:text-error-300",
      buttonColor: "bg-error-600 hover:bg-error-700 focus:ring-error-600 dark:bg-error-700 dark:hover:bg-error-600 dark:focus:ring-error-700",
      icon: ErrorIcon,
    },
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;
  
  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // Función para manejar el click en el backdrop
  const handleBackdropClick = () => {
    handleClose();
  };

  return (
    <DialogTrigger>
      <ModalOverlay
        isOpen={isOpen}
        onOpenChange={(open) => !open && handleClose()}
        isDismissable
        className={cx(
          "fixed inset-0 z-[10000] flex min-h-dvh w-full items-center justify-center",
          "overflow-y-auto bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)]",
          "outline-hidden backdrop-blur-[6px]"
        )}
      >
        <Modal
          className={cx(
            "relative w-full max-w-md transform overflow-hidden",
            "rounded-xl bg-white shadow-xl transition-all",
            "animate-in zoom-in-95 duration-300 ease-out",
            "dark:bg-gray-900 dark:shadow-2xl"
          )}
        >
          <Dialog className="relative focus:outline-none">
            {/* Contenido principal del modal */}
            <div className="px-6 py-6">
              {/* Icono de confirmación o error */}
              <div className={cx(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4",
                currentConfig.iconBgColor
              )}>
                <IconComponent className={cx("h-6 w-6", currentConfig.iconColor)} />
              </div>

              {/* Título del modal */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentConfig.title}
                </h3>
                
                {/* Mensaje descriptivo */}
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  {currentConfig.message}
                </div>

                {/* Contenido personalizado adicional */}
                {children && (
                  <div className="mb-6">
                    {children}
                  </div>
                )}
              </div>
              {/* Botones de acción */}
            <div className="px-6 justify-center py-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleClose}
                className={cx(
                  "inline-flex w-full justify-center rounded-lg",
                  "px-4 py-2.5 text-sm font-semibold text-white dark:text-gray-100",
                  "shadow-sm focus:outline-none focus:ring-2",
                  "focus:ring-offset-2 transition-colors",
                  "sm:ml-3 sm:w-auto",
                  currentConfig.buttonColor
                )}
              >
                {closeButtonText}
              </button>
            </div>
            </div>

            
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

/**
 * Hook personalizado para manejar el estado del modal de confirmación
 */
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"success" | "error">("success");
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const openModal = (
    modalType: "success" | "error" = "success",
    modalTitle?: string,
    modalMessage?: string
  ) => {
    setType(modalType);
    setTitle(modalTitle);
    setMessage(modalMessage);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const showSuccess = (successTitle?: string, successMessage?: string) => {
    openModal("success", successTitle, successMessage);
  };

  const showError = (errorTitle?: string, errorMessage?: string) => {
    openModal("error", errorTitle, errorMessage);
  };

  return {
    isOpen,
    type,
    title,
    message,
    openModal,
    closeModal,
    showSuccess,
    showError,
  };
}
