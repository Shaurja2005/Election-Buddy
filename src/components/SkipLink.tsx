"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
