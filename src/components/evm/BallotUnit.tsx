"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { MOCK_CANDIDATES, NOTA_SERIAL } from "@/lib/evm/candidates";
import BallotSymbol from "./BallotSymbol";

interface BallotUnitProps {
  /** Buttons only work while the control unit has released the ballot. */
  enabled: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * The machine is a physical object, not a neumorphic card: moulded cream
 * plastic, a printed blue header, a recessed lamp per row. It breaks the
 * surrounding design system on purpose — this is the screen people remember.
 */
export default function BallotUnit({ enabled, selectedId, onSelect }: BallotUnitProps) {
  const { t } = useLanguage();

  const rows = [
    ...MOCK_CANDIDATES.map((c) => ({
      id: c.id,
      serial: c.serial,
      name: t(c.nameKey),
      party: t(c.partyKey),
      symbol: c.symbol as (typeof MOCK_CANDIDATES)[number]["symbol"] | null,
    })),
    {
      id: "nota",
      serial: NOTA_SERIAL,
      name: t("evm.nota"),
      party: t("evm.notaDescription"),
      symbol: null,
    },
  ];

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[1.25rem] bg-[#d9d5c9] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] ring-1 ring-black/25">
      <div className="bg-[#15427e] px-4 py-2.5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/95">
          {t("evm.unit.ballot")}
        </p>
      </div>

      <ul className="divide-y divide-black/15">
        {rows.map((row) => {
          const chosen = selectedId === row.id;
          return (
            <li key={row.id} className="flex items-stretch gap-3 px-3 py-2.5">
              <span
                dir="ltr"
                className="tabular w-7 shrink-0 self-center text-center text-sm font-bold text-black/70"
                aria-hidden="true"
              >
                {row.serial}
              </span>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-tight text-black">
                    {row.name}
                  </p>
                  <p className="truncate text-[0.7rem] leading-tight text-black/60">
                    {row.party}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-black/25 bg-white text-black/80">
                  {row.symbol ? (
                    <BallotSymbol symbol={row.symbol} size={28} />
                  ) : (
                    <span className="text-[0.6rem] font-bold tracking-wider">
                      {t("evm.nota")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5 ps-1">
                {/* The lamp is a readout, never the only signal: the chosen row
                    also gets a ring and an aria-pressed state. */}
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/40 transition-colors duration-150 ${
                    chosen ? "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.85)]" : "bg-red-950/40"
                  }`}
                />
                <button
                  type="button"
                  disabled={!enabled}
                  aria-pressed={chosen}
                  aria-label={t("evm.voteFor", { name: row.name })}
                  onClick={() => onSelect(row.id)}
                  className={[
                    "h-9 w-12 rounded-md border-b-4 transition-all duration-100",
                    "border-[#0d2f5c] bg-[#1c5bb0]",
                    "enabled:hover:bg-[#2069c9]",
                    "enabled:active:translate-y-[3px] enabled:active:border-b-[1px]",
                    "motion-reduce:transition-none motion-reduce:active:translate-y-0",
                    "disabled:cursor-not-allowed disabled:border-black/20 disabled:bg-black/25",
                    chosen ? "ring-2 ring-black/70 ring-offset-1 ring-offset-[#d9d5c9]" : "",
                  ].join(" ")}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
