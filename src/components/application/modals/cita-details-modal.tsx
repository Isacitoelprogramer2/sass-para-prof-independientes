"use client";

import React, { useEffect, useRef } from "react";
import { X as XIcon, Calendar, Clock, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Cita } from "@/types/cita";
import { Cliente } from "@/types/cliente";
import { Servicio } from "@/types/servicio";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  clientes?: Cliente[];
  servicios?: Servicio[];
};

export const CitaDetailsModal: React.FC<Props> = ({ isOpen, onClose, cita, clientes = [], servicios = [] }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !cita) return null;

  const formatearFecha = (fecha: Date) =>
    fecha.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });

  const formatearHora = (fecha: Date) =>
    fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  // Obtener nombre del cliente
  const obtenerNombreCliente = () => {
    // Si es cliente ambulatorio, usar su nombre directamente
    if (cita.clienteAmbulatorio) {
      return cita.clienteAmbulatorio.nombre;
    }
    
    // Si es cliente habitual, buscar en el array de clientes
    if (cita.clienteId && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === cita.clienteId);
      return cliente ? cliente.datos.nombre : 'Cliente no encontrado';
    }
    
    return 'Cliente';
  };

  // Obtener teléfono del cliente
  const obtenerTelefonoCliente = () => {
    // Si es cliente ambulatorio, usar su teléfono directamente
    if (cita.clienteAmbulatorio) {
      return cita.clienteAmbulatorio.telefono;
    }
    
    // Si es cliente habitual, buscar en el array de clientes
    if (cita.clienteId && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === cita.clienteId);
      return cliente ? cliente.datos.telefono : undefined;
    }
    
    return undefined;
  };

  // Obtener nombre y precio del servicio
  const obtenerDatosServicio = () => {
    if (cita.servicioId && servicios.length > 0) {
      const servicio = servicios.find(s => s.id === cita.servicioId);
      if (servicio) {
        return {
          nombre: servicio.nombre,
          precio: servicio.precio
        };
      }
    }
    
    return {
      nombre: 'Servicio no encontrado',
      precio: 0
    };
  };

  const datosServicio = obtenerDatosServicio();
  const telefonoCliente = obtenerTelefonoCliente();

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de la cita ${cita.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        // close when clicking on overlay (but not clicks inside the panel)
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative w-full max-w-2xl mx-4 bg-primary border border-secondary rounded-lg shadow-lg z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">Detalles de la cita</h3>
          <Button size="sm" color="tertiary" iconLeading={XIcon} onClick={onClose} aria-label="Cerrar modal" />
        </div>

        <div className="p-6 space-y-4">
          {/* Prioritize notes */}
          {cita.notas ? (
            <div className="rounded-md border border-secondary p-4 bg-gray-850">
              <h4 className="text-sm font-semibold text-primary mb-1">Notas</h4>
              <p className="text-sm text-tertiary">{cita.notas}</p>
            </div>
          ) : (
            <div className="rounded-md border border-secondary p-4 bg-gray-850">
              <h4 className="text-sm font-semibold text-primary mb-1">Notas</h4>
              <p className="text-sm text-tertiary">No hay notas para esta cita.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-primary">Cliente</h5>
              <div className="mt-2 flex items-center space-x-3 text-tertiary">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <User01 className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-md font-semibold text-primary">{obtenerNombreCliente()}</p>
                  {telefonoCliente && <p className="text-sm">{telefonoCliente}</p>}
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-primary">Servicio / Precio</h5>
              <div className="mt-2 text-tertiary">
                <p className="text-md font-semibold text-primary">{datosServicio.nombre}</p>
                <p className="text-sm">S/{datosServicio.precio}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h6 className="text-xs text-tertiary">Fecha</h6>
              <p className="text-sm text-primary">{formatearFecha(cita.fechaReservada)}</p>
            </div>
            <div>
              <h6 className="text-xs text-tertiary">Hora</h6>
              <p className="text-sm text-primary">{formatearHora(cita.fechaReservada)}</p>
            </div>
            <div>
              <h6 className="text-xs text-tertiary">Estado</h6>
              <p
                    className={`text-xs font-semibold p-2 w-fit rounded-2xl
                    ${
                        cita.estado === "CONFIRMADA"
                        ? "bg-green-500 text-primary"
                        : cita.estado === "PENDIENTE"
                        ? "bg-yellow-600 text-primary"
                        : cita.estado === "CANCELADA"
                        ? "bg-red-500 text-primary"
                        : "bg-gray-400 text-primary"
                    }
                    `}
                >
                    {cita.estado}
                </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={onClose} color="tertiary">Cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitaDetailsModal;
