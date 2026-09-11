"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Game } from "@/hooks/useGame";

/**
 * Fixed 16:9 stage. Every scene positions its pieces in percentages inside
 * this box, so one set of coordinates works from 360px to a wide desktop.
 */
export default function GameShell({
  game,
  title,
  hint,
  children,
}: {
  game: Game;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const showHud = game.stageIndex > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-foreground/65">{hint}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showHud && (
            <span className="rounded-full bg-nm-sunken px-3 py-1 text-xs font-semibold text-foreground/70 shadow-nm-inset">
              {t("game.stageOf", {
                current: String(game.stageIndex),
                total: String(game.total),
              })}
            </span>
          )}
          <button
            type="button"
            onClick={() => game.setMuted((m) => !m)}
            aria-label={game.muted ? t("game.unmute") : t("game.mute")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-nm-raised text-foreground/70 shadow-nm-raised-sm transition active:shadow-nm-pressed"
          >
            {game.muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
          </button>
          {showHud && (
            <button
              type="button"
              onClick={game.restart}
              aria-label={t("game.restart")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-nm-raised text-foreground/70 shadow-nm-raised-sm transition active:shadow-nm-pressed"
            >
              <RotateCcw size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-nm-sunken shadow-nm-inset">
        <div
          className="h-full rounded-full bg-primary transition-[inline-size] duration-500"
          style={{ inlineSize: `${(game.stageIndex / game.total) * 100}%` }}
        />
      </div>

      <div
        key={game.stage}
        className="relative aspect-[16/10] w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl bg-[#0e1116] shadow-nm-raised duration-500 motion-reduce:animate-none sm:aspect-[16/9]"
      >
        {children}
      </div>
    </div>
  );
}

/** Instruction strip pinned inside a scene, above the artwork. */
export function SceneBanner({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-2 sm:p-3">
      <p className="max-w-[92%] animate-in fade-in slide-in-from-top-2 rounded-full bg-[#0b1f3f]/85 px-4 py-1.5 text-center text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm duration-500 motion-reduce:animate-none sm:text-sm">
        {children}
      </p>
    </div>
  );
}

/** Transient feedback for a wrong pick. Announced, not just flashed. */
export function useToast() {
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const node = (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-3">
      {toast && (
        <p
          className={`animate-in fade-in slide-in-from-bottom-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xl duration-300 motion-reduce:animate-none sm:text-sm ${
            toast.ok ? "bg-[#2f7a4a]" : "bg-[#b8433a]"
          }`}
        >
          {toast.text}
        </p>
      )}
    </div>
  );

  return { showToast: setToast, toastNode: node };
}
