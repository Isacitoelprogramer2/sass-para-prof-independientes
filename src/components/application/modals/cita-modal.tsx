"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "./modal";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Form } from "@/components/base/form/form";
import { TextArea } from "@/components/base/textarea/textarea";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Calendar, X } from "@untitledui/icons";
import { useClientes } from "@/hooks/use-clientes";
import { useServicios } from "@/hooks/use-servicios";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

// Tipos para los datos del formulario de cita
export type CitaFormData = {
  tipoCliente: "HABITUAL" | "AMBULATORIO";
  clienteId?: string; // para clientes habituales
  clienteAmbulatorio?: {
    nombre: string;
    telefono?: string;
  }; // para clientes ambulatorios
  servicioId: string;
  fechaReservada: Date;
  notas?: string;
  estado: "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
  // Nuevo: manejo de tipo de precio
  precioTipo?: 'ESTANDAR' | 'PERSONALIZADO';
  precioPersonalizado?: number;
};

interface CitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CitaFormData) => void;
  initialData?: CitaFormData;
}

/**
 * Función para validar los datos de la cita
 */
function validate(data: CitaFormData) {
  const errors: { 
    clienteId?: string; 
    clienteAmbulatorio?: { nombre?: string };
    servicioId?: string; 
    fechaReservada?: string;
  } = {};
  
  // Validar cliente según el tipo
  if (data.tipoCliente === "HABITUAL" && !data.clienteId) {
    errors.clienteId = "Debe seleccionar un cliente";
  }
  
  if (data.tipoCliente === "AMBULATORIO") {
    if (!data.clienteAmbulatorio?.nombre?.trim()) {
      errors.clienteAmbulatorio = { nombre: "El nombre es obligatorio" };
    }
  }
  
  // Validar servicio (obligatorio)
  if (!data.servicioId) {
    errors.servicioId = "Debe seleccionar un servicio";
  }
  
  // Validar fecha (obligatoria y no puede ser anterior a hoy)
  if (!data.fechaReservada) {
    errors.fechaReservada = "La fecha y hora son obligatorias";
  } else {
    const hoy = new Date();
    const fechaSeleccionada = new Date(data.fechaReservada);
    
    if (fechaSeleccionada < hoy) {
      errors.fechaReservada = "La fecha y hora no pueden ser anteriores a ahora";
    }
  }
  
  return errors;
}

