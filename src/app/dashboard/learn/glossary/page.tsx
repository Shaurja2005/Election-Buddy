"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GLOSSARY } from "@/lib/india/glossary";
import { pick } from "@/lib/india/types";
import NeuCard from "@/components/ui/NeuCard";
import NeuInput from "@/components/ui/NeuInput";

export default function GlossaryPage() {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    // Match the native script and the Latin abbreviation both, so someone
    // typing "EVM" and someone typing "ஈவிஎம்" each land on the entry.
    return GLOSSARY.filter((term) =>
      [term.abbreviation ?? "", pick(term.term, locale), pick(term.definition, locale), term.term.en]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, locale]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("learn.glossary")}
        </h2>
        <p className="mt-1.5 text-sm text-foreground/65">{t("learn.glossary.intro")}</p>
      </div>

      <NeuInput
        label={t("learn.glossary.search")}
        placeholder={t("learn.glossary.searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search size={16} />}
        type="search"
      />

      {results.length === 0 ? (
        <NeuCard elevation="sunken" className="p-8 text-center">
          <p className="text-sm text-foreground/60">{t("learn.glossary.noResults")}</p>
        </NeuCard>
      ) : (
        <dl className="flex flex-col gap-4">
          {results.map((term) => (
            <NeuCard key={term.id} as="div" className="p-5">
              <dt className="font-semibold text-foreground">{pick(term.term, locale)}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground/65">
                {pick(term.definition, locale)}
              </dd>
            </NeuCard>
          ))}
        </dl>
      )}
    </div>
  );
}
