"use client";

import { useCallback, useRef } from "react";

/**
 * The EVM's confirmation beep. Voters are told to listen for it, so the
 * simulation would be teaching the wrong thing without one. Synthesised
 * rather than shipped as an audio file — it is one tone.
 */
export function useBeep(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (muted) return;
    try {
      // Created on first use: browsers reject an AudioContext made before a gesture.
      ctxRef.current ??= new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 1180;

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      gain.gain.setValueAtTime(0.18, now + 0.42);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } catch {
      // No audio available; the simulation still works silently.
    }
  }, [muted]);
}
