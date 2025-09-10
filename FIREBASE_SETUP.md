# Firebase Configuration Guide

## Bases de Datos Configuradas

Tu proyecto usa dos bases de datos en Firestore:
- `(default)` - Base de datos para desarrollo
- `production` - Base de datos para producción

## Configuración por Entorno

### Desarrollo (Local)
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_DATABASE_ID=(default)
NODE_ENV=development
```

### Producción (Firebase Hosting)
```bash
# .env.production
NEXT_PUBLIC_FIREBASE_DATABASE_ID=production
NODE_ENV=production
```

## Scripts Disponibles

### Desarrollo
```bash
npm run dev                    # Desarrollo local con base (default)
npm run firebase:emulators     # Emuladores de Firebase
```

### Build y Deploy
```bash
npm run build                  # Build para producción
npm run build:export           # Build + export estático
npm run deploy                 # Build + deploy completo
npm run deploy:hosting         # Solo deploy de hosting
```

### Firebase CLI
```bash
npm run firebase:deploy:default     # Deploy reglas a base (default)
npm run firebase:deploy:production  # Deploy reglas a base production
npm run firebase:deploy:rules       # Deploy reglas a ambas bases
npm run firebase:deploy:hosting     # Deploy solo hosting
```

## Pasos para Deploy Completo

1. **Preparar build para producción:**
   ```bash
   npm run build:export
   ```

2. **Deploy de reglas a ambas bases de datos:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules --database production
   firebase deploy --only storage
   ```

3. **Deploy de hosting:**
   ```bash
   firebase deploy --only hosting
   ```

4. **O todo junto:**
   ```bash
   npm run deploy
   ```

## Comandos Firebase CLI Específicos

```bash
# Listar bases de datos
firebase firestore:databases:list

# Deploy a base específica
firebase deploy --only firestore:rules --database (default)
firebase deploy --only firestore:rules --database production

# Deploy de hosting
firebase deploy --only hosting

# Inicializar proyecto (solo una vez)
firebase init

# Ver logs
firebase functions:log
```

## Verificación

1. Revisa los logs del navegador para confirmar la base de datos conectada
2. En Firebase Console, verifica que los datos aparezcan en la base correcta
3. El componente `FirebaseDatabaseInfo` muestra la conexión actual en desarrollo

## Estructura de Archivos Firebase

```
proyecto/
├── firebase.json           # Configuración principal
├── firestore.rules        # Reglas de Firestore
├── firestore.indexes.json # Índices de Firestore
├── storage.rules          # Reglas de Storage
├── .env.local            # Variables desarrollo
├── .env.production       # Variables producción
└── out/                  # Build exportado para hosting
```
