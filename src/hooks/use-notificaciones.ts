'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';
import { Notificacion } from '@/types/notificacion';

/**
 * Hook personalizado para gestionar notificaciones en Firebase
 * Proporciona funcionalidades para obtener notificaciones del usuario
 */
export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Cargar notificaciones del usuario autenticado desde Firebase
   */
  useEffect(() => {
    const cargarNotificaciones = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const notificacionesQuery = query(
          collection(firebaseDb, 'notificaciones'),
          where('usuarioId', '==', firebaseAuth.currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const querySnapshot = await getDocs(notificacionesQuery);
        const notificacionesData: Notificacion[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notificacionesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Notificacion);
        });

        setNotificaciones(notificacionesData);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, []);

  /**
   * Crear una nueva notificación
   */
  const crearNotificacion = async (notifData: Omit<Notificacion, 'id' | 'createdAt'>) => {
    if (!firebaseAuth.currentUser) return;

    setSaving(true);
    try {
      const nuevaNotif = {
        ...notifData,
        usuarioId: firebaseAuth.currentUser.uid,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(firebaseDb, 'notificaciones'), nuevaNotif);

      // Recargar notificaciones para actualizar la lista
      const notificacionesQuery = query(
        collection(firebaseDb, 'notificaciones'),
        where('usuarioId', '==', firebaseAuth.currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(notificacionesQuery);
      const notificacionesData: Notificacion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificacionesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notificacion);
      });

      setNotificaciones(notificacionesData);
    } catch (error) {
      console.error('Error creando notificación:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Marcar notificación como leída
   */
  const marcarComoLeida = async (notifId: string) => {
    if (!firebaseAuth.currentUser) return;

    try {
      const notifRef = doc(firebaseDb, 'notificaciones', notifId);
      await updateDoc(notifRef, { unread: false });

      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(notif =>
          notif.id === notifId ? { ...notif, unread: false } : notif
        )
      );
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  return {
    notificaciones,
    loading,
    saving,
    crearNotificacion,
    marcarComoLeida,
  };
}