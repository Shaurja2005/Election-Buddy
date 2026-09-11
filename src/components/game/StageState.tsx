"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATE_NAME_FIXES } from "@/lib/game/data";
import { SceneBanner } from "./GameShell";

interface StateOption {
  code: string;
  name: string;
}

export default function StageState({
  onPick,
}: {
  onPick: (code: string, name: string) => void;
}) {
  const { t } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<StateOption[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/game/svg/india_map_svg.svg")
      .then((r) => r.text())
      .then((markup) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        host.innerHTML = markup;

        const svg = host.querySelector("svg");
        if (!svg) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("class", "h-full w-full");
        svg.setAttribute("role", "presentation");

        const found: StateOption[] = [];
        host.querySelectorAll<SVGPathElement>("path[name]").forEach((path) => {
          const raw = path.getAttribute("name") ?? "";
          const name = STATE_NAME_FIXES[raw] ?? raw;
          const code = path.getAttribute("id") ?? name;
          path.dataset.stateName = name;
          path.setAttribute("class", "game-state");
          found.push({ code, name });
        });
        found.sort((a, b) => a.name.localeCompare(b.name));
        setOptions(found);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // One delegated listener beats 36 of them, and survives the innerHTML swap.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as Element).closest<SVGPathElement>("path[data-state-name]");
    if (!target) return;
    onPick(target.getAttribute("id") ?? "", target.dataset.stateName ?? "");
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as Element).closest<SVGPathElement>("path[data-state-name]");
    setHovered(target?.dataset.stateName ?? null);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#eef4ef]">
      <SceneBanner>{t("game.state.prompt")}</SceneBanner>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-2 px-3 pb-3 pt-16 sm:pt-14">
        <div
          ref={hostRef}
          onClick={handleClick}
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
          className="min-h-0 flex-1 [&_svg]:h-full [&_svg]:w-full"
        />

        <div className="flex h-8 shrink-0 items-center">
          {hovered ? (
            <span className="rounded-full bg-[#0b1f3f] px-3 py-1 text-xs font-semibold text-white">
              {hovered}
            </span>
          ) : (
            // Keyboard and screen-reader path: the map is a shortcut, not the only way in.
            <label className="flex items-center gap-2 text-xs text-[#0b1f3f]/70">
              <span className="font-medium">{t("game.state.selectLabel")}</span>
              <select
                className="rounded-md border border-[#0b1f3f]/25 bg-white px-2 py-1 text-xs font-semibold text-[#0b1f3f]"
                defaultValue=""
                onChange={(e) => {
                  const opt = options.find((o) => o.code === e.target.value);
                  if (opt) onPick(opt.code, opt.name);
                }}
              >
                <option value="" disabled>
                  {t("game.state.selectPlaceholder")}
                </option>
                {options.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
