export interface Ticket {
  id: string;
  numero: string; // Numeración con formato #000000
  titulo: string;
  clienteId: string;
  estado: "ABIERTO" | "EN_PROGRESO" | "CERRADO";
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  asignadoA: string; // ID del usuario asignado
  fechaIngreso: Date;
  descripcion: string;
  tipoContexto: "DURANTE_SERVICIO" | "POST_SERVICIO";
  // Datos de contacto para clientes ambulatorios
  clienteContacto?: {
    nombre: string;
    telefono: string;
    email?: string;
  };
}
