"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { GAME_STAGES, type GameStage } from "@/lib/game/data";

export type Gender = "male" | "female";

export interface GamePlayer {
  stateCode: string;
  stateName: string;
  gender: Gender;
  name: string;
}

const SOUNDS = {
  paper: "/game/audio/paper-rustle-sound.mp3",
  beep: "/game/audio/evm-beep.mp3",
} as const;

export function useGame() {
  const [stageIndex, setStageIndex] = useState(0);
  const [player, setPlayer] = useState<GamePlayer>({
    stateCode: "",
    stateName: "",
    gender: "male",
    name: "",
  });
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const stage: GameStage = GAME_STAGES[stageIndex];

  const play = useCallback((sound: keyof typeof SOUNDS) => {
    if (mutedRef.current) return;
    // A fresh element per cue lets rapid repeats overlap instead of cutting off.
    const audio = new Audio(SOUNDS[sound]);
    audio.volume = 0.6;
    void audio.play().catch(() => {});
  }, []);

  const next = useCallback(() => {
    setStageIndex((i) => Math.min(i + 1, GAME_STAGES.length - 1));
  }, []);

  const restart = useCallback(() => {
    setStageIndex(0);
    setPlayer({ stateCode: "", stateName: "", gender: "male", name: "" });
  }, []);

  const update = useCallback((patch: Partial<GamePlayer>) => {
    setPlayer((p) => ({ ...p, ...patch }));
  }, []);

  return useMemo(
    () => ({
      stage,
      stageIndex,
      total: GAME_STAGES.length - 1,
      player,
      update,
      next,
      restart,
      play,
      muted,
      setMuted,
    }),
    [stage, stageIndex, player, update, next, restart, play, muted]
  );
}

export type Game = ReturnType<typeof useGame>;
