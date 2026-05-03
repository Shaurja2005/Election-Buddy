"use client";

import type { PollingLocation, PollingLocationsProps } from "@/types";

export default function PollingLocations({ locations }: PollingLocationsProps) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-sm text-base-content/70 mb-3 font-medium uppercase tracking-wide">
        🗳️ Your Polling Locations
      </p>
      <div className="grid grid-cols-1 gap-3">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="card card-compact bg-blue-50 border border-blue-100 shadow-sm"
          >
            <div className="card-body">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-base-content">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-0.5 flex items-center gap-1">
                    <span>📍</span> {loc.address}
                  </p>
                  {loc.hours && (
                    <p className="text-xs text-base-content/70 mt-0.5 flex items-center gap-1">
                      <span>🕐</span> {loc.hours}
                    </p>
                  )}
                  {loc.notes && (
                    <p className="text-xs text-warning mt-1 flex items-center gap-1">
                      <span>ℹ️</span> {loc.notes}
                    </p>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-ghost text-primary shrink-0"
                  id={`map-btn-${idx}`}
                >
                  Map →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
