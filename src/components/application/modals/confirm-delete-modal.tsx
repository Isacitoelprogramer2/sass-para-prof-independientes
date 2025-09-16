"use client";

import React from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";
import { Button } from "@/components/base/buttons/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title = 'Confirmar eliminación', description = 'Esta acción no se puede deshacer.' }: Props) {
  const [loading, setLoading] = React.useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay>
        <Modal className="max-w-md">
          <Dialog role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
            <div className="p-6 bg-primary rounded-md">
              <div className="mb-4">
                <h3 id="confirm-delete-title" className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-tertiary mt-2">{description}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button color="tertiary" onClick={onClose}>Cancelar</Button>
                <Button color="primary-destructive" onClick={handle} disabled={loading}>{loading ? 'Eliminando...' : 'Eliminar'}</Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
