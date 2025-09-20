"use client";

import {  
  Calendar, 
  CurrencyDollar,
  Bell01,
  Clock,
  AlertCircle,
  X,
  FileX01,
  User01,
  Plus
} from "@untitledui/icons";
import { useState, useMemo } from "react";
import StatsGrid from '@/components/dashboard/StatsGrid';
import ClientesRecientes from '@/components/dashboard/ClientesRecientes';
import TicketsAbiertos from '@/components/dashboard/TicketsAbiertos';
import { useCitas } from '@/hooks/use-citas';
import { useClientes } from '@/hooks/use-clientes';
import { useServicios } from '@/hooks/use-servicios';
import DayAppointmentsModal from '@/components/application/modals/DayAppointmentsModal';

export default function InicioPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const { citas, loading: citasLoading } = useCitas();
  const { clientes } = useClientes();
  const { servicios } = useServicios();
  
  // Función para manejar el click en un día
  const handleDayClick = (day: typeof weekSchedule[0]) => {
    // Calcular la fecha completa del día seleccionado
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    const selectedDate = new Date(monday);
    selectedDate.setDate(monday.getDate() + weekSchedule.indexOf(day));
    
    setSelectedDay(selectedDate);
    setShowDayModal(true);
  };
  
  // Calcular la semana actual y contar citas por día
  const weekSchedule = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Calcular el lunes de la semana actual
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      // Contar citas para este día
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      const appointmentsCount = citas.filter(cita => {
        const citaDate = new Date(cita.fechaReservada);
        return citaDate >= dayStart && citaDate <= dayEnd;
      }).length;
      
      weekDays.push({
        day: days[date.getDay()],
        date: date.getDate().toString(),
        appointments: appointmentsCount,
        available: Math.max(0, 10 - appointmentsCount), // Asumiendo capacidad máxima de 10 citas por día
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return weekDays;
  }, [citas]);

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
              <div className="w-3 h-3 bg-brand-400 rounded-full mr-2"></div>
              <span className="text-tertiary">Citas agendadas</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {weekSchedule.map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center p-4 rounded-lg border cursor-pointer transition-colors ${
                day.isToday ? 'border-brand-600 bg-brand-500/20 hover:bg-brand-500/30' : 'border-secondary bg-secondary hover:bg-tertiary'
              }`}
              onClick={() => handleDayClick(day)}
            >
              <p className="text-xs font-medium text-tertiary mb-1">{day.day}</p>
              <p className="text-2xl font-semibold text-primary mb-3">{day.date}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Calendar className="h-3 w-3 text-brand-400" />
                  <span className="text-sm font-medium text-brand-400">
                    {citasLoading ? '...' : day.appointments}
                  </span>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vista de agenda y tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        
        {/* Clientes recientes */}
        <ClientesRecientes />

        {/* Tickets abiertos */}
        <TicketsAbiertos />

      </div>

      {/* Modal de citas del día */}
      <DayAppointmentsModal
        isOpen={showDayModal}
        onOpenChange={setShowDayModal}
        selectedDay={selectedDay}
        citas={citas}
      />

    </div>
  );
}
