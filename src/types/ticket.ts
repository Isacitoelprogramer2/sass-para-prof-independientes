export interface Ticket {
  id: string;
  fechaIngreso: Date;
  descripcion: string;
  tipoUrgencia: "ALTA" | "MEDIA" | "BAJA";
  tipoContexto: "DURANTE_SERVICIO" | "POST_SERVICIO";
}
