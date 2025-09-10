export interface Cita {
  id: string;
  clienteId: string; // referencia a Cliente
  servicioId: string; // referencia a Servicio
  fechaRegistro: Date;
  fechaReservada: Date;
  notas?: string;
  estado: "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
}
