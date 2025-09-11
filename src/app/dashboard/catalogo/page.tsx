"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit01, Trash01, Image01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useServicios } from "@/hooks/use-servicios";
import { ModalConfirmacionEliminar } from "@/components/application/modals/modal-confirmacion-eliminar";

export default function CatalogoPage() {
  const router = useRouter();
  const { servicios, loading, eliminarServicio, saving } = useServicios();
  const [servicioEliminando, setServicioEliminando] = useState<string | null>(null);
  
  /**
   * Estado del modal de confirmación de eliminación
   */
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState<{id: string, nombre: string} | null>(null);

  /**
   * Navegación hacia página de creación de servicio
   */
  const handleNuevoServicio = () => {
    router.push('/dashboard/catalogo/servicio');
  };

  /**
   * Navegación hacia página de edición de servicio
   */
  const handleEditarServicio = (servicioId: string) => {
    if (!servicioId) {
      console.error('ID de servicio no válido');
      alert('Error: ID de servicio no válido');
      return;
    }
    router.push(`/dashboard/catalogo/servicio?id=${encodeURIComponent(servicioId)}`);
  };

  /**
   * Abrir modal de confirmación para eliminar servicio
   */
  const handleEliminarServicio = (servicioId: string, nombreServicio: string) => {
    setServicioAEliminar({ id: servicioId, nombre: nombreServicio });
    setModalEliminarAbierto(true);
  };

  /**
   * Confirmar eliminación del servicio
   */
  const confirmarEliminacion = async () => {
    if (!servicioAEliminar) return;

    try {
      setServicioEliminando(servicioAEliminar.id);
      await eliminarServicio(servicioAEliminar.id);
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      alert('Error al eliminar el servicio. Por favor intenta nuevamente.');
    } finally {
      setServicioEliminando(null);
      setServicioAEliminar(null);
    }
  };

  /**
   * Cerrar modal de confirmación
   */
  const cerrarModalEliminar = () => {
    setModalEliminarAbierto(false);
    setServicioAEliminar(null);
  };

  /**
   * Filtrar servicios por categoría
   */
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos');
  
  const serviciosFiltrados = servicios.filter(servicio => {
    if (categoriaSeleccionada === 'todos') return true;
    return servicio.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase();
  });

  // Obtener categorías únicas de los servicios
  const categoriasUnicas = Array.from(
    new Set(servicios.map(s => s.categoria).filter(Boolean))
  );
  const categorias = ['todos', ...categoriasUnicas];

  // Calcular estadísticas
  const precioPromedio = servicios.length > 0 
    ? servicios.reduce((sum, s) => sum + s.precio, 0) / servicios.length 
    : 0;

  // Estado de carga
  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header con botones de acción */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Catálogo de Servicios</h1>
          <p className="mt-2 text-md text-tertiary">
            Gestiona tus servicios y presenta tu oferta a los clientes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            iconLeading={Plus}
            onClick={handleNuevoServicio}
          >
            Nuevo servicio
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-8 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{servicios.length}</p>
          <p className="text-sm text-tertiary">Servicios Activos</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            S/{precioPromedio.toFixed(2)}
          </p>
          <p className="text-sm text-tertiary">Precio Promedio</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{categoriasUnicas.length}</p>
          <p className="text-sm text-tertiary">Categorías</p>
        </div>
      </div>

      {/* Filtros por categoría */}
      {categorias.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              color={categoria === categoriaSeleccionada ? "primary" : "tertiary"}
              size="sm"
              className="whitespace-nowrap capitalize"
              onClick={() => setCategoriaSeleccionada(categoria || 'todos')}
            >
              {categoria === 'todos' ? 'Todos' : categoria}
            </Button>
          ))}
        </div>
      )}

      {/* Contenido principal */}
      {serviciosFiltrados.length === 0 ? (
        // Estado vacío
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Image01 className="h-12 w-12 text-tertiary" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            {servicios.length === 0 ? 'No tienes servicios aún' : 'No hay servicios en esta categoría'}
          </h3>
          <p className="text-tertiary mb-6">
            {servicios.length === 0 
              ? 'Crea tu primer servicio para comenzar a gestionar tu catálogo'
              : 'Prueba con otra categoría o agrega un nuevo servicio'
            }
          </p>
          {servicios.length === 0 && (
            <Button onClick={handleNuevoServicio} iconLeading={Plus}>
              Crear primer servicio
            </Button>
          )}
        </div>
      ) : (
        // Grid de servicios
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviciosFiltrados.map((servicio) => (
            <div 
              key={servicio.id} 
              className="bg-primary border border-secondary rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen del servicio */}
              <div className="h-48 bg-secondary flex items-center justify-center">
                {servicio.imagen ? (
                  <img 
                    src={servicio.imagen} 
                    alt={servicio.nombre} 
                    className="w-full h-full object-cover" 
                  />
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
                    {servicio.categoria && (
                      <span className="inline-flex rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 capitalize">
                        {servicio.categoria}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      color="tertiary" 
                      size="sm" 
                      iconLeading={Edit01}
                      onClick={() => handleEditarServicio(servicio.id)}
                      title="Editar servicio"
                    />
                    <Button 
                      color="tertiary" 
                      size="sm" 
                      iconLeading={Trash01}
                      onClick={() => handleEliminarServicio(servicio.id, servicio.nombre)}
                      isDisabled={servicioEliminando === servicio.id}
                      title="Eliminar servicio"
                    />
                  </div>
                </div>
                
                {servicio.detalles && (
                  <p className="text-sm text-tertiary mb-4 line-clamp-2">
                    {servicio.detalles}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      S/{servicio.precio.toFixed(2)}
                    </p>
                    <p className="text-sm text-tertiary capitalize">{servicio.tipo}</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleEditarServicio(servicio.id)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar servicio */}
      <ModalConfirmacionEliminar
        isOpen={modalEliminarAbierto}
        onClose={cerrarModalEliminar}
        onConfirm={confirmarEliminacion}
        nombreServicio={servicioAEliminar?.nombre || ""}
        isLoading={servicioEliminando === servicioAEliminar?.id}
      />
    </div>
  );
}
