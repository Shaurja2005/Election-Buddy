interface NeuProgressProps {
  value: number;
  max?: number;
  label: string;
  /** Show the numeric readout beside the label. */
  showValue?: boolean;
  className?: string;
}

export default function NeuProgress({
  value,
  max = 100,
  label,
  showValue = true,
  className = "",
}: NeuProgressProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground/85">{label}</span>
        {showValue && (
          <span dir="ltr" className="tabular text-sm font-semibold text-foreground">
            {value}/{max}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full bg-nm-sunken shadow-nm-inset"
      >
        {/* Physical inline-size, so the fill grows from the start edge in both
            reading directions. */}
        <div
          className="h-full rounded-full bg-primary transition-[inline-size] duration-500 ease-out motion-reduce:transition-none"
          style={{ inlineSize: `${pct}%` }}
        />
      </div>
    </div>
  );
}
