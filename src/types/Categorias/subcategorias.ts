export interface SubcategoriaType {
  id: string;
  value: string;
  label: string;
}

export const SUBCATEGORIAS: Record<string, SubcategoriaType[]> = {
  salud: [
  { id: "odontologia", value: "odontologia", label: "Odontología" },
  { id: "medicina_general", value: "medicina_general", label: "Medicina General" },
  { id: "dermatologia", value: "dermatologia", label: "Dermatología" },
  { id: "oftalmologia", value: "oftalmologia", label: "Oftalmología" },
  ],
  bienestar: [
  { id: "masajes", value: "masajes", label: "Masajes" },
  { id: "terapias", value: "terapias", label: "Terapias Alternativas" },
  { id: "spa", value: "spa", label: "Spa" },
  ],
  belleza: [
  { id: "maquillaje", value: "maquillaje", label: "Maquillaje" },
  { id: "manicure", value: "manicure", label: "Manicure" },
  { id: "pedicure", value: "pedicure", label: "Pedicure" },
  { id: "pestanias", value: "pestanias", label: "Pestañas" },
  { id: "depilacion", value: "depilacion", label: "Depilación" },
  ],
  fitness: [
  { id: "personal_trainer", value: "personal_trainer", label: "Entrenador Personal" },
  { id: "yoga", value: "yoga", label: "Yoga" },
  { id: "pilates", value: "pilates", label: "Pilates" },
  { id: "crossfit", value: "crossfit", label: "Crossfit" },
  ],
  educacion: [
  { id: "clases_particulares", value: "clases_particulares", label: "Clases Particulares" },
  { id: "idiomas", value: "idiomas", label: "Idiomas" },
  { id: "matematicas", value: "matematicas", label: "Matemáticas" },
  { id: "musica", value: "musica", label: "Música" },
  { id: "tecnologia", value: "tecnologia", label: "Tecnología" },
  ],
  consultoria: [
  { id: "legal", value: "legal", label: "Legal" },
  { id: "contable", value: "contable", label: "Contable" },
  { id: "marketing", value: "marketing", label: "Marketing" },
  { id: "gestion_empresarial", value: "gestion_empresarial", label: "Gestión Empresarial" },
  ],
  psicologia: [
  { id: "clinica", value: "clinica", label: "Psicología Clínica" },
  { id: "infantil", value: "infantil", label: "Psicología Infantil" },
  { id: "organizacional", value: "organizacional", label: "Psicología Organizacional" },
  { id: "pareja", value: "pareja", label: "Terapia de Pareja" },
  ],
  nutricion: [
  { id: "clinica", value: "clinica", label: "Nutrición Clínica" },
  { id: "deportiva", value: "deportiva", label: "Nutrición Deportiva" },
  { id: "infantil", value: "infantil", label: "Nutrición Infantil" },
  { id: "estetica", value: "estetica", label: "Nutrición Estética" },
  ],
  creativo: [
  { id: "fotografia", value: "fotografia", label: "Fotografía" },
  { id: "diseno_grafico", value: "diseno_grafico", label: "Diseño Gráfico" },
  { id: "diseno_web", value: "diseno_web", label: "Diseño Web" },
  { id: "diseno_moda", value: "diseno_moda", label: "Diseño de Moda" },
  ],
  desarrollo: [
  { id: "web", value: "web", label: "Desarrollo Web" },
  { id: "mobile", value: "mobile", label: "Desarrollo Móvil" },
  { id: "software", value: "software", label: "Desarrollo de Software" },
  ],
  otros: [
  { id: "servicios_generales", value: "servicios_generales", label: "Servicios Generales" },
  { id: "eventos", value: "eventos", label: "Eventos" },
  ],
};

