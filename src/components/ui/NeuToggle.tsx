"use client";

import { useId } from "react";

interface NeuToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
}

export default function NeuToggle({
  checked,
  onChange,
  label,
  hideLabel = false,
  disabled = false,
}: NeuToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          "shadow-nm-inset motion-reduce:transition-none",
          "disabled:opacity-45 disabled:cursor-not-allowed",
          // Colour carries the state, not the shadow alone.
          checked ? "bg-primary" : "bg-nm-sunken",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 start-1 h-5 w-5 rounded-full bg-nm-surface shadow-nm-raised-sm",
            "transition-transform duration-200 motion-reduce:transition-none",
            checked ? "nm-knob-on" : "",
          ].join(" ")}
        />
      </button>
      {!hideLabel && (
        <label htmlFor={id} className="text-sm text-foreground/85">
          {label}
        </label>
      )}
    </div>
  );
}
