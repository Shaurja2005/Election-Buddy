"use client";

import type { GameSound } from "@/hooks/useGame";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { OFFICER_LINES } from "@/lib/game/data";
import { SceneBanner } from "./GameShell";

export default function StageOfficer({
  playerName,
  gender,
  onDone,
  play,
}: {
  playerName: string;
  gender: "male" | "female";
  onDone: () => void;
  play: (s: GameSound) => void;
}) {
  const { t } = useLanguage();
  const [line, setLine] = useState(0);
  const isLast = line === OFFICER_LINES.length - 1;

  const advance = () => {
    play("click");
    if (isLast) {
      onDone();
      return;
    }
    setLine((l) => l + 1);
  };

  return (
    <div className="absolute inset-0">
      <Image
        src="/game/img/polling_booth_interior.webp"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 900px"
        className="object-cover"
        priority
      />

      <SceneBanner>{t("game.officer.prompt")}</SceneBanner>

      <div className="absolute inset-x-0 bottom-0 top-16 flex items-end justify-between gap-2 px-3 pb-3 sm:top-14 sm:px-6 sm:pb-5">
        <div className="relative h-[62%] w-[30%] max-w-[13rem] shrink-0">
          <Image
            src="/game/img/police_officer.webp"
            alt={t("game.officer.alt")}
            fill
            sizes="210px"
            className="object-contain object-bottom"
          />
        </div>

        <div className="relative h-[52%] w-[24%] max-w-[9rem] shrink-0 order-last">
          <Image
            src={`/game/img/${gender}.webp`}
            alt={playerName}
            fill
            sizes="140px"
            className="object-contain object-bottom"
          />
        </div>

        {/* Speech panel sits between the two figures so the exchange reads as a conversation. */}
        <div
          key={line}
          className="mb-2 min-w-0 flex-1 animate-in fade-in slide-in-from-bottom-2 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-sm duration-300 motion-reduce:animate-none sm:p-4"
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#1f3a93] sm:text-xs">
            {t("game.officer.role")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#0b1f3f] sm:text-sm">
            {t(`game.officer.line.${OFFICER_LINES[line]}`, { name: playerName })}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="flex gap-1" aria-hidden="true">
              {OFFICER_LINES.map((k, i) => (
                <span
                  key={k}
                  className={`h-1.5 rounded-full transition-all ${
                    i === line ? "w-4 bg-[#1f3a93]" : "w-1.5 bg-[#0b1f3f]/20"
                  }`}
                />
              ))}
            </span>
            <button
              type="button"
              onClick={advance}
              autoFocus
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f3a93] sm:text-sm"
            >
              {isLast ? t("game.officer.enter") : t("game.next")}
              <ArrowRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
