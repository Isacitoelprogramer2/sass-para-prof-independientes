"use client";

import { 
  Users01, 
  Calendar, 
  CurrencyDollar,
  Bell01,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Activity,
  X,
  FileX01,
  User01,
  Plus
} from "@untitledui/icons";
import { useState } from "react";
import StatsGrid from '@/components/dashboard/StatsGrid';

export default function InicioPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  

  const todaySchedule = [
    { time: "09:00", client: "Ana Martínez", service: "Consulta médica", status: "confirmed" },
    { time: "10:00", client: "María García", service: "Corte y peinado", status: "confirmed" },
    { time: "11:30", client: "Pedro Ruiz", service: "Masaje terapéutico", status: "in-progress" },
    { time: "14:30", client: "Carlos López", service: "Consulta", status: "confirmed" },
    { time: "16:00", client: "Laura Díaz", service: "Tratamiento facial", status: "pending" },
  ];

  const weekSchedule = [
    { day: "Lun", date: "9", appointments: 8, available: 2 },
    { day: "Mar", date: "10", appointments: 6, available: 4 },
    { day: "Mie", date: "11", appointments: 9, available: 1 },
    { day: "Jue", date: "12", appointments: 5, available: 5 },
    { day: "Vie", date: "13", appointments: 10, available: 0 },
    { day: "Sáb", date: "14", appointments: 4, available: 6 },
  ];

  const notifications = [
    { 
      id: 1, 
      type: "appointment", 
      title: "Nueva cita agendada", 
      message: "Juan Pérez ha agendado una cita para mañana a las 3:00 PM",
      time: "hace 5 min",
      unread: true 
    },
    { 
      id: 2, 
      type: "reminder", 
      title: "Recordatorio", 
      message: "Cita con Laura Díaz en 30 minutos",
      time: "hace 10 min",
      unread: true 
    },
    { 
      id: 3, 
      type: "ticket", 
      title: "Nuevo ticket de soporte", 
      message: "Cliente solicita cambio de horario",
      time: "hace 1 hora",
      unread: false 
    },
    { 
      id: 4, 
      type: "payment", 
      title: "Pago recibido", 
      message: "$150 de Carlos López",
      time: "hace 2 horas",
      unread: false 
    },
  ];

  const openTickets = [
    { id: "T-001", client: "Roberto Silva", issue: "Cambio de horario", priority: "high", time: "hace 2h" },
    { id: "T-002", client: "Carmen Ruiz", issue: "Consulta sobre servicio", priority: "medium", time: "hace 5h" },
    { id: "T-003", client: "Miguel Ángel", issue: "Problema con pago", priority: "high", time: "hace 1d" },
  ];

  const clientes = [
    { id: 1, nombre: "Ana Martínez", ultimaVisita: "Hace 2 días" },
    { id: 2, nombre: "Carlos López", ultimaVisita: "Hace 1 semana" },
    { id: 3, nombre: "María García", ultimaVisita: "Hace 3 días" },
  ];

  const accionesRapidas = [
    { id: 1, nombre: "Nueva Cita", icon: Calendar, color: "bg-blue-500" },
    { id: 2, nombre: "Nuevo Cliente", icon: User01, color: "bg-green-500" },
    { id: 3, nombre: "Nuevo Ticket", icon: FileX01, color: "bg-purple-500" },
    { id: 4, nombre: "Nuevo Servicio", icon: Plus, color: "bg-orange-500" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'text-success-700 bg-success-50';
      case 'in-progress': return 'text-blue-700 bg-blue-50';
      case 'pending': return 'text-warning-700 bg-warning-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmada';
      case 'in-progress': return 'En curso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header con notificaciones */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
          <p className="mt-2 text-md text-tertiary">
            Resumen general de tu negocio - {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {/* Botón de notificaciones */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-primary border border-secondary rounded-lg hover:bg-secondary transition-colors"
          >
            <Bell01 className="h-5 w-5 text-primary" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-600 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>

          {/* Panel de notificaciones */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-primary border border-secondary rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-secondary flex items-center justify-between">
                <h3 className="font-semibold text-primary">Notificaciones</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="h-4 w-4 text-tertiary" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-secondary hover:bg-secondary cursor-pointer ${notif.unread ? 'bg-brand-25' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        notif.type === 'appointment' ? 'bg-success-50' :
                        notif.type === 'reminder' ? 'bg-warning-50' :
                        notif.type === 'ticket' ? 'bg-error-50' :
                        'bg-blue-50'
                      }`}>
                        {notif.type === 'appointment' && <Calendar className="h-4 w-4 text-success-600" />}
                        {notif.type === 'reminder' && <Clock className="h-4 w-4 text-warning-600" />}
                        {notif.type === 'ticket' && <AlertCircle className="h-4 w-4 text-error-600" />}
                        {notif.type === 'payment' && <CurrencyDollar className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">{notif.title}</p>
                        <p className="text-sm text-tertiary mt-1">{notif.message}</p>
                        <p className="text-xs text-quaternary mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-secondary">
                <button className="w-full text-center text-sm text-brand-600 font-medium hover:text-brand-700">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicadores clave mejorados (datos reales) */}
      <StatsGrid />

      {/* Vista semanal */}
      <div className="bg-primary border border-secondary rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Vista Semanal</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-brand-600 rounded-full mr-2"></div>
              <span className="text-tertiary">Citas agendadas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
              <span className="text-tertiary">Espacios disponibles</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {weekSchedule.map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center p-4 rounded-lg border ${
                idx === 0 ? 'border-brand-600 bg-brand-50' : 'border-secondary bg-secondary'
              }`}
            >
              <p className="text-xs font-medium text-tertiary mb-1">{day.day}</p>
              <p className="text-2xl font-semibold text-primary mb-3">{day.date}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Calendar className="h-3 w-3 text-brand-600" />
                  <span className="text-sm font-medium text-brand-600">{day.appointments}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-success-600" />
                  <span className="text-sm font-medium text-success-600">{day.available}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vista de agenda y tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        
        {/* Clientes recientes */}
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Clientes Recientes</h3>
          <div className="space-y-3">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
                    <User01 className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{cliente.nombre}</p>
                    <p className="text-xs text-tertiary">{cliente.ultimaVisita}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">
                  Contactar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets pendientes */}
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Tickets Abiertos</h3>
            <span className="px-2 py-1 bg-error-50 text-error-700 text-xs font-medium rounded-full">
              {openTickets.length} pendientes
            </span>
          </div>
          
          <div className="space-y-3">
            {openTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-tertiary">{ticket.id}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ticket.priority === 'high' 
                      ? 'bg-error-50 text-error-700' 
                      : 'bg-warning-50 text-warning-700'
                  }`}>
                    {ticket.priority === 'high' ? 'Alta' : 'Media'}
                  </span>
                </div>
                <p className="font-medium text-primary text-sm">{ticket.client}</p>
                <p className="text-sm text-tertiary mt-1">{ticket.issue}</p>
                <p className="text-xs text-quaternary mt-2">{ticket.time}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium">
            Ver todos los tickets
          </button>
        </div>
      </div>

      
    </div>
  );
}
