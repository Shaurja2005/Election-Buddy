import type { MockCandidate } from "@/lib/evm/candidates";

/**
 * Authored symbols in one consistent weight, drawn rather than borrowed from
 * an emoji font. Each is deliberately generic so it resembles no real party.
 */
export default function BallotSymbol({
  symbol,
  size = 32,
}: {
  symbol: MockCandidate["symbol"];
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (symbol) {
    case "leaf":
      return (
        <svg {...common}>
          <path d="M25 6C13 6 7 12 7 20a8 8 0 0 0 8 8c8 0 12-7 12-18-.3-2-1-4-2-4Z" />
          <path d="M22 10 9 25" />
        </svg>
      );
    case "river":
      return (
        <svg {...common}>
          <path d="M4 11c3.5-3 6.5-3 10 0s6.5 3 10 0" />
          <path d="M4 18c3.5-3 6.5-3 10 0s6.5 3 10 0" />
          <path d="M4 25c3.5-3 6.5-3 10 0s6.5 3 10 0" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="6" />
          <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2.1 2.1M23.1 23.1l2.1 2.1M25.2 6.8l-2.1 2.1M8.9 23.1l-2.1 2.1" />
        </svg>
      );
    case "hill":
      return (
        <svg {...common}>
          <path d="M3 25h26" />
          <path d="M6 25 14 11l5 8 3-4 5 10" />
          <circle cx="23" cy="7" r="2.5" />
        </svg>
      );
  }
}
