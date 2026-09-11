"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();
  // The hero keeps one key so word order survives translation; [[…]] marks the
  // accented half, which lands in a different position per language.
  const [heroLead, heroAccent = ""] = t("landing.hero").split(/\[\[|\]\]/).filter(Boolean);

  return (
    <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 py-12 gap-8 text-center min-h-[calc(100vh-3.5rem)]">
      {/* ── Hero ── */}
      <section className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium shadow-sm">
          <span>🏛️</span>
          <span className="text-base-content/80">{t("landing.badge")}</span>
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold text-base-content leading-tight tracking-tight">
          {heroLead}{" "}
          <span className="text-primary drop-shadow-sm">{heroAccent}</span>
        </h2>

        <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          {t("landing.subhead")}
        </p>

        <div className="pt-6">
          <Link 
            href="/chat" 
            className="btn btn-primary btn-lg rounded-full px-8 text-lg font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
          >
            {t("landing.cta")} 🚀
          </Link>
        </div>
      </section>

      {/* ── Feature Cards (Optional bottom visuals) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">📝</div>
          <h3 className="font-bold text-base-content">{t("landing.card.register.title")}</h3>
          <p className="text-sm text-base-content/60">{t("landing.card.register.body")}</p>
        </div>
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">📍</div>
          <h3 className="font-bold text-base-content">{t("landing.card.booth.title")}</h3>
          <p className="text-sm text-base-content/60">{t("landing.card.booth.body")}</p>
        </div>
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">⚖️</div>
          <h3 className="font-bold text-base-content">{t("landing.card.neutral.title")}</h3>
          <p className="text-sm text-base-content/60">{t("landing.card.neutral.body")}</p>
        </div>
      </div>
    </main>
  );
}
