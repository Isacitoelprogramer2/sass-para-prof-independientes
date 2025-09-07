"use client";

import { Plus, Calendar, Clock, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

export default function CitasPage() {
  const citas = [
    {
      id: 1,
      cliente: "María García",
      servicio: "Corte y peinado",
      fecha: "2025-01-15",
      hora: "10:00",
      estado: "confirmada",
      duracion: "1h 30min",
    },
    {
      id: 2,
      cliente: "Carlos López",
      servicio: "Consulta médica",
      fecha: "2025-01-15",
      hora: "14:30",
      estado: "pendiente",
      duracion: "45min",
    },
    {
      id: 3,
      cliente: "Ana Martínez",
      servicio: "Masaje terapéutico",
      fecha: "2025-01-16",
      hora: "09:00",
      estado: "confirmada",
      duracion: "1h",
    },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-success-50 text-success-700 border-success-200";
      case "pendiente":
        return "bg-warning-50 text-warning-700 border-warning-200";
      case "cancelada":
        return "bg-error-50 text-error-700 border-error-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Gestión de Citas</h1>
          <p className="mt-2 text-md text-tertiary">
            Administra las citas y reservas de tus clientes
          </p>
        </div>
        <Button size="sm" iconLeading={Plus}>
          Nueva Cita
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button color="secondary" size="sm">
            Hoy
          </Button>
          <Button color="tertiary" size="sm">
            Esta semana
          </Button>
          <Button color="tertiary" size="sm">
            Este mes
          </Button>
        </div>
        <div className="flex gap-2">
          <Button color="tertiary" size="sm">
            Todas
          </Button>
          <Button color="tertiary" size="sm">
            Confirmadas
          </Button>
          <Button color="tertiary" size="sm">
            Pendientes
          </Button>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">Próximas Citas</h3>
        </div>
        <div className="divide-y divide-secondary">
          {citas.map((cita) => (
            <div key={cita.id} className="p-6 hover:bg-secondary transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                    <User01 className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-primary">{cita.cliente}</h4>
                    <p className="text-sm text-tertiary">{cita.servicio}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-tertiary">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{cita.fecha}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{cita.hora}</span>
                      </div>
                      <span>•</span>
                      <span>{cita.duracion}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(
                      cita.estado
                    )}`}
                  >
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <Button color="tertiary" size="sm">
                      Editar
                    </Button>
                    <Button color="tertiary" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
}
