"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import BallotSymbol from "./BallotSymbol";
import type { MockCandidate } from "@/lib/evm/candidates";

interface VVPATWindowProps {
  /** null before a vote is cast. */
  slip: { serial: number; name: string; symbol: MockCandidate["symbol"] | null } | null;
  /** Seconds left on the statutory seven-second window; 0 once it has dropped. */
  secondsLeft: number;
  dropped: boolean;
}

export default function VVPATWindow({ slip, secondsLeft, dropped }: VVPATWindowProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xs overflow-hidden rounded-[1.25rem] bg-[#c8c5ba] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] ring-1 ring-black/25">
      <div className="bg-[#4a4a44] px-4 py-2.5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/95">
          {t("evm.unit.vvpat")}
        </p>
      </div>

      {/* The viewing window: a dark recess with a glass pane. */}
      <div className="relative h-40 overflow-hidden border-y-4 border-black/25 bg-[#141414]">
        {slip && !dropped && (
          <div className="absolute inset-x-5 top-4 animate-[slip-in_0.6s_ease-out] rounded-[2px] bg-[#f4f1e6] p-3 shadow-lg motion-reduce:animate-none">
            <div className="flex items-center gap-2.5">
              <span dir="ltr" className="tabular text-sm font-bold text-black">
                {slip.serial}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-black">
                {slip.name}
              </p>
              <span className="text-black">
                {slip.symbol ? (
                  <BallotSymbol symbol={slip.symbol} size={24} />
                ) : (
                  <span className="text-[0.6rem] font-bold">{t("evm.nota")}</span>
                )}
              </span>
            </div>
            <div className="mt-2.5 border-t border-dashed border-black/25 pt-2">
              <p dir="ltr" className="tabular text-[0.65rem] tracking-wider text-black/55">
                VVPAT · {new Date().getFullYear()}
              </p>
            </div>
          </div>
        )}

        {dropped && (
          <p className="absolute inset-0 flex items-center justify-center px-5 text-center text-xs text-white/55">
            {t("evm.stage.vvpatDropped")}
          </p>
        )}

        {/* The slot the slip falls through. */}
        <div className="absolute inset-x-8 bottom-3 h-1.5 rounded-full bg-black/70 shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" />
      </div>

      <div className="px-4 py-3">
        {/* The seven seconds are statutory, so they are counted down honestly
            rather than dismissed on click. */}
        <p
          aria-live="polite"
          className="tabular text-center text-xs font-semibold text-black/70"
        >
          {dropped
            ? t("evm.stage.vvpatDropped")
            : slip
              ? t("evm.stage.vvpatCountdown", { n: secondsLeft })
              : " "}
        </p>
      </div>
    </div>
  );
}
