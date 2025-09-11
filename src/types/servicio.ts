export interface Servicio {
  id: string;
  usuarioId: string; // referencia al profesional que lo ofrece
  nombre: string;
  tipo: string;
  imagen?: string;
  categoria?: string;
  servicio?: string;
  detalles?: string;
  precio: number; // en la moneda definida (ejemplo soles o dólares)
}
