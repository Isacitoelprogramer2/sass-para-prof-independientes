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
