"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SceneBanner, useToast } from "./GameShell";

const ELECTION_DAY = 17;
const DAYS_IN_MONTH = 30;
/** Month starts on a Wednesday, so the grid gets three leading blanks. */
const LEADING_BLANKS = 3;
const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export default function StageElectionDay({
  onDone,
  play,
}: {
  onDone: () => void;
  play: (s: "paper" | "beep") => void;
}) {
  const { t } = useLanguage();
  const { showToast, toastNode } = useToast();
  const [picked, setPicked] = useState(false);

  const pick = (day: number) => {
    if (picked) return;
    play("paper");
    if (day !== ELECTION_DAY) {
      showToast({ text: t("game.day.wrong"), ok: false });
      return;
    }
    setPicked(true);
    showToast({ text: t("game.day.correct"), ok: true });
    setTimeout(onDone, 1100);
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#ffe9c7] to-[#ffd6a0]">
      <SceneBanner>{t("game.day.prompt")}</SceneBanner>

      <div className="absolute inset-0 flex items-center justify-center p-3 pt-16 sm:pt-14">
        <div className="flex h-full w-full max-w-md flex-col rounded-2xl border-4 border-[#0b1f3f] bg-white p-2.5 shadow-2xl sm:p-4">
          <div className="flex shrink-0 items-center justify-between rounded-lg bg-[#0b1f3f] px-3 py-1.5">
            <span className="text-sm font-extrabold text-white">{t("game.day.month")}</span>
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff9f45]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5fd08a]" />
            </span>
          </div>

          <div className="mt-2 grid shrink-0 grid-cols-7 gap-1">
            {WEEKDAY_KEYS.map((d) => (
              <span
                key={d}
                className="text-center text-[9px] font-bold uppercase text-[#0b1f3f]/50 sm:text-[10px]"
              >
                {t(`game.day.short.${d}`)}
              </span>
            ))}
          </div>

          <div className="mt-1 grid min-h-0 flex-1 grid-cols-7 gap-1">
            {Array.from({ length: LEADING_BLANKS }, (_, i) => (
              <span key={`blank-${i}`} aria-hidden="true" />
            ))}
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((day) => {
              const isElection = day === ELECTION_DAY;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => pick(day)}
                  aria-label={
                    isElection ? t("game.day.electionDayLabel", { day: String(day) }) : String(day)
                  }
                  className={`flex items-center justify-center rounded-md text-[11px] font-bold transition sm:text-sm ${
                    isElection
                      ? `bg-[#d7342a] text-white shadow-md ring-2 ring-[#d7342a]/40 ${
                          picked ? "scale-110" : "animate-pulse hover:scale-110 motion-reduce:animate-none"
                        }`
                      : "bg-[#0b1f3f]/5 text-[#0b1f3f]/75 hover:bg-[#0b1f3f]/12"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="mt-2 shrink-0 text-center text-[10px] font-semibold text-[#d7342a] sm:text-xs">
            {t("game.day.legend")}
          </p>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
