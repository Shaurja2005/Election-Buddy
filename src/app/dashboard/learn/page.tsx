"use client";

import Link from "next/link";
import { Check, ClipboardCheck, FileText, BookOpen, Trophy, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoterProgress, JOURNEY_STEPS, type JourneyStep } from "@/hooks/useVoterProgress";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuProgress from "@/components/ui/NeuProgress";

const MODULES = [
  { href: "/dashboard/learn/eligibility", labelKey: "learn.eligibility", icon: ClipboardCheck },
  { href: "/dashboard/learn/documents", labelKey: "learn.documents", icon: FileText },
  { href: "/dashboard/learn/glossary", labelKey: "learn.glossary", icon: BookOpen },
  { href: "/dashboard/learn/quiz", labelKey: "learn.quiz", icon: Trophy },
];

export default function LearnPage() {
  const { t } = useLanguage();
  const { completedSteps, completeStep, totalSteps, isLoaded } = useVoterProgress();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("learn.title")}</h2>
        <p className="mt-1.5 max-w-xl text-sm text-foreground/65">{t("learn.subtitle")}</p>
      </div>

      <NeuCard className="p-6">
        <NeuProgress
          label={t("learn.journey")}
          value={isLoaded ? completedSteps.length : 0}
          max={totalSteps}
        />
      </NeuCard>

      {/* A timeline, not a card grid: the order is the information. */}
      <ol className="relative flex flex-col gap-4 ps-8">
        <span
          aria-hidden="true"
          className="absolute inset-y-2 start-[0.6875rem] w-px bg-nm-edge"
        />
        {JOURNEY_STEPS.map((step: JourneyStep, index) => {
          const done = completedSteps.includes(step);
          return (
            <li key={step} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -start-8 top-5 flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-nm-sunken text-foreground/50 shadow-nm-inset"
                }`}
              >
                {done ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>

              <NeuCard className="p-5">
                <h3 className="font-semibold text-foreground">{t(`learn.step.${step}`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
                  {t(`learn.step.${step}Body`)}
                </p>
                <div className="mt-4">
                  {done ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                      {t("learn.markedDone")}
                    </span>
                  ) : (
                    <NeuButton size="sm" onClick={() => completeStep(step)}>
                      {t("learn.markDone")}
                    </NeuButton>
                  )}
                </div>
              </NeuCard>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map(({ href, labelKey, icon: Icon }) => (
          <NeuCard key={href} as={Link} href={href} interactive className="group block p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <Icon size={18} className="shrink-0 text-primary" aria-hidden="true" />
                <span className="font-semibold text-foreground">{t(labelKey)}</span>
              </span>
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="shrink-0 text-foreground/35 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
              />
            </div>
          </NeuCard>
        ))}
      </div>
    </div>
  );
}
