import type { ReactNode } from "react";
import NeuCard from "./NeuCard";

interface NeuStatProps {
  label: string;
  value: string;
  /** A short qualifier: a unit, a date, a source. */
  detail?: string;
  icon?: ReactNode;
  className?: string;
}

export default function NeuStat({
  label,
  value,
  detail,
  icon,
  className = "",
}: NeuStatProps) {
  return (
    <NeuCard className={`p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/55">
          {label}
        </p>
        {icon && <span className="shrink-0 text-primary">{icon}</span>}
      </div>
      {/* dir="auto" isolates the run: a Latin figure or date inside an RTL page
          otherwise reorders into nonsense ("96.88 cr" becomes "cr 96.88"). */}
      <p dir="auto" className="tabular mt-3 text-2xl font-bold leading-none text-foreground">
        {value}
      </p>
      {detail && (
        <p dir="auto" className="mt-2 text-xs text-foreground/60">
          {detail}
        </p>
      )}
    </NeuCard>
  );
}
