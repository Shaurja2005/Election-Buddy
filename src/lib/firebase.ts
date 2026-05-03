import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

export function initFirebase(config: Record<string, string>) {
  if (!config.apiKey) {
    return { auth: null, googleProvider: null };
  }

  let app;
  try {
    app = !getApps().length ? initializeApp(config) : getApp();
  } catch (e) {
    console.warn("Firebase config missing or invalid.");
  }

  const auth = app ? getAuth(app) : null;
  const googleProvider = new GoogleAuthProvider();

  return { auth, googleProvider };
}
