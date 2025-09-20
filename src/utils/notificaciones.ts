import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';

/**
 * Función utilitaria para crear notificaciones
 * Se puede usar desde cualquier parte de la aplicación
 */
export const crearNotificacion = async (
  type: 'appointment' | 'reminder' | 'ticket' | 'payment',
  title: string,
  message: string,
  citaId?: string,
  ticketId?: string
) => {
  if (!firebaseAuth.currentUser) return;

  try {
    const nuevaNotif = {
      usuarioId: firebaseAuth.currentUser.uid,
      type,
      title,
      message,
      time: 'ahora',
      unread: true,
      createdAt: Timestamp.now(),
      ...(citaId && { citaId }),
      ...(ticketId && { ticketId })
    };

    await addDoc(collection(firebaseDb, 'notificaciones'), nuevaNotif);
  } catch (error) {
    console.error('Error creando notificación:', error);
  }
};