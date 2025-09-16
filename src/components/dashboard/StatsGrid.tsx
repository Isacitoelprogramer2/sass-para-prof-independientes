"use client";

import React, { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, orderBy, getDoc, doc as firestoreDoc } from "firebase/firestore";
import { firebaseDb, firebaseAuth } from "@/lib/firebase";
import { Calendar, Activity, FileX01, CurrencyDollar } from "@untitledui/icons";

type Stat = {
  name: string;
  value: string;
  icon: any;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
};

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(value);
  } catch (e) {
    return `$${value}`;
  }
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        setStats([
          { name: "Citas Agendadas", value: "0", icon: Calendar, change: "0", changeType: "neutral", description: "Inicia sesión" },
          { name: "Servicios Activos", value: "0", icon: Activity, change: "0", changeType: "neutral", description: "Inicia sesión" },
          { name: "Tickets Pendientes", value: "0", icon: FileX01, change: "0", changeType: "neutral", description: "Inicia sesión" },
          { name: "Ingresos del Mes", value: formatCurrency(0), icon: CurrencyDollar, change: "0", changeType: "neutral" },
        ]);
        setLoading(false);
        return;
      }

      // 1) Citas agendadas: contar citas futuras del usuario
      const now = new Date();
      const citasQ = query(
        collection(firebaseDb, "citas"),
        where("usuarioId", "==", user.uid)
      );
      const citasSnap = await getDocs(citasQ);
      const citas = citasSnap.docs.map((d) => d.data());
      const citasFuturasCount = citas.filter((c: any) => {
        const fecha = c.fechaReservada?.toDate ? c.fechaReservada.toDate() : new Date(c.fechaReservada);
        return fecha >= now;
      }).length;

      // 2) Servicios activos
      const serviciosQ = query(
        collection(firebaseDb, "servicios"),
        where("usuarioId", "==", user.uid),
        where("activo", "==", true)
      );
      const serviciosSnap = await getDocs(serviciosQ);
      const serviciosActivos = serviciosSnap.size;

      // 3) Tickets pendientes: asumir colección 'tickets' y que existe campo 'estado' distinto de 'CERRADO'
      const ticketsQ = query(
        collection(firebaseDb, "tickets"),
        where("usuarioId", "==", user.uid)
      );
      const ticketsSnap = await getDocs(ticketsQ);
      const ticketsPendientes = ticketsSnap.docs.filter((d) => {
        const data: any = d.data();
        return data.estado !== "CERRADO" && data.estado !== "RESUELTO";
      }).length;

      // 4) Ingresos del mes: buscar en 'pagos' o sumar precio de citas pagadas (fallback)
      let ingresos = 0;
      try {
        const pagosQ = query(
          collection(firebaseDb, "pagos"),
          where("usuarioId", "==", user.uid)
        );
        const pagosSnap = await getDocs(pagosQ);
        if (!pagosSnap.empty) {
          ingresos = pagosSnap.docs.reduce((acc, d) => acc + (d.data().monto || 0), 0);
        } else {
          // fallback: sumar precio de servicios asociados a citas pagadas del mes
          const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
          const citasPagadas = citasSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(c => {
            const fecha = c.fechaReservada?.toDate ? c.fechaReservada.toDate() : new Date(c.fechaReservada);
            return c.pagado && fecha >= start && fecha <= end;
          });

          // intentar sumar precio recuperando servicios localmente si están embebidos
          for (const c of citasPagadas) {
            // Determinar el monto a sumar para esta cita.
            // Prioridad:
            // 1) precio personalizado cuando precioTipo === 'PERSONALIZADO'
            // 2) precioFinal (campo calculado o guardado)
            // 3) campo legacy 'precio'
            // 4) fallback: leer el precio del documento de servicio
            let monto = 0;

            if (c.precioTipo === 'PERSONALIZADO' && typeof c.precioPersonalizado !== 'undefined') {
              monto = Number(c.precioPersonalizado || 0);
            } else if (typeof c.precioFinal !== 'undefined') {
              monto = Number(c.precioFinal || 0);
            } else if (typeof c.precio !== 'undefined') {
              monto = Number(c.precio || 0);
            } else if (c.servicioId) {
              try {
                const servicioRef = firestoreDoc(firebaseDb, "servicios", String(c.servicioId));
                const sSnap = await getDoc(servicioRef);
                if (sSnap.exists()) {
                  const precio = sSnap.data().precio;
                  monto = Number(precio || 0);
                }
              } catch (e) {
                // No bloquear el cálculo si falla la lectura de un servicio
              }
            }

            ingresos += isNaN(monto) ? 0 : monto;
          }
        }
      } catch (e) {
        // ignore
      }

      const newStats: Stat[] = [
        { name: "Citas Agendadas", value: String(citasFuturasCount), icon: Calendar, change: "+0%", changeType: "neutral", description: "Esta semana" },
        { name: "Servicios Activos", value: String(serviciosActivos), icon: Activity, change: "+0", changeType: "neutral", description: "En curso" },
        { name: "Tickets Pendientes", value: String(ticketsPendientes), icon: FileX01, change: "-0", changeType: "neutral", description: "Por resolver" },
        { name: "Ingresos del Mes", value: formatCurrency(ingresos), icon: CurrencyDollar, change: "+0%", changeType: "neutral" },
      ];

      setStats(newStats);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-primary border border-secondary rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-secondary rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary border border-secondary rounded-lg p-4 mb-8">
        <p className="text-sm text-error-700">Error cargando indicadores: {error}</p>
        <button onClick={() => fetchStats()} className="mt-3 px-3 py-1 bg-brand-600 text-white rounded">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-primary border border-secondary rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-950/30">
              <stat.icon className="h-6 w-6 text-brand-400" />
            </div>
            <div className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success-700' : stat.changeType === 'negative' ? 'text-error-700' : 'text-tertiary'}`}>
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-display-xs font-semibold text-primary">{stat.value}</p>
            <p className="text-sm font-medium text-tertiary mt-1">{stat.name}</p>
            {stat.description && <p className="text-xs text-quaternary mt-1">{stat.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
