export interface Ticket {
  id: string;
  titulo: string;
  clienteId: string;
  estado: "ABIERTO" | "EN_PROGRESO" | "CERRADO";
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  asignadoA: string; // ID del usuario asignado
  fechaIngreso: Date;
  descripcion: string;
  tipoContexto: "DURANTE_SERVICIO" | "POST_SERVICIO";
}
