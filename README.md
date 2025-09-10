# SaaS para Profesionales Independientes  

👋 Hola, soy **Isaac Pingo** y actualmente estoy construyendo un **SaaS para profesionales independientes** como médicos, fotógrafos, dentistas, terapeutas y más.  

## 🚀 Objetivo del proyecto  
Simplificar la forma en que los profesionales gestionan su negocio digitalmente:  

- 📅 **Gestión de citas y reservas** con disponibilidad en tiempo real.  
- 🛠️ **Seguimiento de servicios** (ej: tratamientos médicos, sesiones de fotos, consultorías).  
- 📂 **Portafolio de servicios**: precios, duración e información clara para clientes.  
- 🙋 **Gestión de clientes**: tickets, reclamos y cartera organizada.  

## 🛠️ Tech Stack  
- **Frontend**: Next.js 15 · React · TailwindCSS · TypeScript  
- **Backend**: Firebase (Auth, Firestore, Storage)  
- **UI/UX**: Mobile-first design, clean & minimal  

## 📌 Estado  
Actualmente en fase de desarrollo inicial 🏗️.  
Próximos pasos: integración con Google Calendar y versión beta para pruebas con usuarios reales.  

---

✨ Mi meta es crear una plataforma que ayude a los profesionales a enfocarse en su trabajo, mientras la herramienta gestiona la parte operativa.  


## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com.
2. In the project settings, copy the web app config values into a local `.env.local` (use `.env.local.example` as template).
3. Install dependencies (already includes `firebase` in package.json). If you need to reinstall:

	npm install

4. Use the exported helpers in `src/lib/firebase.ts` to access `firebaseAuth`, `firebaseDb`, and `firebaseStorage`.

Example usage in a component:

```tsx
import { firebaseAuth } from "@/lib/firebase";
// use firebaseAuth with onAuthStateChanged, signInWithPopup, etc.
```
