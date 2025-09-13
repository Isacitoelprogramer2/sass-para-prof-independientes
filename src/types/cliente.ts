import { Ticket } from "./ticket";
import { Cita } from "./cita";

export interface Cliente {
  id: string;
  usuarioId: string; // ID del usuario propietario del cliente
  tipo: "HABITUAL" | "AMBULATORIO"; // diferenciación para cliente recurrente o esporádico
  datos: {
    nombre: string;
    correo?: string; // Campo opcional
    telefono: string; // Campo obligatorio
    estado: "ACTIVO" | "INACTIVO"; //depende si esta siendo atendido actualmente
  };
  tickets?: Ticket[]; // tickets asociados al cliente
  historialCitas?: Cita[]; // historial de citas del cliente
}

