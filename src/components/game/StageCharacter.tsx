"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Gender } from "@/hooks/useGame";
import { SceneBanner } from "./GameShell";

export default function StageCharacter({
  stateName,
  gender,
  onChange,
  onConfirm,
}: {
  stateName: string;
  gender: Gender;
  onChange: (patch: { gender?: Gender; name?: string }) => void;
  onConfirm: (name: string) => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const trimmed = name.trim();

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#dff0f7] to-[#f6efe2]">
      <SceneBanner>{t("game.character.prompt")}</SceneBanner>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onConfirm(trimmed);
        }}
        className="flex min-h-0 flex-1 items-center gap-4 px-4 pb-4 pt-16 sm:gap-8 sm:px-8 sm:pt-14"
      >
        <div className="relative h-full w-2/5 max-w-[14rem] shrink-0">
          <Image
            key={gender}
            src={`/game/img/${gender}.webp`}
            alt={t(`game.character.${gender}`)}
            fill
            sizes="220px"
            className="animate-in fade-in zoom-in-95 object-contain object-bottom duration-300 motion-reduce:animate-none"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0b1f3f]/60">
            {stateName}
          </p>

          <div className="flex gap-2" role="radiogroup" aria-label={t("game.character.genderLabel")}>
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={gender === g}
                onClick={() => onChange({ gender: g })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  gender === g
                    ? "bg-[#0b1f3f] text-white shadow-md"
                    : "bg-white/70 text-[#0b1f3f] ring-1 ring-[#0b1f3f]/20 hover:bg-white"
                }`}
              >
                {t(`game.character.${g}`)}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[#0b1f3f]">
              {t("game.character.nameLabel")}
            </span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                onChange({ name: e.target.value });
              }}
              maxLength={28}
              autoComplete="off"
              placeholder={t("game.character.namePlaceholder")}
              className="w-full max-w-xs rounded-xl border border-[#0b1f3f]/20 bg-white px-3.5 py-2.5 text-base font-medium text-[#0b1f3f] outline-none placeholder:text-[#0b1f3f]/35 focus-visible:border-[#1f3a93] focus-visible:ring-2 focus-visible:ring-[#1f3a93]/30"
            />
          </label>

          <p className="max-w-xs text-[11px] leading-snug text-[#0b1f3f]/60">
            {t("game.character.nameHint")}
          </p>

          <button
            type="submit"
            disabled={!trimmed}
            className="w-fit rounded-full bg-[#0b1f3f] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition enabled:hover:bg-[#1f3a93] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("game.continue")}
          </button>
        </div>
      </form>
    </div>
  );
}
