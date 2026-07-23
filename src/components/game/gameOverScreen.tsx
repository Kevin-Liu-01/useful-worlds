import React from "react";
import Image from "next/image";
import { useGame } from "../../providers/gameProvider";
import { motion } from "framer-motion";
import {
  BarChart2,
  Zap,
  AlertTriangle,
  Sparkles,
  Biohazard,
  RefreshCw,
} from "lucide-react";
import {
  AnimatedBackground,
  HighTechEffects,
  PulsingCircuit,
} from "../team/teamUI";

const StatRow = ({
  icon,
  label,
  playerValue,
  cpuValue,
}: {
  icon: React.ReactNode;
  label: string;
  playerValue: string | number;
  cpuValue: string | number;
}) => (
  <div className="grid grid-cols-10 items-center gap-4 border-b border-slate-200/80 py-2.5 text-sm last:border-b-0 dark:border-cyan-400/10">
    <div className="col-span-6 flex items-center gap-3">
      <div className="text-cyan-600 dark:text-cyan-400">{icon}</div>
      <span className="font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
    </div>
    <div className="col-span-2 text-center font-mono text-lg font-bold text-slate-900 dark:text-white">
      {playerValue}
    </div>
    <div className="col-span-2 text-center font-mono text-lg font-bold text-slate-900 dark:text-white">
      {cpuValue}
    </div>
  </div>
);

const TrainerPodium = ({
  isWinner,
  trainerState,
  isPlayer,
}: {
  isWinner: boolean;
  trainerState: "win" | "lose";
  isPlayer: boolean;
}) => {
  const trainerImage = isPlayer
    ? `/images/trainer/${trainerState}.png`
    : `/images/cynthia/${trainerState}.png`;

  const variants = {
    hidden: { opacity: 0, x: isPlayer ? -80 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={variants}
      className="relative flex h-full w-full flex-col items-center justify-end"
    >
      <div
        className={`absolute bottom-0 h-2/3 w-full ${
          isPlayer ? "bg-gradient-to-r" : "bg-gradient-to-l"
        } ${
          isWinner
            ? "from-cyan-500/15 to-transparent"
            : "from-red-500/15 to-transparent"
        }`}
      />
      <motion.div
        className="absolute bottom-2 z-20 h-full w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <Image
          src={trainerImage}
          alt={isPlayer ? "Player Trainer" : "CPU Trainer"}
          fill
          className={
            !isPlayer
              ? "-scale-x-100 object-contain object-bottom"
              : "object-contain object-bottom"
          }
          priority
        />
      </motion.div>
      <motion.div
        className="relative h-12 w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div
          className={`absolute inset-x-0 bottom-0 h-1.5 blur-lg ${
            isWinner ? "bg-cyan-400" : "bg-red-500"
          }`}
        />
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 200 48"
          className="absolute bottom-0"
        >
          <polygon
            points="0,48 200,48 180,0 20,0"
            className={`fill-current ${
              isWinner
                ? "text-slate-300/60 dark:text-slate-700/60"
                : "text-slate-200/60 dark:text-slate-800/60"
            }`}
          />
          <polygon
            points="0,48 200,48 180,0 20,0"
            className={`stroke-current ${
              isWinner
                ? "text-cyan-500/60 dark:text-cyan-400/60"
                : "text-red-500/60"
            }`}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export const GameOverScreen = () => {
  const { winner, handleReset, turnCount, playerStats, cpuStats, background } =
    useGame();
  const isPlayerWinner = winner === "Player";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="absolute inset-0 z-[100] flex h-full w-full flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900"
    >
      <AnimatedBackground />
      <HighTechEffects />
      <PulsingCircuit />
      <div className="absolute inset-0 aspect-video h-full w-full overflow-hidden rounded opacity-30">
        <Image
          src={`/images/backgrounds/background-${background}.jpg`}
          alt={`Background ${background}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex h-full w-full max-w-screen-2xl items-stretch justify-center">
        {/* Left Trainer Podium */}
        <div className="w-1/3">
          <TrainerPodium
            isWinner={isPlayerWinner}
            trainerState={isPlayerWinner ? "win" : "lose"}
            isPlayer={true}
          />
        </div>

        {/* Central Content Column */}
        <motion.div
          variants={containerVariants}
          className="flex w-1/3 flex-col items-center justify-center"
        >
          <div className="absolute flex w-full flex-col items-center gap-6 px-4 py-8 sm:relative">
            {/* Title */}
            <motion.div variants={itemVariants} className="text-center">
              <h1
                className={`text-7xl font-extrabold tracking-tighter drop-shadow-lg md:text-8xl ${
                  isPlayerWinner
                    ? "text-cyan-500 dark:text-cyan-300"
                    : "text-red-500"
                }`}
              >
                {isPlayerWinner ? "VICTORY" : "DEFEAT"}
              </h1>
            </motion.div>

            {/* Battle Report */}
            <motion.div variants={itemVariants} className="w-full max-w-lg">
              <div
                className="bg-slate-300/50 p-px shadow-lg backdrop-blur-sm dark:bg-slate-700/50"
                style={{
                  clipPath:
                    "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)",
                }}
              >
                <div
                  className="relative h-full w-full bg-white/80 p-4 dark:bg-slate-800/80"
                  style={{
                    clipPath:
                      "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)",
                  }}
                >
                  <div className="grid grid-cols-10 items-center gap-4 border-b border-slate-300 pb-2 dark:border-cyan-400/20">
                    <div className="col-span-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <BarChart2 className="h-4 w-4" />
                      Battle Report
                    </div>
                    <div className="col-span-2 text-center text-xs font-bold text-cyan-500 dark:text-cyan-300">
                      YOU
                    </div>
                    <div className="col-span-2 text-center text-xs font-bold text-red-400">
                      CPU
                    </div>
                  </div>
                  <div className="mt-1">
                    <StatRow
                      icon={<RefreshCw size={18} />}
                      label="Turns Taken"
                      playerValue={turnCount}
                      cpuValue={turnCount}
                    />
                    <StatRow
                      icon={<Zap size={18} />}
                      label="Damage Dealt"
                      playerValue={playerStats.damageDealt}
                      cpuValue={cpuStats.damageDealt}
                    />
                    <StatRow
                      icon={<AlertTriangle size={18} />}
                      label="Critical Hits"
                      playerValue={playerStats.critsLanded}
                      cpuValue={cpuStats.critsLanded}
                    />
                    <StatRow
                      icon={<Sparkles size={18} />}
                      label="Super-Effective"
                      playerValue={playerStats.superEffectiveHits}
                      cpuValue={cpuStats.superEffectiveHits}
                    />
                    <StatRow
                      icon={<Biohazard size={18} />}
                      label="Status Applied"
                      playerValue={playerStats.statusEffectsInflicted}
                      cpuValue={cpuStats.statusEffectsInflicted}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleReset}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(45, 212, 191, 0.7)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative mt-2 bg-green-500 px-10 py-4 text-xl font-bold text-white shadow-lg transition sm:mt-0 sm:text-2xl"
                style={{
                  clipPath:
                    "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
                }}
              >
                BATTLE AGAIN
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Trainer Podium */}
        <div className="w-1/3">
          <TrainerPodium
            isWinner={!isPlayerWinner}
            trainerState={!isPlayerWinner ? "win" : "lose"}
            isPlayer={false}
          />
        </div>
      </div>
    </motion.div>
  );
};
