"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function ControlUnit({ busy }: { busy: boolean }) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[13rem] overflow-hidden rounded-[1.25rem] bg-[#c2c7b4] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75)] ring-1 ring-black/25">
      <div className="bg-[#2f5d3a] px-4 py-2.5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/95">
          {t("evm.unit.control")}
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <span
          aria-hidden="true"
          className={`h-3 w-3 rounded-full ring-1 ring-inset ring-black/40 transition-colors duration-200 ${
            busy
              ? "bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.8)]"
              : "bg-emerald-500 shadow-[0_0_8px_1px_rgba(16,185,129,0.7)]"
          }`}
        />
        <p
          dir="ltr"
          className="tabular text-sm font-bold tracking-[0.15em] text-black/75"
        >
          {busy ? t("evm.unit.busy") : t("evm.unit.ready")}
        </p>
      </div>
    </div>
  );
}