export function CitaModal({ isOpen, onClose, onSave, initialData }: CitaModalProps) {
  // Estados del formulario
  const [form, setForm] = useState<CitaFormData>({
    tipoCliente: "HABITUAL",
    servicioId: "",
    fechaReservada: new Date(),
    estado: "PENDIENTE",
  });

  // Estado para el DatePicker
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(today(getLocalTimeZone()));
  
  // Estados para los selects controlados
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [selectedServicioId, setSelectedServicioId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [errors, setErrors] = useState<{ 
    clienteId?: string; 
    clienteAmbulatorio?: { nombre?: string };
    servicioId?: string; 
    fechaReservada?: string;
    precioPersonalizado?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks para obtener datos de clientes y servicios
  const { clientes, loading: loadingClientes } = useClientes();
  const { servicios, loading: loadingServicios } = useServicios();

  /**
   * Efecto para resetear el formulario cuando se abre/cierra el modal
   */
  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setIsSubmitting(false);
    
    if (initialData) {
      setForm(initialData);
      setSelectedClienteId(initialData.clienteId || "");
      setSelectedServicioId(initialData.servicioId || "");
      // precio
      setForm(prev => ({ ...prev, precioTipo: (initialData as any).precioTipo, precioPersonalizado: (initialData as any).precioPersonalizado }));
      
      // Convertir la fecha a CalendarDate para el DatePicker
      const calendarDate = new CalendarDate(
        initialData.fechaReservada.getFullYear(),
        initialData.fechaReservada.getMonth() + 1,
        initialData.fechaReservada.getDate()
      );
      setSelectedDate(calendarDate);
      
      // Inicializar la hora seleccionada
      const hours = initialData.fechaReservada.getHours().toString().padStart(2, '0');
      const minutes = initialData.fechaReservada.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    } else {
      const defaultForm = {
        tipoCliente: "HABITUAL" as const,
        servicioId: "",
        fechaReservada: new Date(),
        estado: "PENDIENTE" as const,
        precioTipo: 'ESTANDAR' as const,
      };
      setForm(defaultForm);
      setSelectedClienteId("");
      setSelectedServicioId("");
      setSelectedDate(today(getLocalTimeZone()));
      setSelectedTime("09:00"); // Hora por defecto
    }
  }, [isOpen, initialData]);

  /**
   * Función para actualizar campos del formulario
   */
  const onChangeField = (field: keyof CitaFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario corrige
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Función para manejar cambios en la fecha desde el DatePicker
   */
  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());
      // Mantener la hora seleccionada al cambiar la fecha
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        jsDate.setHours(hours, minutes, 0, 0);
      }
      onChangeField('fechaReservada', jsDate);
    }
  };

  /**
   * Función para manejar selección de cliente
   */
  const handleClienteSelection = (key: any) => {
    const id = String(key || "");
    setSelectedClienteId(id);
    onChangeField('clienteId', id);
  };

  /**
   * Función para manejar selección de servicio
   */
  const handleServicioSelection = (key: any) => {
    const id = String(key || "");
    setSelectedServicioId(id);
    onChangeField('servicioId', id);
  };

  /**
   * Función para manejar cambios en cliente ambulatorio
   */
  const onChangeClienteAmbulatorio = (field: keyof NonNullable<CitaFormData['clienteAmbulatorio']>, value: string) => {
    setForm(prev => ({
      ...prev,
      clienteAmbulatorio: {
        nombre: prev.clienteAmbulatorio?.nombre || "",
        telefono: prev.clienteAmbulatorio?.telefono,
        [field]: value
      }
    }));
  };
  
  /**
   * Función para generar opciones de horas
   */
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        const timeStr = `${hourStr}:${minuteStr}`;
        options.push(
          <SelectItem
            key={timeStr}
            id={timeStr}
            label={timeStr}
          />
        );
      }
    }
    return options;
  };
  
  /**
   * Función para manejar selección de hora
   */
  const handleTimeSelection = (key: any) => {
    const time = String(key || "");
    setSelectedTime(time);
    
    // Actualizar la fechaReservada con la nueva hora
    if (form.fechaReservada) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(form.fechaReservada);
      newDate.setHours(hours, minutes, 0, 0);
      onChangeField('fechaReservada', newDate);
    }
  };

  // Manejar cambio de tipo de precio
  const handlePrecioTipoChange = (value: 'ESTANDAR' | 'PERSONALIZADO') => {
    setForm(prev => ({ ...prev, precioTipo: value }));
    // si se cambia a ESTANDAR, limpiar precio personalizado
    if (value === 'ESTANDAR') {
      setForm(prev => ({ ...prev, precioPersonalizado: undefined }));
      setErrors(prev => ({ ...prev, precioPersonalizado: undefined }));
    }
  };

  /**
   * Función para manejar el envío del formulario
   */
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const nextErrors = validate(form);
    setErrors(nextErrors);
    
    // Si hay errores, no continuar
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    
    try {
      // Preparar datos para envío, evitando campos undefined
      const citaData: CitaFormData = {
        tipoCliente: form.tipoCliente,
        servicioId: form.servicioId,
        fechaReservada: form.fechaReservada,
        estado: form.estado,
        precioTipo: form.precioTipo,
        precioPersonalizado: form.precioPersonalizado,
      };

      // Solo agregar campos opcionales si tienen valor y el tipo de cliente es correcto
      if (form.tipoCliente === "HABITUAL" && form.clienteId) {
        citaData.clienteId = form.clienteId;
        // Para clientes habituales, NO agregar clienteAmbulatorio
      } else if (form.tipoCliente === "AMBULATORIO" && form.clienteAmbulatorio?.nombre?.trim()) {
        citaData.clienteAmbulatorio = {
          nombre: form.clienteAmbulatorio.nombre.trim(),
        };
        // Solo agregar teléfono si tiene valor
        if (form.clienteAmbulatorio.telefono?.trim()) {
          citaData.clienteAmbulatorio.telefono = form.clienteAmbulatorio.telefono.trim();
        }
        // Para clientes ambulatorios, NO agregar clienteId
      }

      // Solo agregar notas si tiene valor
      if (form.notas?.trim()) {
        citaData.notas = form.notas.trim();
      }

      // Validación: si precio personalizado está seleccionado, debe existir y ser número > 0
      if (form.precioTipo === 'PERSONALIZADO') {
        if (typeof form.precioPersonalizado === 'undefined' || Number.isNaN(Number(form.precioPersonalizado)) || Number(form.precioPersonalizado) <= 0) {
          setErrors(prev => ({ ...prev, precioPersonalizado: 'Ingrese un precio válido mayor a 0' }));
          setIsSubmitting(false);
          return;
        }
        // Asegurar número
        citaData.precioPersonalizado = Number(form.precioPersonalizado);
      }
      
      console.log('Datos que se enviarán:', citaData); // Para debug
      
      onSave(citaData);
      onClose();
    } catch (error) {
      console.error('Error al crear cita:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog>
          <div className="flex w-full max-w-2xl flex-col bg-primary rounded-xl shadow-lg">
            {/* Header del modal */}
            <div className="flex items-center justify-between border-b border-secondary p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <Calendar className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary">
                    {initialData ? "Editar servicio" : "Nuevo servicio"}
                  </h2>
                  <p className="text-sm text-tertiary">
                    Completa los datos para {initialData ? "actualizar" : "crear"} el servicio
                  </p>
                </div>
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={X}
                onClick={onClose}
              />
            </div>

            {/* Contenido del modal */}
            <Form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Tipo de cliente */}
              <div className="space-y-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-primary">
                  Tipo de Cliente
                </label>
                <RadioGroup
                  aria-label="Tipo de Cliente"
                  value={form.tipoCliente}
                  onChange={(value) => {
                    onChangeField('tipoCliente', value);
                    // Limpiar campos relacionados cuando cambia el tipo
                    if (value === 'HABITUAL') {
                      setForm(prev => ({ ...prev, clienteAmbulatorio: undefined }));
                    } else {
                      setForm(prev => ({ ...prev, clienteId: undefined }));
                      setSelectedClienteId("");
                    }
                  }}
                  className="grid grid-cols-2 gap-3 "
                >
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <RadioButton value="HABITUAL" label="Cliente Habitual" />
                  </div>
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <RadioButton value="AMBULATORIO" label="Cliente Ambulatorio" />
                  </div>
                </RadioGroup>
              </div>

              {/* Selección de cliente habitual */}
              {form.tipoCliente === "HABITUAL" && (
                <Select
                  label="Cliente"
                  placeholder="Seleccionar cliente..."
                  isRequired
                  isInvalid={!!errors.clienteId}
                  hint={errors.clienteId}
                  selectedKey={selectedClienteId}
                  onSelectionChange={handleClienteSelection}
                >
                  {clientes
                    .filter(cliente => cliente.datos.estado === "ACTIVO")
                    .map(cliente => (
                      <SelectItem key={cliente.id} id={cliente.id}>
                        {cliente.datos.nombre}
                      </SelectItem>
                    ))}
                </Select>
              )}

              {/* Datos de cliente ambulatorio (grid 2 columnas) */}
              {form.tipoCliente === "AMBULATORIO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Nombre del Cliente"
                      value={form.clienteAmbulatorio?.nombre || ""}
                      onChange={(value) => onChangeClienteAmbulatorio('nombre', String(value))}
                      placeholder="Ingrese el nombre completo"
                      isRequired
                      isInvalid={!!errors.clienteAmbulatorio?.nombre}
                      hint={errors.clienteAmbulatorio?.nombre}
                    />
                  </div>

                  <div>
                    <Input
                      label="Teléfono (Opcional)"
                      value={form.clienteAmbulatorio?.telefono || ""}
                      onChange={(value) => onChangeClienteAmbulatorio('telefono', String(value))}
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>
              )}

              {/* Selección de servicio */}
              <Select
                label="Servicio"
                placeholder="Seleccionar servicio..."
                isRequired
                isInvalid={!!errors.servicioId}
                hint={errors.servicioId}
                selectedKey={selectedServicioId}
                onSelectionChange={handleServicioSelection}
              >
                {servicios.filter(servicio => servicio.activo).map(servicio => (
                  <SelectItem
                    key={servicio.id}
                    id={servicio.id}
                    label={`${servicio.nombre} - $${servicio.precio}`}
                  />
                ))}
              </Select>

              {/* Tipo de precio: Estándar o Personalizado */}
              <div className="space-y-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-primary">Tipo de Precio</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="precioTipo"
                        value="ESTANDAR"
                        checked={form.precioTipo !== 'PERSONALIZADO'}
                        onChange={() => handlePrecioTipoChange('ESTANDAR')}
                      />
                      <span className="text-sm">Estándar</span>
                    </label>
                  </div>
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="precioTipo"
                        value="PERSONALIZADO"
                        checked={form.precioTipo === 'PERSONALIZADO'}
                        onChange={() => handlePrecioTipoChange('PERSONALIZADO')}
                      />
                      <span className="text-sm">Personalizado</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Campo para precio personalizado */}
              {form.precioTipo === 'PERSONALIZADO' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Precio Personalizado</label>
                  <Input
                    type="text"
                    value={form.precioPersonalizado as any ?? ''}
                    onChange={(v) => {
                      const raw = String(v || '').trim();
                      const num = raw === '' ? undefined : Number(raw);
                      setForm(prev => ({ ...prev, precioPersonalizado: num }));
                    }}
                    placeholder="Ingrese el precio personalizado"
                    isInvalid={!!errors.precioPersonalizado}
                    hint={errors.precioPersonalizado}
                  />
                </div>
              )}

              {/* Fecha y Hora (un solo contenedor) */}
              <div className="space-y-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-primary">Fecha y Hora *</label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      minValue={today(getLocalTimeZone())}
                    />
                  </div>

                  <div>
                    <Select                      
                      placeholder="Seleccionar hora..."
                      isRequired
                      isInvalid={!!errors.fechaReservada}
                      hint={errors.fechaReservada}
                      selectedKey={selectedTime}
                      onSelectionChange={handleTimeSelection}
                    >
                      {generateTimeOptions()}
                    </Select>
                  </div>
                </div>

                {errors.fechaReservada && (
                  <p className="text-sm text-error-600">{errors.fechaReservada}</p>
                )}
              </div>

              {/* Estado de la cita */}
              <div className="space-y-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-primary">
                  Estado de la Cita
                </label>
                <RadioGroup
                  value={form.estado}
                  onChange={(value) => onChangeField('estado', value)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <RadioButton value="PENDIENTE" label="Pendiente" />
                  </div>
                  <div className="rounded-lg border border-secondary/60 p-3 has-[:checked]:ring-2 ring-primary">
                    <RadioButton value="CONFIRMADA" label="Confirmada" />
                  </div>
                </RadioGroup>
              </div>

              {/* Notas adicionales */}
              <TextArea
                label="Notas (Opcional)"
                value={form.notas || ""}
                onChange={(value) => onChangeField('notas', value)}
                placeholder="Notas adicionales sobre la cita..."
                rows={3}
              />

              {/* Botones de acción */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  color="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  {initialData ? "Actualizar Cita" : "Crear Cita"}
                </Button>
              </div>
            </Form>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}