"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Fingerprint, IdCard, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBeep } from "@/hooks/useBeep";
import { useVoterProgress } from "@/hooks/useVoterProgress";
import { MOCK_CANDIDATES, NOTA_SERIAL } from "@/lib/evm/candidates";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuProgress from "@/components/ui/NeuProgress";
import BallotUnit from "./BallotUnit";
import ControlUnit from "./ControlUnit";
import VVPATWindow from "./VVPATWindow";

const STAGES = ["arrival", "ink", "ballot", "vvpat", "done"] as const;
type Stage = (typeof STAGES)[number];

/** The real statutory duration the slip stays visible. */
const VVPAT_SECONDS = 7;

export default function SimulationStage() {
  const { t } = useLanguage();
  const { completeStep } = useVoterProgress();

  const [stage, setStage] = useState<Stage>("arrival");
  const [muted, setMuted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(VVPAT_SECONDS);
  const [dropped, setDropped] = useState(false);
  const beep = useBeep(muted);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const stageIndex = STAGES.indexOf(stage);

  // Move focus to the new stage heading so keyboard and screen-reader users
  // are not left behind on a control that has just disappeared.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stage]);

  // The seven seconds run on a real clock; there is no "skip" button, because
  // the point of the stage is that the slip is readable for exactly that long.
  useEffect(() => {
    if (stage !== "vvpat" || dropped) return;
    if (secondsLeft <= 0) {
      setDropped(true);
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [stage, secondsLeft, dropped]);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      beep();
      setStage("vvpat");
      setSecondsLeft(VVPAT_SECONDS);
      setDropped(false);
    },
    [beep]
  );

  const restart = useCallback(() => {
    setSelectedId(null);
    setSecondsLeft(VVPAT_SECONDS);
    setDropped(false);
    setStage("arrival");
  }, []);

  useEffect(() => {
    if (stage === "done") completeStep("pollingDay");
  }, [stage, completeStep]);

  const chosen = MOCK_CANDIDATES.find((c) => c.id === selectedId);
  const slip = selectedId
    ? {
        serial: chosen?.serial ?? NOTA_SERIAL,
        name: chosen ? t(chosen.nameKey) : t("evm.nota"),
        symbol: chosen?.symbol ?? null,
      }
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="tabular text-xs font-semibold uppercase tracking-wide text-primary">
          {t("evm.stageOf", { n: stageIndex + 1, total: STAGES.length })}
        </p>
        <div className="flex items-center gap-2">
          <NeuButton
            size="sm"
            variant="ghost"
            onClick={() => setMuted((m) => !m)}
            icon={muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          >
            {muted ? t("evm.muted") : t("evm.unmuted")}
          </NeuButton>
          <NeuButton
            size="sm"
            variant="ghost"
            onClick={restart}
            icon={<RotateCcw size={15} />}
          >
            {t("evm.restart")}
          </NeuButton>
        </div>
      </div>

      <NeuProgress
        label={t("evm.progress")}
        value={stageIndex + 1}
        max={STAGES.length}
        showValue={false}
      />

      {/* Narration is the teaching surface, so it is announced, not decorative. */}
      <NeuCard className="p-6">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-bold text-foreground outline-none sm:text-xl"
        >
          {t(`evm.stage.${stage}`)}
        </h2>
        <p aria-live="polite" className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/70">
          {t(`evm.stage.${stage}Narration`)}
        </p>

        {stage === "arrival" && (
          <NeuButton
            variant="primary"
            className="mt-5"
            icon={<IdCard size={16} />}
            onClick={() => setStage("ink")}
          >
            {t("evm.stage.arrivalAction")}
          </NeuButton>
        )}

        {stage === "ink" && (
          <NeuButton
            variant="primary"
            className="mt-5"
            icon={<Fingerprint size={16} />}
            onClick={() => setStage("ballot")}
          >
            {t("evm.stage.inkAction")}
          </NeuButton>
        )}

        {stage === "vvpat" && dropped && (
          <NeuButton variant="primary" className="mt-5" onClick={() => setStage("done")}>
            {t("evm.next")}
          </NeuButton>
        )}

        {stage === "done" && (
          <div className="mt-4">
            <p className="text-sm text-foreground/80">
              {chosen ? (
                <>
                  {t("evm.stage.doneYouChose")}{" "}
                  <strong className="font-bold text-primary">{t(chosen.nameKey)}</strong>
                </>
              ) : (
                t("evm.stage.doneNota")
              )}
            </p>
            <NeuButton
              variant="primary"
              className="mt-5"
              icon={<RotateCcw size={16} />}
              onClick={restart}
            >
              {t("evm.restart")}
            </NeuButton>
          </div>
        )}
      </NeuCard>

      {/* The machines. Stacked in portrait rather than shrunk. */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
        <ControlUnit busy={stage === "ballot"} />

        {(stage === "ballot" || stage === "vvpat" || stage === "done") && (
          <BallotUnit
            enabled={stage === "ballot"}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {(stage === "vvpat" || stage === "done") && (
          <VVPATWindow slip={slip} secondsLeft={secondsLeft} dropped={dropped} />
        )}
      </div>

      {stage === "ballot" && (
        <p className="text-center text-xs text-foreground/45">{t("evm.stage.ballotHint")}</p>
      )}
    </div>
  );
}
