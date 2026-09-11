"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAME_CANDIDATES } from "@/lib/game/data";
import { SceneBanner } from "./GameShell";

type Phase = "room" | "ballot" | "vvpat";

/**
 * Geometry read straight out of the ballot-unit artwork. Its name plates are
 * 100x50 boxes at x=45, the first at y=75, each row 70 units below the last.
 */
const VIEW_W = 300;
const VIEW_H = 500;
const PLATE_X = 47;
const PLATE_W = 96;
const PLATE_H = 46;
const PLATE_TOP = 77;
const ROW_GAP = 70;
const NOTA_ROW = 5;
const VVPAT_SECONDS = 7;

export default function StageEvm({
  onDone,
  play,
}: {
  onDone: () => void;
  play: (s: "paper" | "beep") => void;
}) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("room");
  const [choice, setChoice] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(VVPAT_SECONDS);
  const hostRef = useRef<HTMLDivElement>(null);

  // Load the machine artwork once the player steps up to it. Guarded against a
  // second run: re-injecting on the VVPAT phase would wipe the lit red LED.
  useEffect(() => {
    if (phase === "room" || hostRef.current?.querySelector("svg")) return;
    let cancelled = false;

    fetch("/game/svg/evm_svg.svg")
      .then((r) => r.text())
      .then((markup) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        host.innerHTML = markup;
        const svg = host.querySelector("svg");
        svg?.setAttribute("class", "h-full w-full");
        svg?.setAttribute("role", "presentation");
        // The artwork's buttons become the real controls — focusable and
        // labelled — instead of parking invisible HTML buttons on top of them.
        host.querySelectorAll('[id^="btn-"]').forEach((el) => {
          const n = Number(el.id.split("-")[1]);
          el.setAttribute("class", "game-evm-btn");
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
          el.setAttribute(
            "aria-label",
            n === NOTA_ROW ? t("game.evm.nota") : t("game.evm.voteFor", { n: String(n) })
          );
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [phase, t]);

  // The slip is visible for the full statutory seven seconds, counted down.
  useEffect(() => {
    if (phase !== "vvpat") return;
    if (seconds <= 0) {
      const id = setTimeout(onDone, 600);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, seconds, onDone]);

  const vote = (n: number) => {
    if (choice !== null) return;
    play("beep");
    setChoice(n);
    const led = hostRef.current?.querySelector(`#led-${n}`);
    led?.setAttribute("fill", "#ef4444");
    setTimeout(() => setPhase("vvpat"), 1100);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as Element).closest<SVGElement>('[id^="btn-"]');
    if (!btn) return;
    vote(Number(btn.id.split("-")[1]));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const btn = (e.target as Element).closest<SVGElement>('[id^="btn-"]');
    if (!btn) return;
    e.preventDefault();
    vote(Number(btn.id.split("-")[1]));
  };

  if (phase === "room") {
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
        <SceneBanner>{t("game.evm.roomPrompt")}</SceneBanner>

        <button
          type="button"
          onClick={() => {
            play("paper");
            setPhase("ballot");
          }}
          aria-label={t("game.evm.approach")}
          className="absolute bottom-[14%] left-1/2 h-[46%] w-[22%] -translate-x-1/2 rounded-xl outline-none transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-white"
        >
          <span className="block h-full w-full [&_svg]:h-full [&_svg]:w-full [&_svg]:drop-shadow-2xl">
            <EvmThumb />
          </span>
          <span className="mt-1 block rounded-full bg-[#0b1f3f] px-2 py-0.5 text-[10px] font-bold text-white sm:text-xs">
            {t("game.evm.approach")}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1b2430] to-[#2c3a4c]">
      <SceneBanner>
        {phase === "vvpat" ? t("game.evm.vvpatPrompt") : t("game.evm.ballotPrompt")}
      </SceneBanner>

      <div className="absolute inset-0 flex items-center justify-center gap-3 p-3 pt-16 sm:gap-6 sm:pt-14">
        {/* Ballot unit. The candidate plates are drawn in a second SVG that
            repeats the artwork's viewBox, so both letterbox identically and the
            plates cannot drift out of their rows the way percentages did. */}
        <div className="relative h-full max-h-full w-[46%] max-w-[15rem]">
          <div
            ref={hostRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="h-full w-full"
          />

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {GAME_CANDIDATES.filter((c) => c.symbol !== "nota").map((c, i) => {
              const top = PLATE_TOP + i * ROW_GAP;
              const mid = top + PLATE_H / 2;
              return (
                <g key={c.id}>
                  {/* Covers the blank swatch and rule the artwork leaves behind. */}
                  <rect x={PLATE_X} y={top} width={PLATE_W} height={PLATE_H} rx="4" fill="#F1F5F9" />
                  <text x={PLATE_X + 22} y={mid} fontSize="30" textAnchor="middle" dominantBaseline="central">
                    {c.symbol}
                  </text>
                  <text
                    x={PLATE_X + 52}
                    y={mid}
                    fontSize="24"
                    fontWeight="bold"
                    fill="#1E293B"
                    dominantBaseline="central"
                  >
                    {c.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* VVPAT window */}
        <div className="flex h-full w-[40%] max-w-[13rem] flex-col justify-center">
          <div className="rounded-xl border-4 border-[#0b1f3f] bg-[#111820] p-2 shadow-2xl">
            <p className="mb-1.5 text-center text-[9px] font-bold uppercase tracking-wide text-white/70 sm:text-[11px]">
              {t("game.evm.vvpat")}
            </p>
            <div className="flex min-h-[4.5rem] items-center justify-center overflow-hidden rounded-md bg-[#0b0f14] p-1.5 sm:min-h-[7rem] sm:p-2">
              {phase === "vvpat" && choice !== null ? (
                <div className="w-full animate-in slide-in-from-top-6 rounded-sm bg-[#fdf8ec] p-2 text-center shadow-lg duration-700 motion-reduce:animate-none">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-[#0b1f3f]/60">
                    {t("game.evm.slipTitle")}
                  </p>
                  <p className="mt-1 text-2xl leading-none" aria-hidden="true">
                    {GAME_CANDIDATES[choice - 1].symbol === "nota"
                      ? "🚫"
                      : GAME_CANDIDATES[choice - 1].symbol}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-[#0b1f3f]">
                    {GAME_CANDIDATES[choice - 1].symbol === "nota"
                      ? t("game.evm.nota")
                      : t("game.evm.candidate", { n: String(choice) })}
                  </p>
                  <p className="mt-0.5 font-mono text-[8px] text-[#0b1f3f]/55">
                    {t("game.evm.serial")}
                  </p>
                </div>
              ) : (
                <p className="text-center text-[9px] text-white/40 sm:text-[11px]">
                  {t("game.evm.vvpatWaiting")}
                </p>
              )}
            </div>

            {phase === "vvpat" && (
              <p aria-live="polite" className="mt-1.5 text-center text-[10px] font-bold text-[#5fd08a] sm:text-xs">
                {t("game.evm.countdown", { s: String(Math.max(seconds, 0)) })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small stand-in for the machine as it sits in the room, before you walk up. */
function EvmThumb() {
  return (
    <svg viewBox="0 0 100 150" aria-hidden="true">
      <rect x="10" y="14" width="80" height="130" rx="10" fill="#94A3B8" />
      <rect x="6" y="10" width="80" height="130" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="26" cy={40 + i * 24} r="5" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
          <rect x="42" y={32 + i * 24} width="30" height="16" rx="8" fill="#3B82F6" stroke="#1E293B" strokeWidth="2.5" />
        </g>
      ))}
    </svg>
  );
}
