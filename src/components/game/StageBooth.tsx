"use client";

import type { GameSound } from "@/hooks/useGame";
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAME_BUILDINGS } from "@/lib/game/data";
import { SceneBanner, useToast } from "./GameShell";

/**
 * The street art ships without buildings, so each one is drawn here in the
 * same flat style. Swapping in painted sprites later only means replacing
 * this shape with an <Image>.
 */
function Building({ color, roof }: { color: string; roof: string }) {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-md" aria-hidden="true">
      <path d="M6 34 50 8l44 26z" fill={roof} />
      <rect x="12" y="34" width="76" height="78" rx="3" fill={color} stroke="#0b1f3f" strokeWidth="2.5" />
      <rect x="41" y="76" width="18" height="36" rx="2" fill={roof} stroke="#0b1f3f" strokeWidth="2" />
      <rect x="20" y="46" width="18" height="16" rx="2" fill="#fff" stroke="#0b1f3f" strokeWidth="2" />
      <rect x="62" y="46" width="18" height="16" rx="2" fill="#fff" stroke="#0b1f3f" strokeWidth="2" />
      <rect x="20" y="76" width="14" height="14" rx="2" fill="#fff" stroke="#0b1f3f" strokeWidth="2" />
      <rect x="66" y="76" width="14" height="14" rx="2" fill="#fff" stroke="#0b1f3f" strokeWidth="2" />
    </svg>
  );
}

export default function StageBooth({
  onDone,
  play,
}: {
  onDone: () => void;
  play: (s: GameSound) => void;
}) {
  const { t } = useLanguage();
  const { showToast, toastNode } = useToast();
  const [shaking, setShaking] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const pick = (id: string, correct: boolean) => {
    if (done) return;
    play("building");
    if (!correct) {
      setShaking(id);
      setTimeout(() => setShaking(null), 420);
      showToast({ text: t(`game.booth.${id}.reject`), ok: false });
      return;
    }
    setDone(true);
    showToast({ text: t("game.booth.correct"), ok: true });
    setTimeout(onDone, 1100);
  };

  return (
    <div className="absolute inset-0 bg-[#bfe8f2]">
      <Image
        src="/game/img/town_street_bg.webp"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 900px"
        className="object-cover"
        priority
      />

      <SceneBanner>{t("game.booth.prompt")}</SceneBanner>

      {GAME_BUILDINGS.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => pick(b.id, b.correct)}
          className={`absolute bottom-[26%] z-10 flex w-[17%] flex-col items-center gap-1 outline-none transition-transform duration-200 focus-visible:ring-4 focus-visible:ring-white ${
            done && b.correct ? "scale-110" : "hover:-translate-y-1.5"
          } ${shaking === b.id ? "game-shake" : ""}`}
          style={{ insetInlineStart: `${b.x}%` }}
        >
          <span className="aspect-[5/6] w-full">
            <Building color={b.color} roof={b.roof} />
          </span>
          <span
            className={`max-w-full truncate rounded-md px-2 py-0.5 text-[9px] font-bold shadow-md sm:text-[11px] ${
              done && b.correct ? "bg-[#2f7a4a] text-white" : "bg-white text-[#0b1f3f]"
            }`}
          >
            {t(`game.booth.${b.id}.label`)}
          </span>
        </button>
      ))}

      {toastNode}
    </div>
  );
}
