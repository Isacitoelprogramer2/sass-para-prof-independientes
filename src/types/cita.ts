export interface Cita {
  id: string;
  usuarioId: string; // ID del usuario propietario de la cita
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
  pagado?: boolean;
  // Nuevo: manejo de precios
  precioTipo?: 'ESTANDAR' | 'PERSONALIZADO';
  precioFinal?: number; // el precio que se cobrará (estándar o personalizado)
  precioPersonalizado?: number; // sólo si precioTipo === 'PERSONALIZADO'
}

