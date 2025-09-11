'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseDb, firebaseStorage, firebaseAuth } from '@/lib/firebase';
import { Usuario } from '@/types/usuario';

export function useUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(firebaseDb, 'usuarios', firebaseAuth.currentUser.uid));
        
        if (userDoc.exists()) {
          setUsuario({ id: userDoc.id, ...userDoc.data() } as Usuario);
        } else {
          // Crear usuario por defecto si no existe
          const nuevoUsuario: Usuario = {
            id: firebaseAuth.currentUser.uid,
            datosProfesional: {
              nombres: firebaseAuth.currentUser.displayName || '',
              profesion: '',
              experiencia: '',
            },
            datosNegocio: {
              descripcion: '',
              categoria: '',
              subcategoria: '',
              informacionContacto: {
                telefono: '',
                correo: firebaseAuth.currentUser.email || '',
              },
              horarioAtencion: 'Lun-Vie 9:00-18:00',
            },
            datosCuenta: {
              plan: 'BASICO',
            },
          };
          
          await setDoc(doc(firebaseDb, 'usuarios', firebaseAuth.currentUser.uid), nuevoUsuario);
          setUsuario(nuevoUsuario);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  // Subir archivo a Firebase Storage
  const subirArchivo = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(firebaseStorage, `usuarios/${firebaseAuth.currentUser?.uid}/${path}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  // Guardar cambios del usuario
  const guardarUsuario = async (datosActualizados: Partial<Usuario>, archivos?: { fotoPerfil?: File; fotoPortada?: File }): Promise<void> => {
    if (!firebaseAuth.currentUser || !usuario) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      let datosFinales = { ...datosActualizados };

      // Subir archivos si existen
      if (archivos?.fotoPerfil) {
        const urlFotoPerfil = await subirArchivo(
          archivos.fotoPerfil,
          'foto-perfil'
        );
        datosFinales = {
          ...datosFinales,
          datosProfesional: {
            ...usuario.datosProfesional,
            ...datosFinales.datosProfesional,
            fotoPerfil: urlFotoPerfil,
          },
        };
      }

      if (archivos?.fotoPortada) {
        const urlFotoPortada = await subirArchivo(
          archivos.fotoPortada,
          'foto-portada'
        );
        datosFinales = {
          ...datosFinales,
          datosNegocio: {
            ...usuario.datosNegocio,
            ...datosFinales.datosNegocio,
            fotoPortada: urlFotoPortada,
          },
        };
      }

      // Actualizar en Firestore
      await updateDoc(doc(firebaseDb, 'usuarios', firebaseAuth.currentUser.uid), datosFinales);
      
      // Actualizar estado local
      setUsuario(prev => prev ? { ...prev, ...datosFinales } : null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    usuario,
    loading,
    saving,
    guardarUsuario,
  };
}
