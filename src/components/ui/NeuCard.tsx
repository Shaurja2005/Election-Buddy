import type { ElementType, HTMLAttributes, ReactNode } from "react";

type Elevation = "raised" | "sunken" | "flat";

const ELEVATION: Record<Elevation, string> = {
  raised: "bg-nm-surface shadow-nm-raised",
  sunken: "bg-nm-sunken shadow-nm-inset",
  flat: "bg-nm-surface shadow-nm-flat",
};

interface NeuCardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  elevation?: Elevation;
  /** Adds a lift on hover. Only for cards that actually do something when clicked. */
  interactive?: boolean;
  children: ReactNode;
}

export default function NeuCard({
  as: Tag = "div",
  elevation = "raised",
  interactive = false,
  className = "",
  children,
  ...rest
}: NeuCardProps) {
  return (
    <Tag
      className={[
        "rounded-2xl",
        ELEVATION[elevation],
        interactive
          ? "transition-shadow duration-200 hover:shadow-nm-raised-lg motion-reduce:transition-none"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
