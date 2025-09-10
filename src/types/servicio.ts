export interface Servicio {
  id: string;
  usuarioId: string; // referencia al profesional que lo ofrece
  nombre: string;
  tipo: string;
  imagen?: string;
  categoria?: string;
  detalles?: string;
}
