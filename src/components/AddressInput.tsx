"use client";

import { useState } from "react";

interface AddressInputProps {
  address: string;
  onChange: (val: string) => void;
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

export default function AddressInput({
  address,
  onChange,
  onSubmit,
  disabled,
}: AddressInputProps) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr =
            data?.display_name ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          onChange(addr);
          onSubmit(addr);
        } catch {
          setGeoError("Could not reverse-geocode your location.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setGeoError(`Location error: ${err.message}`);
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-5 py-6">
      <div className="space-y-1.5 px-4">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-base-content leading-snug max-w-xl mx-auto">
          Enter your full address to precisely locate your polling station, representatives, and specific election details.
        </h2>
      </div>

      <form 
        onSubmit={handleFormSubmit} 
        className="w-full relative flex items-center shadow-md hover:shadow-lg rounded-full bg-base-100 border border-base-200 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all p-1.5"
      >
        <div className="pl-4 pr-2 text-primary opacity-80 flex items-center justify-center">
          🔎︎
        </div>
        <input
          id="address-input"
          type="text"
          placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC..."
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-3 px-1 text-base-content placeholder-base-content/40"
          value={address}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || locating}
        />
        
        <div className="flex items-center gap-1.5 pr-1">
          <button
            type="button"
            id="geolocate-btn"
            className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10 border border-transparent dark:border-white/50"
            onClick={handleGeolocate}
            disabled={disabled || locating}
            aria-label="Use my location"
            title="Use my location"
          >
            {locating ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
            )}
          </button>

          <button
            id="address-submit-btn"
            type="submit"
            className="btn btn-primary btn-circle btn-md shadow-sm ml-1"
            disabled={disabled || !address.trim() || locating}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </form>

      {geoError && (
        <p className="text-error text-xs animate-in fade-in flex items-center gap-1">
          <span>⚠️</span> {geoError}
        </p>
      )}
      <p className="text-[11px] text-base-content/40 font-medium">
        🔒 Your address is securely used to look up local data and is never stored.
      </p>
    </div>
  );
}
