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
  /** Paper handled: documents lifted off the desk, a name ticked on the roll. */
  paper: "/game/audio/paper-rustle-sound.mp3",
  /** Generic advance: a choice made, a line of dialogue stepped through. */
  click: "/game/audio/sfx_click.mp3",
  /** Stepping into a building on the street. */
  building: "/game/audio/building_select_sound.mp3",
  /** The EVM's confirmation beep — the sound a voter is told to listen for. */
  beep: "/game/audio/evm-beep.mp3",
  /** The VVPAT printing the slip behind the glass. */
  print: "/game/audio/sfx_vvpat_print.mp3",
} as const;

export type GameSound = keyof typeof SOUNDS;

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
