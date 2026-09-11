"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ballot-buddy-progress";

/** Voter-journey milestones, in the order a first-time voter meets them. */
export const JOURNEY_STEPS = [
  "turning18",
  "register",
  "epic",
  "checkRoll",
  "findBooth",
  "pollingDay",
  "results",
] as const;

export type JourneyStep = (typeof JOURNEY_STEPS)[number];

export type EligibilityOutcome = "unknown" | "eligible" | "needsForm6" | "needsUpdate";

export interface VoterProgress {
  completedSteps: JourneyStep[];
  badges: string[];
  eligibility: EligibilityOutcome;
}

const EMPTY: VoterProgress = {
  completedSteps: [],
  badges: [],
  eligibility: "unknown",
};

function read(): VoterProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<VoterProgress>;
    return {
      completedSteps: (parsed.completedSteps ?? []).filter((s): s is JourneyStep =>
        (JOURNEY_STEPS as readonly string[]).includes(s)
      ),
      badges: parsed.badges ?? [],
      eligibility: parsed.eligibility ?? "unknown",
    };
  } catch {
    return EMPTY;
  }
}

/**
 * Progress is per-device and deliberately local: none of it is worth asking a
 * first-time voter to create an account for.
 */
export function useVoterProgress() {
  const [progress, setProgress] = useState<VoterProgress>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(read());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((next: VoterProgress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Progress stays for this session only.
    }
  }, []);

  const completeStep = useCallback(
    (step: JourneyStep) =>
      setProgress((prev) => {
        if (prev.completedSteps.includes(step)) return prev;
        const next = { ...prev, completedSteps: [...prev.completedSteps, step] };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // As above.
        }
        return next;
      }),
    []
  );

  const setEligibility = useCallback(
    (eligibility: EligibilityOutcome) =>
      persist({ ...read(), eligibility }),
    [persist]
  );

  const awardBadge = useCallback(
    (badge: string) => {
      const current = read();
      if (current.badges.includes(badge)) return;
      persist({ ...current, badges: [...current.badges, badge] });
    },
    [persist]
  );

  return {
    ...progress,
    isLoaded,
    totalSteps: JOURNEY_STEPS.length,
    completeStep,
    setEligibility,
    awardBadge,
  };
}
