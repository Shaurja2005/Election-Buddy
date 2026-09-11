import type { Locale } from "@/lib/i18n/locales";

/**
 * Each entry carries all eight languages inline rather than living in eight
 * parallel files, so a missing translation is visible where it is authored.
 */
export type Localized = Record<Locale, string>;

export interface OfficialLink {
  id: string;
  url: string;
  title: Localized;
  description: Localized;
}

export interface FormInfo {
  id: string;
  /** The official form number, e.g. "6". Not translated. */
  number: string;
  url: string;
  title: Localized;
  purpose: Localized;
  /** Who should file it. */
  whoFiles: Localized;
}

export interface DocumentItem {
  id: string;
  title: Localized;
  note: Localized;
  /** Required on polling day, or only for registration. */
  stage: "registration" | "pollingDay";
  required: boolean;
}

export interface GlossaryTerm {
  id: string;
  /** Latin-script form people type when searching, e.g. "EVM", "EPIC". */
  abbreviation?: string;
  term: Localized;
  definition: Localized;
}

export interface EligibilityRule {
  id: string;
  rule: Localized;
}

export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}
