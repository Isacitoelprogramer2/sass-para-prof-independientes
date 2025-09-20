"use client";

import { useEffect, useState } from "react";
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
  Timestamp,
} from "firebase/firestore";
import { firebaseDb, firebaseAuth } from "@/lib/firebase";
import { Ticket } from "@/types/ticket";
import { crearNotificacion } from "@/utils/notificaciones";

interface UseTicketsOptions {
  orderByField?: string;
}

export function useTickets(options?: UseTicketsOptions) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cargar = async () => {
      if (!firebaseAuth.currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ticketsQuery = query(
          collection(firebaseDb, "tickets"),
          where("usuarioId", "==", firebaseAuth.currentUser.uid),
          orderBy(options?.orderByField || "fechaIngreso", "desc") as any,
          limit(50)
        );

        const snap = await getDocs(ticketsQuery);
        const data = snap.docs.map((d) => {
          const raw = d.data() as any;
          
          // Manejar fechaIngreso de manera robusta
          let fechaIngreso: Date;
          if (raw.fechaIngreso?.toDate) {
            fechaIngreso = raw.fechaIngreso.toDate();
          } else if (typeof raw.fechaIngreso === 'string') {
            const parsed = new Date(raw.fechaIngreso);
            fechaIngreso = isNaN(parsed.getTime()) ? new Date() : parsed;
          } else if (raw.fechaIngreso instanceof Date) {
            fechaIngreso = raw.fechaIngreso;
          } else {
            fechaIngreso = new Date();
          }
          
          return {
            id: d.id,
            ...raw,
            fechaIngreso,
          } as Ticket;
        });

        setTickets(data);
      } catch (e: any) {
        console.error("Error cargando tickets:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const sanitizeForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeForFirestore(item));
    }
    
    if (typeof obj === 'object') {
      const copy: any = {};
      Object.keys(obj).forEach((k) => {
        if (typeof obj[k] !== "undefined") {
          copy[k] = sanitizeForFirestore(obj[k]);
        }
      });
      return copy;
    }
    
    return obj;
  };

  const crearTicket = async (payload: Omit<Ticket, "id" | "usuarioId" | "fechaIngreso" | "numero">) => {
    if (!firebaseAuth.currentUser) throw new Error("Usuario no autenticado");
    console.log("Creando ticket - Usuario autenticado:", firebaseAuth.currentUser.uid);
    console.log("Payload recibido:", payload);
    setSaving(true);
    try {
      // Generar numero incremental
      const ticketsQuery = query(
        collection(firebaseDb, "tickets"),
        where("usuarioId", "==", firebaseAuth.currentUser.uid)
      );
      const snap = await getDocs(ticketsQuery);
      let maxNumber = 0;
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.numero) {
          const num = parseInt(data.numero.replace('#', ''), 10);
          if (num > maxNumber) maxNumber = num;
        }
      });
      const nextNumber = maxNumber + 1;
      const numero = `#${nextNumber.toString().padStart(6, '0')}`;

      const docBody: any = {
        ...payload,
        numero,
        // Si asignadoA está vacío, usar el usuarioId como valor por defecto
        ...(payload.asignadoA === "" && { asignadoA: firebaseAuth.currentUser.uid }),
        usuarioId: firebaseAuth.currentUser.uid,
        fechaIngreso: Timestamp.fromDate(new Date()),
      };
      console.log("DocBody a enviar a Firestore:", docBody);
      console.log("Validando campos requeridos:");
      console.log("- titulo:", typeof docBody.titulo, docBody.titulo);
      console.log("- descripcion:", typeof docBody.descripcion, docBody.descripcion);
      console.log("- clienteId:", typeof docBody.clienteId, docBody.clienteId);
      console.log("- estado:", typeof docBody.estado, docBody.estado);
      console.log("- prioridad:", typeof docBody.prioridad, docBody.prioridad);
      console.log("- tipoContexto:", typeof docBody.tipoContexto, docBody.tipoContexto);
      console.log("- asignadoA:", typeof docBody.asignadoA, `"${docBody.asignadoA}"`, docBody.asignadoA === "");
      console.log("- usuarioId:", typeof docBody.usuarioId, docBody.usuarioId);
      
      // Verificar si el clienteId existe y pertenece al usuario
      try {
        const clienteRef = doc(firebaseDb, "clientes", docBody.clienteId);
        const clienteSnap = await getDoc(clienteRef);
        if (clienteSnap.exists()) {
          const clienteData = clienteSnap.data();
          console.log("Cliente encontrado:", clienteData);
          console.log("Cliente pertenece al usuario:", clienteData.usuarioId === docBody.usuarioId);
        } else {
          console.log("Cliente no encontrado");
        }
      } catch (e) {
        console.log("Error verificando cliente:", e);
      }
      
      if (docBody.clienteContacto) {
        console.log("clienteContacto presente:", docBody.clienteContacto);
      }

      const sanitized = sanitizeForFirestore(docBody);
      console.log("DocBody sanitizado:", sanitized);
      const ref = await addDoc(collection(firebaseDb, "tickets"), sanitized);

      const created: Ticket = {
        id: ref.id,
        ...payload,
        numero,
        usuarioId: firebaseAuth.currentUser.uid,
        fechaIngreso: new Date(),
      } as Ticket;

      setTickets((prev) => [created, ...prev]);

      // Crear notificación de nuevo ticket
      let nombreCliente = 'Cliente';
      if (payload.clienteId) {
        try {
          const clienteDoc = await getDoc(doc(firebaseDb, 'clientes', payload.clienteId));
          if (clienteDoc.exists()) {
            nombreCliente = clienteDoc.data().datos.nombre;
          }
        } catch (error) {
          console.error('Error obteniendo nombre del cliente:', error);
        }
      } else if (payload.clienteContacto) {
        nombreCliente = payload.clienteContacto.nombre;
      }

      await crearNotificacion(
        'ticket',
        'Nuevo ticket de soporte',
        `${nombreCliente} ha creado un ticket: ${payload.titulo}`,
        undefined, // citaId
        ref.id // ticketId
      );

      return created;
    } catch (e: any) {
      console.error("Error creando ticket:", e);
      setError(e);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const actualizarTicket = async (id: string, cambios: Partial<Ticket>) => {
    if (!firebaseAuth.currentUser) throw new Error("Usuario no autenticado");
    setSaving(true);
    try {
      const ref = doc(firebaseDb, "tickets", id);
      const toUpdate: any = { ...cambios };
      if (toUpdate.fechaIngreso instanceof Date) toUpdate.fechaIngreso = Timestamp.fromDate(toUpdate.fechaIngreso);
      Object.keys(toUpdate).forEach((k) => typeof toUpdate[k] === "undefined" && delete toUpdate[k]);
      await updateDoc(ref, toUpdate);

      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...cambios } as Ticket : t)));
    } catch (e: any) {
      console.error("Error actualizando ticket:", e);
      setError(e);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const eliminarTicket = async (id: string) => {
    if (!firebaseAuth.currentUser) throw new Error("Usuario no autenticado");
    setSaving(true);
    try {
      await deleteDoc(doc(firebaseDb, "tickets", id));
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      console.error("Error eliminando ticket:", e);
      setError(e);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const obtenerTicketPorId = async (id: string): Promise<Ticket | null> => {
    try {
      const ref = doc(firebaseDb, "tickets", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data() as any;
      
      // Manejar fechaIngreso de manera robusta
      let fechaIngreso: Date;
      if (data.fechaIngreso?.toDate) {
        fechaIngreso = data.fechaIngreso.toDate();
      } else if (typeof data.fechaIngreso === 'string') {
        const parsed = new Date(data.fechaIngreso);
        fechaIngreso = isNaN(parsed.getTime()) ? new Date() : parsed;
      } else if (data.fechaIngreso instanceof Date) {
        fechaIngreso = data.fechaIngreso;
      } else {
        fechaIngreso = new Date();
      }
      
      return { id: snap.id, ...data, fechaIngreso } as Ticket;
    } catch (e) {
      console.error("Error obteniendo ticket:", e);
      return null;
    }
  };

  const filtrarPorPrioridad = (prioridad?: Ticket['prioridad']) => {
    if (!prioridad) return tickets;
    return tickets.filter((t) => t.prioridad === prioridad);
  };

  const filtrarPorContexto = (contexto?: Ticket['tipoContexto']) => {
    if (!contexto) return tickets;
    return tickets.filter((t) => t.tipoContexto === contexto);
  };

  return {
    tickets,
    loading,
    saving,
    error,
    crearTicket,
    actualizarTicket,
    eliminarTicket,
    obtenerTicketPorId,
    filtrarPorPrioridad,
    filtrarPorContexto,
  };
}
