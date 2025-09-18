"use client";

import React from "react";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Cita } from "@/types/cita";
import { Cliente } from "@/types/cliente";
import { Servicio } from "@/types/servicio";
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
  Hash01
} from "@untitledui/icons";

interface CitaDetalleCardProps {
  cita: Cita;
  cliente?: Cliente;
  servicio?: Servicio;
  showActions?: boolean;
  onEditar?: () => void;
  onMarcarPagado?: () => void;
  onCambiarEstado?: (nuevoEstado: Cita['estado']) => void;
  className?: string;
}

/**
 * Componente reutilizable para mostrar los detalles de una cita
 * Puede usarse tanto en páginas completas como en modales
 */
export function CitaDetalleCard({ 
  cita, 
  cliente, 
  servicio, 
  showActions = true,
  onEditar, 
  onMarcarPagado, 
  onCambiarEstado,
  className = ""
}: CitaDetalleCardProps) {
  
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
    <div className={`space-y-4 ${className}`}>
      {/* Header con información principal */}
      <div className="bg-secondary border border-tertiary rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <FeaturedIcon
              icon={Calendar}
              size="md"
              color="brand"
              theme="light"
            />
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Cita #{cita.codigoAcceso}
              </h2>
              <p className="text-xs text-tertiary">
                Registrada el {formatearFecha(cita.fechaRegistro)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BadgeWithDot
              color={obtenerColorEstado(cita.estado)}
              size="sm"
            >
              {cita.estado}
            </BadgeWithDot>
            
            {cita.pagado ? (
              <Badge color="success" size="sm">
                Pagado
              </Badge>
            ) : (
              <Badge color="warning" size="sm">
                Pendiente
              </Badge>
            )}
          </div>
        </div>

        {/* Información de fecha y hora */}
        <div className="bg-primary border border-tertiary rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-brand-50 rounded-lg">
                <Calendar className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary">Fecha</p>
                <p className="text-sm font-semibold text-primary">
                  {new Intl.DateTimeFormat('es-ES', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }).format(cita.fechaReservada)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-brand-50 rounded-lg">
                <Clock className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary">Hora</p>
                <p className="text-sm font-semibold text-primary">
                  {formatearHora(cita.fechaReservada)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del cliente */}
      <div className="bg-secondary border border-tertiary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <User01 className="w-4 h-4 text-tertiary" />
          <h3 className="text-sm font-semibold text-primary">Cliente</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">{obtenerNombreCliente()}</span>
            <Badge 
              color={cita.clienteId ? "brand" : "warning"} 
              size="sm"
            >
              {cita.clienteId ? "Habitual" : "Ambulatorio"}
            </Badge>
          </div>
          
          {obtenerTelefonoCliente() && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-tertiary" />
              <span className="text-xs text-secondary">{obtenerTelefonoCliente()}</span>
            </div>
          )}
          
          {cliente?.datos.correo && (
            <div className="flex items-center gap-2">
              <Mail01 className="w-3 h-3 text-tertiary" />
              <span className="text-xs text-secondary">{cliente.datos.correo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Información del servicio */}
      <div className="bg-secondary border border-tertiary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard01 className="w-4 h-4 text-tertiary" />
          <h3 className="text-sm font-semibold text-primary">Servicio</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {servicio?.nombre || 'Servicio no encontrado'}
            </span>
            <span className="text-lg font-bold text-primary">
              S/{precioFinal.toFixed(2)}
            </span>
          </div>
          
          {cita.precioTipo === 'PERSONALIZADO' && (
            <div className="flex items-center gap-1">
              <Badge color="warning" size="sm">
                Precio Personalizado
              </Badge>
              {servicio?.precio && (
                <span className="text-xs text-tertiary">
                  (Estándar: S/{servicio.precio.toFixed(2)})
                </span>
              )}
            </div>
          )}
          
          {servicio?.tipo && (
            <div>
              <Badge color="gray" size="sm">
                {servicio.tipo}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-secondary">Estado de pago:</span>
            {cita.pagado ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-success-600" />
                <span className="text-xs text-success-600 font-medium">Pagado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-warning-600" />
                <span className="text-xs text-warning-600 font-medium">Pendiente</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notas */}
      {cita.notas && (
        <div className="bg-secondary border border-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash01 className="w-4 h-4 text-tertiary" />
            <h3 className="text-sm font-semibold text-primary">Notas</h3>
          </div>
          <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
            {cita.notas}
          </p>
        </div>
      )}

      {/* Acciones (condicional) */}
      {showActions && (onEditar || onMarcarPagado || onCambiarEstado) && (
        <div className="bg-secondary border border-tertiary rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary mb-3">Acciones</h3>
          
          <div className="flex flex-wrap gap-2">
            {onEditar && (
              <Button
                color="primary"
                size="sm"
                iconLeading={Edit01}
                onClick={onEditar}
              >
                Editar
              </Button>
            )}
            
            {onMarcarPagado && (
              <Button
                color={cita.pagado ? "secondary" : "primary"}
                size="sm"
                iconLeading={CreditCard01}
                onClick={onMarcarPagado}
              >
                {cita.pagado ? "No Pagado" : "Pagado"}
              </Button>
            )}
            
            {onCambiarEstado && cita.estado === 'PENDIENTE' && (
              <Button
                color="primary"
                size="sm"
                iconLeading={CheckCircle}
                onClick={() => onCambiarEstado('CONFIRMADA')}
              >
                Confirmar
              </Button>
            )}
            
            {onCambiarEstado && cita.estado !== 'CANCELADA' && (
              <Button
                color="primary-destructive"
                size="sm"
                iconLeading={XClose}
                onClick={() => onCambiarEstado('CANCELADA')}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}