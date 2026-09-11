"use client";

import { useState } from "react";
import { RotateCcw, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoterProgress } from "@/hooks/useVoterProgress";
import { FORMS } from "@/lib/india/eligibility";
import { pick } from "@/lib/india/types";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";

type Answer = "yes" | "no" | "unsure";

const QUESTIONS = [
  "citizen",
  "age",
  "registered",
  "moved",
  "detailsCorrect",
] as const;
type QuestionId = (typeof QUESTIONS)[number];

interface Outcome {
  titleKey: string;
  bodyKey: string;
  formId?: string;
  progress: "eligible" | "needsForm6" | "needsUpdate" | "unknown";
}

/**
 * The branch order matters: a "no" on citizenship or age ends the wizard,
 * because no form fixes either. Everything after that is about which form.
 */
function decide(answers: Partial<Record<QuestionId, Answer>>): Outcome | null {
  const { citizen, age, registered, moved, detailsCorrect } = answers;
  if (!citizen || !age) return null;

  if (citizen === "no" || age === "no") {
    return {
      titleKey: "learn.eligibility.notEligible",
      bodyKey: "learn.eligibility.notEligibleBody",
      progress: "unknown",
    };
  }

  if (!registered) return null;
  if (registered === "unsure") {
    return {
      titleKey: "learn.eligibility.checkRollFirst",
      bodyKey: "learn.eligibility.checkRollFirstBody",
      progress: "unknown",
    };
  }
  if (registered === "no") {
    return {
      titleKey: "learn.eligibility.needsForm6",
      bodyKey: "learn.eligibility.needsForm6Body",
      formId: "form6",
      progress: "needsForm6",
    };
  }

  if (!moved) return null;
  if (moved === "yes") {
    return {
      titleKey: "learn.eligibility.needsForm6",
      bodyKey: "learn.eligibility.needsForm6Body",
      formId: "form6",
      progress: "needsForm6",
    };
  }

  if (!detailsCorrect) return null;
  if (detailsCorrect === "no") {
    return {
      titleKey: "learn.eligibility.needsForm8",
      bodyKey: "learn.eligibility.needsForm8Body",
      formId: "form8",
      progress: "needsUpdate",
    };
  }

  return {
    titleKey: "learn.eligibility.allGood",
    bodyKey: "learn.eligibility.allGoodBody",
    progress: "eligible",
  };
}

/** Which question to show next, given what has been answered. */
function nextQuestion(answers: Partial<Record<QuestionId, Answer>>): QuestionId | null {
  for (const q of QUESTIONS) {
    if (answers[q]) continue;
    if (q === "moved" && answers.registered !== "yes") return null;
    if (q === "detailsCorrect" && answers.registered !== "yes") return null;
    return q;
  }
  return null;
}

export default function EligibilityPage() {
  const { t, locale } = useLanguage();
  const { setEligibility } = useVoterProgress();
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, Answer>>>({});

  const outcome = decide(answers);
  const current = outcome ? null : nextQuestion(answers);

  function answer(q: QuestionId, value: Answer) {
    const next = { ...answers, [q]: value };
    setAnswers(next);
    const result = decide(next);
    if (result) setEligibility(result.progress);
  }

  const form = outcome?.formId ? FORMS.find((f) => f.id === outcome.formId) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("learn.eligibility")}
        </h2>
        <p className="mt-1.5 text-sm text-foreground/65">{t("learn.eligibility.intro")}</p>
      </div>

      {current && (
        <NeuCard className="p-6 sm:p-7">
          <h3 className="text-lg font-bold text-foreground">
            {t(`learn.eligibility.q.${current}`)}
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            <NeuButton variant="primary" onClick={() => answer(current, "yes")}>
              {t("learn.eligibility.yes")}
            </NeuButton>
            <NeuButton onClick={() => answer(current, "no")}>
              {t("learn.eligibility.no")}
            </NeuButton>
            {current === "registered" && (
              <NeuButton variant="ghost" onClick={() => answer(current, "unsure")}>
                {t("learn.eligibility.unsure")}
              </NeuButton>
            )}
          </div>
        </NeuCard>
      )}

      {outcome && (
        <NeuCard className="p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t("learn.eligibility.result")}
          </p>
          <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
            {t(outcome.titleKey)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            {t(outcome.bodyKey)}
          </p>

          {form && (
            <p className="mt-4 rounded-xl bg-nm-sunken p-4 text-sm text-foreground/75 shadow-nm-inset">
              <strong className="font-semibold text-foreground">
                {pick(form.title, locale)}
              </strong>{" "}
              — {pick(form.whoFiles, locale)}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {form && (
              <NeuButton
                as="a"
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon={<ExternalLink size={15} />}
              >
                {t("learn.eligibility.openForm")}
              </NeuButton>
            )}
            <NeuButton
              variant="ghost"
              onClick={() => setAnswers({})}
              icon={<RotateCcw size={15} />}
            >
              {t("learn.eligibility.restart")}
            </NeuButton>
          </div>
        </NeuCard>
      )}
    </div>
  );
}
