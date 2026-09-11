"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 52, height: 28 }} />;

  const isDark = theme === "dark";

  return (
    <button
      aria-label={t("theme.toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`theme-toggle ${isDark ? "dark-active" : ""}`}
    >
      <span className="theme-toggle__thumb">
        {isDark ? "🌙" : "☀️"}
      </span>
      <span className="sr-only">{isDark ? t("theme.dark") : t("theme.light")}</span>
    </button>
  );
}
