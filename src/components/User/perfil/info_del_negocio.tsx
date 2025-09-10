'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { TextArea } from '@/components/base/textarea/textarea';
import { FileTrigger } from '@/components/base/file-upload-trigger/file-upload-trigger';
import { Usuario } from '@/types/usuario';

interface InfoDelNegocioProps {
  usuario: Usuario | null;
  onSave?: (datos: Partial<Usuario>, archivos?: { fotoPortada?: File }) => void;
  loading?: boolean;
  saving?: boolean;
}

export default function InfoDelNegocio({ 
  usuario, 
  onSave,
  loading = false,
  saving = false
}: InfoDelNegocioProps) {
  const [formData, setFormData] = useState({
    nombre: usuario?.datosNegocio.nombre || '',
    descripcion: usuario?.datosNegocio.descripcion || '',
    colorMarca: usuario?.datosNegocio.colorMarca || '#000000',
    telefono: usuario?.datosNegocio.informacionContacto.telefono || '',
    correo: usuario?.datosNegocio.informacionContacto.correo || '',
    horarioAtencion: usuario?.datosNegocio.horarioAtencion || 'Lun-Vie 9:00-18:00',
    ubicacion: usuario?.datosNegocio.ubicacion || '',
  });

  const [fotoPortada, setFotoPortada] = useState<File | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFotoPortada(file);
  };

  const handleSave = () => {
    if (onSave) {
      const datosActualizados: Partial<Usuario> = {
        datosNegocio: {
          ...usuario?.datosNegocio,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          colorMarca: formData.colorMarca,
          informacionContacto: {
            telefono: formData.telefono,
            correo: formData.correo,
          },
          horarioAtencion: formData.horarioAtencion,
          ubicacion: formData.ubicacion,
        },
      };
      
      const archivos = fotoPortada ? { fotoPortada } : undefined;
      onSave(datosActualizados, archivos);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Datos básicos del negocio */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-100">Datos del Negocio</h3>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombre del Negocio
            </label>
            <Input
              placeholder="Ej: Estudio de Diseño Creativo"
              value={formData.nombre}
              onChange={(value) => handleInputChange('nombre', value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Si es diferente al del profesional
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Color de Marca
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.colorMarca}
                onChange={(e) => handleInputChange('colorMarca', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <Input
                placeholder="#000000"
                value={formData.colorMarca}
                onChange={(value) => handleInputChange('colorMarca', value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Descripción General *
          </label>
          <TextArea
            placeholder="Describe tu negocio, servicios principales y qué te hace único..."
            value={formData.descripcion}
            onChange={(value) => handleInputChange('descripcion', value)}
            rows={4}
            isRequired
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Foto de Portada
          </label>
          {usuario?.datosNegocio.fotoPortada && (
            <div className="mb-4">
              <img 
                src={usuario.datosNegocio.fotoPortada} 
                alt="Foto de portada actual"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <FileTrigger
            acceptedFileTypes={['image/*']}
            onSelect={(files) => {
              if (files && files.length > 0) {
                handleFileChange(files[0]);
              }
            }}
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm">Sube una imagen de portada</p>
                <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
              </div>
            </div>
          </FileTrigger>
          {fotoPortada && (
            <p className="mt-2 text-sm text-green-600">
              Archivo seleccionado: {fotoPortada.name}
            </p>
          )}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-100">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Número Telefónico *
            </label>
            <Input
              type="tel"
              placeholder="+52 55 1234 5678"
              value={formData.telefono}
              onChange={(value) => handleInputChange('telefono', value)}
              isRequired
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Correo Electrónico *
            </label>
            <Input
              type="email"
              placeholder="contacto@tunegocio.com"
              value={formData.correo}
              onChange={(value) => handleInputChange('correo', value)}
              isRequired
            />
          </div>
        </div>
      </div>

      {/* Horario de atención */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-100">Horario de Atención</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Horario de Atención
          </label>
          <Input
            placeholder="Ej: Lun-Vie 9:00-18:00, Sáb 9:00-14:00"
            value={formData.horarioAtencion}
            onChange={(value) => handleInputChange('horarioAtencion', value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Describe tu horario de atención al cliente
          </p>
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-100">Ubicación</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Ubicación
          </label>
          <Input
            placeholder="Ciudad, Estado, País o dirección completa"
            value={formData.ubicacion}
            onChange={(value) => handleInputChange('ubicacion', value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Ubicación donde prestas tus servicios (opcional)
          </p>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button 
          color="primary" 
          onClick={handleSave}
          isDisabled={saving || !formData.descripcion || !formData.telefono || !formData.correo}
          isLoading={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}