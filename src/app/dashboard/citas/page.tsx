"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, User01, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Check, CheckCheck } from "lucide-react";
import { useCitas } from "@/hooks/use-citas";
import { useClientes } from "@/hooks/use-clientes";
import { useServicios } from "@/hooks/use-servicios";
import { CitaModal, CitaFormData } from "@/components/application/modals/cita-modal";
import { Cita } from "@/types/cita";

// Tipos para filtros
type FiltroFecha = 'todas' | 'hoy' | 'semana' | 'mes';
type FiltroEstado = 'todas' | 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA';

export default function CitasPage() {
  // Estados locales para filtros y modal
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todas');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  // Hooks para gestión de datos
  const { 
    citas, 
    loading, 
    crearCita, 
    cambiarEstadoCita, 
    obtenerCitasHoy, 
    obtenerCitasEstaSemana, 
    obtenerCitasEsteMes,
    filtrarCitasPorEstado 
  } = useCitas();
  
  const { clientes } = useClientes();
  const { servicios } = useServicios();

  /**
   * Función para obtener las citas filtradas según los criterios seleccionados
   */
  const obtenerCitasFiltradas = () => {
    let citasFiltradas = [...citas];

    // Aplicar filtro de fecha
    switch (filtroFecha) {
      case 'hoy':
        citasFiltradas = obtenerCitasHoy();
        break;
      case 'semana':
        citasFiltradas = obtenerCitasEstaSemana();
        break;
      case 'mes':
        citasFiltradas = obtenerCitasEsteMes();
        break;
      default:
        break;
    }

    // Aplicar filtro de estado
    if (filtroEstado !== 'todas') {
      citasFiltradas = citasFiltradas.filter(cita => cita.estado === filtroEstado);
    }

    return citasFiltradas;
  };

  /**
   * Función para obtener los datos del cliente
   */
  const obtenerDatosCliente = (cita: Cita) => {
    if (cita.clienteId) {
      const cliente = clientes.find(c => c.id === cita.clienteId);
      return {
        nombre: cliente?.datos.nombre || 'Cliente no encontrado',
        telefono: cliente?.datos.telefono
      };
    } else if (cita.clienteAmbulatorio) {
      return {
        nombre: cita.clienteAmbulatorio.nombre,
        telefono: cita.clienteAmbulatorio.telefono
      };
    }
    return { nombre: 'Cliente desconocido' };
  };

  /**
   * Función para obtener los datos del servicio
   */
  const obtenerDatosServicio = (cita: Cita) => {
    const servicio = servicios.find(s => s.id === cita.servicioId);
    return {
      nombre: servicio?.nombre || 'Servicio no encontrado',
      precio: servicio?.precio || 0
    };
  };

  /**
   * Función para manejar la creación de nueva cita
   */
  const manejarCrearCita = async (datosFormulario: CitaFormData) => {
    try {
      // Construir el objeto base de la cita
      const datosCita: any = {
        servicioId: datosFormulario.servicioId,
        fechaReservada: datosFormulario.fechaReservada,
        estado: datosFormulario.estado,
      };

      // Añadir campos opcionales solo si tienen valor
      if (datosFormulario.tipoCliente === 'HABITUAL') {
        datosCita.clienteId = datosFormulario.clienteId;
      } else if (datosFormulario.tipoCliente === 'AMBULATORIO') {
        datosCita.clienteAmbulatorio = datosFormulario.clienteAmbulatorio;
      }

      if (datosFormulario.notas) {
        datosCita.notas = datosFormulario.notas;
      }

      await crearCita(datosCita);
      setModalAbierto(false);
    } catch (error) {
      console.error('Error al crear cita:', error);
      alert('Error al crear la cita. Por favor intente nuevamente.');
    }
  };

  /**
   * Función para aceptar una cita
   */
  const manejarAceptarCita = async (citaId: string) => {
    try {
      await cambiarEstadoCita(citaId, 'CONFIRMADA');
    } catch (error) {
      console.error('Error al aceptar cita:', error);
      alert('Error al aceptar la cita. Por favor intente nuevamente.');
    }
  };

  /**
   * Función para cancelar una cita
   */
  const manejarCancelarCita = async (citaId: string) => {
    try {
      await cambiarEstadoCita(citaId, 'CANCELADA');
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      alert('Error al cancelar la cita. Por favor intente nuevamente.');
    }
  };

  /**
   * Función para formatear fecha
   */
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  /**
   * Función para formatear hora
   */
  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Función para obtener el color del estado
   */
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return "bg-success-50 text-success-700 border-success-200";
      case "PENDIENTE":
        return "bg-warning-50 text-warning-700 border-warning-200";
      case "CANCELADA":
        return "bg-error-50 text-error-700 border-error-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Obtener citas filtradas
  const citasFiltradas = obtenerCitasFiltradas();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Gestión de Citas</h1>
          <p className="mt-2 text-md text-tertiary">
            Administra las citas y reservas de tus clientes
          </p>
        </div>
        <Button size="sm" iconLeading={Plus} onClick={() => setModalAbierto(true)}>
          Nueva Cita
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button 
            color={filtroFecha === 'hoy' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroFecha('hoy')}
          >
            Hoy
          </Button>
          <Button 
            color={filtroFecha === 'semana' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroFecha('semana')}
          >
            Esta semana
          </Button>
          <Button 
            color={filtroFecha === 'mes' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroFecha('mes')}
          >
            Este mes
          </Button>
          <Button 
            color={filtroFecha === 'todas' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroFecha('todas')}
          >
            Todas
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            color={filtroEstado === 'todas' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('todas')}
          >
            Todas
          </Button>
          <Button 
            color={filtroEstado === 'CONFIRMADA' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('CONFIRMADA')}
          >
            Confirmadas
          </Button>
          <Button 
            color={filtroEstado === 'PENDIENTE' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('PENDIENTE')}
          >
            Pendientes
          </Button>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">
            {loading ? "Cargando citas..." : `Citas (${citasFiltradas.length})`}
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-tertiary">Cargando citas...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-tertiary mb-4" />
              <h4 className="text-lg font-medium text-primary mb-2">No hay citas</h4>
              <p className="text-tertiary mb-4">
                {filtroFecha !== 'todas' || filtroEstado !== 'todas' 
                  ? 'No hay citas que coincidan con los filtros seleccionados.'
                  : 'No tienes citas programadas aún. ¡Crea tu primera cita!'
                }
              </p>
              <Button size="sm" iconLeading={Plus} onClick={() => setModalAbierto(true)}>
                Nueva Cita
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-secondary">
            {citasFiltradas.map((cita) => {
              const datosCliente = obtenerDatosCliente(cita);
              const datosServicio = obtenerDatosServicio(cita);
              
              return (
                <div key={cita.id} className="p-6 hover:bg-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                        <User01 className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-primary">{datosCliente.nombre}</h4>
                        <p className="text-sm text-tertiary">{datosServicio.nombre}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-tertiary">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatearFecha(cita.fechaReservada)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatearHora(cita.fechaReservada)}</span>
                          </div>
                          <span>•</span>
                          <span>${datosServicio.precio}</span>
                          {cita.notas && (
                            <>
                              <span>•</span>
                              <span className="italic">{cita.notas}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(
                          cita.estado
                        )}`}
                      >
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1).toLowerCase()}
                      </span>
                      <div className="flex space-x-2">
                        {cita.estado === 'PENDIENTE' && (
                          <Button 
                            color="tertiary" 
                            size="sm" 
                            iconLeading={Check}
                            onClick={() => manejarAceptarCita(cita.id)}
                          >
                            Aceptar 
                          </Button>
                        )}
                        {cita.estado !== 'CANCELADA' && (
                          <Button 
                            color="tertiary" 
                            size="sm" 
                            iconLeading={X}
                            onClick={() => manejarCancelarCita(cita.id)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vista de calendario placeholder */}
      <div className="mt-8 bg-primary border border-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Vista de Calendario</h3>
        <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-tertiary mx-auto mb-2" />
            <p className="text-tertiary">Vista de calendario próximamente</p>
          </div>
        </div>
      </div>

      {/* Modal para nueva cita */}
      <CitaModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setCitaEditando(null);
        }}
        onSave={manejarCrearCita}
        initialData={citaEditando ? {
          tipoCliente: citaEditando.clienteId ? 'HABITUAL' : 'AMBULATORIO',
          clienteId: citaEditando.clienteId,
          clienteAmbulatorio: citaEditando.clienteAmbulatorio,
          servicioId: citaEditando.servicioId,
          fechaReservada: citaEditando.fechaReservada,
          notas: citaEditando.notas,
          estado: citaEditando.estado
        } : undefined}
      />
    </div>
  );
}
