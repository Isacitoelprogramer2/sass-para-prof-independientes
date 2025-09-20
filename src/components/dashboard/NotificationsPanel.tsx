'use client';

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

  const handleNotificationClick = async (notifId: string) => {
    await marcarComoLeida(notifId);
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
      <div className="max-h-96 overflow-y-auto">
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
                  <p className="text-xs text-quaternary mt-2">{notif.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}