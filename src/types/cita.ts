export interface Cita {
  id: string;
  codigoAcceso: string; // código único generado automáticamente
  clienteId?: string;   // si es HABITUAL
  clienteAmbulatorio?: {
    nombre: string;
    telefono?: string;
  }; // si es AMBULATORIO
  servicioId: string;
  fechaRegistro: Date;
  fechaReservada: Date;
  notas?: string;
  estado: "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
}

