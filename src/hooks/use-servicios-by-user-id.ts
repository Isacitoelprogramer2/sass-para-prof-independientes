'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebase';
import { Servicio } from '@/types/servicio';

export function useServiciosByUserId(userId: string) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarServicios = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const serviciosQuery = query(
          collection(firebaseDb, 'servicios'),
          where('usuarioId', '==', userId),
          where('activo', '==', true),
          limit(100)
        );

        const querySnapshot = await getDocs(serviciosQuery);
        const serviciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Servicio));

        setServicios(serviciosData);
      } catch (error) {
        console.error('Error cargando servicios:', error);
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, [userId]);

  return { servicios, loading };
}