"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, User01, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Check} from "lucide-react";
import { useCitas } from "@/hooks/use-citas";
import { useClientes } from "@/hooks/use-clientes";
import { useServicios } from "@/hooks/use-servicios";
import { CitaModal, CitaFormData } from "@/components/application/modals/cita-modal";
import CitaDetailsModal from "@/components/application/modals/cita-details-modal";
import { Cita } from "@/types/cita";
import { useRouter } from "next/navigation";

// Tipos para filtros
type FiltroFecha = 'todas' | 'hoy' | 'semana' | 'mes';
type FiltroEstado = 'todas' | 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA';

export default function ServiciosPage() {
  // Estados locales para filtros y modal
  const [filtroFecha, setFiltroFecha] = useState<FiltroFecha>('todas');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const router = useRouter();

  // Hooks para gestión de datos
  const { 
    citas, 
    loading, 
    crearCita, 
    cambiarEstadoCita, 
    marcarPagado,
    obtenerCitasHoy, 
    obtenerCitasEstaSemana, 
    obtenerCitasEsteMes, 
  } = useCitas();
  
  const { clientes } = useClientes();
  const { servicios } = useServicios();

  // Función para navegar a los detalles de la cita
  const handleCitaClick = (citaId: string) => {
    router.push(`/dashboard/servicios/servicio-details?id=${citaId}`);
  };

  /**
   * Función para obtener los servicios filtrados según los criterios seleccionados
   */
  const obtenerServiciosFiltrados = () => {
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
      // Si la cita tiene precio personalizado y el tipo indica PERSONALIZADO, mostrarlo
      precio: cita.precioTipo === 'PERSONALIZADO' && typeof cita.precioPersonalizado === 'number'
        ? cita.precioPersonalizado
        : (servicio?.precio || 0)
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
        precioTipo: datosFormulario.precioTipo,
        precioPersonalizado: datosFormulario.precioPersonalizado,
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

  // Obtener servicios filtrados
  const citasFiltradas = obtenerServiciosFiltrados();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Gestión de Servicios</h1>
          <p className="mt-2 text-md text-tertiary">
            Administra los servicios y reservas de tus clientes
          </p>
        </div>
        <Button size="sm" iconLeading={Plus} onClick={() => setModalAbierto(true)}>
            Nuevo servicio
          </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button 
            color={filtroFecha === 'todas' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroFecha('todas')}
          >
            Todas
          </Button>
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
          
        </div>
        <div className="flex gap-2">
          <Button 
            color={filtroEstado === 'todas' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('todas')}
          >
            Todos
          </Button>
          <Button 
            color={filtroEstado === 'CONFIRMADA' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('CONFIRMADA')}
          >
            Confirmados
          </Button>
          <Button 
            color={filtroEstado === 'PENDIENTE' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('PENDIENTE')}
          >
            Pendientes
          </Button>
          <Button 
            color={filtroEstado === 'PENDIENTE' ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => setFiltroEstado('CANCELADA')}
          >
            Cancelados
          </Button>
        </div>
      </div>

      {/*
        Sección principal para mostrar la lista de servicios (citas) filtrados.
        Incluye manejo de estados de carga, lista vacía y renderizado de cada cita.
      */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        {/* Encabezado de la sección con el contador de servicios */}
        <div className="px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">
            {loading ? "Cargando servicios..." : `Servicios (${citasFiltradas.length})`}
          </h3>
        </div>

        {/* Estado de carga: muestra mensaje mientras se obtienen los datos */}
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-tertiary">Cargando servicios...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          // Si no hay servicios, muestra un estado vacío con opción para crear uno nuevo
          <div className="p-6 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-tertiary mb-4" />
              <h4 className="text-lg font-medium text-primary mb-2">No hay servicios programados</h4>
              <p className="text-tertiary mb-4">
                {filtroFecha !== 'todas' || filtroEstado !== 'todas' 
                  ? 'No hay servicios que coincidan con los filtros seleccionados.'
                  : 'No tienes servicios programados aún. ¡Crea tu primer servicio!'
                }
              </p>
              {/* Botón para abrir el modal de nuevo servicio */}
              <Button size="sm" iconLeading={Plus} onClick={() => setModalAbierto(true)}>
                Nuevo Servicio
              </Button>
            </div>
          </div>
        ) : (
          // Renderizado de la lista de servicios (citas)
          <div className="divide-y divide-secondary">
            {citasFiltradas.map((cita: Cita) => {
              // Obtiene los datos del cliente y servicio para mostrar
              const datosCliente = obtenerDatosCliente(cita);
              const datosServicio = obtenerDatosServicio(cita);

              return (
                <div key={cita.id} className="p-6 hover:bg-secondary transition-colors cursor-pointer" onClick={() => handleCitaClick(cita.id)}>
                  <div className="flex items-center justify-between">
                    {/* Información del cliente y servicio */}
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                        <User01 className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        {/* Nombre del cliente */}
                        <h4 className="text-md font-semibold text-primary">{datosCliente.nombre}</h4>
                        {/* Nombre del servicio */}
                        <p className="text-sm text-tertiary">{datosServicio.nombre}</p>
                        {/* Detalles de la cita: fecha, hora, precio y notas */}
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
                          <span>S/{datosServicio.precio}</span>            
                        </div>

                        {/* Etiqueta de estado con color dinámico */}
                            <div className="flex items-center space-x-2 mt-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(
                              cita?.estado ?? ""
                              )}`}
                            >
                              {(cita?.estado ?? "")
                              ? cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1).toLowerCase()
                              : "Sin estado"}
                            </span>
                            {/* Estado de pago */}
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${cita?.pagado ? 'bg-success-900 text-success-100 border-success-800' : 'bg-warning-900 text-warning-100 border-warning-800'}`}>
                              {cita?.pagado ? '$ Pagado' : 'Pendiente de pago'}
                            </span>
                            </div>

                          {cita.notas && (
                            <div className="mt-2 max-w-md max-h-16 overflow-hidden">
                              <p className="text-sm text-quaternary italic">Notas: {cita.notas}</p>
                            </div>
                          )}
                      </div>
                    </div>
                    {/* Acciones y estado de la cita */}
                    <div className="flex items-center space-x-3">
                      
                      <div className="flex space-x-2">
                        {/* Botón para aceptar la cita si está pendiente */}
                        {cita.estado === 'PENDIENTE' && (
                          <Button 
                            color="tertiary" 
                            size="sm" 
                            iconLeading={Check}
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); manejarAceptarCita(cita.id); }}
                          >
                            Aceptar 
                          </Button>
                        )}
                        {/* Botón para cancelar la cita si no está cancelada */}
                        {cita.estado !== 'CANCELADA' && (
                          <Button 
                            color="tertiary" 
                            size="sm" 
                            iconLeading={X}
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); manejarCancelarCita(cita.id); }}
                          >
                            Cancelar
                          </Button>
                        )}
                        {/* Botón rápido para alternar estado de pago */}
                        <Button
                          color={cita.pagado ? 'secondary' : 'tertiary'}
                          size="sm"
                          iconLeading={Check}
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); marcarPagado?.(cita.id); }}
                        >
                          {cita.pagado ? 'Marcar no pagado' : 'Marcar pagado'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detalles de la cita: modal que se abre al hacer click en una fila */}
      <CitaDetailsModal
        isOpen={!!selectedCita}
        onClose={() => setSelectedCita(null)}
        cita={selectedCita}
        clientes={clientes}
        servicios={servicios}
      />

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
          ,
          precioTipo: citaEditando.precioTipo,
          precioPersonalizado: citaEditando.precioPersonalizado
        } : undefined}
      />
    </div>
  );
}
