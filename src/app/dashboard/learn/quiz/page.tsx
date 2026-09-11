"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoterProgress } from "@/hooks/useVoterProgress";
import { QUIZ, QUIZ_BADGE } from "@/lib/india/quiz";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuProgress from "@/components/ui/NeuProgress";

export default function QuizPage() {
  const { t } = useLanguage();
  const { awardBadge } = useVoterProgress();

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ[index];
  const isLast = index === QUIZ.length - 1;

  function choose(option: number) {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.answer) setScore((s) => s + 1);
  }

  function advance() {
    if (isLast) {
      // The badge marks a clean sweep, so it is awarded on the final tally.
      const finalScore = score;
      if (finalScore === QUIZ.length) awardBadge(QUIZ_BADGE);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="mx-auto w-full max-w-2xl py-2">
        <NeuCard className="p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("learn.quiz")}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/70">
            {t("learn.quiz.intro")}
          </p>
          <NeuButton
            variant="primary"
            size="lg"
            className="mt-7"
            icon={<Trophy size={18} />}
            onClick={() => setStarted(true)}
          >
            {t("learn.quiz.start")}
          </NeuButton>
        </NeuCard>
      </div>
    );
  }

  if (finished) {
    const perfect = score === QUIZ.length;
    return (
      <div className="mx-auto w-full max-w-2xl py-2">
        <NeuCard className="p-8 sm:p-10 text-center">
          <Trophy
            size={36}
            className={`mx-auto ${perfect ? "text-primary" : "text-foreground/35"}`}
            aria-hidden="true"
          />
          <p className="mt-4 text-lg font-bold text-foreground">
            {t("learn.quiz.score", { score, total: QUIZ.length })}
          </p>
          {perfect && (
            <p className="mt-2 text-sm font-semibold text-primary">
              {t("learn.quiz.badgeEarned")}
            </p>
          )}
          <NeuButton
            variant="primary"
            className="mt-6"
            icon={<RotateCcw size={16} />}
            onClick={restart}
          >
            {t("learn.quiz.again")}
          </NeuButton>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2">
      <NeuProgress
        label={t("learn.quiz.question", { n: index + 1, total: QUIZ.length })}
        value={index + 1}
        max={QUIZ.length}
        showValue={false}
      />

      <NeuCard className="p-6 sm:p-7">
        <h2 className="text-lg font-bold leading-snug text-foreground">
          {t(`learn.${question.id}`)}
        </h2>

        <ul className="mt-5 flex flex-col gap-3">
          {question.options.map((optionKey, i) => {
            const isAnswer = i === question.answer;
            const isPicked = picked === i;
            const revealed = picked !== null;
            return (
              <li key={optionKey}>
                <button
                  type="button"
                  disabled={revealed}
                  onClick={() => choose(i)}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-start text-sm",
                    "transition-shadow duration-150 motion-reduce:transition-none",
                    revealed && isAnswer
                      ? "bg-nm-sunken font-semibold text-primary shadow-nm-inset ring-1 ring-primary"
                      : revealed && isPicked
                        ? "bg-nm-sunken text-destructive shadow-nm-inset ring-1 ring-destructive"
                        : revealed
                          ? "text-foreground/45"
                          : "text-foreground shadow-nm-raised hover:shadow-nm-raised-lg",
                  ].join(" ")}
                >
                  <span>{t(optionKey)}</span>
                  {revealed && isAnswer && (
                    <Check size={17} strokeWidth={3} className="shrink-0" aria-hidden="true" />
                  )}
                  {revealed && isPicked && !isAnswer && (
                    <X size={17} strokeWidth={3} className="shrink-0" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* The explanation is where the learning happens, so it is announced
            and it appears whether the answer was right or wrong. */}
        {picked !== null && (
          <div aria-live="polite" className="mt-5 rounded-xl bg-nm-sunken p-4 shadow-nm-inset">
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                picked === question.answer ? "text-primary" : "text-destructive"
              }`}
            >
              {picked === question.answer ? t("learn.quiz.correct") : t("learn.quiz.incorrect")}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
              {t(`learn.${question.id}.exp`)}
            </p>
          </div>
        )}

        {picked !== null && (
          <NeuButton variant="primary" className="mt-5" onClick={advance}>
            {isLast ? t("learn.quiz.finish") : t("learn.quiz.next")}
          </NeuButton>
        )}
      </NeuCard>
    </div>
  );
}
