"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface NeuInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  icon?: ReactNode;
}

export default function NeuInput({
  label,
  hideLabel = false,
  hint,
  error,
  icon,
  id,
  className = "",
  ...rest
}: NeuInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={
          hideLabel
            ? "sr-only"
            : "mb-2 block text-sm font-medium text-foreground/85"
        }
      >
        {label}
      </label>

      {/* A soft well alone does not read as a field, so it also carries a
          visible edge — the shadow is never the only signal. */}
      <div
        className={[
          "flex items-center gap-2.5 rounded-2xl bg-nm-sunken px-4",
          "shadow-nm-inset ring-1 transition-shadow duration-150",
          "motion-reduce:transition-none",
          error ? "ring-destructive" : "ring-nm-edge focus-within:ring-ring",
        ].join(" ")}
      >
        {icon && <span className="shrink-0 text-foreground/45">{icon}</span>}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={[
            "min-h-11 w-full bg-transparent py-2.5 text-sm text-foreground",
            "placeholder:text-foreground/40 focus:outline-none",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-xs text-foreground/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
