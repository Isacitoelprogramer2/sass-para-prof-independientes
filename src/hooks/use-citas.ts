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
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';
import { Cita } from '@/types/cita';

/**
 * Hook personalizado para gestionar citas en Firebase
 * Proporciona funcionalidades CRUD para citas de usuario
 */
export function useCitas() {
  // Estados para gestionar citas y estados de carga
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Cargar citas del usuario autenticado desde Firebase
   */
  useEffect(() => {
    const cargarCitas = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Consulta para obtener citas del usuario actual
        const citasQuery = query(
          collection(firebaseDb, 'citas'),
          where('usuarioId', '==', firebaseAuth.currentUser.uid),
          orderBy('fechaReservada', 'asc'),
          limit(50)
        );

        const querySnapshot = await getDocs(citasQuery);
        const citasData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
            fechaReservada: data.fechaReservada?.toDate() || new Date(),
              pagado: data.pagado ?? false,
              // Precios: mapear campos si existen en Firestore
              precioTipo: data.precioTipo ?? undefined,
              precioFinal: typeof data.precioFinal === 'number' ? data.precioFinal : (data.precioFinal ? Number(data.precioFinal) : undefined),
              precioPersonalizado: typeof data.precioPersonalizado === 'number' ? data.precioPersonalizado : (data.precioPersonalizado ? Number(data.precioPersonalizado) : undefined),
          } as Cita;
        });

        setCitas(citasData);
      } catch (error) {
        console.error('Error al cargar citas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitas();
  }, []);

  /**
   * Crear una nueva cita
   */
  const crearCita = async (citaData: Omit<Cita, 'id' | 'codigoAcceso' | 'fechaRegistro' | 'usuarioId'>) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Generar código de acceso único
      const codigoAcceso = Math.random().toString(36).substring(2, 8).toUpperCase();

      const nuevaCita = {
        ...citaData,
        usuarioId: firebaseAuth.currentUser.uid,
        codigoAcceso,
        fechaRegistro: Timestamp.fromDate(new Date()),
        fechaReservada: Timestamp.fromDate(citaData.fechaReservada),
        // si el caller pasó info de precio, respetarla; de lo contrario, queda undefined
        precioTipo: (citaData as any).precioTipo,
        precioFinal: (citaData as any).precioFinal,
        precioPersonalizado: (citaData as any).precioPersonalizado,
      };

      // Firestore no acepta valores 'undefined' en los documentos — eliminarlos antes de enviar
      const sanitizeForFirestore = (obj: any) => {
        const copy: any = { ...obj };
        Object.keys(copy).forEach(key => {
          if (typeof copy[key] === 'undefined') delete copy[key];
        });
        return copy;
      };

      const nuevaCitaSanitizada = sanitizeForFirestore(nuevaCita);

      const docRef = await addDoc(collection(firebaseDb, 'citas'), nuevaCitaSanitizada);
      
      const citaCreada: Cita = {
        id: docRef.id,
        usuarioId: firebaseAuth.currentUser.uid,
        ...citaData,
        codigoAcceso,
        fechaRegistro: new Date(),
        pagado: (citaData as any).pagado ?? false,
        precioTipo: (citaData as any).precioTipo,
        precioFinal: (citaData as any).precioFinal,
        precioPersonalizado: (citaData as any).precioPersonalizado,
      };

      setCitas(prev => [...prev, citaCreada].sort((a, b) => 
        a.fechaReservada.getTime() - b.fechaReservada.getTime()
      ));

      return citaCreada;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Actualizar una cita existente
   */
  const actualizarCita = async (id: string, datosActualizados: Partial<Cita>) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      const citaRef = doc(firebaseDb, 'citas', id);
      
      const datosParaActualizar: any = { ...datosActualizados };
      if (datosParaActualizar.fechaReservada) {
        datosParaActualizar.fechaReservada = Timestamp.fromDate(datosParaActualizar.fechaReservada) as any;
      }
      // Asegurar que pagado se envíe como booleano si está presente
      if (typeof datosParaActualizar.pagado !== 'undefined') {
        datosParaActualizar.pagado = !!datosParaActualizar.pagado;
      }
      // Si se actualiza precio, asegurar número
      if (typeof datosParaActualizar.precioFinal !== 'undefined') {
        datosParaActualizar.precioFinal = Number(datosParaActualizar.precioFinal);
      }
      if (typeof datosParaActualizar.precioPersonalizado !== 'undefined') {
        datosParaActualizar.precioPersonalizado = Number(datosParaActualizar.precioPersonalizado);
      }
      if (typeof datosParaActualizar.precioTipo !== 'undefined') {
        datosParaActualizar.precioTipo = datosParaActualizar.precioTipo;
      }

      // Eliminar keys con undefined antes de actualizar
      Object.keys(datosParaActualizar).forEach(k => {
        if (typeof datosParaActualizar[k] === 'undefined') delete datosParaActualizar[k];
      });

      await updateDoc(citaRef, datosParaActualizar);

      setCitas(prev => prev.map(cita => 
        cita.id === id 
          ? { ...cita, ...datosActualizados }
          : cita
      ).sort((a, b) => a.fechaReservada.getTime() - b.fechaReservada.getTime()));

    } catch (error) {
      console.error('Error al actualizar cita:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Marcar una cita como pagada/no pagada
   */
  const marcarPagado = async (id: string, valor?: boolean) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Si no se pasa valor, alternamos
      const cita = citas.find(c => c.id === id);
      const nuevoValor = typeof valor === 'boolean' ? valor : !cita?.pagado;

      const citaRef = doc(firebaseDb, 'citas', id);
      await updateDoc(citaRef, { pagado: nuevoValor });

      setCitas(prev => prev.map(c => c.id === id ? { ...c, pagado: nuevoValor } : c));
    } catch (error) {
      console.error('Error al marcar pagado:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cambiar el estado de una cita
   */
  const cambiarEstadoCita = async (id: string, nuevoEstado: Cita['estado']) => {
    await actualizarCita(id, { estado: nuevoEstado });
  };

  /**
   * Eliminar una cita
   */
  const eliminarCita = async (id: string) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      await deleteDoc(doc(firebaseDb, 'citas', id));
      setCitas(prev => prev.filter(cita => cita.id !== id));
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Obtener una cita por ID
   */
  const obtenerCitaPorId = async (id: string): Promise<Cita | null> => {
    try {
      const citaRef = doc(firebaseDb, 'citas', id);
      const citaSnapshot = await getDoc(citaRef);
      
      if (citaSnapshot.exists()) {
        const data = citaSnapshot.data();
        return {
          id: citaSnapshot.id,
          ...data,
          fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
          fechaReservada: data.fechaReservada?.toDate() || new Date(),
        } as Cita;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener cita:', error);
      return null;
    }
  };

  /**
   * Filtrar citas por fecha
   */
  const filtrarCitasPorFecha = (fechaInicio: Date, fechaFin: Date) => {
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fechaReservada);
      return fechaCita >= fechaInicio && fechaCita <= fechaFin;
    });
  };

  /**
   * Filtrar citas por estado
   */
  const filtrarCitasPorEstado = (estado: Cita['estado']) => {
    return citas.filter(cita => cita.estado === estado);
  };

  /**
   * Obtener citas de hoy
   */
  const obtenerCitasHoy = () => {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
    
    return filtrarCitasPorFecha(inicioDelDia, finDelDia);
  };

  /**
   * Obtener citas de esta semana
   */
  const obtenerCitasEstaSemana = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
    const finSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 6));
    
    return filtrarCitasPorFecha(inicioSemana, finSemana);
  };

  /**
   * Obtener citas de este mes
   */
  const obtenerCitasEsteMes = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    return filtrarCitasPorFecha(inicioMes, finMes);
  };

  return {
    // Estados
    citas,
    loading,
    saving,
    
    // Métodos CRUD
    crearCita,
    actualizarCita,
    eliminarCita,
    obtenerCitaPorId,
    cambiarEstadoCita,
    marcarPagado,
    
    // Métodos de filtrado
    filtrarCitasPorFecha,
    filtrarCitasPorEstado,
    obtenerCitasHoy,
    obtenerCitasEstaSemana,
    obtenerCitasEsteMes,
  };
}