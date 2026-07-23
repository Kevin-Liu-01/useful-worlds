import React from "react";
import { useGame } from "../../providers/gameProvider";
import { FightScreen } from "../battle/battleUI";
import { GameOverScreen } from "./gameOverScreen";
import { TeamSelectScreen } from "../team/teamUI";
import { TeamPreviewScreen } from "../team/teamPreviewUI";
import { AnimatePresence, motion } from "framer-motion";

const GameScreenManager = () => {
  const game = useGame();

  const activePlayerMon = game.playerTeamState[game.activePlayerIndex];
  const activeCpuMon = game.cpuTeamState[game.activeCpuIndex];

  const getCurrentScreenKey = () => {
    switch (game.gameState) {
      case "teamSelect":
        return "teamSelect";
      case "teamPreview":
        return "teamPreview";
      case "fight":
      case "forcedSwitch":
        return "fight"; // Use the same key for smooth transitions
      case "gameOver":
        return "gameOver";
      default:
        return "teamSelect";
    }
  };

  return (
    <main className="relative h-full w-full flex-grow">
      <AnimatePresence mode="wait">
        <motion.div
          key={getCurrentScreenKey()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full w-full"
        >
          {game.gameState === "teamSelect" && <TeamSelectScreen />}
          {game.gameState === "teamPreview" && <TeamPreviewScreen />}
          {(game.gameState === "fight" || game.gameState === "forcedSwitch") &&
            activePlayerMon &&
            activeCpuMon && <FightScreen />}
        </motion.div>
      </AnimatePresence>
      {game.gameState === "gameOver" && <GameOverScreen />}
    </main>
  );
};

export default GameScreenManager;
