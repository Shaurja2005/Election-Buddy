"use client";

import { useEffect, useState } from "react";
import { Check, Printer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DOCUMENTS } from "@/lib/india/documents";
import { pick } from "@/lib/india/types";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";

const STORAGE_KEY = "ballot-buddy-documents";

export default function DocumentsPage() {
  const { t, locale } = useLanguage();
  const [ticked, setTicked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setTicked(JSON.parse(raw) as string[]);
    } catch {
      // Start unticked.
    }
  }, []);

  function toggle(id: string) {
    setTicked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ticks stay for this session only.
      }
      return next;
    });
  }

  const groups = [
    { stage: "registration" as const, labelKey: "learn.documents.registration" },
    { stage: "pollingDay" as const, labelKey: "learn.documents.pollingDay" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("learn.documents")}
          </h2>
          <p className="mt-1.5 text-sm text-foreground/65">{t("learn.documents.intro")}</p>
        </div>
        <NeuButton
          size="sm"
          variant="ghost"
          onClick={() => window.print()}
          icon={<Printer size={15} />}
          className="print:hidden"
        >
          {t("learn.documents.print")}
        </NeuButton>
      </div>

      {groups.map(({ stage, labelKey }) => {
        const items = DOCUMENTS.filter((d) => d.stage === stage);
        if (items.length === 0) return null;
        return (
          <section key={stage} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t(labelKey)}
            </h3>
            <ul className="flex flex-col gap-3">
              {items.map((doc) => {
                const on = ticked.includes(doc.id);
                return (
                  <li key={doc.id}>
                    <NeuCard className="p-0">
                      <button
                        type="button"
                        onClick={() => toggle(doc.id)}
                        aria-pressed={on}
                        className="flex w-full items-start gap-3.5 p-5 text-start"
                      >
                        {/* A tick box, not a bare shadow: the state is visible
                            without relying on depth alone. */}
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors duration-150 motion-reduce:transition-none ${
                            on
                              ? "bg-primary text-primary-foreground"
                              : "bg-nm-sunken shadow-nm-inset ring-1 ring-nm-edge"
                          }`}
                        >
                          {on && <Check size={13} strokeWidth={3} />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block font-semibold ${
                              on ? "text-foreground/50 line-through" : "text-foreground"
                            }`}
                          >
                            {pick(doc.title, locale)}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-foreground/60">
                            {pick(doc.note, locale)}
                          </span>
                          {!doc.required && (
                            <span className="mt-2 inline-block rounded-full bg-nm-sunken px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-foreground/55">
                              {t("learn.documents.optional")}
                            </span>
                          )}
                        </span>
                      </button>
                    </NeuCard>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
