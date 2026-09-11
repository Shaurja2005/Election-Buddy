"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LOCALES, LOCALE_CODES, type Locale } from "@/lib/i18n/locales";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.current", { name: LOCALES[locale].native })}
        className="btn btn-sm btn-ghost gap-1.5 px-2 font-medium text-xs text-base-content/80 hover:text-base-content"
      >
        <svg
          className="h-4 w-4 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
        </svg>
        <span className="max-w-[7rem] truncate">{LOCALES[locale].native}</span>
        <svg
          className={`h-3 w-3 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={t("language.label")}
          className="absolute end-0 z-[60] mt-2 max-h-[70vh] w-52 overflow-y-auto rounded-2xl border border-base-200 bg-base-100 p-1.5 shadow-lg"
        >
          {LOCALE_CODES.map((code) => {
            const meta = LOCALES[code];
            const active = code === locale;
            return (
              <li key={code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  lang={code}
                  dir={meta.dir}
                  onClick={() => choose(code)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start transition-colors ${
                    active
                      ? "bg-primary/15 text-base-content"
                      : "text-base-content/80 hover:bg-base-200"
                  }`}
                >
                  <span className="flex flex-col leading-snug">
                    <span className="text-sm font-semibold">{meta.native}</span>
                    <span className="text-[11px] text-base-content/50" dir="ltr">
                      {meta.name}
                    </span>
                  </span>
                  {active && (
                    <svg
                      className="h-4 w-4 shrink-0 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
