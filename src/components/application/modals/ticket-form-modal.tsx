"use client";

import React, { useEffect, useState } from "react";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "./modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextAreaBase } from "@/components/base/textarea/textarea";
import { Select } from "@/components/base/select/select";
import { Ticket } from "@/types/ticket";
import { X, Save, AlertTriangle, Clock, Building } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // onSave ahora puede recibir optional clienteContacto para clientes ambulatorios
  onSave: (
    payload: Omit<Ticket, 'id' | 'usuarioId' | 'fechaIngreso'>,
    clienteContacto?: { id: string; nombre: string; telefono: string; email?: string }
  ) => Promise<void> | void;
  // Lista opcional de clientes guardados para modo RECURRENTE
  savedClients?: Array<{ id: string; nombre: string }>;
  initial?: Partial<Ticket> | null;
}

export function TicketFormModal({ isOpen, onClose, onSave, initial, savedClients }: Props) {
  const [descripcion, setDescripcion] = useState(initial?.descripcion || "");
  const [prioridad, setPrioridad] = useState<Ticket['prioridad']>((initial?.prioridad as any) || 'MEDIA');
  const [tipoContexto, setTipoContexto] = useState<Ticket['tipoContexto']>((initial?.tipoContexto as any) || 'DURANTE_SERVICIO');
  const [asignadoA, setAsignadoA] = useState(initial?.asignadoA || '');
  const [clienteId, setClienteId] = useState(initial?.clienteId || '');
  // Nuevo: tipo de cliente - RECURRENTE (cliente guardado) o AMBULATORIO (datos en el ticket)
  const [clienteTipo, setClienteTipo] = useState<'RECURRENTE' | 'AMBULATORIO'>((initial?.clienteId ? 'RECURRENTE' : 'AMBULATORIO') as any);
  // Campos para cliente ambulatorio
  const [ambNombre, setAmbNombre] = useState('');
  const [ambTelefono, setAmbTelefono] = useState('');
  const [ambEmail, setAmbEmail] = useState('');
  const [estado, setEstado] = useState<Ticket['estado']>((initial?.estado as any) || 'ABIERTO');
  const [saving, setSaving] = useState(false);

  // Form validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (isOpen) {
      setDescripcion(initial?.descripcion || "");
      setPrioridad((initial?.prioridad as any) || 'MEDIA');
      setTipoContexto((initial?.tipoContexto as any) || 'DURANTE_SERVICIO');
      setAsignadoA(initial?.asignadoA || '');
      setClienteId(initial?.clienteId || '');
      setClienteTipo(initial?.clienteId ? 'RECURRENTE' : 'AMBULATORIO');
      // If no initial id, and initial tiene campos de contacto (assumption: none), keep amb fields empty
      setAmbNombre('');
      setAmbTelefono('');
      setAmbEmail('');
      setEstado((initial?.estado as any) || 'ABIERTO');
      setErrors({});
    }
  }, [isOpen, initial]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    // Validación condicional según tipo de cliente
    if (clienteTipo === 'RECURRENTE') {
      if (!clienteId.trim()) newErrors.clienteId = 'Seleccione un cliente recurrente';
    } else {
      if (!ambNombre.trim()) newErrors.ambNombre = 'El nombre es obligatorio para cliente ambulatorio';
      if (!ambTelefono.trim()) newErrors.ambTelefono = 'El teléfono/Whatsapp es obligatorio para cliente ambulatorio';
      // email es opcional
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Preparar payload base
      const basePayload: Omit<Ticket, 'id' | 'usuarioId' | 'fechaIngreso'> = {
        descripcion,
        prioridad,
        tipoContexto,
        asignadoA,
        titulo: descripcion.substring(0, 60),
        clienteId: clienteId,
        estado,
      };

      if (clienteTipo === 'AMBULATORIO') {
        // Generar id temporal para cliente ambulatorio
        const tempClienteId = `amb-${Date.now()}`;
        basePayload.clienteId = tempClienteId;

        const clienteContacto = {
          id: tempClienteId,
          nombre: ambNombre.trim(),
          telefono: ambTelefono.trim(),
          email: ambEmail.trim() || undefined,
        };

        // Llamada extendida: payload + clienteContacto
        await onSave(basePayload, clienteContacto as any);
      } else {
        // Recurrente: enviar sólo el payload que incluye clienteId seleccionado
        await onSave(basePayload as any);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Error al guardar el ticket. Inténtelo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return 'text-error-600';
      case 'MEDIA':
        return 'text-warning-600';
      case 'BAJA':
        return 'text-success-600';
      default:
        return 'text-tertiary';
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay>
        <Modal className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <Dialog role="dialog" aria-modal="true" aria-labelledby="ticket-form-title">
            <form onSubmit={handleSubmit} className="bg-primary w-xl rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-tertiary">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-50 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 id="ticket-form-title" className="text-lg font-semibold text-primary">
                      {initial ? 'Editar Ticket' : 'Crear Nuevo Ticket'}
                    </h3>
                    <p className="text-sm text-tertiary">
                      {initial ? 'Modifica los detalles del ticket' : 'Complete la información del nuevo ticket'}
                    </p>
                  </div>
                </div>
                <Button 
                  color="tertiary" 
                  size="sm" 
                  onClick={onClose} 
                  aria-label="Cerrar"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {errors.general && (
                  <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                    <p className="text-sm text-error-700">{errors.general}</p>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-secondary">
                    Descripción del Ticket *
                  </label>
                  <TextAreaBase
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe detalladamente el problema o solicitud..."
                    rows={4}
                    className={`resize-none ${errors.descripcion ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''}`}
                  />
                  {errors.descripcion && (
                    <p className="text-sm text-error-600">{errors.descripcion}</p>
                  )}
                  <p className="text-xs text-tertiary">
                    {descripcion.length}/1000 caracteres
                  </p>
                </div>

                {/* Priority and Context Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary">
                      Prioridad *
                    </label>
                    <Select
                      selectedKey={prioridad}
                      onSelectionChange={(key) => setPrioridad(key as Ticket['prioridad'])}
                    >
                      <Select.Item id="ALTA" label="Alta" icon={<AlertTriangle className="h-4 w-4 text-error-600" />}>
                        
                      </Select.Item>
                      <Select.Item id="MEDIA" label="Media" icon={<Clock className="h-4 w-4 text-warning-600" />}>
                      </Select.Item>
                      <Select.Item id="BAJA" label="Baja" icon={<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <path
                            d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                            stroke="green"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>}>
                      </Select.Item>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary">
                      Contexto del Ticket *
                    </label>
                    <Select
                      selectedKey={tipoContexto}
                      onSelectionChange={(key) => setTipoContexto(key as Ticket['tipoContexto'])}
                    >
                      <Select.Item id="DURANTE_SERVICIO">Durante el servicio</Select.Item>
                      <Select.Item id="POST_SERVICIO">Post servicio</Select.Item>
                    </Select>
                  </div>
                </div>

                {/* Client ID and Assigned To Row */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clienteId" className="block text-sm font-medium text-secondary">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        ID Cliente *
                      </div>
                    </label>
                    {/* Radios para elegir tipo de cliente */}
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="clienteTipo"
                          value="RECURRENTE"
                          checked={clienteTipo === 'RECURRENTE'}
                          onChange={() => {
                            setClienteTipo('RECURRENTE');
                            // limpiar campos ambulatorios al elegir recurrente
                            setAmbNombre('');
                            setAmbTelefono('');
                            setAmbEmail('');
                          }}
                          className="form-radio"
                        />
                        <span className="text-sm">Recurrente</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="clienteTipo"
                          value="AMBULATORIO"
                          checked={clienteTipo === 'AMBULATORIO'}
                          onChange={() => {
                            setClienteTipo('AMBULATORIO');
                            // limpiar clienteId seleccionado al elegir ambulatorio
                            setClienteId('');
                          }}
                          className="form-radio"
                        />
                        <span className="text-sm">Ambulatorio</span>
                      </label>
                    </div>

                    {/* Si RECURRENTE: mostrar Select con savedClients (si vienen por prop) */}
                    {clienteTipo === 'RECURRENTE' ? (
                      <div className="mt-3">
                        {/* Siempre mostrar Select con savedClients; si no hay clientes, mostrar mensaje y Select vacío */}
                        {savedClients && savedClients.length > 0 ? (
                          <Select
                            selectedKey={clienteId}
                            onSelectionChange={(k) => setClienteId(k as string)}
                          >
                            {savedClients.map((c) => (
                              <Select.Item key={c.id} id={c.id}>
                                {c.nombre}
                              </Select.Item>
                            ))}
                          </Select>
                        ) : (
                          <div className="p-3 border rounded-md bg-secondary text-sm text-tertiary">No hay clientes guardados</div>
                        )}

                        {errors.clienteId && (
                          <p className="text-sm text-error-600">{errors.clienteId}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary">Nombre *</label>
                          <Input value={ambNombre} onChange={setAmbNombre} placeholder="Nombre del cliente" />
                          {errors.ambNombre && <p className="text-sm text-error-600">{errors.ambNombre}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary">Whatsapp / Teléfono *</label>
                          <Input value={ambTelefono} onChange={setAmbTelefono} placeholder="Número de teléfono" />
                          {errors.ambTelefono && <p className="text-sm text-error-600">{errors.ambTelefono}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary">Email (opcional)</label>
                          <Input value={ambEmail} onChange={setAmbEmail} placeholder="Correo electrónico" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado (only show when editing) */}
                {initial && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary">
                      Estado del Ticket
                    </label>
                    <Select
                      selectedKey={estado}
                      onSelectionChange={(key) => setEstado(key as Ticket['estado'])}
                    >
                      <Select.Item id="ABIERTO" label="Abierto">
                        <span className="text-brand-600 font-medium">Abierto</span>
                      </Select.Item>
                      <Select.Item id="EN_PROGRESO" label="En Progreso">
                        <span className="text-warning-600 font-medium">En Progreso</span>
                      </Select.Item>
                      <Select.Item id="CERRADO" label="Cerrado">
                        <span className="text-success-600 font-medium">Cerrado</span>
                      </Select.Item>
                    </Select>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-tertiary bg-secondary rounded-b-2xl">
                <p className="text-xs text-tertiary">
                  * Campos obligatorios
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    color="tertiary" 
                    onClick={onClose} 
                    type="button"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    color="primary" 
                    type="submit"
                    iconLeading={<Save className="h-4 w-4" />}
                    disabled={saving}
                    className="inline-flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        
                        {initial ? 'Actualizar' : 'Crear Ticket'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
