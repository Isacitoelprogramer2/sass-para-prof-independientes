"use client";

import { Plus, Edit01, Trash01, Image01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

export default function CatalogoPage() {
  const servicios = [
    {
      id: 1,
      nombre: "Corte de Cabello",
      descripcion: "Corte moderno y profesional adaptado a tu estilo",
      precio: "$25.00",
      duracion: "45 min",
      categoria: "Cabello",
      imagen: null,
    },
    {
      id: 2,
      nombre: "Peinado Completo",
      descripcion: "Peinado profesional para eventos especiales",
      precio: "$40.00",
      duracion: "1h 30min",
      categoria: "Cabello",
      imagen: null,
    },
    {
      id: 3,
      nombre: "Consulta Médica",
      descripcion: "Consulta general con especialista",
      precio: "$80.00",
      duracion: "30 min",
      categoria: "Salud",
      imagen: null,
    },
    {
      id: 4,
      nombre: "Masaje Terapéutico",
      descripcion: "Masaje relajante y terapéutico",
      precio: "$60.00",
      duracion: "1h",
      categoria: "Bienestar",
      imagen: null,
    },
  ];

  const categorias = ["Todos", "Cabello", "Salud", "Bienestar"];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Catálogo de Servicios</h1>
          <p className="mt-2 text-md text-tertiary">
            Gestiona tus servicios y presenta tu oferta a los clientes
          </p>
        </div>
        <Button size="sm" iconLeading={Plus}>
          Nuevo Servicio
        </Button>
      </div>


      {/* Estadísticas rápidas */}
      <div className="mt-8 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{servicios.length}</p>
          <p className="text-sm text-tertiary">Servicios Activos</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">$45</p>
          <p className="text-sm text-tertiary">Precio Promedio</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-sm text-tertiary">Categorías</p>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            color={categoria === "Todos" ? "secondary" : "tertiary"}
            size="sm"
            className="whitespace-nowrap"
          >
            {categoria}
          </Button>
        ))}
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-primary border border-secondary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen placeholder */}
            <div className="h-48 bg-secondary flex items-center justify-center">
              {servicio.imagen ? (
                <img src={servicio.imagen} alt={servicio.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Image01 className="h-12 w-12 text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-tertiary">Sin imagen</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-primary">{servicio.nombre}</h3>
                  <span className="inline-flex rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                    {servicio.categoria}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button color="tertiary" size="sm" iconLeading={Edit01} />
                  <Button color="tertiary" size="sm" iconLeading={Trash01} />
                </div>
              </div>
              
              <p className="text-sm text-tertiary mb-4 line-clamp-2">
                {servicio.descripcion}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-primary">{servicio.precio}</p>
                  <p className="text-sm text-tertiary">{servicio.duracion}</p>
                </div>
                <Button size="sm">
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      

      
    </div>
  );
}
