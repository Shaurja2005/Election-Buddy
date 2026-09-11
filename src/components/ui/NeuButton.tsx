"use client";

import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

type Variant = "default" | "primary" | "ghost";
type Size = "sm" | "md" | "lg";

// Raised → pressed is the one move neumorphism does better than any other
// style. Every variant keeps it, and none of them rely on the shadow alone to
// say what the control is: each carries a label or colour too.
const VARIANT: Record<Variant, string> = {
  default: "bg-nm-surface text-foreground shadow-nm-raised active:shadow-nm-pressed",
  primary:
    "bg-primary text-primary-foreground font-semibold shadow-nm-raised active:shadow-nm-pressed",
  ghost:
    "bg-transparent text-foreground/80 shadow-none hover:bg-nm-surface hover:shadow-nm-raised-sm active:shadow-nm-pressed",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-14 px-7 text-base gap-2.5 rounded-2xl",
};

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a link (e.g. next/link) when the action navigates. */
  as?: ElementType;
  href?: string;
  variant?: Variant;
  size?: Size;
  /** Rendered before the label; pass a lucide icon, never an emoji. */
  icon?: ReactNode;
  children?: ReactNode;
}

export default function NeuButton({
  as: Tag = "button",
  variant = "default",
  size = "md",
  icon,
  className = "",
  children,
  type = "button",
  ...rest
}: NeuButtonProps) {
  const isButton = Tag === "button";
  return (
    <Tag
      type={isButton ? type : undefined}
      className={[
        "inline-flex items-center justify-center font-medium",
        "transition-shadow duration-150 motion-reduce:transition-none",
        "disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-nm-flat",
        VARIANT[variant],
        SIZE[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon}
      {children}
    </Tag>
  );
}
