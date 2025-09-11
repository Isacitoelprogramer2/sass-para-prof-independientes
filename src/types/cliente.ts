import { Ticket } from "./ticket";
import { Cita } from "./cita";

export interface Cliente {
  id: string;
  tipo: "HABITUAL" | "AMBULATORIO"; // diferenciación
  datos: {
    nombre: string;
    correo?: string;
    telefono?: string;
    estado: "ACTIVO" | "INACTIVO";
  };
  tickets?: Ticket[]; // solo habitual
  historialCitas?: Cita[];
}

