"use client";

import { 
  User01, 
  Settings01, 
  Bell01, 
  Shield01, 
  CreditCard01, 
  Building01,
  Eye,
  Edit01
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function ConfiguracionPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-display-xs font-semibold text-primary">Configuración</h1>
        <p className="mt-2 text-md text-tertiary">
          Administra tu perfil y configuraciones del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a
              href="#"
              className="bg-secondary text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <User01 className="text-primary mr-3 h-5 w-5" />
              Perfil Personal
            </a>
            <a
              href="#"
              className="text-tertiary hover:bg-secondary hover:text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <Building01 className="text-tertiary group-hover:text-primary mr-3 h-5 w-5" />
              Información del Negocio
            </a>
            <a
              href="#"
              className="text-tertiary hover:bg-secondary hover:text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <Bell01 className="text-tertiary group-hover:text-primary mr-3 h-5 w-5" />
              Notificaciones
            </a>
            <a
              href="#"
              className="text-tertiary hover:bg-secondary hover:text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <Shield01 className="text-tertiary group-hover:text-primary mr-3 h-5 w-5" />
              Seguridad
            </a>
            <a
              href="#"
              className="text-tertiary hover:bg-secondary hover:text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <CreditCard01 className="text-tertiary group-hover:text-primary mr-3 h-5 w-5" />
              Facturación
            </a>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <div className="bg-primary border border-secondary rounded-lg">
            <div className="px-6 py-4 border-b border-secondary">
              <h3 className="text-lg font-semibold text-primary">Perfil Personal</h3>
              <p className="mt-1 text-sm text-tertiary">
                Actualiza tu información personal y foto de perfil
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Foto de perfil */}
              <div className="flex items-center space-x-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                  <User01 className="h-10 w-10 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary">Foto de perfil</h4>
                  <p className="text-sm text-tertiary">
                    JPG, GIF o PNG. Máximo 1MB.
                  </p>
                  <div className="mt-2 flex space-x-3">
                    <Button color="secondary" size="sm" iconLeading={Edit01}>
                      Cambiar
                    </Button>
                    <Button color="tertiary" size="sm">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Información personal */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Nombre
                  </label>
                  <Input
                    defaultValue="Juan"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Apellido
                  </label>
                  <Input
                    defaultValue="Pérez"
                    placeholder="Tu apellido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    defaultValue="juan.perez@email.com"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    placeholder="Tu teléfono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Biografía
                </label>
                <textarea
                  rows={3}
                  className="block w-full rounded-md border border-secondary px-3 py-2 text-primary placeholder-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-primary"
                  placeholder="Cuéntanos sobre ti..."
                  defaultValue="Profesional con más de 10 años de experiencia en el sector."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button color="tertiary">
                  Cancelar
                </Button>
                <Button>
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>

          {/* Configuración de cuenta */}
          <div className="mt-8 bg-primary border border-secondary rounded-lg">
            <div className="px-6 py-4 border-b border-secondary">
              <h3 className="text-lg font-semibold text-primary">Configuración de Cuenta</h3>
              <p className="mt-1 text-sm text-tertiary">
                Administra la configuración de tu cuenta y privacidad
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-primary">Perfil Público</h4>
                  <p className="text-sm text-tertiary">
                    Tu perfil será visible para tus clientes
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-brand-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-primary">Notificaciones por Email</h4>
                  <p className="text-sm text-tertiary">
                    Recibe notificaciones sobre citas y clientes
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-brand-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-primary">Autenticación de Dos Factores</h4>
                  <p className="text-sm text-tertiary">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <Button color="secondary" size="sm">
                  Configurar
                </Button>
              </div>
            </div>
          </div>

          {/* Zona de peligro */}
          <div className="mt-8 bg-primary border border-error-200 rounded-lg">
            <div className="px-6 py-4 border-b border-error-200">
              <h3 className="text-lg font-semibold text-error-600">Zona de Peligro</h3>
              <p className="mt-1 text-sm text-tertiary">
                Acciones irreversibles que afectan tu cuenta
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-primary">Eliminar Cuenta</h4>
                  <p className="text-sm text-tertiary">
                    Elimina permanentemente tu cuenta y todos los datos asociados
                  </p>
                </div>
                <Button color="primary-destructive" size="sm">
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
