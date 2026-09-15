"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  User,
  Auth
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { initFirebase } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const authRef = useRef<Auth | null>(null);
  const storageRef = useRef<FirebaseStorage | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.firebase && data.firebase.apiKey) {
          const { auth, storage } = initFirebase(data.firebase);
          authRef.current = auth;
          storageRef.current = storage;
          
          if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (u) => {
              setUser(u);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load Firebase config", err);
        setLoading(false);
      });
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!authRef.current) {
      setAuthError(t("auth.notConfigured"));
      return;
    }
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(authRef.current, email, pass);
    } catch (error: any) {
      console.error("Error signing in", error);
      setAuthError(error.message || t("auth.signInFailed"));
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!authRef.current) {
      setAuthError(t("auth.notConfigured"));
      return;
    }
    try {
      setAuthError(null);
      await createUserWithEmailAndPassword(authRef.current, email, pass);
    } catch (error: any) {
      console.error("Error signing up", error);
      setAuthError(error.message || t("auth.signInFailed"));
      throw error;
    }
  };

  const logout = async () => {
    if (!authRef.current) return;
    try {
      await signOut(authRef.current);
    } catch (error) {
      console.error("Error signing out", error);
      setAuthError(t("auth.signOutFailed"));
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!storageRef.current || !user) {
      setAuthError(t("auth.signInToUpload"));
      return null;
    }
    try {
      setAuthError(null);
      const fileRef = ref(storageRef.current, `uploads/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      setAuthError(t("auth.uploadFailed"));
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, logout, uploadFile }}>
      {children}
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-4 start-1/2 z-[100] -translate-x-1/2 rtl:translate-x-1/2 flex max-w-[min(28rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-error/40 bg-base-100 px-4 py-3 shadow-lg"
        >
          <p className="flex-1 text-sm text-base-content">{authError}</p>
          <button
            type="button"
            onClick={() => setAuthError(null)}
            aria-label={t("common.close")}
            className="btn btn-ghost btn-xs btn-square -me-1"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
