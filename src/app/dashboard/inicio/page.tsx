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
  FileX01
} from "@untitledui/icons";
import { useState } from "react";

export default function InicioPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const stats = [
    {
      name: "Citas Agendadas",
      value: "24",
      icon: Calendar,
      change: "+12%",
      changeType: "positive" as const,
      description: "Esta semana"
    },
    {
      name: "Servicios Activos", 
      value: "8",
      icon: Activity,
      change: "+2",
      changeType: "positive" as const,
      description: "En curso"
    },
    {
      name: "Tickets Pendientes",
      value: "5",
      icon: FileX01,
      change: "-3",
      changeType: "negative" as const,
      description: "Por resolver"
    },
    {
      name: "Ingresos del Mes",
      value: "$12,450",
      icon: CurrencyDollar,
      change: "+8%",
      changeType: "positive" as const,
      description: "vs último mes"
    },
  ];

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

      {/* Indicadores clave mejorados */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-primary border border-secondary rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-950/30">
                <stat.icon className="h-6 w-6 text-brand-400" />
              </div>
            </div>
            <div>
              <p className="text-display-xs font-semibold text-primary">{stat.value}</p>
              <p className="text-sm font-medium text-tertiary mt-1">{stat.name}</p>
              <p className="text-xs text-quaternary mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vista de agenda y tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Agenda del día */}
        <div className="lg:col-span-2 bg-primary border border-secondary rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Agenda de Hoy</h3>
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center">
              Ver calendario completo
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {todaySchedule.map((appointment, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-tertiary transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{appointment.time}</p>
                  </div>
                  <div className="h-12 w-px bg-border"></div>
                  <div>
                    <p className="font-medium text-primary">{appointment.client}</p>
                    <p className="text-sm text-tertiary">{appointment.service}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Clientes Recientes</h3>
          <div className="space-y-3">
            {clientes.slice(0, 3).map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                    <User01 className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{cliente.nombre}</p>
                    <p className="text-xs text-tertiary">{cliente.ultimaVisita}</p>
                  </div>
                </div>
                <Button color="tertiary" size="sm">
                  Contactar
                </Button>
              </div>
            ))}
          </div>
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

      {/* Vista semanal */}
      <div className="bg-primary border border-secondary rounded-lg p-6">
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

      {/* Acciones rápidas y actividad reciente */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex flex-col items-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Nueva Cita</span>
            </button>
            <button className="p-4 bg-secondary border border-secondary rounded-lg hover:bg-tertiary transition-colors flex flex-col items-center">
              <Users01 className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium text-primary">Nuevo Cliente</span>
            </button>
            <button className="p-4 bg-secondary border border-secondary rounded-lg hover:bg-tertiary transition-colors flex flex-col items-center">
              <FileX01 className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium text-primary">Crear Ticket</span>
            </button>
            <button className="p-4 bg-secondary border border-secondary rounded-lg hover:bg-tertiary transition-colors flex flex-col items-center">
              <CurrencyDollar className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium text-primary">Registrar Pago</span>
            </button>
          </div>
        </div>

        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-primary">Nueva cita programada con Juan Pérez</p>
                <p className="text-xs text-tertiary">hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-primary">Servicio completado - María García</p>
                <p className="text-xs text-tertiary">hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-primary">Ticket #T-001 actualizado</p>
                <p className="text-xs text-tertiary">hace 30 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-primary">Pago recibido - $150</p>
                <p className="text-xs text-tertiary">hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
