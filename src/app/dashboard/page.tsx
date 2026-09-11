"use client";

import Link from "next/link";
import { ArrowRight, Vote, MessagesSquare, Phone, ClipboardCheck, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoterProgress } from "@/hooks/useVoterProgress";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuProgress from "@/components/ui/NeuProgress";

export default function DashboardOverview() {
  const { t } = useLanguage();
  const { completedSteps, badges, totalSteps, isLoaded } = useVoterProgress();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("dash.greeting")}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-foreground/65">
          {t("dash.subtitle")}
        </p>
      </div>

      {/* The one card that has to earn its place: what to do next. */}
      <NeuCard className="p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t("dash.nextStep")}
        </p>
        <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
          {t("dash.nextStep.unknown")}
        </h3>
        <p className="mt-2 max-w-lg text-sm text-foreground/65">
          {t("dash.nextStep.unknownBody")}
        </p>
        <NeuButton
          as={Link}
          href="/dashboard/learn/eligibility"
          variant="primary"
          className="mt-5"
          icon={<ClipboardCheck size={16} />}
        >
          {t("dash.nextStep.action")}
        </NeuButton>
      </NeuCard>

      <div className="grid gap-5 sm:grid-cols-2">
        <NeuCard className="p-6">
          <NeuProgress
            label={t("dash.journey")}
            value={isLoaded ? completedSteps.length : 0}
            max={totalSteps}
          />
          <p className="mt-3 text-xs text-foreground/55">{t("dash.journeyDetail")}</p>
        </NeuCard>

        <NeuCard className="p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-foreground/85">{t("dash.quiz")}</p>
            <Trophy size={18} className="shrink-0 text-primary" aria-hidden="true" />
          </div>
          <p dir="ltr" className="tabular mt-3 text-2xl font-bold leading-none text-foreground">
            {isLoaded ? badges.length : 0}
          </p>
          <p className="mt-2 text-xs text-foreground/55">{t("dash.quizDetail")}</p>
        </NeuCard>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <NeuCard as={Link} href="/dashboard/simulate" interactive className="group block p-6">
          <div className="flex items-start justify-between gap-3">
            <Vote size={20} className="shrink-0 text-primary" aria-hidden="true" />
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-foreground/35 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
            />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">{t("dash.openSimulator")}</h3>
          <p className="mt-1.5 text-sm text-foreground/60">{t("dash.openSimulatorBody")}</p>
        </NeuCard>

        <NeuCard as={Link} href="/dashboard/chat" interactive className="group block p-6">
          <div className="flex items-start justify-between gap-3">
            <MessagesSquare size={20} className="shrink-0 text-primary" aria-hidden="true" />
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-foreground/35 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
            />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">{t("dash.openChat")}</h3>
          <p className="mt-1.5 text-sm text-foreground/60">{t("dash.openChatBody")}</p>
        </NeuCard>
      </div>

      <NeuCard elevation="sunken" className="flex flex-wrap items-center gap-x-5 gap-y-2 p-5">
        <Phone size={18} className="shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {t("dash.helpline")} <span dir="ltr" className="tabular">1950</span>
          </p>
          <p className="mt-0.5 text-xs text-foreground/60">{t("dash.helplineBody")}</p>
        </div>
      </NeuCard>
    </div>
  );
}
