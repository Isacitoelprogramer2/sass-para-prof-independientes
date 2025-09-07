"use client";

import { Plus, SearchLg, Mail01, Phone, User01, DotsHorizontal } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function ClientesPage() {
  const clientes = [
    {
      id: 1,
      nombre: "María García",
      email: "maria.garcia@email.com",
      telefono: "+1 (555) 123-4567",
      ultimaVisita: "2025-01-10",
      totalCitas: 15,
      estado: "activo",
      avatar: null,
    },
    {
      id: 2,
      nombre: "Carlos López",
      email: "carlos.lopez@email.com",
      telefono: "+1 (555) 234-5678",
      ultimaVisita: "2025-01-08",
      totalCitas: 8,
      estado: "activo",
      avatar: null,
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+1 (555) 345-6789",
      ultimaVisita: "2024-12-20",
      totalCitas: 22,
      estado: "inactivo",
      avatar: null,
    },
    {
      id: 4,
      nombre: "Luis Rodríguez",
      email: "luis.rodriguez@email.com",
      telefono: "+1 (555) 456-7890",
      ultimaVisita: "2025-01-12",
      totalCitas: 5,
      estado: "activo",
      avatar: null,
    },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-success-50 text-success-700 border-success-200";
      case "inactivo":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Gestión de Clientes</h1>
          <p className="mt-2 text-md text-tertiary">
            Administra la información de tus clientes y su historial
          </p>
        </div>
        <Button size="sm" iconLeading={Plus}>
          Nuevo Cliente
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar clientes..."
            icon={SearchLg}
            size="sm"
          />
        </div>
        <div className="flex gap-2">
          <Button color="secondary" size="sm">
            Todos
          </Button>
          <Button color="tertiary" size="sm">
            Activos
          </Button>
          <Button color="tertiary" size="sm">
            Inactivos
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{clientes.length}</p>
          <p className="text-sm text-tertiary">Total Clientes</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {clientes.filter(c => c.estado === "activo").length}
          </p>
          <p className="text-sm text-tertiary">Activos</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {Math.round(clientes.reduce((acc, c) => acc + c.totalCitas, 0) / clientes.length)}
          </p>
          <p className="text-sm text-tertiary">Citas Promedio</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">85%</p>
          <p className="text-sm text-tertiary">Retención</p>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">Lista de Clientes</h3>
        </div>
        <div className="divide-y divide-secondary">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="p-6 hover:bg-secondary transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                    {cliente.avatar ? (
                      <img src={cliente.avatar} alt={cliente.nombre} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User01 className="h-6 w-6 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-primary">{cliente.nombre}</h4>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-tertiary">
                      <div className="flex items-center space-x-1">
                        <Mail01 className="h-4 w-4" />
                        <span>{cliente.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{cliente.telefono}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{cliente.totalCitas} citas</p>
                    <p className="text-xs text-tertiary">Última visita: {cliente.ultimaVisita}</p>
                  </div>
                  
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(
                      cliente.estado
                    )}`}
                  >
                    {cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Button color="tertiary" size="sm">
                      Ver Perfil
                    </Button>
                    <Button color="tertiary" size="sm" iconLeading={DotsHorizontal} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Clientes Recientes</h3>
          <div className="space-y-3">
            {clientes.slice(0, 3).map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                    <User01 className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">{cliente.nombre}</p>
                    <p className="text-xs text-tertiary">{cliente.ultimaVisita}</p>
                  </div>
                </div>
                <Button color="tertiary" size="sm">
                  Contactar
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button color="tertiary" size="sm" className="w-full justify-start">
              Enviar recordatorio de cita
            </Button>
            <Button color="tertiary" size="sm" className="w-full justify-start">
              Exportar lista de clientes
            </Button>
            <Button color="tertiary" size="sm" className="w-full justify-start">
              Importar clientes desde CSV
            </Button>
            <Button color="tertiary" size="sm" className="w-full justify-start">
              Configurar automatizaciones
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
