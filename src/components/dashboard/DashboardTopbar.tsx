"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NeuButton from "@/components/ui/NeuButton";
import { DASHBOARD_NAV, isActivePath } from "@/lib/dashboard-nav";
import AuthModal from "@/components/AuthModal";

export default function DashboardTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const current = DASHBOARD_NAV.find((item) => isActivePath(pathname, item.href));

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("nav.openMenu")}
          className="rounded-xl p-2 text-foreground/70 hover:bg-nm-sunken md:hidden"
        >
          <Menu size={20} />
        </button>

        <h1 className="min-w-0 truncate text-base font-semibold text-foreground">
          {current ? t(current.labelKey) : t("nav.dashboard")}
        </h1>

        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher />

          {!loading &&
            (user ? (
              <div className="flex items-center gap-2">
                <Image
                  src={user.photoURL || "/logo.svg"}
                  alt={t("header.profileAlt")}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover shadow-nm-raised-sm"
                />
                <NeuButton
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={15} />}
                  aria-label={t("header.signOut")}
                >
                  <span className="hidden sm:inline">{t("header.signOut")}</span>
                </NeuButton>
              </div>
            ) : (
              <NeuButton variant="primary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                {t("header.signIn")}
              </NeuButton>
            ))}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
