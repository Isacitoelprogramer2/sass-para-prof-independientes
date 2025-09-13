"use client";

// Página de gestión de clientes
// Se añade un modal controlado desde el componente padre para crear/editar clientes

import { useMemo, useState } from "react";
import { Plus, SearchLg, Mail01, Phone, User01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { ClienteModal, type ClienteFormData } from "@/components/application/modals";
import { ModalConfirmacionEliminar } from "@/components/application/modals/modal-confirmacion-eliminar";
import { ModalPerfilCliente } from "@/components/application/modals/modal-perfil-cliente";
import { useClientes } from "@/hooks/use-clientes";
import { Cliente } from "@/types/cliente";

// Función para transformar Cliente de Firebase a estructura de vista
function transformarClienteParaVista(cliente: Cliente, calcularTotalCitas: (c: Cliente) => number, obtenerUltimaVisita: (c: Cliente) => string | undefined) {
  return {
    id: cliente.id,
    nombre: cliente.datos.nombre,
    email: cliente.datos.correo,
    telefono: cliente.datos.telefono,
    ultimaVisita: obtenerUltimaVisita(cliente),
    totalCitas: calcularTotalCitas(cliente),
    estado: cliente.datos.estado === "ACTIVO" ? "activo" : "inactivo" as "activo" | "inactivo",
    avatar: null,
    clienteOriginal: cliente, // Guardamos referencia al cliente original
  };
}

// Tipo para la vista de clientes en la tabla
type ClienteVista = ReturnType<typeof transformarClienteParaVista>;

export default function ClientesPage() {
  // Hook para gestionar clientes desde Firebase
  const { 
    clientes: clientesFirebase, 
    loading, 
    saving, 
    crearCliente, 
    actualizarCliente,
    eliminarCliente,
    calcularTotalCitas,
    obtenerUltimaVisita 
  } = useClientes();

  // Estado para la búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "inactivos">("todos");

  // Transformar clientes de Firebase para la vista
  const clientesVista = useMemo(() => {
    return clientesFirebase.map(cliente => 
      transformarClienteParaVista(cliente, calcularTotalCitas, obtenerUltimaVisita)
    );
  }, [clientesFirebase, calcularTotalCitas, obtenerUltimaVisita]);

  // Filtrar clientes según término de búsqueda y filtro de estado
  const clientesFiltrados = useMemo(() => {
    let clientesFiltrados = clientesVista;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const termino = searchTerm.toLowerCase().trim();
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.nombre.toLowerCase().includes(termino) ||
        (cliente.email && cliente.email.toLowerCase().includes(termino)) ||
        (cliente.telefono && cliente.telefono.includes(termino))
      );
    }

    // Filtrar por estado
    if (filtroEstado !== "todos") {
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.estado === filtroEstado.slice(0, -1) // "activos" -> "activo", "inactivos" -> "inactivo"
      );
    }

    return clientesFiltrados;
  }, [clientesVista, searchTerm, filtroEstado]);

  // Estado del modal y el cliente en edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado del modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingNombre, setDeletingNombre] = useState<string>("");
  
  // Estado del modal de perfil de cliente
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [clientePerfil, setClientePerfil] = useState<Cliente | null>(null);

  // Datos iniciales para el modal cuando se edita
  const initialData: ClienteFormData | undefined = useMemo(() => {
    if (editingId == null) return undefined;
    const current = clientesVista.find((c) => c.id === editingId);
    if (!current) return undefined;
    return {
      nombre: current.nombre,
      correo: current.email || undefined,
      telefono: current.telefono || "", // Asegurar que telefono tenga un valor
      // mapear del cliente original de Firebase
      tipo: current.clienteOriginal.tipo,
      estado: current.clienteOriginal.datos.estado,
    };
  }, [editingId, clientesVista]);

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Abrir modal de confirmación de eliminación
  const openDeleteModal = (id: string, nombre: string) => {
    setDeletingId(id);
    setDeletingNombre(nombre);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
    setDeletingNombre("");
  };

  // Confirmar eliminación del cliente
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await eliminarCliente(deletingId);
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  };

  // Abrir modal de perfil de cliente
  const openPerfilModal = (clienteId: string) => {
    const cliente = clientesFirebase.find(c => c.id === clienteId);
    if (cliente) {
      setClientePerfil(cliente);
      setIsPerfilModalOpen(true);
    }
  };

  // Cerrar modal de perfil de cliente
  const closePerfilModal = () => {
    setIsPerfilModalOpen(false);
    setClientePerfil(null);
  };

  // Función para manejar cambios en el término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Función para manejar cambios en el filtro de estado
  const handleFiltroChange = (filtro: "todos" | "activos" | "inactivos") => {
    setFiltroEstado(filtro);
  };

  // Guardar (crear o actualizar) desde el modal
  const handleSave = async (data: ClienteFormData) => {
    try {
      if (editingId) {
        // Crear objeto de datos para actualización
        const datosActualizacion: any = {
          datos: {
            nombre: data.nombre,
            telefono: data.telefono,
            estado: data.estado,
          },
          tipo: data.tipo,
        };
        
        // Agregar correo solo si tiene valor
        if (data.correo) {
          datosActualizacion.datos.correo = data.correo;
        }
        
        // Actualizar cliente existente
        await actualizarCliente(editingId, datosActualizacion);
      } else {
        // Crear objeto de datos para nuevo cliente
        const datosNuevoCliente: any = {
          tipo: data.tipo,
          datos: {
            nombre: data.nombre,
            telefono: data.telefono,
            estado: data.estado,
          },
          tickets: [],
          historialCitas: [],
        };
        
        // Agregar correo solo si tiene valor
        if (data.correo) {
          datosNuevoCliente.datos.correo = data.correo;
        }
        
        // Crear nuevo cliente
        await crearCliente(datosNuevoCliente);
      }
      
      // Cerrar modal después de guardar exitosamente
      closeModal();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100/30 text-success-200 border-success-200/30";
      case "inactivo":
        return "bg-gray-150 text-gray-400 border-gray-400";
      default:
        return "bg-gray-150 text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary">Gestión de Clientes</h1>
          <p className="mt-2 text-md text-tertiary">
            Administra la información de tus clientes y su historial
          </p>
        </div>
        {/* Acción: abrir modal de creación (estado controlado en el padre) */}
        <Button size="sm" iconLeading={Plus} onClick={openCreateModal}>
          Nuevo Cliente
        </Button>
      </div>

      

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{clientesFiltrados.length}</p>
          <p className="text-sm text-tertiary">Clientes mostrados</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{clientesVista.length}</p>
          <p className="text-sm text-tertiary">Total Clientes</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {clientesVista.filter(c => c.estado === "activo").length}
          </p>
          <p className="text-sm text-tertiary">Activos</p>
        </div>
        <div className="bg-primary border border-secondary rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {clientesFiltrados.length > 0 ? Math.round(clientesFiltrados.reduce((acc, c) => acc + c.totalCitas, 0) / clientesFiltrados.length) : 0}
          </p>
          <p className="text-sm text-tertiary">Citas promedio</p>
        </div>
      </div>

      
      {/* Búsqueda y filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

         {/* Filtros */}       
        <div className="flex gap-2">
          <Button 
            color={filtroEstado === "todos" ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => handleFiltroChange("todos")}
          >
            Todos
          </Button>
          <Button 
            color={filtroEstado === "activos" ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => handleFiltroChange("activos")}
          >
            Activos
          </Button>
          <Button 
            color={filtroEstado === "inactivos" ? "secondary" : "tertiary"} 
            size="sm"
            onClick={() => handleFiltroChange("inactivos")}
          >
            Inactivos
          </Button>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar clientes..."
            icon={SearchLg}
            size="sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>


      {/* Lista de clientes */}
      <div className="bg-primary border border-secondary rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary">
          <h3 className="text-lg font-semibold text-primary">Lista de Clientes</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-tertiary">
            Cargando clientes...
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="p-6 text-center text-tertiary">
            {searchTerm || filtroEstado !== "todos" 
              ? "No se encontraron clientes con los criterios de búsqueda." 
              : "No hay clientes registrados aún. ¡Crea tu primer cliente!"
            }
          </div>
        ) : (
          <div className="divide-y divide-secondary">
            {clientesFiltrados.map((cliente) => (
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
                      <p className="text-xs text-tertiary">Última visita: {cliente.ultimaVisita || 'Nunca'}</p>
                    </div>
                    
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(
                        cliente.estado
                      )}`}
                    >
                      {cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <Button color="tertiary" size="sm" onClick={() => openPerfilModal(cliente.id)}>
                        Ver Perfil
                      </Button>
                      <Button color="tertiary" size="sm" onClick={() => openEditModal(cliente.id)}>
                        Editar
                      </Button>
                      <Button 
                        color="primary-destructive" 
                        size="sm" 
                        iconLeading={Trash01}
                        onClick={() => openDeleteModal(cliente.id, cliente.nombre)}
                      >
                        
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación usando componente reutilizable */}
      <ModalConfirmacionEliminar
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        nombreElemento={deletingNombre}
        tipoElemento="cliente"
        isLoading={saving}
      />

      {/* Modal de Perfil de Cliente */}
      <ModalPerfilCliente
        isOpen={isPerfilModalOpen}
        onClose={closePerfilModal}
        cliente={clientePerfil}
      />

      {/* Modal de Crear/Editar Cliente en la capa superior de la jerarquía */}
      <ClienteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={initialData}
      />
    </div>
  );
}
