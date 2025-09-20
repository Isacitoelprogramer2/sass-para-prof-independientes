"use client";

import { useParams } from "next/navigation";
import { useTickets } from "@/hooks/use-tickets";
import { useClientes } from "@/hooks/use-clientes";
import { useMemo } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { useRouter } from "next/navigation";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const router = useRouter();
  const { tickets } = useTickets();
  const { clientes } = useClientes();

  const ticket = useMemo(() => {
    return tickets.find(t => t.id === ticketId);
  }, [tickets, ticketId]);

  const cliente = useMemo(() => {
    if (!ticket) return null;
    return clientes.find(c => c.id === ticket.clienteId);
  }, [clientes, ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg">Ticket no encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const clienteNombre = cliente?.datos.nombre || ticket.clienteContacto?.nombre || "Cliente desconocido";
  const clienteTelefono = cliente?.datos.telefono || ticket.clienteContacto?.telefono || "No disponible";
  const clienteEmail = cliente?.datos.correo || ticket.clienteContacto?.email || "No disponible";

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botón de volver mejorado */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-gray-400 hover:text-blue-400 mb-8 transition-all duration-300 hover:translate-x-1"
        >
          <div className="p-2 rounded-xl transition-all duration-300 border border-gray-700/50 group-hover:border-blue-500/30">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-medium">Volver</span>
        </button>

        {/* Card principal con efecto glassmorphism */}
        <div className=" rounded-3xl overflow-hidden">
          {/* Header con gradiente */}
          <div className=" p-8 border-b border-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-100 mb-3 leading-tight">{ticket.titulo}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium">Número:</span>
                  <code className="text-blue-400 bg-blue-950/50 px-3 py-1 rounded-lg text-sm font-mono border border-blue-800/30">
                    {ticket.numero}
                  </code>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${
                  ticket.prioridad === 'ALTA'
                    ? 'bg-red-900/30 text-red-300 border-red-700/50 shadow-red-900/20 shadow-lg'
                    : ticket.prioridad === 'MEDIA'
                    ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50 shadow-yellow-900/20 shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 border-gray-600/50 shadow-gray-900/20 shadow-lg'
                }`}>
                  {ticket.prioridad}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            {/* Grid de información */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Información del Cliente */}
              <div className=" rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/30">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">Información del Cliente</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[70px]">Nombre:</span>
                    <span className="text-gray-200 font-medium">{clienteNombre}</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[70px]">Teléfono:</span>
                    <span className="text-gray-200">{clienteTelefono}</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[70px]">Email:</span>
                    <span className="text-gray-200 break-all">{clienteEmail}</span>
                  </div>
                </div>
              </div>

              {/* Detalles del Ticket */}
              <div className=" rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-800/30">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">Detalles del Ticket</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[80px]">Estado:</span>
                    <span className="text-gray-200 capitalize">{ticket.estado.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[80px]">Tipo:</span>
                    <span className="text-gray-200 capitalize">{ticket.tipoContexto.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <span className="text-gray-400 font-medium min-w-[80px]">Fecha de ingreso:</span>
                    <span className="text-gray-200">{new Date(ticket.fechaIngreso).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-green-900/30 rounded-lg border border-green-800/30">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-100">Descripción</h3>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{ticket.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
