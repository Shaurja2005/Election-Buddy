"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { OFFICIAL_LINKS } from "@/lib/india/officialLinks";
import { pick } from "@/lib/india/types";

export default function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const { t, locale } = useLanguage();
  const pathname = usePathname();

  // The dashboard has its own topbar; stacking both wastes the viewport.
  if (pathname === "/" || pathname.startsWith("/dashboard")) return null;

  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200 transition-colors duration-300">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-3 sm:px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label={t("brand.home")}
        >
          <Image
            src="/logo.svg"
            alt={t("brand.logoAlt")}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <h1 className="truncate text-sm font-bold text-base-content">{t("brand.name")}</h1>
            <p className="truncate text-[11px] text-base-content/50">{t("brand.tagline")}</p>
          </div>
        </Link>

        {/* Right actions */}
        <nav aria-label={t("header.portalsMenuLabel")} className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher />

          {/* Auth Button */}
          {!loading && (
            user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-200 transition-transform hover:scale-105">
                  <div className="w-7 h-7 rounded-full">
                    <Image src={user.photoURL || "/logo.svg"} alt={t("header.profileAlt")} width={28} height={28} className="object-cover" />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-xl w-52 border border-base-200">
                  <li className="menu-title px-4 py-2">
                    <span className="text-xs font-semibold opacity-70">{t("header.signedInAs")}</span>
                    <span className="text-sm font-bold truncate text-base-content">{user.displayName || t("header.defaultUserName")}</span>
                  </li>
                  <li><button onClick={logout} className="text-error hover:bg-error/10 mt-1 font-medium">{t("header.signOut")}</button></li>
                </ul>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle} 
                className="btn btn-sm btn-outline btn-primary rounded-full px-4 text-[11px] uppercase tracking-wider font-bold"
              >
                {t("header.signIn")}
              </button>
            )
          )}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-label={t("header.officialPortalsAria")}
              className="text-xs btn btn-sm btn-ghost text-primary gap-1.5 font-medium px-2"
            >
              <svg
                className="h-3.5 w-3.5 opacity-80"
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
              <span className="hidden sm:inline">{t("header.officialPortals")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              role="menu"
              aria-label={t("header.portalsMenuLabel")}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-2xl w-52 text-sm mt-1"
            >
              {OFFICIAL_LINKS.map((link) => (
                <li key={link.id} role="none">
                  <a
                    role="menuitem"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pick(link.title, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
