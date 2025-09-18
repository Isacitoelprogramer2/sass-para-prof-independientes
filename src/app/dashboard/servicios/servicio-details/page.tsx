"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Cita } from "@/types/cita";
import { Cliente } from "@/types/cliente";
import { Servicio } from "@/types/servicio";
import { useCitas } from "@/hooks/use-citas";
import { useClientes } from "@/hooks/use-clientes";
import { useServicios } from "@/hooks/use-servicios";
import {
  Calendar,
  Clock,
  User01,
  Phone,
  Mail01,
  Edit01,
  CreditCard01,
  AlertTriangle,
  CheckCircle,
  XClose,
  ArrowLeft,
  Hash01
} from "@untitledui/icons";

interface CitaDetalleProps {
  cita: Cita;
  cliente?: Cliente;
  servicio?: Servicio;
  onEditar?: () => void;
  onMarcarPagado?: () => void;
  onCambiarEstado?: (nuevoEstado: Cita['estado']) => void;
}

/**
 * Componente para mostrar los detalles completos de una cita
 */
function CitaDetalle({ cita, cliente, servicio, onEditar, onMarcarPagado, onCambiarEstado }: CitaDetalleProps) {
  
  // Función para obtener el nombre del cliente
  const obtenerNombreCliente = () => {
    if (cita.clienteId && cliente) {
      return cliente.datos.nombre;
    }
    if (cita.clienteAmbulatorio) {
      return cita.clienteAmbulatorio.nombre;
    }
    return "Cliente no especificado";
  };

  // Función para obtener el teléfono del cliente
  const obtenerTelefonoCliente = () => {
    if (cita.clienteId && cliente) {
      return cliente.datos.telefono;
    }
    if (cita.clienteAmbulatorio?.telefono) {
      return cita.clienteAmbulatorio.telefono;
    }
    return null;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(fecha);
  };

  // Función para formatear hora
  const formatearHora = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(fecha);
  };

  // Función para obtener el color del badge según el estado
  const obtenerColorEstado = (estado: Cita['estado']) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'success' as const;
      case 'PENDIENTE':
        return 'warning' as const;
      case 'CANCELADA':
        return 'error' as const;
      default:
        return 'gray' as const;
    }
  };

  // Función para calcular el precio final
  const calcularPrecioFinal = () => {
    if (cita.precioTipo === 'PERSONALIZADO' && typeof cita.precioPersonalizado === 'number') {
      return cita.precioPersonalizado;
    }
    if (typeof cita.precioFinal === 'number') {
      return cita.precioFinal;
    }
    return servicio?.precio || 0;
  };

  const precioFinal = calcularPrecioFinal();

  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <div className="bg-secondary border border-tertiary rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <FeaturedIcon
              icon={Calendar}
              size="lg"
              color="brand"
              theme="light"
            />
            <div>
              <h1 className="text-2xl font-semibold text-primary">
                Servicio #{cita.codigoAcceso}
              </h1>
              <p className="text-sm text-tertiary mt-1">
                Registrada el {formatearFecha(cita.fechaRegistro)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BadgeWithDot
              color={obtenerColorEstado(cita.estado)}
              size="md"
            >
              {cita.estado}
            </BadgeWithDot>
            
            {cita.pagado ? (
              <Badge color="success" size="md">
                Pagado
              </Badge>
            ) : (
              <Badge color="warning" size="md">
                Pendiente de pago
              </Badge>
            )}
          </div>
        </div>

        

        {/* Información de fecha y hora destacada */}
        <div className="bg-primary border border-tertiary rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-brand-50 rounded-lg">
                <Calendar className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">Fecha</p>
                <p className="text-lg font-semibold text-primary">
                  {formatearFecha(cita.fechaReservada)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-brand-50 rounded-lg">
                <Clock className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">Hora</p>
                <p className="text-lg font-semibold text-primary">
                  {formatearHora(cita.fechaReservada)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones disponibles */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-3 flex-row-reverse">

        {onCambiarEstado && cita.estado !== 'CANCELADA' && (
            <Button
              color="primary-destructive"
              size="md"
              iconLeading={XClose}
              onClick={() => onCambiarEstado('CANCELADA')}
            >
              Cancelar Cita
            </Button>
          )}
          
          {onMarcarPagado && (
            <Button
              color={cita.pagado ? "secondary" : "primary"}
              size="md"
              iconLeading={CreditCard01}
              onClick={onMarcarPagado}
            >
              {cita.pagado ? "Marcar como No Pagado" : "Marcar como Pagado"}
            </Button>
          )}
          
          
          
          

          {onCambiarEstado && cita.estado === 'PENDIENTE' && (
            <Button
              className="bg-green-800"
              size="md"
              iconLeading={<CheckCircle className="w-4 h-4" />}
              onClick={() => onCambiarEstado('CONFIRMADA')}
            >
              Confirmar Cita
            </Button>
          )}
        </div>
      </div>
      </div>

      {/* Información del cliente */}
      <div className="bg-secondary border border-tertiary rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FeaturedIcon
            icon={User01}
            size="sm"
            color="gray"
            theme="light"
          />
          <h2 className="text-lg font-semibold text-primary">Información del Cliente</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User01 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium text-secondary">Nombre:</span>
              <span className="text-sm text-primary">{obtenerNombreCliente()}</span>
            </div>
            
            {obtenerTelefonoCliente() && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-tertiary" />
                <span className="text-sm font-medium text-secondary">Teléfono:</span>
                <a
                  href={`https://wa.me/${obtenerTelefonoCliente()?.replace(/\s+/g, '').replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-brand-600 underline cursor-pointer"
                >
                  {obtenerTelefonoCliente()}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary">Tipo:</span>
              <Badge 
                color={cita.clienteId ? "brand" : "warning"} 
                size="sm"
              >
                {cita.clienteId ? "Cliente Habitual" : "Cliente Ambulatorio"}
              </Badge>
            </div>
          </div>

          {cliente && (
            <div className="space-y-3">
              {cliente.datos.correo && (
                <div className="flex items-center gap-2">
                  <Mail01 className="w-4 h-4 text-tertiary" />
                  <span className="text-sm font-medium text-secondary">Email:</span>
                  <span className="text-sm text-primary">{cliente.datos.correo}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-tertiary" />
                <span className="text-sm font-medium text-secondary">Estado:</span>
                <Badge
                  color={cliente.datos.estado?.toLowerCase() === 'activo' ? 'success' : 'gray'}
                  size="sm"
                >
                  {cliente.datos.estado || 'Sin estado'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información del servicio */}
      <div className="bg-secondary border border-tertiary rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FeaturedIcon
            icon={CreditCard01}
            size="sm"
            color="gray"
            theme="light"
          />
          <h2 className="text-lg font-semibold text-primary">Servicio y Precio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-secondary">Servicio</p>
              <p className="text-lg font-semibold text-primary">
                {servicio?.nombre || 'Servicio no encontrado'}
              </p>
            </div>
            
            {servicio?.detalles && (
              <div>
                <p className="text-sm font-medium text-secondary">Descripción</p>
                <p className="text-sm text-tertiary">{servicio.detalles}</p>
              </div>
            )}
            
            {servicio?.tipo && (
              <div>
                <p className="text-sm font-medium text-secondary">Categoría</p>
                <Badge color="gray" size="sm">
                  {servicio.tipo}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-secondary">Precio Final</p>
              <p className="text-2xl font-bold text-primary">
                S/{precioFinal.toFixed(2)}
              </p>
            </div>
            
            {cita.precioTipo === 'PERSONALIZADO' && (
              <div>
                <Badge color="warning" size="sm">
                  Precio Personalizado
                </Badge>
                {servicio?.precio && (
                  <p className="text-sm text-tertiary mt-1">
                    Precio estándar: S/{servicio.precio.toFixed(2)}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary">Estado de pago:</span>
              {cita.pagado ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-success-600 font-medium">Pagado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                  <span className="text-sm text-warning-600 font-medium">Pendiente</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      {cita.notas && (
        <div className="bg-secondary border border-tertiary rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Hash01 className="w-4 h-4 text-tertiary" />
            <h2 className="text-lg font-semibold text-primary">Notas</h2>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
              {cita.notas}
            </p>
          </div>
        </div>
      )}

      
    </div>
  );
}

/**
 * Página principal para mostrar los detalles de una cita
 */
export default function CitaDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const citaId = searchParams.get('id');

  // Estados
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);

  // Hooks
  const { obtenerCitaPorId, actualizarCita, marcarPagado } = useCitas();
  const { clientes } = useClientes();
  const { servicios } = useServicios();

  // Cargar datos de la cita
  useEffect(() => {
    const cargarCita = async () => {
      if (!citaId) {
        setLoading(false);
        return;
      }

      try {
        const citaData = await obtenerCitaPorId(citaId);
        setCita(citaData);
      } catch (error) {
        console.error('Error al cargar la cita:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCita();
  }, [citaId, obtenerCitaPorId]);

  // Obtener datos relacionados
  const cliente = cita?.clienteId 
    ? clientes.find(c => c.id === cita.clienteId)
    : undefined;
    
  const servicio = cita?.servicioId 
    ? servicios.find(s => s.id === cita.servicioId)
    : undefined;

  // Handlers
  const handleEditar = () => {
    // Navegar a la página de edición o abrir modal
    router.push(`/dashboard/servicios?edit=${cita?.id}`);
  };

  const handleMarcarPagado = async () => {
    if (!cita) return;
    
    try {
      await marcarPagado(cita.id);
      // Actualizar el estado local
      setCita(prev => prev ? { ...prev, pagado: !prev.pagado } : null);
    } catch (error) {
      console.error('Error al cambiar estado de pago:', error);
    }
  };

  const handleCambiarEstado = async (nuevoEstado: Cita['estado']) => {
    if (!cita) return;
    
    try {
      await actualizarCita(cita.id, { estado: nuevoEstado });
      // Actualizar el estado local
      setCita(prev => prev ? { ...prev, estado: nuevoEstado } : null);
    } catch (error) {
      console.error('Error al cambiar estado de la cita:', error);
    }
  };

  const handleVolver = () => {
    router.push('/dashboard/servicios');
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
          <p className="text-sm text-tertiary mt-2">Cargando detalles de la cita...</p>
        </div>
      </div>
    );
  }

  if (!citaId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">ID de cita no especificado</h2>
          <p className="text-sm text-tertiary mb-4">No se proporcionó un ID válido para la cita.</p>
          <Button color="primary" onClick={handleVolver}>
            Volver a Servicios
          </Button>
        </div>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-error-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">Cita no encontrada</h2>
          <p className="text-sm text-tertiary mb-4">La cita solicitada no existe o no tienes permisos para verla.</p>
          <Button color="primary" onClick={handleVolver}>
            Volver a Servicios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header con navegación */}
        <div className="mb-6">
          <Button
            color="tertiary"
            size="sm"
            iconLeading={ArrowLeft}
            onClick={handleVolver}
            className="mb-4"
          >
            Volver a Servicios
          </Button>
        </div>

        {/* Contenido principal */}
        <CitaDetalle
          cita={cita}
          cliente={cliente}
          servicio={servicio}
          onEditar={handleEditar}
          onMarcarPagado={handleMarcarPagado}
          onCambiarEstado={handleCambiarEstado}
        />
      </div>
    </div>
  );
}
