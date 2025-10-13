'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CurrencyDollar,
  Clock,
  AlertCircle,
  X,
} from "@untitledui/icons";
import { useNotificaciones } from '@/hooks/use-notificaciones';

interface NotificationsPanelProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

export default function NotificationsPanel({
  showNotifications,
  setShowNotifications
}: NotificationsPanelProps) {
  const { notificaciones, loading, marcarComoLeida } = useNotificaciones();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isVisible, setIsVisible] = useState(true);

  // Detectar si es móvil para ajustar intervalo
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  const intervalMs = isMobile ? 5000 : 1000; // 5s en móvil, 1s en desktop

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Pausar si no está visible
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isVisible, intervalMs]);

  const handleNotificationClick = async (notifId: string) => {
    await marcarComoLeida(notifId);
  };

  // Función para calcular tiempo transcurrido
  const calcularTiempoTranscurrido = (createdAt: Date) => {
    try {
      const ahora = currentTime;
      const diffMs = ahora - createdAt.getTime();

      const diffMinutos = Math.floor(diffMs / (1000 * 60));
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffSemanas = Math.floor(diffDias / 7);
      const diffMeses = Math.floor(diffDias / 30);
      const diffAnios = Math.floor(diffDias / 365);

      if (diffAnios > 0) {
        return `hace ${diffAnios} ${diffAnios === 1 ? 'año' : 'años'}`;
      } else if (diffMeses > 0) {
        return `hace ${diffMeses} ${diffMeses === 1 ? 'mes' : 'meses'}`;
      } else if (diffSemanas > 0) {
        return `hace ${diffSemanas} ${diffSemanas === 1 ? 'semana' : 'semanas'}`;
      } else if (diffDias > 0) {
        return `hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;
      } else if (diffHoras > 0) {
        return `hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
      } else if (diffMinutos > 0) {
        return `hace ${diffMinutos} ${diffMinutos === 1 ? 'minuto' : 'minutos'}`;
      } else {
        return "hace menos de 1 min";
      }
    } catch (error) {
      console.error("Error calculando tiempo para notificación:", error);
      return "Error calculando tiempo";
    }
  };

  if (!showNotifications) return null;

  return (
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
      <div className="max-h-96 overflow-y-auto rounded-lg">
        {loading ? (
          <div className="p-4 text-center text-tertiary">
            Cargando notificaciones...
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="p-4 text-center text-tertiary">
            No hay notificaciones
          </div>
        ) : (
          notificaciones.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b shadow-4xl shadow-white border-secondary  hover:bg-secondary cursor-pointer ${notif.unread ? 'bg-primary' : ''}`}
              onClick={() => handleNotificationClick(notif.id)}
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
                  <p className="text-xs text-quaternary mt-2">{calcularTiempoTranscurrido(notif.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}