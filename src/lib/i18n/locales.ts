export type Direction = "ltr" | "rtl";

export interface LocaleMeta {
  /** English name, used in code and analytics. */
  name: string;
  /** Endonym — how speakers write the language in their own script. */
  native: string;
  dir: Direction;
  /** Key into the font-variable map in globals.css. */
  font: string;
  /** BCP-47 tag for Intl formatting (dates, numbers, segmentation). */
  intl: string;
}

export const LOCALES = {
  en: { name: "English", native: "English", dir: "ltr", font: "latin", intl: "en-IN" },
  hi: { name: "Hindi", native: "हिन्दी", dir: "ltr", font: "devanagari", intl: "hi-IN" },
  bn: { name: "Bengali", native: "বাংলা", dir: "ltr", font: "bengali", intl: "bn-IN" },
  ta: { name: "Tamil", native: "தமிழ்", dir: "ltr", font: "tamil", intl: "ta-IN" },
  te: { name: "Telugu", native: "తెలుగు", dir: "ltr", font: "telugu", intl: "te-IN" },
  kn: { name: "Kannada", native: "ಕನ್ನಡ", dir: "ltr", font: "kannada", intl: "kn-IN" },
  ml: { name: "Malayalam", native: "മലയാളം", dir: "ltr", font: "malayalam", intl: "ml-IN" },
  ur: { name: "Urdu", native: "اردو", dir: "rtl", font: "urdu", intl: "ur-IN" },
} as const satisfies Record<string, LocaleMeta>;

export type Locale = keyof typeof LOCALES;

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "ballot-buddy-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in LOCALES;
}

/** Maps a browser language tag ("ta-IN", "hi") onto a supported locale. */
export function resolveBrowserLocale(tags: readonly string[]): Locale | null {
  for (const tag of tags) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
