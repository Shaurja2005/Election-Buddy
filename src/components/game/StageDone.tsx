"use client";

import Link from "next/link";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Gender } from "@/hooks/useGame";

export default function StageDone({
  name,
  stateName,
  gender,
  onRestart,
}: {
  name: string;
  stateName: string;
  gender: Gender;
  onRestart: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ff9f45] via-[#f6efe2] to-[#5fd08a] p-4">
      <div className="flex w-full max-w-md items-center gap-4 rounded-2xl bg-white/92 p-4 shadow-2xl backdrop-blur-sm sm:gap-6 sm:p-6">
        <div className="relative h-28 w-20 shrink-0 sm:h-36 sm:w-24">
          <Image
            src={`/game/img/${gender}.webp`}
            alt=""
            fill
            sizes="96px"
            className="object-contain object-bottom"
          />
          {/* The inked finger is the proof you voted — worth showing at the end. */}
          <span
            aria-hidden="true"
            className="absolute bottom-[38%] end-[14%] h-2.5 w-1.5 rotate-12 rounded-full bg-[#2b1a4d]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f7a4a]">
            {t("game.done.badge")}
          </p>
          <h3 className="mt-1 text-xl font-extrabold leading-tight text-[#0b1f3f] sm:text-2xl">
            {t("game.done.title", { name })}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#0b1f3f]/70 sm:text-sm">
            {t("game.done.body", { state: stateName })}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f3a93] sm:text-sm"
            >
              <RotateCcw size={14} aria-hidden="true" />
              {t("game.done.again")}
            </button>
            <Link
              href="/dashboard/learn"
              className="inline-flex items-center rounded-full bg-[#0b1f3f]/8 px-4 py-2 text-xs font-bold text-[#0b1f3f] transition hover:bg-[#0b1f3f]/15 sm:text-sm"
            >
              {t("game.done.learn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
