'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseDb, firebaseStorage, firebaseAuth } from '@/lib/firebase';
import { Servicio } from '@/types/servicio';

/**
 * Hook personalizado para gestionar servicios en Firebase
 * Proporciona funcionalidades CRUD para servicios de usuario
 */
export function useServicios() {
  // Estados para gestionar servicios y estados de carga
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Cargar servicios del usuario autenticado desde Firebase
   */
  useEffect(() => {
    const cargarServicios = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Consulta simple sin orderBy para evitar índice compuesto
        const serviciosQuery = query(
          collection(firebaseDb, 'servicios'),
          where('usuarioId', '==', firebaseAuth.currentUser.uid),
          limit(100)
        );

        const querySnapshot = await getDocs(serviciosQuery);
        const serviciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Servicio[];

        // Ordenar en el cliente para evitar índice compuesto
        const serviciosOrdenados = serviciosData.sort((a, b) => 
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );

        setServicios(serviciosOrdenados);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  /**
   * Subir imagen a Firebase Storage
   * @param file - Archivo de imagen a subir
   * @param servicioId - ID del servicio para organizar archivos
   * @returns URL de descarga de la imagen
   */
  const subirImagen = async (file: File, servicioId: string): Promise<string> => {
    // La ruta debe ser servicios/{servicioId}/{userId}/{file.name} para cumplir con las reglas de storage
    const userId = firebaseAuth.currentUser?.uid;
    const storageRef = ref(
      firebaseStorage,
      `servicios/${servicioId}/${userId}/${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  /**
   * Eliminar imagen de Firebase Storage
   * @param imagenUrl - URL de la imagen a eliminar
   */
  const eliminarImagen = async (imagenUrl: string): Promise<void> => {
    try {
      const imageRef = ref(firebaseStorage, imagenUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  };

  /**
   * Crear un nuevo servicio
   * @param servicioData - Datos del servicio sin imagen
   * @param imagenFile - Archivo de imagen opcional
   * @returns Servicio creado
   */
  const crearServicio = async (
    servicioData: Omit<Servicio, 'id' | 'usuarioId'>, 
    imagenFile?: File
  ): Promise<Servicio> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Preparar datos del servicio
      const nuevoServicio = {
  ...servicioData,
  usuarioId: firebaseAuth.currentUser.uid,
  // Estado inicial del servicio: activo
  activo: true,
      };

      // Crear documento en Firestore
      const docRef = await addDoc(collection(firebaseDb, 'servicios'), nuevoServicio);
      
      let servicioCompleto = { 
        id: docRef.id, 
        ...nuevoServicio 
      } as Servicio;

      // Subir imagen si se proporciona
      if (imagenFile) {
        const imagenUrl = await subirImagen(imagenFile, docRef.id);
        await updateDoc(docRef, { imagen: imagenUrl });
        servicioCompleto.imagen = imagenUrl;
      }

      // Actualizar estado local
      setServicios(prev => [...prev, servicioCompleto]);

      return servicioCompleto;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Obtener un servicio por ID
   * @param servicioId - ID del servicio
   * @returns Servicio encontrado o null
   */
  const obtenerServicio = async (servicioId: string): Promise<Servicio | null> => {
    try {
      console.log('Buscando servicio con ID:', servicioId);
      
      if (!servicioId) {
        console.error('ID de servicio no proporcionado');
        return null;
      }

      const docRef = doc(firebaseDb, 'servicios', servicioId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const servicioData = { id: docSnap.id, ...docSnap.data() } as Servicio;
        
        // Verificar que el servicio pertenece al usuario actual
        if (firebaseAuth.currentUser && servicioData.usuarioId !== firebaseAuth.currentUser.uid) {
          console.error('Usuario no autorizado para acceder a este servicio');
          return null;
        }
        
        console.log('Servicio encontrado:', servicioData);
        return servicioData;
      } else {
        console.warn('Documento no existe para ID:', servicioId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      return null;
    }
  };

  /**
   * Actualizar un servicio existente
   * @param servicioId - ID del servicio a actualizar
   * @param servicioData - Datos actualizados del servicio
   * @param imagenFile - Nueva imagen opcional
   * @returns Servicio actualizado
   */
  const actualizarServicio = async (
    servicioId: string,
    servicioData: Partial<Omit<Servicio, 'id' | 'usuarioId'>>,
    imagenFile?: File
  ): Promise<Servicio> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      const docRef = doc(firebaseDb, 'servicios', servicioId);
      
      // Obtener servicio actual para gestionar imagen existente
      const servicioActual = await obtenerServicio(servicioId);
      if (!servicioActual) {
        throw new Error('Servicio no encontrado');
      }

      let datosActualizados = { ...servicioData };

      // Gestionar nueva imagen
      if (imagenFile) {
        // Eliminar imagen anterior si existe
        if (servicioActual.imagen) {
          await eliminarImagen(servicioActual.imagen);
        }

        // Subir nueva imagen
        const nuevaImagenUrl = await subirImagen(imagenFile, servicioId);
        datosActualizados.imagen = nuevaImagenUrl;
      }

      // Actualizar documento en Firestore
      await updateDoc(docRef, datosActualizados);

      // Crear servicio actualizado
      const servicioActualizado = { 
        ...servicioActual, 
        ...datosActualizados 
      } as Servicio;

      // Actualizar estado local
      setServicios(prev => 
        prev.map(servicio => 
          servicio.id === servicioId ? servicioActualizado : servicio
        )
      );

      return servicioActualizado;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Eliminar un servicio
   * @param servicioId - ID del servicio a eliminar
   */
  const eliminarServicio = async (servicioId: string): Promise<void> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Obtener servicio para eliminar imagen si existe
      const servicio = await obtenerServicio(servicioId);
      
      if (servicio?.imagen) {
        await eliminarImagen(servicio.imagen);
      }

      // Eliminar documento de Firestore
      await deleteDoc(doc(firebaseDb, 'servicios', servicioId));

      // Actualizar estado local
      setServicios(prev => prev.filter(servicio => servicio.id !== servicioId));
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    // Estados
    servicios,
    loading,
    saving,

    // Métodos CRUD
    crearServicio,
    obtenerServicio,
    actualizarServicio,
    eliminarServicio,
  };
}
