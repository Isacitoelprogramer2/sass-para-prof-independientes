"use client";

import { TrendUp01, Users01, Calendar, CurrencyDollar } from "@untitledui/icons";

export default function InicioPage() {
  const stats = [
    {
      name: "Citas Hoy",
      value: "8",
      icon: Calendar,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Clientes Activos", 
      value: "127",
      icon: Users01,
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      name: "Ingresos del Mes",
      value: "$12,450",
      icon: CurrencyDollar,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      name: "Crecimiento",
      value: "15%",
      icon: TrendUp01,
      change: "+3%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-display-xs font-semibold text-primary">Dashboard</h1>
        <p className="mt-2 text-md text-tertiary">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-primary border border-secondary rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tertiary">{stat.name}</p>
                <p className="text-display-xs font-semibold text-primary">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                <stat.icon className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-success-700">
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-tertiary">vs último mes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Próximas Citas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-primary">María García</p>
                <p className="text-sm text-tertiary">Corte y peinado</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">10:00 AM</p>
                <p className="text-xs text-tertiary">Hoy</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-primary">Carlos López</p>
                <p className="text-sm text-tertiary">Consulta</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">2:30 PM</p>
                <p className="text-xs text-tertiary">Hoy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary border border-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-primary">Nueva cita programada</p>
                <p className="text-xs text-tertiary">hace 2 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-primary">Cliente actualizado</p>
                <p className="text-xs text-tertiary">hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-primary">Cita cancelada</p>
                <p className="text-xs text-tertiary">hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
