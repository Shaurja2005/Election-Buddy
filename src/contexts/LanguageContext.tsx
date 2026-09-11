"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  isLocale,
  resolveBrowserLocale,
  type Direction,
  type Locale,
} from "@/lib/i18n/locales";

import en from "@/lib/i18n/dictionaries/en.json";
import hi from "@/lib/i18n/dictionaries/hi.json";
import bn from "@/lib/i18n/dictionaries/bn.json";
import ta from "@/lib/i18n/dictionaries/ta.json";
import te from "@/lib/i18n/dictionaries/te.json";
import kn from "@/lib/i18n/dictionaries/kn.json";
import ml from "@/lib/i18n/dictionaries/ml.json";
import ur from "@/lib/i18n/dictionaries/ur.json";

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, bn, ta, te, kn, ml, ur };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a key, optionally interpolating `{name}`-style placeholders. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: Direction;
  /** BCP-47 tag for Intl date/number/segmentation APIs. */
  intlLocale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at the default so server and first client render agree; the
  // stored preference is applied in the effect below.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let next: Locale | null = null;
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) next = stored;
    } catch {
      // Private mode or blocked storage — fall through to browser languages.
    }
    if (!next) next = resolveBrowserLocale(navigator.languages ?? [navigator.language]);
    if (next && next !== DEFAULT_LOCALE) setLocaleState(next);
  }, []);

  // `layout.tsx` is a server component, so lang/dir are driven from here.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = LOCALES[locale].dir;
    root.dataset.font = LOCALES[locale].font;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Preference simply won't persist; the session still switches.
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = DICTIONARIES[locale][key] ?? en[key as keyof typeof en];
      if (value === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] Missing translation key: "${key}"`);
        }
        return key;
      }
      return interpolate(value, vars);
    },
    [locale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir: LOCALES[locale].dir,
      intlLocale: LOCALES[locale].intl,
    }),
    [locale, setLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
