"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DASHBOARD_NAV, isActivePath } from "@/lib/dashboard-nav";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function DashboardSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label={t("nav.primary")}
        className={[
          "fixed inset-y-0 start-0 z-50 flex flex-col bg-nm-surface",
          "transition-[transform,inline-size] duration-300 ease-out motion-reduce:transition-none",
          "md:static md:translate-x-0 md:rtl:translate-x-0",
          collapsed ? "w-[4.75rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center gap-2.5 px-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-xl py-1"
            aria-label={t("nav.backToSite")}
          >
            <Image
              src="/logo.png"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            {!collapsed && (
              <span className="truncate text-sm font-bold text-foreground">
                {t("brand.name")}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label={t("nav.closeMenu")}
            className="ms-auto rounded-xl p-2 text-foreground/70 hover:bg-nm-sunken md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="flex flex-col gap-1.5">
            {DASHBOARD_NAV.map(({ href, labelKey, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              const label = t(labelKey);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onCloseMobile}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                      "transition-shadow duration-150 motion-reduce:transition-none",
                      collapsed ? "justify-center" : "",
                      // Pressed-in is the natural affordance for "you are here",
                      // but colour and aria-current carry it too.
                      active
                        ? "bg-nm-sunken font-semibold text-primary shadow-nm-inset"
                        : "font-medium text-foreground/70 hover:text-foreground hover:shadow-nm-raised-sm",
                    ].join(" ")}
                  >
                    <Icon size={18} className="shrink-0" aria-hidden="true" />
                    {collapsed ? (
                      <span className="sr-only">{label}</span>
                    ) : (
                      <span className="truncate">{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden p-3 md:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground/60 hover:text-foreground hover:shadow-nm-raised-sm"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} className="rtl:-scale-x-100" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose size={18} className="rtl:-scale-x-100" aria-hidden="true" />
                {t("nav.collapse")}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
