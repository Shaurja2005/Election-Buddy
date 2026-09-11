"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useGame } from "@/hooks/useGame";
import { useVoterProgress } from "@/hooks/useVoterProgress";
import GameShell from "@/components/game/GameShell";
import StageState from "@/components/game/StageState";
import StageCharacter from "@/components/game/StageCharacter";
import StageDocuments from "@/components/game/StageDocuments";
import StageRoll from "@/components/game/StageRoll";
import StageBooth from "@/components/game/StageBooth";
import StageElectionDay from "@/components/game/StageElectionDay";
import StageOfficer from "@/components/game/StageOfficer";
import StageEvm from "@/components/game/StageEvm";
import StageDone from "@/components/game/StageDone";

export default function GamePage() {
  const { t } = useLanguage();
  const game = useGame();
  const { completeStep } = useVoterProgress();
  const { player } = game;

  const finish = () => {
    completeStep("pollingDay");
    game.next();
  };

  return (
    <div className="py-2">
      <GameShell game={game} title={t(`game.title.${game.stage}`)} hint={t(`game.hint.${game.stage}`)}>
        {game.stage === "state" && (
          <StageState
            onPick={(stateCode, stateName) => {
              game.update({ stateCode, stateName });
              game.play("paper");
              game.next();
            }}
          />
        )}

        {game.stage === "character" && (
          <StageCharacter
            stateName={player.stateName}
            gender={player.gender}
            onChange={game.update}
            onConfirm={(name) => {
              game.update({ name });
              game.play("paper");
              game.next();
            }}
          />
        )}

        {game.stage === "documents" && <StageDocuments onDone={game.next} play={game.play} />}

        {game.stage === "roll" && (
          <StageRoll
            playerName={player.name}
            stateName={player.stateName}
            onDone={game.next}
            play={game.play}
          />
        )}

        {game.stage === "booth" && <StageBooth onDone={game.next} play={game.play} />}

        {game.stage === "electionDay" && <StageElectionDay onDone={game.next} play={game.play} />}

        {game.stage === "officer" && (
          <StageOfficer
            playerName={player.name}
            gender={player.gender}
            onDone={game.next}
            play={game.play}
          />
        )}

        {game.stage === "evm" && <StageEvm onDone={finish} play={game.play} />}

        {game.stage === "done" && (
          <StageDone
            name={player.name}
            stateName={player.stateName}
            gender={player.gender}
            onRestart={game.restart}
          />
        )}
      </GameShell>
    </div>
  );
}
