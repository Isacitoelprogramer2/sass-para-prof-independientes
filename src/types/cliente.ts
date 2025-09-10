import { Ticket } from "./ticket";
import { Cita } from "./cita";

export interface Cliente {
  id: string;
  datos: {
    nombre: string;
    correo: string;
    telefono: string;
    estado: "ACTIVO" | "INACTIVO";
  };
  tickets: Ticket[];
  historialCitas: Cita[];
}
