// Firebase client initialization for Next.js
// Reads config from NEXT_PUBLIC_... environment variables.
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  analytics?: Analytics | null;
};

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  } as Record<string, string | undefined>;
}

function initFirebase(): FirebaseServices {
  const config = getFirebaseConfig();

  // Basic runtime check — ensure required public env vars exist
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error(
      "Missing required NEXT_PUBLIC_FIREBASE_* environment variables. Copy .env.local.example to .env.local and fill values."
    );
  }

  const app = getApps().length ? getApp() : initializeApp(config);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // Analytics is optional and only available in the browser
  let analytics: Analytics | null = null;
  if (typeof window !== "undefined") {
    // isSupported checks if analytics is supported in this environment
    // it returns a Promise<boolean>
    isSupported()
      .then((supported) => {
        if (supported && config.measurementId) {
          try {
            analytics = getAnalytics(app);
          } catch (e) {
            // fail silently — analytics is optional
            // eslint-disable-next-line no-console
            console.warn("Firebase analytics failed to initialize:", e);
          }
        }
      })
      .catch(() => {
        /* ignore */
      });
  }

  return { app, auth, db, storage, analytics };
}

let services: FirebaseServices | null = null;

export function getFirebaseServices(): FirebaseServices {
  if (!services) services = initFirebase();
  return services;
}

// Convenience named exports
export const firebaseApp = (() => getFirebaseServices().app)();
export const firebaseAuth = (() => getFirebaseServices().auth)();
export const firebaseDb = (() => getFirebaseServices().db)();
export const firebaseStorage = (() => getFirebaseServices().storage)();
export const firebaseAnalytics = (() => getFirebaseServices().analytics)();

export default getFirebaseServices;
