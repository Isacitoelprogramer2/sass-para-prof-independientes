"use client";

import React from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";
import { Button } from "@/components/base/buttons/button";
import { Ticket } from "@/types/ticket";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export function TicketDetailModal({ isOpen, onClose, ticket }: Props) {
  if (!ticket) return null;

  const f = (fecha?: Date) => (fecha ? new Date(fecha).toLocaleString("es-ES") : "-");

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay>
        <Modal className="max-w-2xl">
          <Dialog role="dialog" aria-modal="true" aria-labelledby="ticket-detail-title">
            <div className="p-6 bg-primary rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h3 id="ticket-detail-title" className="text-lg font-semibold">Detalle de Ticket</h3>
                <Button color="tertiary" size="sm" onClick={onClose} aria-label="Cerrar">Cerrar</Button>
              </div>

              <div className="space-y-3">
                <p><strong>ID:</strong> {ticket.id}</p>
                <p><strong>Fecha ingreso:</strong> {f(ticket.fechaIngreso)}</p>
                <p><strong>Prioridad:</strong> {ticket.prioridad}</p>
                <p><strong>Contexto:</strong> {ticket.tipoContexto}</p>
                <p><strong>Asignado a:</strong> {ticket.asignadoA || '—'}</p>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <p className="mt-2 text-sm text-tertiary whitespace-pre-wrap">{ticket.descripcion}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button color="secondary" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
