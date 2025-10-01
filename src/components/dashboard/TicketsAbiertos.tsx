import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileX01 } from "@untitledui/icons";
import { useTickets } from "@/hooks/use-tickets";
import { useClientes } from "@/hooks/use-clientes";

type FsTimestamp = { toMillis?: () => number; seconds?: number; nanoseconds?: number };

/** Acepta Firestore Timestamp, {seconds,nanoseconds}, Date, number(ms) o string ISO y devuelve ms. */
function toMillisSafe(v: unknown): number {
  // Firestore Timestamp real
  if (v && typeof (v as FsTimestamp).toMillis === "function") {
    return (v as FsTimestamp).toMillis!();
  }
  // Objeto emulado {seconds, nanoseconds}
  if (v && typeof (v as FsTimestamp).seconds === "number") {
    const s = (v as FsTimestamp).seconds!;
    const ns = (v as FsTimestamp).nanoseconds ?? 0;
    return s * 1000 + Math.floor(ns / 1e6);
  }
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const t = new Date(v).getTime(); // Solo fiable si es ISO (ej. 2025-09-30T21:50:00Z)
    if (!Number.isNaN(t)) return t;
  }
  throw new Error("fechaIngreso inválida/no normalizada");
}

/** Sugerencia de refresco: evita intervalos cortos cuando ya pasaron horas/días. */
function suggestedRefreshMs(fromMs: number, nowMs: number): number {
  const diffSec = Math.abs(Math.floor((nowMs - fromMs) / 1000));
  if (diffSec < 60) return 5_000;        // cada 5s si es "ahora"
  if (diffSec < 3_600) return 30_000;    // cada 30s si <1h
  if (diffSec < 86_400) return 60_000;   // cada 1min si <24h
  if (diffSec < 604_800) return 300_000; // cada 5min si <7d
  return 3_600_000;                       // cada 1h si >7d
}

/** Para una lista de fechas, usa el refresco mínimo que necesites. */
function minRefreshForAll(msList: number[], nowMs: number): number {
  if (!msList.length) return 60_000;
  return msList.reduce((m, t) => Math.min(m, suggestedRefreshMs(t, nowMs)), Infinity);
}

