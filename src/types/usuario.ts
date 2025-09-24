export interface Usuario {
  id: string;
  datosProfesional: {
    nombres: string;
    profesion: string;
    fotoPerfil?: string;
    experiencia?: string;
    provincia?: string;
    pais?: string;
  };
  datosNegocio: {
    nombre?: string; // puede ser distinto al nombre del profesional
    descripcion: string;
    colorMarca?: string;
    redesSociales?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      otro?: string;
    };
    informacionContacto: {
      telefono: string;
      correo: string;
    };
    fotoPortada?: string;
    horarioAtencion: string; // ejemplo: "Lun-Vie 9:00-18:00"
    ubicacion?: string;
    categoria: string;      // Ejemplo: "Salud"
    subcategoria: string;   // Ejemplo: "Odontología"
  };
  datosCuenta: {
    plan: "BASICO" | "PREMIUM";
  };
}

