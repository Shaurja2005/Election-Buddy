import {
  LayoutDashboard,
  MessagesSquare,
  GraduationCap,
  Vote,
  Gamepad2,
  BarChart3,
  Trophy,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.overview", icon: LayoutDashboard },
  { href: "/dashboard/chat", labelKey: "nav.chat", icon: MessagesSquare },
  { href: "/dashboard/learn", labelKey: "nav.learn", icon: GraduationCap },
  { href: "/dashboard/simulate", labelKey: "nav.simulate", icon: Vote },
  { href: "/dashboard/game", labelKey: "nav.game", icon: Gamepad2 },
  { href: "/dashboard/insights", labelKey: "nav.insights", icon: BarChart3 },
  { href: "/dashboard/progress", labelKey: "nav.progress", icon: Trophy },
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
];

/** Overview must match exactly; the rest match their subtree. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
