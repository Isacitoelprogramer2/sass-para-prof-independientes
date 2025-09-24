'use client';

import React, { useState } from "react";
import { Button } from "../../base/buttons/button";
import { Input } from "../../base/input/input";
import { TextArea } from "../../base/textarea/textarea";
import { FileTrigger } from "../../base/file-upload-trigger/file-upload-trigger";
import { Select } from "../../base/select/select";
import { SelectItem } from "../../base/select/select-item";
import { Usuario } from "@/types/usuario";

interface PerfilDelUsuarioProps {
  usuario: Usuario | null;
  onSave?: (datos: Partial<Usuario>, archivos?: { fotoPerfil?: File }) => void;
  loading?: boolean;
  saving?: boolean;
}

const PerfilDelUsuario: React.FC<PerfilDelUsuarioProps> = ({ 
  usuario, 
  onSave,
  loading = false,
  saving = false
}) => {
  const [formData, setFormData] = useState({
    nombres: usuario?.datosProfesional.nombres || '',
    profesion: usuario?.datosProfesional.profesion || '',
    experiencia: usuario?.datosProfesional.experiencia || '',
    provincia: usuario?.datosProfesional.provincia || '',
    pais: usuario?.datosProfesional.pais || 'Perú',
  });
  
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);

  const departamentos = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Cusco', 
    'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 
    'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 
    'Tacna', 'Tumbes', 'Ucayali'
  ];

  const paises = ['Perú'];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFotoPerfil(file);
  };

  const handleSave = () => {
    if (onSave) {
      const datosActualizados: Partial<Usuario> = {
        datosProfesional: {
          ...usuario?.datosProfesional,
          nombres: formData.nombres,
          profesion: formData.profesion,
          experiencia: formData.experiencia,
          provincia: formData.provincia,
          pais: formData.pais,
        },
      };
      
      const archivos = fotoPerfil ? { fotoPerfil } : undefined;
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
    <div className="space-y-6">
      {/* Foto de perfil */}
      <div className="flex items-center space-x-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 overflow-hidden">
          {usuario?.datosProfesional.fotoPerfil ? (
            <img 
              src={usuario.datosProfesional.fotoPerfil} 
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
            </svg>
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium text-primary">Foto de perfil</h4>
          <p className="text-sm text-tertiary">JPG, GIF o PNG. Máximo 1MB.</p>
          <div className="mt-2 flex space-x-3">
            <FileTrigger
              acceptedFileTypes={['image/*']}
              onSelect={(files) => {
                if (files && files.length > 0) {
                  handleFileChange(files[0]);
                }
              }}
            >
              <Button color="secondary" size="sm">
                <svg className="inline-block mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                </svg>
                Cambiar
              </Button>
            </FileTrigger>
            {usuario?.datosProfesional.fotoPerfil && (
              <Button 
                color="tertiary" 
                size="sm"
                onClick={() => {
                  if (onSave) {
                    onSave({
                      datosProfesional: {
                        ...usuario.datosProfesional,
                        fotoPerfil: undefined,
                      }
                    });
                  }
                }}
              >
                Eliminar
              </Button>
            )}
          </div>
          {fotoPerfil && (
            <p className="mt-2 text-sm text-green-600">
              Archivo seleccionado: {fotoPerfil.name}
            </p>
          )}
        </div>
      </div>

      {/* Información personal */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Nombres *</label>
          <Input 
            value={formData.nombres}
            onChange={(value) => handleInputChange('nombres', value)}
            placeholder="Tu nombre completo" 
            isRequired
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Profesión *</label>
          <Input 
            value={formData.profesion}
            onChange={(value) => handleInputChange('profesion', value)}
            placeholder="Tu profesión o especialidad" 
            isRequired
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">Experiencia</label>
        <TextArea
          value={formData.experiencia}
          onChange={(value) => handleInputChange('experiencia', value)}
          rows={4}
          placeholder="Cuéntanos sobre tu experiencia profesional, logros, certificaciones, etc."
        />
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">País</label>
          <Select
            items={paises.map(pais => ({ id: pais, label: pais }))}
            selectedKey={formData.pais}
            onSelectionChange={(key) => handleInputChange('pais', key as string)}
            placeholder="Selecciona tu país"
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Provincia</label>
          <Select
            items={departamentos.map(dep => ({ id: dep, label: dep }))}
            selectedKey={formData.provincia}
            onSelectionChange={(key) => handleInputChange('provincia', key as string)}
            placeholder="Selecciona tu provincia"
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button 
          color="primary" 
          onClick={handleSave}
          isDisabled={saving || !formData.nombres || !formData.profesion}
          isLoading={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
};

export default PerfilDelUsuario;