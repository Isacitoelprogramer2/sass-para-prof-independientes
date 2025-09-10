export interface Usuario {
  id: string;
  datosProfesional: {
    nombres: string;
    profesion: string;
    fotoPerfil?: string;
    experiencia?: string;
  };
  datosNegocio: {
    nombre?: string; // puede ser distinto al nombre del profesional
    descripcion: string;
    colorMarca?: string;
    informacionContacto: {
      telefono: string;
      correo: string;
    };
    fotoPortada?: string;
    horarioAtencion: string; // ejemplo: "Lun-Vie 9:00-18:00"
    ubicacion?: string;
  };
  datosCuenta: {
    plan: "BASICO" | "PREMIUM";
  };
}
