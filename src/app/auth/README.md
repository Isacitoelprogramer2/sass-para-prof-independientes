# Sistema de Autenticación

Este sistema de autenticación incluye páginas para login, registro y recuperación de contraseña, con soporte para autenticación por email/contraseña y Google OAuth.

## Páginas Creadas

### 1. Login (`/auth/login`)
- Autenticación con email y contraseña
- Login con Google OAuth
- Validación de errores
- Redirección automática al dashboard
- Enlaces a registro y recuperación de contraseña

### 2. Registro (`/auth/register`)
- Registro con nombre, email y contraseña
- Confirmación de contraseña
- Registro con Google OAuth
- Creación de perfil de usuario en Firestore
- Validación de formulario en tiempo real

### 3. Recuperación de Contraseña (`/auth/forgot-password`)
- Envío de email para restablecer contraseña
- Confirmación visual del envío
- Validación de errores

### 4. Logout (`/auth/logout`)
- Cierre de sesión automático
- Redirección al login

## Componentes de Seguridad

### AuthGuard
Protege rutas que requieren o no requieren autenticación:
```tsx
// Para rutas que requieren autenticación
<AuthGuard requireAuth={true}>
  {children}
</AuthGuard>

// Para rutas que NO requieren autenticación (login, register)
<AuthGuard requireAuth={false}>
  {children}
</AuthGuard>
```

### Hook useAuth
Proporciona el estado de autenticación:
```tsx
const { user, loading, isAuthenticated } = useAuth();
```

## Características Implementadas

### ✅ Diseño Responsivo
- Diseño móvil-first
- Componentes de UI consistentes
- Tema coherente con el resto de la aplicación

### ✅ Validación de Formularios
- Validación en tiempo real
- Mensajes de error específicos
- Estados de carga durante las peticiones

### ✅ Autenticación con Google
- OAuth 2.0 configurado
- Creación automática de perfil de usuario
- Botón social con diseño consistente

### ✅ Seguridad
- Protección de rutas
- Redirección automática basada en estado de autenticación
- Manejo seguro de tokens de Firebase

### ✅ Experiencia de Usuario
- Estados de carga
- Feedback visual
- Navegación intuitiva entre páginas
- Iconos para mostrar/ocultar contraseña

## Configuración Requerida

### Variables de Entorno
Asegúrate de tener configuradas las variables de Firebase en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Configuración de Firebase
1. Habilita Authentication en Firebase Console
2. Configura Email/Password provider
3. Configura Google OAuth provider
4. Configura Firestore para perfiles de usuario

## Rutas de Navegación

- `/` - Landing page principal
- `/app` - Redirección inteligente (dashboard si autenticado, login si no)
- `/auth/login` - Página de inicio de sesión
- `/auth/register` - Página de registro
- `/auth/forgot-password` - Recuperación de contraseña
- `/auth/logout` - Cierre de sesión
- `/dashboard/*` - Páginas protegidas que requieren autenticación

## Estructura de Usuario en Firestore

Cuando un usuario se registra, se crea un documento en la colección `users`:

```typescript
{
  uid: string,
  name: string,
  email: string,
  createdAt: string,
  role: "client" // Puede expandirse para diferentes roles
}
```

## Próximos Pasos

1. **Personalización de Emails**: Configurar templates personalizados para emails de Firebase
2. **Verificación de Email**: Implementar verificación de email obligatoria
3. **Roles de Usuario**: Expandir el sistema de roles (admin, client, etc.)
4. **Perfil de Usuario**: Crear páginas para editar perfil
5. **2FA**: Implementar autenticación de dos factores
6. **Social Logins**: Agregar más proveedores (Facebook, Apple, etc.)

## Uso

Las páginas están listas para usar. Los usuarios pueden:

1. Visitar `/auth/register` para crear una cuenta nueva
2. Visitar `/auth/login` para iniciar sesión
3. Usar autenticación con Google en ambas páginas
4. Recuperar contraseña desde `/auth/forgot-password`
5. Ser redirigidos automáticamente al dashboard tras autenticarse
6. Ser protegidos de acceder a páginas que requieren autenticación

El sistema maneja automáticamente la navegación y seguridad basada en el estado de autenticación del usuario.
