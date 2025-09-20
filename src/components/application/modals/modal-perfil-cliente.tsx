"use client";

import { User01, Mail01, Phone, Calendar, Ticket01, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";
import { Cliente } from "@/types/cliente";

/**
 * Propiedades del modal de perfil de cliente
 */
interface ModalPerfilClienteProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
}

/**
 * Modal para mostrar el perfil completo de un cliente
 * Incluye datos generales, tickets y historial de citas
 */
export function ModalPerfilCliente({
  isOpen,
  onClose,
  cliente
}: ModalPerfilClienteProps) {
  if (!cliente) return null;

  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;
    if (Number.isNaN(fechaObj.getTime())) return "Fecha inválida";
    return fechaObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getColorEstadoCita = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return "bg-success-50 text-success-700 border-success-200";
      case "PENDIENTE":
        return "bg-warning-50 text-warning-700 border-warning-200";
      case "CANCELADA":
        return "bg-error-50 text-error-700 border-error-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getColorTipoCliente = (tipo: string) => {
    switch (tipo) {
      case "HABITUAL":
        return "bg-brand-50 text-brand-700 border-brand-200";
      case "AMBULATORIO":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay /* si tu Overlay acepta className, puedes sumar padding externo: className="p-4" */>
        {/* Más ancho, margen responsivo al viewport y altura cómoda */}
        <Modal
          className="
            w-[80vh]
            max-h-[85vh]
          "
        >
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-perfil-cliente-title"
          >
            {/* NOTA: no usamos overflow-hidden aquí para no cortar el botón/focus ring */}
            <div className="bg-primary rounded-lg shadow-xl w-[100%] flex flex-col">
              {/* Header sticky para mantener el botón visible */}
              <div className="px-6 py-4 border-b border-secondary bg-secondary
                              sticky top-0 z-10
                              flex items-center justify-between">
                <div className="flex items-center space-x-3 rounded-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 shrink-0">
                    <User01 className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="rounded-lg">
                    <h2 id="modal-perfil-cliente-title" className="text-lg font-semibold text-primary truncate">
                      Perfil de Cliente
                    </h2>
                    <p className="text-sm text-tertiary truncate">{cliente.datos.nombre}</p>
                  </div>
                </div>
                <Button
                  color="tertiary"
                  size="sm"
                  iconLeading={X}
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="shrink-0"
                />
              </div>

              {/* Contenido scrolleable */}
              <div className="overflow-y-auto max-h-[calc(85vh-112px)]">
                {/* Sección: Datos Generales */}
                <div className="p-8 border-b border-secondary/20">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                    <User01 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">Datos Generales</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                    <div>
                        <label className="text-xs font-medium text-secondary/60 uppercase tracking-wide mb-2 block">
                        Nombre completo
                        </label>
                        <p className="text-lg font-medium text-primary">{cliente.datos.nombre}</p>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-secondary/60 uppercase tracking-wide mb-2 block">
                        Tipo de cliente
                        </label>
                        <span className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getColorTipoCliente(cliente.tipo)}`}>
                        {cliente.tipo === "HABITUAL" ? "Cliente Habitual" : "Cliente Ambulatorio"}
                        </span>
                    </div>
                    </div>

                    <div className="space-y-6">
                    <div>
                        <label className="text-xs font-medium text-secondary/60 uppercase tracking-wide mb-2 block">
                        Correo electrónico
                        </label>
                        <div className="flex items-center space-x-3 bg-gray-50/10 rounded-lg px-3 py-2.5">
                        <Mail01 className="h-4 w-4 text-tertiary flex-shrink-0" />
                        <p className="text-sm text-primary break-all">
                            {cliente.datos.correo || "No proporcionado"}
                        </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-secondary/60 uppercase tracking-wide mb-2 block">
                        Teléfono
                        </label>
                        <div className="flex items-center space-x-3 bg-gray-50/10 rounded-lg px-3 py-2.5">
                        <Phone className="h-4 w-4 text-tertiary flex-shrink-0" />
                        <p className="text-sm text-primary">{cliente.datos.telefono || "No proporcionado"}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-secondary/60 uppercase tracking-wide mb-2 block">
                        Estado
                        </label>
                        <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${
                            cliente.datos.estado === "ACTIVO"
                            ? "bg-green-100/30 text-success-200 border-success-200/30"
                            : "bg-gray-500/50 text-gray-200 border-gray-500/60"
                        }`}
                        >
                        {cliente.datos.estado}
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Sección: Historial de Citas */}
                <div className="p-6 border-b border-secondary">
                  <h3 className="text-md font-semibold text-primary mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Historial de Citas</span>
                    </div>
                    <span className="text-sm text-tertiary">
                      {cliente.historialCitas?.length || 0} citas totales
                    </span>
                  </h3>

                  {!cliente.historialCitas || cliente.historialCitas.length === 0 ? (
                    <div className="text-center py-8 text-tertiary">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay citas registradas</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cliente.historialCitas.map((cita, index) => (
                        <div key={cita.id || index} className="bg-secondary rounded-lg p-4 border border-secondary">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-medium text-primary">
                                  Código: {cita.codigoAcceso}
                                </p>
                                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getColorEstadoCita(cita.estado)}`}>
                                  {cita.estado}
                                </span>
                              </div>
                              <p className="text-sm text-tertiary">
                                Fecha: {formatearFecha(cita.fechaReservada)}
                              </p>
                              {cita.notas && (
                                <p className="text-sm text-tertiary mt-1">
                                  Notas: {cita.notas}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sección: Tickets */}
                <div className="p-6">
                  <h3 className="text-md font-semibold text-primary mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Ticket01 className="h-4 w-4" />
                      <span>Tickets y Reclamos</span>
                    </div>
                    <span className="text-sm text-tertiary">
                      {cliente.tickets?.length || 0} tickets
                    </span>
                  </h3>

                  {!cliente.tickets || cliente.tickets.length === 0 ? (
                    <div className="text-center py-8 text-tertiary">
                      <Ticket01 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay tickets registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cliente.tickets.map((ticket, index) => (
                        <div key={ticket.id || index} className="bg-secondary rounded-lg p-4 border border-secondary">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-primary mb-1">
                                Ticket {ticket.numero}
                              </p>
                              <p className="text-sm text-tertiary">
                                {ticket.descripcion || "Sin descripción"}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span
                                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                                    ticket.prioridad === "ALTA"
                                      ? "bg-error-50 text-error-700 border-error-200"
                                      : ticket.prioridad === "MEDIA"
                                      ? "bg-warning-50 text-warning-700 border-warning-200"
                                      : "bg-success-50 text-success-700 border-success-200"
                                  }`}
                                >
                                  {ticket.prioridad}
                                </span>
                                <span className="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                                  {ticket.tipoContexto === "DURANTE_SERVICIO" ? "Durante servicio" : "Post servicio"}
                                </span>
                              </div>
                              <p className="text-xs text-tertiary mt-2">
                                Fecha: {formatearFecha(ticket.fechaIngreso)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer sticky para acción siempre visible */}
              <div className="px-6 py-4 border-t border-secondary bg-secondary flex justify-end sticky bottom-0 z-10">
                <Button color="secondary" size="sm" onClick={onClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
