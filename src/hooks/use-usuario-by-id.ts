'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebase';
import { Usuario } from '@/types/usuario';

export function useUsuarioById(userId: string) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(firebaseDb, 'usuarios', userId));
        
        if (userDoc.exists()) {
          setUsuario({ id: userDoc.id, ...userDoc.data() } as Usuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [userId]);

  return { usuario, loading };
}