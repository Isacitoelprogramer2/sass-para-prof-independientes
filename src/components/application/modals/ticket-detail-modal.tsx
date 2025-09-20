"use client";

import React, { useState, useEffect } from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Ticket } from "@/types/ticket";
import { Cliente } from "@/types/cliente";
import { useClientes } from "@/hooks/use-clientes";
import {
  Ticket01,
  User01,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Mail01,
  Phone,
  Hash01,
  File02,
  X
} from "@untitledui/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export function TicketDetailModal({ isOpen, onClose, ticket }: Props) {
  const { obtenerCliente } = useClientes();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    // Si el ticket tiene clienteContacto, no intentamos obtener cliente de la DB
    if (ticket?.clienteContacto) {
      setCliente(null);
      return;
    }
    
    if (ticket?.clienteId) {
      obtenerCliente(ticket.clienteId).then(setCliente);
    } else {
      setCliente(null);
    }
  }, [ticket, obtenerCliente]);

  if (!ticket) return null;

  const formatDate = (fecha?: Date) => (fecha ? new Date(fecha).toLocaleString("es-ES") : "-");

  // Función para obtener el color del badge según el estado
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'abierto':
      case 'nuevo':
        return 'blue';
      case 'en progreso':
      case 'asignado':
        return 'warning';
      case 'resuelto':
      case 'cerrado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'gray';
    }
  };

  // Función para obtener el color del badge según la prioridad
  const getPrioridadBadgeColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
      case 'crítica':
        return 'error';
      case 'media':
        return 'warning';
      case 'baja':
        return 'success';
      default:
        return 'gray';
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay>
        <Modal className="max-w-3xl">
          <Dialog role="dialog" aria-modal="true" aria-labelledby="ticket-detail-title">
            <div className="bg-primary rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-secondary border-b border-tertiary px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FeaturedIcon
                      icon={Ticket01}
                      size="md"
                      color="brand"
                      theme="light"
                    />
                    <div>
                      <h3 id="ticket-detail-title" className="text-lg font-semibold text-primary">
                        Detalle de Ticket
                      </h3>
                      <p className="text-sm text-tertiary">{ticket.numero}</p>
                    </div>
                  </div>
                  <Button
                    color="tertiary"
                    size="sm"
                    onClick={onClose}
                    aria-label="Cerrar"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Título y badges principales */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-primary mb-2">
                      {ticket.titulo}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <BadgeWithDot
                        color={getEstadoBadgeColor(ticket.estado)}
                        size="md"
                      >
                        {ticket.estado}
                      </BadgeWithDot>
                      <Badge
                        color={getPrioridadBadgeColor(ticket.prioridad)}
                        size="md"
                      >
                        {ticket.prioridad}
                      </Badge>
                      <Badge color="gray" size="md">
                        {ticket.tipoContexto}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información del Ticket */}
                <div className="bg-secondary rounded-lg p-5 border border-tertiary">
                  <div className="flex items-center gap-2 mb-4">
                    <FeaturedIcon
                      icon={File02}
                      size="sm"
                      color="gray"
                      theme="light"
                    />
                    <h5 className="font-semibold text-primary">Información del Ticket</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Hash01 className="size-4 text-tertiary" />
                        <span className="text-sm font-medium text-secondary">Número:</span>
                        <span className="text-sm text-primary font-mono">{ticket.numero}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-tertiary" />
                        <span className="text-sm font-medium text-secondary">Fecha ingreso:</span>
                        <span className="text-sm text-primary">{formatDate(ticket.fechaIngreso)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-tertiary" />
                        <span className="text-sm font-medium text-secondary">Prioridad:</span>
                        <Badge
                          color={getPrioridadBadgeColor(ticket.prioridad)}
                          size="sm"
                        >
                          {ticket.prioridad}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User01 className="size-4 text-tertiary" />
                        <span className="text-sm font-medium text-secondary">Asignado a:</span>
                        <span className="text-sm text-primary">{ticket.asignadoA || 'Sin asignar'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                {(cliente || ticket.clienteContacto) && (
                  <div className="bg-secondary rounded-lg p-5 border border-tertiary">
                    <div className="flex items-center gap-2 mb-4">
                      <FeaturedIcon
                        icon={User01}
                        size="sm"
                        color="brand"
                        theme="light"
                      />
                      <h5 className="font-semibold text-primary">Información del Cliente</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User01 className="size-4 text-tertiary" />
                          <span className="text-sm font-medium text-secondary">Nombre:</span>
                          <span className="text-sm text-primary font-medium">
                            {cliente ? cliente.datos.nombre : ticket.clienteContacto?.nombre}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail01 className="size-4 text-tertiary" />
                          <span className="text-sm font-medium text-secondary">Correo:</span>
                          <span className="text-sm text-primary">
                            {cliente
                              ? (cliente.datos.correo || 'No especificado')
                              : (ticket.clienteContacto?.email || 'No especificado')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-tertiary" />
                          <span className="text-sm font-medium text-secondary">Teléfono:</span>
                          <span className="text-sm text-primary">
                            {cliente ? cliente.datos.telefono : ticket.clienteContacto?.telefono}
                          </span>
                        </div>
                        
                        {!cliente && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-secondary">Tipo:</span>
                            <Badge color="warning" size="sm">
                              Ambulatorio
                            </Badge>
                          </div>
                        )}
                        
                        {cliente && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="size-4 text-tertiary" />
                            <span className="text-sm font-medium text-secondary">Estado:</span>
                            <Badge
                              color={cliente.datos.estado?.toLowerCase() === 'activo' ? 'success' : 'gray'}
                              size="sm"
                            >
                              {cliente.datos.estado}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Descripción */}
                <div className="bg-secondary rounded-lg p-5 border border-tertiary">
                  <div className="flex items-center gap-2 mb-3">
                    <File02 className="size-4 text-tertiary" />
                    <h5 className="font-semibold text-primary">Descripción</h5>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                      {ticket.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-secondary border-t border-tertiary px-6 py-4">
                <div className="flex justify-end">
                  <Button
                    color="secondary"
                    size="md"
                    onClick={onClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
