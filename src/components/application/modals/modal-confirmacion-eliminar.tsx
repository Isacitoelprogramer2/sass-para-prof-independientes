"use client";

import { AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";

/**
 * Propiedades del modal de confirmación para eliminar elementos
 */
interface ModalConfirmacionEliminarProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Función que se ejecuta cuando se confirma la eliminación */
  onConfirm: () => void;
  /** Nombre del elemento que se va a eliminar */
  nombreElemento: string;
  /** Tipo de elemento que se va a eliminar (servicio, cliente, etc.) */
  tipoElemento?: string;
  /** Indica si la operación de eliminación está en proceso */
  isLoading?: boolean;
}

/**
 * Modal de confirmación para eliminar elementos
 * Muestra una advertencia al usuario antes de proceder con la eliminación
 */
export function ModalConfirmacionEliminar({
  isOpen,
  onClose,
  onConfirm,
  nombreElemento,
  tipoElemento = "elemento",
  isLoading = false
}: ModalConfirmacionEliminarProps) {
  
  /**
   * Maneja la confirmación de eliminación
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay>
        <Modal className="w-full max-w-md">
          <Dialog>
            <div className="bg-primary rounded-lg p-6 shadow-xl">
              {/* Icono de advertencia */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-50 mb-4">
                <AlertCircle className="h-6 w-6 text-error-600" />
              </div>

              {/* Título del modal */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Eliminar {tipoElemento}
                </h3>
                <p className="mt-2 text-sm text-tertiary">
                  ¿Estás seguro de que deseas eliminar {tipoElemento === "elemento" ? "el elemento" : `${tipoElemento === "cliente" ? "al cliente" : `el ${tipoElemento}`}`}{" "}
                  <span className="font-medium text-primary">"{nombreElemento}"</span>?
                </p>
                <p className="mt-1 text-sm text-error-600">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 justify-end">
                <Button
                  color="tertiary"
                  size="sm"
                  onClick={onClose}
                  isDisabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary-destructive"
                  size="sm"
                  onClick={handleConfirm}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? "Eliminando..." : "Eliminar"}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
