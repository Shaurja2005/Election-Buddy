"use client";

import { ExternalLink, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LOK_SABHA_TURNOUT, TURNOUT_SOURCE, TURNOUT_SOURCE_URL } from "@/lib/india/turnout";
import NeuCard from "@/components/ui/NeuCard";
import NeuStat from "@/components/ui/NeuStat";

export default function InsightsPage() {
  const { t, intlLocale } = useLanguage();

  const sorted = [...LOK_SABHA_TURNOUT].sort((a, b) => a.turnout - b.turnout);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const latest = LOK_SABHA_TURNOUT[LOK_SABHA_TURNOUT.length - 1];

  const fmt = (n: number) =>
    new Intl.NumberFormat(intlLocale, { minimumFractionDigits: 2 }).format(n) + "%";
  const year = (n: number) => new Intl.NumberFormat(intlLocale).format(n);

  // Scale from 50 rather than 0: every figure sits in the high fifties to
  // high sixties, and a zero baseline would flatten the whole series.
  const floor = 50;
  const ceil = 70;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("ins.title")}</h2>
        <p className="mt-1.5 max-w-xl text-sm text-foreground/65">{t("ins.subtitle")}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <NeuStat label={t("ins.latest")} value={fmt(latest.turnout)} detail={year(latest.year)} />
        <NeuStat label={t("ins.highest")} value={fmt(highest.turnout)} detail={year(highest.year)} />
        <NeuStat label={t("ins.lowest")} value={fmt(lowest.turnout)} detail={year(lowest.year)} />
      </div>

      <NeuCard className="p-6">
        <h3 className="font-semibold text-foreground">{t("ins.turnout")}</h3>
        <p className="mt-1.5 text-sm text-foreground/65">{t("ins.turnoutBody")}</p>

        {/* A table of real figures, read as a chart. Wide content scrolls in
            its own container rather than pushing the page sideways. */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse">
            <caption className="sr-only">{t("ins.turnout")}</caption>
            <thead>
              <tr className="text-start text-xs uppercase tracking-wide text-foreground/50">
                <th scope="col" className="pb-2 text-start font-semibold">{t("ins.year")}</th>
                <th scope="col" className="pb-2 text-start font-semibold">{t("ins.pct")}</th>
              </tr>
            </thead>
            <tbody>
              {LOK_SABHA_TURNOUT.map((row) => {
                const pct = ((row.turnout - floor) / (ceil - floor)) * 100;
                const isLatest = row.year === latest.year;
                return (
                  <tr key={row.year}>
                    <th
                      scope="row"
                      dir="ltr"
                      className="tabular w-16 py-1.5 text-start text-sm font-semibold text-foreground/80"
                    >
                      {year(row.year)}
                    </th>
                    <td className="py-1.5">
                      <span className="flex items-center gap-3">
                        <span className="h-4 flex-1 overflow-hidden rounded-full bg-nm-sunken shadow-nm-inset">
                          <span
                            className={`block h-full rounded-full ${
                              isLatest ? "bg-primary" : "bg-foreground/25"
                            }`}
                            style={{ inlineSize: `${pct}%` }}
                          />
                        </span>
                        <span
                          dir="ltr"
                          className="tabular w-16 shrink-0 text-end text-sm font-semibold text-foreground"
                        >
                          {fmt(row.turnout)}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-foreground/50">
          {t("ins.source", { name: TURNOUT_SOURCE })}{" "}
          <a
            href={TURNOUT_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
          >
            eci.gov.in
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        </p>
      </NeuCard>

      <NeuCard className="p-6">
        <h3 className="font-semibold text-foreground">{t("ins.anatomy")}</h3>
        <p className="mt-1.5 text-sm text-foreground/65">{t("ins.anatomyBody")}</p>
        <ul className="mt-5 flex flex-col gap-3">
          {[
            { key: "ins.anatomy.control", tone: "bg-[#2f5d3a]" },
            { key: "ins.anatomy.ballot", tone: "bg-[#15427e]" },
            { key: "ins.anatomy.vvpat", tone: "bg-[#4a4a44]" },
          ].map(({ key, tone }) => (
            <li key={key} className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className={`mt-1 h-4 w-6 shrink-0 rounded-sm ring-1 ring-black/30 ${tone}`}
              />
              <p className="text-sm leading-relaxed text-foreground/75">{t(key)}</p>
            </li>
          ))}
        </ul>
      </NeuCard>

      <NeuCard className="p-6">
        <h3 className="font-semibold text-foreground">{t("ins.dos")}</h3>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t("ins.do")}
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {["ins.do1", "ins.do2", "ins.do3"].map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm text-foreground/75">
                  <Check size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  {t(k)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
              {t("ins.dont")}
            </p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {["ins.dont1", "ins.dont2", "ins.dont3"].map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm text-foreground/75">
                  <X size={15} className="mt-0.5 shrink-0 text-destructive" aria-hidden="true" />
                  {t(k)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </NeuCard>
    </div>
  );
}
