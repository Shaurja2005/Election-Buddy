"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROLL_FILLER_NAMES } from "@/lib/game/data";
import { SceneBanner, useToast } from "./GameShell";

/** Deterministic shuffle so the roll does not reorder on every re-render. */
function seededOrder<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function StageRoll({
  playerName,
  stateName,
  onDone,
  play,
}: {
  playerName: string;
  stateName: string;
  onDone: () => void;
  play: (s: "paper" | "beep") => void;
}) {
  const { t } = useLanguage();
  const { showToast, toastNode } = useToast();
  const [ticked, setTicked] = useState(false);

  const rows = useMemo(() => {
    const seed = playerName.split("").reduce((a, c) => a + c.charCodeAt(0), 7);
    const names = seededOrder([...ROLL_FILLER_NAMES.slice(0, 13), playerName], seed);
    return names.map((name, i) => ({ name, serial: 101 + i, isPlayer: name === playerName }));
  }, [playerName]);

  const pick = (isPlayer: boolean, name: string) => {
    if (ticked) return;
    play("paper");
    if (!isPlayer) {
      showToast({ text: t("game.roll.wrong", { name }), ok: false });
      return;
    }
    setTicked(true);
    showToast({ text: t("game.roll.correct"), ok: true });
    setTimeout(onDone, 1200);
  };

  return (
    <div className="absolute inset-0 bg-[#3b2f23]">
      <SceneBanner>{t("game.roll.prompt")}</SceneBanner>

      <div className="absolute inset-0 flex items-center justify-center p-3 pt-16 sm:pt-14">
        <div className="flex h-full w-full max-w-lg flex-col rounded-sm bg-[#fdf8ec] p-3 shadow-2xl [background-image:repeating-linear-gradient(transparent,transparent_27px,rgba(11,31,63,0.07)_28px)] sm:p-5">
          <div className="shrink-0 border-b-2 border-[#0b1f3f]/25 pb-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1f3f]/70">
              {t("game.roll.title")}
            </p>
            <p className="text-xs font-semibold text-[#0b1f3f]">{stateName}</p>
          </div>

          <ul className="mt-1 min-h-0 flex-1 overflow-y-auto">
            {rows.map((row) => (
              <li key={row.serial}>
                <button
                  type="button"
                  onClick={() => pick(row.isPlayer, row.name)}
                  disabled={ticked && !row.isPlayer}
                  className={`flex w-full items-center gap-3 rounded px-2 py-1.5 text-start transition disabled:opacity-45 ${
                    row.isPlayer && ticked ? "bg-[#2f7a4a]/15" : "hover:bg-[#0b1f3f]/8"
                  }`}
                >
                  <span className="w-8 shrink-0 font-mono text-[11px] text-[#0b1f3f]/55">
                    {row.serial}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0b1f3f]">
                    {row.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-[#0b1f3f]/35"
                  >
                    {row.isPlayer && ticked && (
                      <Check size={14} strokeWidth={3} className="text-[#2f7a4a]" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
