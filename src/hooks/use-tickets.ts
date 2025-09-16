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
  Timestamp,
} from "firebase/firestore";
import { firebaseDb, firebaseAuth } from "@/lib/firebase";
import { Ticket } from "@/types/ticket";

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
          orderBy(options?.orderByField || "fechaIngreso", "desc") as any
        );

        const snap = await getDocs(ticketsQuery);
        const data = snap.docs.map((d) => {
          const raw = d.data() as any;
          return {
            id: d.id,
            ...raw,
            fechaIngreso: raw.fechaIngreso?.toDate ? raw.fechaIngreso.toDate() : raw.fechaIngreso || new Date(),
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

  const sanitizeForFirestore = (obj: any) => {
    const copy: any = { ...obj };
    Object.keys(copy).forEach((k) => {
      if (typeof copy[k] === "undefined") delete copy[k];
    });
    return copy;
  };

  const crearTicket = async (payload: Omit<Ticket, "id" | "usuarioId" | "fechaIngreso">) => {
    if (!firebaseAuth.currentUser) throw new Error("Usuario no autenticado");
    setSaving(true);
    try {
      const docBody: any = {
        ...payload,
        usuarioId: firebaseAuth.currentUser.uid,
        fechaIngreso: Timestamp.fromDate(new Date()),
      };

      const sanitized = sanitizeForFirestore(docBody);
      const ref = await addDoc(collection(firebaseDb, "tickets"), sanitized);

      const created: Ticket = {
        id: ref.id,
        ...payload,
        usuarioId: firebaseAuth.currentUser.uid,
        fechaIngreso: new Date(),
      } as Ticket;

      setTickets((prev) => [created, ...prev]);
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
      return { id: snap.id, ...data, fechaIngreso: data.fechaIngreso?.toDate ? data.fechaIngreso.toDate() : data.fechaIngreso } as Ticket;
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
