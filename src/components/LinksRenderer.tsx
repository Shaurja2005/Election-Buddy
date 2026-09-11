"use client";

import type { ElectionLink, LinksRendererProps } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

const TYPE_CONFIG: Record<
  ElectionLink["type"],
  { icon: string; badgeKey: string; badgeClass: string }
> = {
  registration: {
    icon: "✅",
    badgeKey: "links.type.registration",
    badgeClass: "badge-success",
  },
  polling: {
    icon: "🗳️",
    badgeKey: "links.type.polling",
    badgeClass: "badge-primary",
  },
  official: {
    icon: "🏛️",
    badgeKey: "links.type.official",
    badgeClass: "badge-info",
  },
  ballot: {
    icon: "📋",
    badgeKey: "links.type.ballot",
    badgeClass: "badge-warning",
  },
  general: {
    icon: "🔗",
    badgeKey: "links.type.info",
    badgeClass: "badge-ghost",
  },
};

export default function LinksRenderer({ links, title }: LinksRendererProps) {
  const { t } = useLanguage();
  if (!links || links.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-sm opacity-80 mb-3 font-medium uppercase tracking-wide">
        {title ?? `🔗 ${t("links.title")}`}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {links.map((link, idx) => {
          const cfg = TYPE_CONFIG[link.type] ?? TYPE_CONFIG.general;
          return (
            <div
              key={idx}
              className="card card-compact bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="card-body flex-row items-center gap-3">
                <span className="text-2xl">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-base-content">
                      {link.title}
                    </h3>
                    <span className={`badge badge-sm ${cfg.badgeClass}`}>
                      {t(cfg.badgeKey)}
                    </span>
                  </div>
                  {link.description && (
                    <p className="text-xs text-base-content/60 mt-0.5 truncate">
                      {link.description}
                    </p>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm btn-outline shrink-0 gap-1"
                  id={`link-btn-${idx}`}
                  aria-label={`${t("links.visit")}: ${link.title}. ${t("links.opensInNewTab")}`}
                >
                  {t("links.visit")}
                  <span aria-hidden="true" className="rtl:-scale-x-100">
                    →
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