export default function TicketsAbiertos() {
  const router = useRouter();
  const { tickets, loading: ticketsLoading } = useTickets();
  const { clientes } = useClientes();

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    let timer: number | null = null;

    const tick = () => setCurrentTime(Date.now());

    const start = () => {
      // Calcula el refresco mínimo según lo que tengas en pantalla
      const fuentes = tickets
        .filter((t: any) => t?.estado === "ABIERTO")
        .filter((t: any) => {
          try {
            toMillisSafe(t?.fechaIngreso);
            return true;
          } catch {
            return false;
          }
        })
        .slice(0, 5)
        .map((t: any) => {
          try { return toMillisSafe(t?.fechaIngreso); } catch { return null; }
        })
        .filter((x: number | null): x is number => typeof x === "number");

      const delay = minRefreshForAll(fuentes, Date.now());
      timer = window.setTimeout(tick, delay) as unknown as number;
    };

    const stop = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const onVis = () => {
      stop();
      if (document.visibilityState === "visible") tick();
    };

    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]); // <- no dependas de currentTime o se reprograma sin necesidad

  // Filtrar tickets abiertos y obtener información del cliente
  const openTickets = useMemo(() => {
    return tickets
      .filter(ticket => ticket.estado === "ABIERTO")
      .filter(ticket => {
        try {
          toMillisSafe(ticket.fechaIngreso);
          return true;
        } catch {
          return false; // Excluir tickets con fecha inválida
        }
      })
      .sort((a, b) => {
        try {
          const aMs = toMillisSafe(a.fechaIngreso);
          const bMs = toMillisSafe(b.fechaIngreso);
          return bMs - aMs; // Más reciente primero
        } catch {
          return 0;
        }
      })
      .slice(0, 5) // Mostrar máximo 5 tickets
      .map(ticket => {
        const cliente = clientes.find(c => c.id === ticket.clienteId);
        const clienteNombre = cliente?.datos.nombre || ticket.clienteContacto?.nombre || "Cliente desconocido";

        // Calcular tiempo transcurrido con manejo de errores
        let tiempo = "Fecha inválida";
        try {
          const ahora = currentTime;

          const createdMs = toMillisSafe(ticket.fechaIngreso); // <- clave
          const diffMs = ahora - createdMs;

          if (!Number.isFinite(diffMs)) throw new Error("diff inválido");

          const diffMinutos = Math.floor(diffMs / (1000 * 60));
          const diffHoras   = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDias    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffSemanas = Math.floor(diffDias / 7);
          const diffMeses   = Math.floor(diffDias / 30);
          const diffAnios   = Math.floor(diffDias / 365);

          // Evita "hace 0m" cuando <45s
          if (diffMs < 45_000) {
            tiempo = "ahora";
          } else if (diffAnios > 0) {
            tiempo = `hace ${diffAnios} ${diffAnios === 1 ? "año" : "años"}`;
          } else if (diffMeses > 0) {
            tiempo = `hace ${diffMeses} ${diffMeses === 1 ? "mes" : "meses"}`;
          } else if (diffSemanas > 0) {
            tiempo = `hace ${diffSemanas} ${diffSemanas === 1 ? "semana" : "semanas"}`;
          } else if (diffDias > 0) {
            tiempo = `hace ${diffDias} ${diffDias === 1 ? "día" : "días"}`;
          } else if (diffHoras > 0) {
            tiempo = `hace ${diffHoras} ${diffHoras === 1 ? "hora" : "horas"}`;
          } else {
            tiempo = `hace ${diffMinutos} ${diffMinutos === 1 ? "minuto" : "minutos"}`;
          }
        } catch (error) {
          console.error("Error calculando tiempo para ticket:", ticket.id, error);
        }

        return {
          id: ticket.id,
          numero: ticket.numero,
          client: clienteNombre,
          issue: ticket.titulo,
          priority: ticket.prioridad.toLowerCase() as "alta" | "media" | "baja",
          time: tiempo,
          fullTicket: ticket
        };
      });
  }, [tickets, clientes, currentTime]);

  const handleTicketClick = (ticketId: string) => {
    router.push(`/dashboard/tickets/${ticketId}`);
  };

  const handleVerTodos = () => {
    router.push("/dashboard/tickets");
  };

  if (ticketsLoading) {
    return (
      <div className="bg-primary border border-secondary rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Tickets Abiertos</h3>
          <div className="animate-pulse bg-secondary h-6 w-20 rounded-full"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-secondary rounded-lg animate-pulse">
              <div className="h-4 bg-tertiary rounded mb-2"></div>
              <div className="h-3 bg-tertiary rounded mb-1"></div>
              <div className="h-3 bg-quaternary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Tickets Abiertos</h3>
        <span className="px-2 py-1 bg-error-50 text-error-700 text-xs font-medium rounded-full">
          {openTickets.length} {openTickets.length === 1 ? 'pendiente' : 'pendientes'}
        </span>
      </div>

      <div className="space-y-3">
        {openTickets.length === 0 ? (
          <div className="text-center py-8">
            <FileX01 className="h-12 w-12 text-quaternary mx-auto mb-4" />
            <p className="text-tertiary">No hay tickets abiertos</p>
          </div>
        ) : (
          openTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.id)}
              className="p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-tertiary">{ticket.numero}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.priority === 'alta'
                    ? 'bg-error-700/40 text-error-100'
                    : ticket.priority === 'media'
                    ? 'bg-warning-700/40 text-warning-50'
                    : 'bg-gray-700/30 text-gray-50'
                }`}>
                  {ticket.priority === 'alta' ? 'Alta' :
                   ticket.priority === 'media' ? 'Media' : 'Baja'}
                </span>
              </div>
              <p className="font-medium text-primary text-sm">{ticket.client}</p>
              <p className="text-sm text-tertiary mt-1">{ticket.issue}</p>
              <p className="text-xs text-quaternary mt-2">{ticket.time}</p>
            </div>
          ))
        )}
      </div>

      {openTickets.length > 0 && (
        <button
          onClick={handleVerTodos}
          className="w-full mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          Ver todos los tickets
        </button>
      )}
    </div>
  );
}