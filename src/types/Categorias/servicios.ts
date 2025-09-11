export const SERVICIOS: Record<string, { value: string; label: string }[]> = {
  // --- SALUD ---
  odontologia: [
    { value: "endodoncia", label: "Endodoncia" },
    { value: "ortodoncia", label: "Ortodoncia" },
    { value: "implantes", label: "Implantes" },
    { value: "blanqueamiento", label: "Blanqueamiento Dental" },
  ],
  medicina_general: [
    { value: "consulta", label: "Consulta General" },
    { value: "chequeo", label: "Chequeos Preventivos" },
    { value: "certificados", label: "Certificados Médicos" },
  ],
  dermatologia: [
    { value: "acne", label: "Tratamiento de Acné" },
    { value: "manchas", label: "Tratamiento de Manchas" },
    { value: "laser", label: "Láser Dermatológico" },
  ],
  oftalmologia: [
    { value: "examen_vista", label: "Examen de Vista" },
    { value: "lentes_contacto", label: "Lentes de Contacto" },
    { value: "cirugia_refractiva", label: "Cirugía Refractiva" },
  ],

  // --- BIENESTAR ---
  masajes: [
    { value: "relajante", label: "Relajante" },
    { value: "descontracturante", label: "Descontracturante" },
    { value: "terapeutico", label: "Terapéutico" },
  ],
  terapias: [
    { value: "acupuntura", label: "Acupuntura" },
    { value: "aromaterapia", label: "Aromaterapia" },
    { value: "reiki", label: "Reiki" },
  ],
  spa: [
    { value: "facial", label: "Tratamientos Faciales" },
    { value: "corporal", label: "Tratamientos Corporales" },
    { value: "hidroterapia", label: "Hidroterapia" },
  ],

  // --- BELLEZA ---
  maquillaje: [
    { value: "social", label: "Social" },
    { value: "novias", label: "Novias" },
    { value: "editorial", label: "Editorial" },
    { value: "cejas", label: "Cejas" },
  ],
  manicure: [
    { value: "clasico", label: "Clásico" },
    { value: "gel", label: "Gel" },
    { value: "acrilico", label: "Acrílico" },
  ],
  pedicure: [
    { value: "clasico", label: "Clásico" },
    { value: "spa", label: "Spa" },
    { value: "medico", label: "Médico" },
  ],
  pestanias: [
    { value: "clasicas", label: "Clásicas" },
    { value: "volumen", label: "Volumen" },
    { value: "lifting", label: "Lifting" },
  ],
  depilacion: [
    { value: "cera", label: "Con Cera" },
    { value: "laser", label: "Láser" },
    { value: "hilo", label: "Con Hilo" },
  ],

  // --- FITNESS ---
  personal_trainer: [
    { value: "evaluacion", label: "Evaluación Física" },
    { value: "rutinas", label: "Rutinas Personalizadas" },
  ],
  yoga: [
    { value: "hatha", label: "Hatha Yoga" },
    { value: "vinyasa", label: "Vinyasa Yoga" },
    { value: "kundalini", label: "Kundalini Yoga" },
  ],
  pilates: [
    { value: "suelo", label: "Pilates en Suelo" },
    { value: "maquinas", label: "Pilates con Máquinas" },
  ],
  crossfit: [
    { value: "wod", label: "Entrenamiento WOD" },
    { value: "competencia", label: "Competencia" },
  ],

  // --- EDUCACIÓN ---
  clases_particulares: [
    { value: "matematicas", label: "Matemáticas" },
    { value: "fisica", label: "Física" },
    { value: "quimica", label: "Química" },
  ],
  idiomas: [
    { value: "ingles", label: "Inglés" },
    { value: "frances", label: "Francés" },
    { value: "aleman", label: "Alemán" },
  ],
  musica: [
    { value: "guitarra", label: "Guitarra" },
    { value: "piano", label: "Piano" },
    { value: "canto", label: "Canto" },
  ],
  tecnologia: [
    { value: "programacion", label: "Programación" },
    { value: "robotica", label: "Robótica" },
    { value: "ofimatica", label: "Ofimática" },
  ],

  // --- CONSULTORÍA ---
  legal: [
    { value: "civil", label: "Derecho Civil" },
    { value: "penal", label: "Derecho Penal" },
    { value: "laboral", label: "Derecho Laboral" },
  ],
  contable: [
    { value: "declaraciones", label: "Declaraciones de Renta" },
    { value: "auditoria", label: "Auditoría Financiera" },
  ],
  marketing: [
    { value: "digital", label: "Marketing Digital" },
    { value: "seo", label: "SEO & SEM" },
  ],
  gestion_empresarial: [
    { value: "estrategia", label: "Estrategia Empresarial" },
    { value: "procesos", label: "Optimización de Procesos" },
  ],

  // --- PSICOLOGÍA ---
  Asesoria: [
    { value: "individual", label: "Terapia Individual" },
    { value: "grupo", label: "Terapia de Grupo" },
  ],
  infantil: [
    { value: "evaluacion", label: "Evaluación Infantil" },
    { value: "juego", label: "Terapia de Juego" },
  ],
  organizacional: [
    { value: "coaching", label: "Coaching Organizacional" },
    { value: "seleccion", label: "Selección de Personal" },
  ],
  pareja: [
    { value: "terapia_pareja", label: "Terapia de Pareja" },
    { value: "mediacion", label: "Mediación Familiar" },
  ],

  // --- NUTRICIÓN ---
  clinica: [
    { value: "diabetes", label: "Control de Diabetes" },
    { value: "hipertension", label: "Hipertensión" },
  ],
  deportiva: [
    { value: "alto_rendimiento", label: "Alto Rendimiento" },
    { value: "suplementacion", label: "Suplementación" },
  ],
  N_infantil: [
    { value: "alimentacion", label: "Alimentación Infantil" },
    { value: "plan_escolar", label: "Plan Escolar Nutricional" },
  ],
  estetica: [
    { value: "perdida_peso", label: "Pérdida de Peso" },
    { value: "dieta_antiedad", label: "Dieta Anti-Edad" },
  ],

  // --- CREATIVO ---
  fotografia: [
    { value: "bodas", label: "Fotografía de Bodas" },
    { value: "productos", label: "Fotografía de Productos" },
    { value: "retratos", label: "Retratos" },
  ],
  diseno_grafico: [
    { value: "branding", label: "Branding" },
    { value: "redes", label: "Diseño para Redes Sociales" },
    { value: "impresos", label: "Diseño Impreso" },
  ],
  diseno_web: [
    { value: "landing", label: "Landing Pages" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "corporativa", label: "Web Corporativa" },
  ],
  diseno_moda: [
    { value: "asesoria", label: "Asesoría de Imagen" },
    { value: "patrones", label: "Diseño de Patrones" },
  ],

  // --- DESARROLLO ---
  web: [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "fullstack", label: "Fullstack" },
  ],
  mobile: [
    { value: "ios", label: "iOS" },
    { value: "android", label: "Android" },
    { value: "multiplataforma", label: "Multiplataforma" },
  ],
  software: [
    { value: "erp", label: "ERP" },
    { value: "crm", label: "CRM" },
    { value: "automatizacion", label: "Automatización" },
  ],

  // --- OTROS ---
  servicios_generales: [
    { value: "limpieza", label: "Limpieza" },
    { value: "mantenimiento", label: "Mantenimiento" },
  ],
  eventos: [
    { value: "organizacion", label: "Organización de Eventos" },
    { value: "decoracion", label: "Decoración" },
  ],
};



