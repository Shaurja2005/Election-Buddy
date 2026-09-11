"use client";

import type { ReactNode } from "react";

export interface NeuTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface NeuTabsProps {
  items: NeuTabItem[];
  active: string;
  onChange: (id: string) => void;
  /** Names the tab group for screen readers. */
  label: string;
  className?: string;
}

export default function NeuTabs({
  items,
  active,
  onChange,
  label,
  className = "",
}: NeuTabsProps) {
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    // Arrow keys follow what the reader sees, so they swap under RTL.
    const dir = document.documentElement.dir === "rtl" ? -delta : delta;
    onChange(items[(index + dir + items.length) % items.length].id);
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={`inline-flex gap-1 rounded-2xl bg-nm-sunken p-1.5 shadow-nm-inset ${className}`}
    >
      {items.map((item, index) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={[
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm",
              "transition-shadow duration-150 motion-reduce:transition-none",
              selected
                ? "bg-nm-surface font-semibold text-foreground shadow-nm-raised-sm"
                : "font-medium text-foreground/60 hover:text-foreground",
            ].join(" ")}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
