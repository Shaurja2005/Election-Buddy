"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import NeuCard from "@/components/ui/NeuCard";

/** Honest stand-in for a route whose feature has not been built yet. */
export default function ComingSoon({ titleKey }: { titleKey: string }) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto w-full max-w-5xl py-2">
      <NeuCard elevation="sunken" className="p-10 text-center">
        <h2 className="text-lg font-semibold text-foreground">{t(titleKey)}</h2>
        <p className="mt-2 text-sm text-foreground/60">{t("dash.comingSoon")}</p>
      </NeuCard>
    </div>
  );
}
