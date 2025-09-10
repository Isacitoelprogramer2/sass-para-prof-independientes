@echo off
REM Scripts de Firebase para desarrollo y producción en Windows

REM Instalar Firebase CLI (si no está instalado)
REM npm install -g firebase-tools

REM Inicializar Firebase en el proyecto (solo la primera vez)
REM firebase init

echo Deploying Firestore rules to (default) database...
firebase deploy --only firestore:rules --database (default) --project sass-para-profesionales

echo Deploying Firestore rules to production database...
firebase deploy --only firestore:rules --database production --project sass-para-profesionales

echo Deploying Storage rules...
firebase deploy --only storage --project sass-para-profesionales

echo Building and deploying to Firebase Hosting...
npm run build:export
firebase deploy --only hosting --project sass-para-profesionales

REM Deploy completo
REM firebase deploy --project sass-para-profesionales

REM Para usar emuladores en desarrollo
REM firebase emulators:start

pause
