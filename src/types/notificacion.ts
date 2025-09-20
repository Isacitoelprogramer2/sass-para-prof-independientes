export interface Notificacion {
  id: string;
  usuarioId: string;
  type: 'appointment' | 'reminder' | 'ticket' | 'payment';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  createdAt: Date;
  citaId?: string; // Para relacionar con citas
  ticketId?: string; // Para relacionar con tickets
}