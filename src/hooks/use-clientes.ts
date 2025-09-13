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
  deleteDoc
} from 'firebase/firestore';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';
import { Cliente } from '@/types/cliente';

/**
 * Hook personalizado para gestionar clientes en Firebase
 * Proporciona funcionalidades CRUD para clientes de usuario
 */
export function useClientes() {
  // Estados para gestionar clientes y estados de carga
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /**
   * Cargar clientes del usuario autenticado desde Firebase
   */
  useEffect(() => {
    const cargarClientes = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Consulta para obtener clientes del usuario actual
        const clientesQuery = query(
          collection(firebaseDb, 'clientes'),
          where('usuarioId', '==', firebaseAuth.currentUser.uid)
        );

        const querySnapshot = await getDocs(clientesQuery);
        const clientesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Cliente[];

        // Ordenar alfabéticamente por nombre
        const clientesOrdenados = clientesData.sort((a, b) => 
          a.datos.nombre.localeCompare(b.datos.nombre, 'es', { sensitivity: 'base' })
        );

        setClientes(clientesOrdenados);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  /**
   * Crear un nuevo cliente
   * @param clienteData - Datos del cliente sin ID y usuarioId
   * @returns Cliente creado
   */
  const crearCliente = async (
    clienteData: Omit<Cliente, 'id' | 'usuarioId'>
  ): Promise<Cliente> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Preparar datos del cliente con usuarioId para identificar propietario
      const nuevoCliente = {
        ...clienteData,
        usuarioId: firebaseAuth.currentUser.uid,
        // Inicializar arrays vacíos si no se proporcionan
        tickets: clienteData.tickets || [],
        historialCitas: clienteData.historialCitas || [],
      };

      // Crear documento en Firestore
      const docRef = await addDoc(collection(firebaseDb, 'clientes'), nuevoCliente);
      
      const clienteCompleto = { 
        id: docRef.id, 
        ...nuevoCliente 
      } as Cliente;

      // Actualizar estado local
      setClientes(prev => [clienteCompleto, ...prev]);

      return clienteCompleto;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Obtener un cliente por ID
   * @param clienteId - ID del cliente
   * @returns Cliente encontrado o null
   */
  const obtenerCliente = async (clienteId: string): Promise<Cliente | null> => {
    try {
      console.log('Buscando cliente con ID:', clienteId);
      
      if (!clienteId) {
        console.error('ID de cliente no proporcionado');
        return null;
      }

      const docRef = doc(firebaseDb, 'clientes', clienteId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const clienteData = { id: docSnap.id, ...docSnap.data() } as Cliente;
        
        // Verificar que el cliente pertenece al usuario actual
        if (firebaseAuth.currentUser && clienteData.usuarioId !== firebaseAuth.currentUser.uid) {
          console.error('Usuario no autorizado para acceder a este cliente');
          return null;
        }
        
        console.log('Cliente encontrado:', clienteData);
        return clienteData;
      } else {
        console.warn('Documento no existe para ID:', clienteId);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return null;
    }
  };

  /**
   * Actualizar un cliente existente
   * @param clienteId - ID del cliente a actualizar
   * @param clienteData - Datos actualizados del cliente
   * @returns Cliente actualizado
   */
  const actualizarCliente = async (
    clienteId: string,
    clienteData: Partial<Omit<Cliente, 'id' | 'usuarioId'>>
  ): Promise<Cliente> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      const docRef = doc(firebaseDb, 'clientes', clienteId);

      // Actualizar documento en Firestore
      await updateDoc(docRef, clienteData);

      // Obtener cliente actualizado
      const clienteActual = clientes.find(c => c.id === clienteId);
      if (!clienteActual) {
        throw new Error('Cliente no encontrado en estado local');
      }

      const datosActualizados = { ...clienteData };
      const clienteActualizado = { 
        ...clienteActual, 
        ...datosActualizados 
      } as Cliente;

      // Actualizar estado local
      setClientes(prev => 
        prev.map(cliente => 
          cliente.id === clienteId ? clienteActualizado : cliente
        )
      );

      return clienteActualizado;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Eliminar un cliente
   * @param clienteId - ID del cliente a eliminar
   */
  const eliminarCliente = async (clienteId: string): Promise<void> => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    setSaving(true);

    try {
      // Eliminar documento de Firestore
      await deleteDoc(doc(firebaseDb, 'clientes', clienteId));

      // Actualizar estado local
      setClientes(prev => prev.filter(cliente => cliente.id !== clienteId));
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Calcular el total de citas de un cliente
   * @param cliente - Cliente para calcular citas
   * @returns Número total de citas
   */
  const calcularTotalCitas = (cliente: Cliente): number => {
    return cliente.historialCitas?.length || 0;
  };

  /**
   * Obtener la fecha de la última visita de un cliente
   * @param cliente - Cliente para obtener última visita
   * @returns Fecha de última visita o undefined
   */
  const obtenerUltimaVisita = (cliente: Cliente): string | undefined => {
    if (!cliente.historialCitas || cliente.historialCitas.length === 0) {
      return undefined;
    }

    // Ordenar citas por fecha y obtener la más reciente
    const citasOrdenadas = [...cliente.historialCitas].sort((a, b) => 
      new Date(b.fechaReservada).getTime() - new Date(a.fechaReservada).getTime()
    );

    return citasOrdenadas[0]?.fechaReservada.toString();
  };

  return {
    // Estados
    clientes,
    loading,
    saving,

    // Métodos CRUD
    crearCliente,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,

    // Métodos auxiliares
    calcularTotalCitas,
    obtenerUltimaVisita,
  };
}