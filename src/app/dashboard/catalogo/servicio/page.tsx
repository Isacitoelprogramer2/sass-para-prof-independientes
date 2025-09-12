"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Select } from "@/components/base/select/select";
import { useServicios } from "@/hooks/use-servicios";
import { Toggle } from "@/components/base/toggle/toggle";
import { useUsuario } from "@/hooks/use-usuario";
import { SERVICIOS } from "@/types/Categorias/servicios";
import ImageUploader from "@/components/dashboard/uploaderUX";


/**
 * Tipos de servicio predefinidos
 */
const TIPOS_SERVICIO = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'domicilio', label: 'A domicilio' },
  { value: 'mixto', label: 'Mixto' },
];

/**
 * Página para crear o editar servicios
 * Utiliza parámetros de búsqueda para determinar si es edición
 */
export default function ServicioFormPage() {
  // Obtener datos del usuario
  const { usuario } = useUsuario();
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicioId = searchParams.get('id');
  const isEditing = !!servicioId;

  // Si el usuario tiene subcategoría configurada, la usamos como valor inicial
  useEffect(() => {
    if (usuario?.datosNegocio?.subcategoria && !formData.categoria) {
      setFormData(prev => ({
        ...prev,
        categoria: usuario.datosNegocio.subcategoria
      }));
    }
  }, [usuario]);

  // Hooks para gestión de servicios
  const { crearServicio, obtenerServicio, actualizarServicio, saving } = useServicios();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    categoria: '', // subcategoría
    servicio: '', // servicio específico
    detalles: '',
    precio: 0,
    activo: true, // Por defecto el servicio está activo
  });

  // Estados para manejo de imagen
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');
  const [imagenExistente, setImagenExistente] = useState<string>('');

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [servicioEncontrado, setServicioEncontrado] = useState<boolean>(true);

  /**
   * Cargar datos del servicio si está en modo edición
   */
  useEffect(() => {
    const cargarServicio = async () => {
      if (!isEditing || !servicioId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setServicioEncontrado(true);
      
      try {
        console.log('Cargando servicio con ID:', servicioId);
        const servicio = await obtenerServicio(servicioId);
        
        if (servicio) {
          console.log('Servicio encontrado:', servicio);
          setFormData({
            nombre: servicio.nombre || '',
            tipo: servicio.tipo || '',
            categoria: servicio.categoria || '',
            servicio: servicio.servicio || '',
            detalles: servicio.detalles || '',
            precio: servicio.precio || 0,
            activo: typeof servicio.activo === 'boolean' ? servicio.activo : true,
          });
          
          if (servicio.imagen) {
            setImagenExistente(servicio.imagen);
          }
          setServicioEncontrado(true);
        } else {
          console.warn('Servicio no encontrado con ID:', servicioId);
          setServicioEncontrado(false);
          setErrors({
            submit: 'El servicio solicitado no fue encontrado.'
          });
        }
      } catch (error) {
        console.error('Error al cargar servicio:', error);
        setServicioEncontrado(false);
        setErrors({
          submit: 'Error al cargar el servicio. Por favor verifica que el servicio existe.'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarServicio();
  }, [isEditing, servicioId]); // Removemos obtenerServicio de las dependencias

  /**
   * Manejar cambios en los campos del formulario
   */
  // Permite string, number y boolean para los campos del formulario
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Si cambia la subcategoría, resetea el servicio seleccionado
    if (field === 'categoria') {
      setFormData(prev => ({
        ...prev,
        servicio: ''
      }));
    }
  };

  /**
   * Manejar selección de imagen
   */
  const handleImageChange = (file: File | null) => {
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          imagen: 'Por favor selecciona un archivo de imagen válido'
        }));
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imagen: 'La imagen no puede ser mayor a 5MB'
        }));
        return;
      }

      setImagenFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Limpiar error de imagen
      if (errors.imagen) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.imagen;
          return newErrors;
        });
      }
    } else {
      // Remover imagen
      setImagenFile(null);
      setImagenPreview('');
      
      // Limpiar error de imagen
      if (errors.imagen) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.imagen;
          return newErrors;
        });
      }
    }
  };

  /**
   * Validar formulario antes del envío
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del servicio es requerido';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de servicio es requerido';
    }

    // Validar servicio específico (proveniente de servicios.ts)
    if (!formData.servicio) {
      newErrors.servicio = 'Selecciona la categoría específica del servicio';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Limpiar errores previos
    setErrors({});

    try {
      console.log('Enviando formulario:', { formData, isEditing, servicioId });

      if (isEditing && servicioId) {
        // Actualizar servicio existente
        console.log('Actualizando servicio...');
        await actualizarServicio(servicioId, formData, imagenFile || undefined);
        console.log('Servicio actualizado exitosamente');
      } else {
        // Crear nuevo servicio
        console.log('Creando nuevo servicio...');
        await crearServicio(formData, imagenFile || undefined);
        console.log('Servicio creado exitosamente');
      }

      // Redirigir al catálogo
      router.push('/dashboard/catalogo');
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      
      // Mostrar error más específico si está disponible
      let errorMessage = 'Error al guardar el servicio. Por favor intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setErrors({
        submit: errorMessage
      });
    }
  };

  // Mostrar loading mientras carga datos en modo edición
  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-md text-tertiary">
              {isEditing ? 'Cargando datos del servicio...' : 'Cargando...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el servicio no se encontró en modo edición
  if (isEditing && !servicioEncontrado) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-error-50 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Servicio no encontrado
            </h3>
            <p className="text-tertiary mb-6">
              El servicio que intentas editar no existe o no tienes permisos para acceder a él.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                color="secondary"
                onClick={() => router.push('/dashboard/catalogo')}
              >
                Volver al catálogo
              </Button>
              <Button
                onClick={() => router.push('/dashboard/catalogo/servicio')}
                iconLeading={Plus}
              >
                Crear nuevo servicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header con navegación */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          color="tertiary"
          size="sm"
          iconLeading={ArrowLeft}
          onClick={() => router.back()}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-display-xs font-semibold text-primary">
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h1>
          <p className="mt-2 text-md text-tertiary">
            {isEditing 
              ? 'Modifica los detalles de tu servicio'
              : 'Agrega un nuevo servicio a tu catálogo'
            }
          </p>
        </div>
      </div>

      {/* Componente ImageUploader */}
      <div className="max-w-2xl mb-8">
        <label className="block text-sm font-medium text-primary mb-4">
          Imagen del servicio
        </label>
        <ImageUploader 
          onImageChange={handleImageChange}
          imagenPreview={imagenPreview}
          imagenExistente={imagenExistente}
          error={errors.imagen}
        />
      </div>

      {/* Formulario */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Error general */}
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nombre del servicio */}
            <div className="sm:col-span-2">
              <Input
                label="Nombre del servicio"
                placeholder="Ej: Corte de cabello moderno"
                value={formData.nombre}
                onChange={(value) => handleInputChange('nombre', value)}
                isInvalid={!!errors.nombre}
                isRequired
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-error-600">{errors.nombre}</p>
              )}
            </div>

            {/* Tipo de servicio */}
            <div>
              <Select
                label="Tipo de servicio"
                items={TIPOS_SERVICIO.map(tipo => ({ id: tipo.value, label: tipo.label, value: tipo.value }))}
                selectedKey={formData.tipo}
                onSelectionChange={key => handleInputChange('tipo', key ? String(key) : '')}
                isRequired
                hint={errors.tipo}
              >
                {(item) => (
                  <Select.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                  </Select.Item>
                )}
              </Select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-error-600">{errors.tipo}</p>
              )}
            </div>

            {/* Categoría */}
            {/* Servicio (mostrado como categoría) dependiente de la subcategoría seleccionada en el perfil */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Categoría
              </label>
              <Select
                items={(SERVICIOS[formData.categoria || usuario?.datosNegocio?.subcategoria || ''] || []).map(serv => ({ id: serv.value, label: serv.label, value: serv.value }))}
                selectedKey={formData.servicio}
                onSelectionChange={key => handleInputChange('servicio', key ? String(key) : '')}
                isDisabled={!(formData.categoria || usuario?.datosNegocio?.subcategoria)}
                isRequired
              >
                {(item) => (
                  <Select.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                  </Select.Item>
                )}
              </Select>
              {errors.servicio && (
                <p className="mt-1 text-sm text-error-600">{errors.servicio}</p>
              )}
            </div>

            {/* Precio */}
            <div className="sm:col-span-2">
              <Input
                type="number"
                label="Precio"
                placeholder="0.00"
                value={formData.precio.toString()}
                onChange={(value) => handleInputChange('precio', parseFloat(value) || 0)}
                isInvalid={!!errors.precio}
                isRequired
              />
              {errors.precio && (
                <p className="mt-1 text-sm text-error-600">{errors.precio}</p>
              )}
            </div>
            {/* Toggle para activar/desactivar el servicio */}
            <div className="sm:col-span-2 flex items-center gap-3">
              <Toggle
                label="Estado del servicio"
                isSelected={formData.activo}
                onChange={selected => handleInputChange('activo', selected)}
                size="md"
              />
              <span className={`text-sm ${formData.activo ? 'text-success-600' : 'text-error-600'}`}>
                {formData.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Detalles del servicio */}
          <div>
            <TextArea
              label="Descripción del servicio"
              placeholder="Describe tu servicio, que incluye, beneficios, etc."
              value={formData.detalles}
              onChange={(value) => handleInputChange('detalles', value)}
              rows={4}
              hint={errors.detalles}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              color="secondary"
              onClick={() => router.back()}
              isDisabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={saving}
              isDisabled={saving}
            >
              {isEditing ? 'Actualizar servicio' : 'Crear servicio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
