# Scripts de Firebase para desarrollo y producción

# Instalar Firebase CLI (si no está instalado)
# npm install -g firebase-tools

# Inicializar Firebase en el proyecto (solo la primera vez)
# firebase init

# Deploy a la base de datos de desarrollo
echo "Deploying to development database..."
firebase deploy --only firestore:rules --project sass-para-profesionales

# Deploy a la base de datos de producción (cuando estés listo)
# firebase deploy --only firestore:rules --project sass-para-profesionales

# Deploy de Storage rules
firebase deploy --only storage --project sass-para-profesionales

# Deploy completo (reglas + índices)
# firebase deploy --only firestore --project sass-para-profesionales

# Para usar emuladores en desarrollo
# firebase emulators:start

# Para ver logs de Firestore
# firebase firestore:databases:list --project sass-para-profesionales
