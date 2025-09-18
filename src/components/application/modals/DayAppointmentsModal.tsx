"use client";

import { Calendar, X, ArrowRight } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from '@/components/application/modals/modal';
import { useClientes } from '@/hooks/use-clientes';
import { useServicios } from '@/hooks/use-servicios';
import { useRouter } from 'next/navigation';

interface DayAppointmentsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDay: Date | null;
  citas: any[];
}

export default function DayAppointmentsModal({
  isOpen,
  onOpenChange,
  selectedDay,
  citas
}: DayAppointmentsModalProps) {
  const { clientes } = useClientes();
  const { servicios } = useServicios();
  const router = useRouter();

  // Función para navegar a los detalles de la cita
  const handleCitaClick = (citaId: string) => {
    router.push(`/dashboard/servicios/servicio-details?id=${citaId}`);
    onOpenChange(false); // Cerrar el modal después de navegar
  };

  // Función para obtener citas de un día específico
  const getCitasForDay = (date: Date) => {
    if (!date) return [];

    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    return citas.filter(cita => {
      const citaDate = new Date(cita.fechaReservada);
      return citaDate >= dayStart && citaDate <= dayEnd;
    }).sort((a, b) => new Date(a.fechaReservada).getTime() - new Date(b.fechaReservada).getTime());
  };

  // Función para obtener el nombre del cliente
  const getClientName = (cita: any) => {
    if (cita.clienteId) {
      const cliente = clientes.find(c => c.id === cita.clienteId);
      return cliente?.datos.nombre || 'Cliente no encontrado';
    } else if (cita.clienteAmbulatorio) {
      return cita.clienteAmbulatorio.nombre;
    }
    return 'Cliente desconocido';
  };

  // Función para obtener el nombre del servicio
  const getServiceName = (cita: any) => {
    const servicio = servicios.find(s => s.id === cita.servicioId);
    return servicio?.nombre || 'Servicio no encontrado';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMADA': return 'text-success-700 bg-success-50';
      case 'PENDIENTE': return 'text-warning-700 bg-warning-50';
      case 'CANCELADA': return 'text-error-700 bg-error-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'CONFIRMADA': return 'Confirmada';
      case 'PENDIENTE': return 'Pendiente';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  };

  if (!selectedDay) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal>
        <Dialog className="w-full ">
          <div className="bg-primary border border-secondary rounded-lg shadow-xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-secondary">
              <h2 className="text-lg font-semibold text-primary">
                Citas del {selectedDay.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-tertiary" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 w-lg">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getCitasForDay(selectedDay).length > 0 ? (
                  getCitasForDay(selectedDay).map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
                      onClick={() => handleCitaClick(cita.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-primary">
                            {new Date(cita.fechaReservada).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="h-12 w-px bg-border"></div>
                        <div>
                          <p className="font-medium text-primary">{getClientName(cita)}</p>
                          <p className="text-sm text-tertiary">{getServiceName(cita)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cita.estado)}`}>
                        {getStatusText(cita.estado)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-tertiary mx-auto mb-4" />
                    <p className="text-tertiary">No hay citas programadas para este día</p>
                  </div>
                )}
              </div>

              {getCitasForDay(selectedDay).length > 0 && (
                <div className="mt-6 pt-4 border-t border-secondary">    
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}