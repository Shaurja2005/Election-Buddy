"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";

interface AddressInputProps {
  address: string;
  onChange: (val: string) => void;
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: object
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => { formatted_address?: string };
          };
        };
      };
    };
  }
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function AddressInput({
  address,
  onChange,
  onSubmit,
  disabled,
}: AddressInputProps) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<ReturnType<NonNullable<NonNullable<Window["google"]>["maps"]>["places"]["Autocomplete"]> | null>(null);

  // Initialize Google Places Autocomplete once the Maps script is loaded
  const initAutocomplete = () => {
    if (
      !inputRef.current ||
      !window.google?.maps?.places ||
      autocompleteRef.current
    ) {
      return;
    }
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const formatted = place.formatted_address || inputRef.current?.value || "";
      onChange(formatted);
      onSubmit(formatted);
    });
    autocompleteRef.current = ac;
  };

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

          // Use Google Maps Geocoding API if key is available, else Nominatim fallback
          if (MAPS_API_KEY) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAPS_API_KEY}`
            );
            const data = await res.json();
            const addr =
              data?.results?.[0]?.formatted_address ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            onChange(addr);
            onSubmit(addr);
          } else {
            // Fallback to Nominatim for non-Google environments
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const addr =
              data?.display_name ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            onChange(addr);
            onSubmit(addr);
          }
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
    <>
      {/* Load Google Maps Places library (only if key is configured) */}
      {MAPS_API_KEY && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
          onLoad={initAutocomplete}
        />
      )}

      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-5 py-6">
        <div className="space-y-1.5 px-4">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-base-content leading-snug max-w-xl mx-auto">
            Enter your full address to precisely locate your polling station, representatives, and specific election details.
          </h2>
        </div>

        <form
          onSubmit={handleFormSubmit}
          aria-label="Address search form"
          className="w-full relative flex items-center shadow-md hover:shadow-lg rounded-full bg-base-100 border border-base-200 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all p-1.5"
        >
          <div className="pl-4 pr-2 text-primary opacity-80 flex items-center justify-center" aria-hidden="true">
            🔎︎
          </div>
          <label htmlFor="address-input" className="sr-only">
            Your full address
          </label>
          <input
            ref={inputRef}
            id="address-input"
            type="text"
            placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-3 px-1 text-base-content placeholder-base-content/40"
            value={address}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || locating}
            autoComplete="street-address"
            aria-describedby="address-hint"
          />

          <div className="flex items-center gap-1.5 pr-1">
            <button
              type="button"
              id="geolocate-btn"
              className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10 border border-transparent dark:border-white/50"
              onClick={handleGeolocate}
              disabled={disabled || locating}
              aria-label="Use my current location"
              title="Use my current location"
            >
              {locating ? (
                <span className="loading loading-spinner loading-xs" aria-label="Detecting location" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
              aria-label="Search for election information at this address"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </form>

        <span id="address-hint" className="sr-only">
          Type your full street address to get personalized election information. Supported countries include USA, India, UK, Canada, and Australia.
        </span>

        {geoError && (
          <p role="alert" aria-live="assertive" className="text-error text-xs animate-in fade-in flex items-center gap-1">
            <span aria-hidden="true">⚠️</span> {geoError}
          </p>
        )}
        <p className="text-[11px] text-base-content/40 font-medium">
          <span aria-hidden="true">🔒</span> Your address is securely used to look up local data and is never stored.
        </p>
      </div>
    </>
  );
}
