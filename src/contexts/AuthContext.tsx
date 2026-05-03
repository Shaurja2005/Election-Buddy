"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  Auth,
  GoogleAuthProvider
} from "firebase/auth";
import { initFirebase } from "@/lib/firebase";
import type { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // We store auth and provider in refs so they persist across renders
  const authRef = useRef<Auth | null>(null);
  const providerRef = useRef<GoogleAuthProvider | null>(null);

  useEffect(() => {
    // Dynamically fetch Firebase config at runtime to completely bypass Cloud Run's build-time limitation
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.firebase && data.firebase.apiKey) {
          const { auth, googleProvider } = initFirebase(data.firebase);
          authRef.current = auth;
          providerRef.current = googleProvider;
          
          if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (u) => {
              setUser(u);
              setLoading(false);
            });
            // Note: Returning from inside a promise .then() doesn't act as a useEffect cleanup
            // but for a singleton auth state in a root provider it's generally okay.
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

  const signInWithGoogle = async () => {
    if (!authRef.current || !providerRef.current) {
      alert("Firebase is not configured properly. Ensure your environment variables are correctly set in Cloud Run.");
      return;
    }
    try {
      await signInWithPopup(authRef.current, providerRef.current);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    if (!authRef.current) return;
    try {
      await signOut(authRef.current);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
