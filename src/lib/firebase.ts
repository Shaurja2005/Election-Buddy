import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim()
};

// Initialize Firebase safely for Next.js SSR
// If config is missing, initializeApp will fail, but we guard against usage in the AuthContext.
let app;
const hasFirebaseConfig = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (hasFirebaseConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (e) {
    console.warn("Firebase config missing or invalid.");
  }
}

const auth = app && hasFirebaseConfig ? getAuth(app) : null;
const googleProvider = hasFirebaseConfig ? new GoogleAuthProvider() : null;

export { app, auth, googleProvider };
