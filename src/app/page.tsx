"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const POINTS = ["register", "booth", "neutral"] as const;

export default function LandingPage() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  // [[…]] marks the accented half, which lands in a different position per language.
  const [heroLead, heroAccent = ""] = t("landing.hero").split(/\[\[|\]\]/).filter(Boolean);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <main className="relative isolate flex min-h-[100svh] w-full flex-col overflow-x-hidden overflow-y-auto bg-[#f4efe6] text-[#0b1f3f]">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Veil on the reading side only, so the flag and chakra stay whole on the other. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 from-[#f7f3ec]/90 via-[#f7f3ec]/55 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l"
      />

      <header className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-7">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t("brand.home")}>
          <Image
            src="/logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-[#0b1f3f]/15"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold">{t("brand.name")}</span>
            <span className="block text-[11px] text-[#0b1f3f]/65">{t("brand.tagline")}</span>
          </span>
        </Link>

        <div className="dark rounded-full bg-[#0b1f3f] text-white shadow-lg shadow-[#0b1f3f]/20">
          <LanguageSwitcher />
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center px-5 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b1f3f]/70 duration-700 fill-mode-both motion-reduce:animate-none sm:text-sm">
            {t("landing.eyebrow")}
          </p>

          <h1 className="mt-5 animate-in fade-in slide-in-from-bottom-4 text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[1.02] tracking-tight delay-150 duration-700 fill-mode-both motion-reduce:animate-none [html:not([data-font=latin])_&]:leading-[1.3] [html:not([data-font=latin])_&]:tracking-normal">
            {heroLead}{" "}
            <span className="text-[#1f3a93]">{heroAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-[#0b1f3f]/80 delay-300 duration-700 fill-mode-both motion-reduce:animate-none sm:text-lg">
            {t("landing.subhead")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700 fill-mode-both motion-reduce:animate-none">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#0b1f3f] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#0b1f3f]/25 transition hover:bg-[#1f3a93] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b1f3f]"
            >
              {t("landing.enter")}
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
            <Link
              href="/dashboard/simulate"
              className="text-base font-semibold text-[#0b1f3f] underline decoration-[#0b1f3f]/30 decoration-2 underline-offset-[6px] transition hover:decoration-[#0b1f3f]"
            >
              {t("landing.simulate")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-6 sm:px-10 sm:pb-8 lg:px-16">
        <ul className="grid max-w-4xl animate-in fade-in gap-4 border-t border-[#0b1f3f]/15 pt-5 delay-700 duration-1000 fill-mode-both motion-reduce:animate-none sm:grid-cols-3 sm:gap-8">
          {POINTS.map((p) => (
            <li key={p} className="hidden sm:block">
              <p className="text-sm font-semibold">{t(`landing.card.${p}.title`)}</p>
              <p className="mt-1 text-[13px] leading-snug text-[#0b1f3f]/70">
                {t(`landing.card.${p}.body`)}
              </p>
            </li>
          ))}
          <li className="text-[13px] font-medium text-[#0b1f3f]/75 sm:hidden">
            {POINTS.map((p) => t(`landing.card.${p}.title`)).join(" · ")}
          </li>
        </ul>
      </footer>
    </main>
  );
}
