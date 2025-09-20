"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileX01 } from "@untitledui/icons";
import { useTickets } from "@/hooks/use-tickets";
import { useClientes } from "@/hooks/use-clientes";

export default function TicketsAbiertos() {
  const router = useRouter();
  const { tickets, loading: ticketsLoading } = useTickets();
  const { clientes } = useClientes();

  // Filtrar tickets abiertos y obtener información del cliente
  const openTickets = useMemo(() => {
    return tickets
      .filter(ticket => ticket.estado === "ABIERTO")
      .slice(0, 5) // Mostrar máximo 5 tickets
      .map(ticket => {
        const cliente = clientes.find(c => c.id === ticket.clienteId);
        const clienteNombre = cliente?.datos.nombre || ticket.clienteContacto?.nombre || "Cliente desconocido";

        // Calcular tiempo transcurrido
        const ahora = new Date();
        const fechaIngreso = new Date(ticket.fechaIngreso);
        const diffMs = ahora.getTime() - fechaIngreso.getTime();
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDias = Math.floor(diffHoras / 24);

        let tiempo;
        if (diffDias > 0) {
          tiempo = `hace ${diffDias}d`;
        } else if (diffHoras > 0) {
          tiempo = `hace ${diffHoras}h`;
        } else {
          tiempo = "hace menos de 1h";
        }

        return {
          id: ticket.id,
          numero: ticket.numero,
          client: clienteNombre,
          issue: ticket.titulo,
          priority: ticket.prioridad.toLowerCase() as "alta" | "media" | "baja",
          time: tiempo,
          fullTicket: ticket
        };
      });
  }, [tickets, clientes]);

  const handleTicketClick = (ticketId: string) => {
    router.push(`/dashboard/tickets/${ticketId}`);
  };

  const handleVerTodos = () => {
    router.push("/dashboard/tickets");
  };

  if (ticketsLoading) {
    return (
      <div className="bg-primary border border-secondary rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Tickets Abiertos</h3>
          <div className="animate-pulse bg-secondary h-6 w-20 rounded-full"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-secondary rounded-lg animate-pulse">
              <div className="h-4 bg-tertiary rounded mb-2"></div>
              <div className="h-3 bg-tertiary rounded mb-1"></div>
              <div className="h-3 bg-quaternary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Tickets Abiertos</h3>
        <span className="px-2 py-1 bg-error-50 text-error-700 text-xs font-medium rounded-full">
          {openTickets.length} {openTickets.length === 1 ? 'pendiente' : 'pendientes'}
        </span>
      </div>

      <div className="space-y-3">
        {openTickets.length === 0 ? (
          <div className="text-center py-8">
            <FileX01 className="h-12 w-12 text-quaternary mx-auto mb-4" />
            <p className="text-tertiary">No hay tickets abiertos</p>
          </div>
        ) : (
          openTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.id)}
              className="p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-tertiary">{ticket.numero}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.priority === 'alta'
                    ? 'bg-error-50 text-error-700'
                    : ticket.priority === 'media'
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {ticket.priority === 'alta' ? 'Alta' :
                   ticket.priority === 'media' ? 'Media' : 'Baja'}
                </span>
              </div>
              <p className="font-medium text-primary text-sm">{ticket.client}</p>
              <p className="text-sm text-tertiary mt-1">{ticket.issue}</p>
              <p className="text-xs text-quaternary mt-2">{ticket.time}</p>
            </div>
          ))
        )}
      </div>

      {openTickets.length > 0 && (
        <button
          onClick={handleVerTodos}
          className="w-full mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          Ver todos los tickets
        </button>
      )}
    </div>
  );
}