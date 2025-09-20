'use client';

import { useMemo } from 'react';
import { User01 } from '@untitledui/icons';
import { useClientes } from '@/hooks/use-clientes';
import { useCitas } from '@/hooks/use-citas';
import { Cliente } from '@/types/cliente';
import { Cita } from '@/types/cita';

interface ClienteReciente {
  id: string;
  nombre: string;
  telefono: string;
  ultimaVisita: string;
  tipo: 'HABITUAL' | 'AMBULATORIO';
}

export default function ClientesRecientes() {
  const { clientes, loading: clientesLoading } = useClientes();
  const { citas, loading: citasLoading } = useCitas();

  // Calcular clientes recientes basados en citas
  const clientesRecientes = useMemo(() => {
    if (clientesLoading || citasLoading) return [];

    const clientesMap = new Map<string, ClienteReciente>();

    // Procesar citas para encontrar clientes recientes
    citas.forEach((cita: Cita) => {
      let clienteInfo: ClienteReciente | null = null;

      if (cita.clienteId) {
        // Cliente habitual
        const cliente = clientes.find((c: Cliente) => c.id === cita.clienteId);
        if (cliente) {
          clienteInfo = {
            id: cliente.id,
            nombre: cliente.datos.nombre,
            telefono: cliente.datos.telefono,
            ultimaVisita: formatUltimaVisita(cita.fechaReservada),
            tipo: 'HABITUAL'
          };
        }
      } else if (cita.clienteAmbulatorio) {
        // Cliente ambulatorio
        clienteInfo = {
          id: `ambulatorio-${cita.id}`,
          nombre: cita.clienteAmbulatorio.nombre,
          telefono: cita.clienteAmbulatorio.telefono || '',
          ultimaVisita: formatUltimaVisita(cita.fechaReservada),
          tipo: 'AMBULATORIO'
        };
      }

      if (clienteInfo) {
        // Solo actualizar si es más reciente o no existe
        const existing = clientesMap.get(clienteInfo.id);
        if (!existing || new Date(cita.fechaReservada) > new Date(parseFecha(existing.ultimaVisita))) {
          clientesMap.set(clienteInfo.id, clienteInfo);
        }
      }
    });

    // Convertir a array y ordenar por fecha más reciente
    return Array.from(clientesMap.values())
      .sort((a, b) => new Date(parseFecha(b.ultimaVisita)).getTime() - new Date(parseFecha(a.ultimaVisita)).getTime())
      .slice(0, 5); // Mostrar solo los 5 más recientes
  }, [clientes, citas, clientesLoading, citasLoading]);

  // Función para formatear la fecha de última visita
  function formatUltimaVisita(fecha: Date | any): string {
    const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fechaObj.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Hace 1 día';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) > 1 ? 's' : ''}`;

    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: fechaObj.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
    });
  }

  // Función auxiliar para parsear fechas de texto
  function parseFecha(fechaStr: string): Date {
    if (fechaStr === 'Hoy') return new Date();
    if (fechaStr === 'Hace 1 día') {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 1);
      return fecha;
    }
    if (fechaStr.startsWith('Hace ')) {
      const match = fechaStr.match(/Hace (\d+) días?/);
      if (match) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - parseInt(match[1]));
        return fecha;
      }
    }
    // Para fechas más antiguas, devolver una fecha antigua
    return new Date(2000, 0, 1);
  }

  // Función para generar enlace de WhatsApp
  const generarWhatsAppLink = (telefono: string): string => {
    // Limpiar el número de teléfono (remover espacios, guiones, etc.)
    const numeroLimpio = telefono.replace(/\D/g, '');
    // Agregar prefijo internacional si no lo tiene (asumiendo México/España)
    const numeroConPrefijo = numeroLimpio.startsWith('+') ? numeroLimpio : `+52${numeroLimpio}`;
    return `https://wa.me/${numeroConPrefijo}`;
  };

  if (clientesLoading || citasLoading) {
    return (
      <div className="bg-primary border border-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Clientes Recientes</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-tertiary rounded-full"></div>
                <div>
                  <div className="h-4 w-24 bg-tertiary rounded mb-1"></div>
                  <div className="h-3 w-16 bg-tertiary rounded"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-tertiary rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary border border-secondary rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Clientes Recientes</h3>
      <div className="space-y-3">
        {clientesRecientes.length === 0 ? (
          <div className="text-center py-8">
            <User01 className="h-12 w-12 text-tertiary mx-auto mb-3" />
            <p className="text-tertiary">No hay clientes recientes</p>
            <p className="text-sm text-quaternary mt-1">Los clientes aparecerán aquí después de agendar citas</p>
          </div>
        ) : (
          clientesRecientes.map((cliente) => (
            <div key={cliente.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
                  <User01 className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-primary">{cliente.nombre}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-tertiary">{cliente.ultimaVisita}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      cliente.tipo === 'HABITUAL'
                        ? 'bg-success-50 text-success-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {cliente.tipo === 'HABITUAL' ? 'Habitual' : 'Ambulatorio'}
                    </span>
                  </div>
                </div>
              </div>
              {cliente.telefono && (
                <a
                  href={generarWhatsAppLink(cliente.telefono)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Contactar
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}