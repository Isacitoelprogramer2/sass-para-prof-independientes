"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "./modal";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Form } from "@/components/base/form/form";
import { User01 } from "@untitledui/icons";

// Tipos fuertes para los datos del cliente
export type ClienteFormData = {
  nombre: string;
  correo?: string; // Campo opcional
  telefono: string; // Campo obligatorio
  tipo: "HABITUAL" | "AMBULATORIO";
  estado: "ACTIVO" | "INACTIVO";
};

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClienteFormData) => void;
  initialData?: ClienteFormData;
}

// Función para validar los datos del cliente
function validate(data: ClienteFormData) {
  const errors: { nombre?: string; correo?: string; telefono?: string } = {};
  
  // Validar nombre (obligatorio)
  if (!data.nombre.trim()) {
    errors.nombre = "No puede estar vacío";
  }
  
  // Validar teléfono (obligatorio)
  if (!data.telefono?.trim()) {
    errors.telefono = "No puede estar vacío";
  }
  
  // Validar correo (opcional, pero si se proporciona debe ser válido)
  if (data.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
    errors.correo = "Correo inválido";
  }
  
  return errors;
}

export function ClienteModal({ isOpen, onClose, onSave, initialData }: ClienteModalProps) {
  const [form, setForm] = useState<ClienteFormData>({
    nombre: "",
    correo: "",
    telefono: "",
    tipo: "HABITUAL",
    estado: "ACTIVO",
  });

  const [errors, setErrors] = useState<{ nombre?: string; correo?: string; telefono?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setIsSubmitting(false);
    setForm(
      initialData ?? {
        nombre: "",
        correo: "",
        telefono: "",
        tipo: "HABITUAL",
        estado: "ACTIVO",
      }
    );
  }, [isOpen, initialData]);

  const onChangeField = (field: keyof ClienteFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    
    // Crear objeto base con campos obligatorios
    const clienteData: ClienteFormData = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      tipo: form.tipo,
      estado: form.estado,
    };
    
    // Agregar correo solo si tiene valor
    if (form.correo?.trim()) {
      clienteData.correo = form.correo.trim();
    }
    
    onSave(clienteData);
    setIsSubmitting(false);
    onClose();
  };

  return (
  <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
    <ModalOverlay isDismissable>
      <Modal /* ojo: aquí no ponemos overflow/rounded, lo hacemos en el contenedor interno */ className="w-full max-w-3xl">
        <Dialog className="w-full">
          {/* CONTENEDOR REAL DEL PANEL */}
          <div className="relative isolate w-full overflow-hidden rounded-2xl bg-primary shadow-2xl">
            {/* GRID: sidebar (md) + body */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

              {/* SIDEBAR / HEADER */}
              <aside className="hidden md:block border-r border-secondary/60 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-secondary/30 grid place-items-center">
                    {/* icono */}
                    <User01 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {initialData ? "Editar cliente" : "Nuevo cliente"}
                    </h3>
                    <p className="mt-1 text-sm text-tertiary">
                      {initialData ? "Edita la informacion del cliente" : "Crea un nuevo cliente para tu agenda."}
                    </p>
                  </div>
                </div>
              </aside>

              {/* BODY + FOOTER */}
              <div className="flex flex-col">
                {/* HEADER compacto para mobile */}
                <div className="md:hidden px-6 pb-4 pt-5 border-b border-secondary/60">
                  <h3 className="text-base font-semibold">
                    {initialData ? "Editar cliente" : "Nuevo cliente"}
                  </h3>
                  <p className="mt-1 text-sm text-tertiary">
                    Comparte la información básica del cliente.
                  </p>
                </div>

                {/* FORM scrollable */}
                <Form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="px-6 py-6 space-y-8 max-h-[min(78vh,720px)] overflow-auto">
                    {/* --- Datos del cliente --- */}
                    <section>
                      <h4 className="text-sm font-medium text-secondary">Datos del cliente</h4>
                      <p className="text-xs text-tertiary mt-1">
                        Nombre, contacto y medios preferidos.
                      </p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          label="Nombre"
                          placeholder="Nombre completo"
                          value={form.nombre}
                          isRequired
                          isInvalid={!!errors.nombre}
                          onChange={(v) => onChangeField("nombre", String(v))}
                          hint={errors.nombre}
                        />
                        <Input
                          label="Teléfono"
                          placeholder="+1 (555) 000-0000"
                          value={form.telefono}
                          isRequired
                          isInvalid={!!errors.telefono}
                          onChange={(v) => onChangeField("telefono", String(v))}
                          hint={errors.telefono}
                        />
                        <Input
                          className="md:col-span-2"
                          label="Correo"
                          placeholder="correo@ejemplo.com"
                          value={form.correo}
                          type="email"
                          isInvalid={!!errors.correo}
                          onChange={(v) => onChangeField("correo", String(v))}
                          hint={errors.correo}
                        />
                      </div>
                    </section>

                    <hr className="border-secondary/50" />

                    {/* --- Configuración --- */}
                    <section>
                      <h4 className="text-sm font-medium text-secondary">Configuración</h4>
                      <p className="text-xs text-tertiary mt-1">
                        Define el tipo de cliente y su estado actual.
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-6">

                        <div>
                          <p className="text-xs font-medium text-secondary mb-2">Tipo de cliente</p>
                          <RadioGroup
                            aria-label="Tipo de cliente"
                            value={form.tipo}
                            onChange={(v) => onChangeField("tipo", String(v))}
                            className="grid grid-cols-2 gap-3"
                          >
                            <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                              <RadioButton value="HABITUAL" label="Habitual" />
                              <p className="text-[11px] text-tertiary mt-1">Visitas recurrentes.</p>
                            </div>
                            <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                              <RadioButton value="AMBULATORIO" label="Ambulatorio" />
                              <p className="text-[11px] text-tertiary mt-1">Atenciones puntuales.</p>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-secondary mb-2">Estado</p>
                          <RadioGroup
                            aria-label="Estado del cliente"
                            value={form.estado}
                            onChange={(v) => onChangeField("estado", String(v))}
                            className="grid grid-cols-2 gap-3"
                          >
                            <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                              <RadioButton value="ACTIVO" label="Activo" />
                              <p className="text-[11px] text-tertiary mt-1">Disponible para agendar.</p>
                            </div>
                            <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                              <RadioButton value="INACTIVO" label="Inactivo" />
                              <p className="text-[11px] text-tertiary mt-1">No disponible temporalmente.</p>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* FOOTER (sticky dentro del panel real) */}
                  <div className="sticky bottom-0 bg-primary/95 backdrop-blur border-t border-secondary/60 px-6 py-4 flex items-center justify-end gap-3">
                    <Button color="tertiary" size="sm" type="button" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" size="sm" type="submit" isLoading={isSubmitting}>
                      {initialData ? "Guardar cambios" : "Crear cliente"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  </DialogTrigger>
);
}

