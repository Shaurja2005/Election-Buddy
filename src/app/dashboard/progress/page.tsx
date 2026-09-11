"use client";

import Link from "next/link";
import { Check, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoterProgress, JOURNEY_STEPS } from "@/hooks/useVoterProgress";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuProgress from "@/components/ui/NeuProgress";

export default function ProgressPage() {
  const { t } = useLanguage();
  const { completedSteps, badges, totalSteps, isLoaded } = useVoterProgress();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-2">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("nav.progress")}</h2>

      <NeuCard className="p-6">
        <NeuProgress
          label={t("dash.journey")}
          value={isLoaded ? completedSteps.length : 0}
          max={totalSteps}
        />
        <ul className="mt-5 flex flex-col gap-2.5">
          {JOURNEY_STEPS.map((step) => {
            const done = completedSteps.includes(step);
            return (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-nm-sunken shadow-nm-inset ring-1 ring-nm-edge"
                  }`}
                >
                  {done && <Check size={13} strokeWidth={3} />}
                </span>
                <span className={done ? "text-foreground" : "text-foreground/55"}>
                  {t(`learn.step.${step}`)}
                </span>
              </li>
            );
          })}
        </ul>
      </NeuCard>

      <NeuCard className="p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground/85">{t("dash.quiz")}</p>
          <Trophy
            size={18}
            className={badges.length ? "text-primary" : "text-foreground/30"}
            aria-hidden="true"
          />
        </div>
        <p dir="ltr" className="tabular mt-3 text-2xl font-bold leading-none text-foreground">
          {isLoaded ? badges.length : 0}
        </p>
        <p className="mt-2 text-xs text-foreground/55">{t("dash.quizDetail")}</p>
        <NeuButton as={Link} href="/dashboard/learn/quiz" size="sm" className="mt-5">
          {t("learn.quiz")}
        </NeuButton>
      </NeuCard>
    </div>
  );
}
