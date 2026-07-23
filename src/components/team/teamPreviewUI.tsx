import { motion } from "framer-motion";
import { useGame } from "../../providers/gameProvider";
import { TypeBadge } from "../ui/TypeBadge";
import { AnimatedBackground, HighTechEffects, PulsingCircuit } from "./teamUI";
import Image from "next/image";
import { Swords } from "lucide-react";

const SPARK_COUNT = 24;
const RING_COUNT = 3;

const EnergyRing = ({ index }: { index: number }) => {
  const size = 120 + index * 80;
  const delay = 0.6 + index * 0.15;
  return (
    <motion.div
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor: index % 2 === 0 ? "rgba(250,204,21,0.4)" : "rgba(0,220,255,0.3)",
        boxShadow: `0 0 ${10 + index * 5}px ${index % 2 === 0 ? "rgba(250,204,21,0.2)" : "rgba(0,220,255,0.15)"}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.1, 1],
        opacity: [0, 0.8, 0],
        rotate: [0, index % 2 === 0 ? 180 : -180],
      }}
      transition={{ duration: 1.4, delay, ease: "easeOut" }}
    />
  );
};

const Spark = ({ index }: { index: number }) => {
  const angle = (index / SPARK_COUNT) * 360 + (Math.random() - 0.5) * 30;
  const dist = 60 + Math.random() * 200;
  const rad = (angle * Math.PI) / 180;
  const length = 8 + Math.random() * 24;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: length,
        height: 2,
        background: `linear-gradient(90deg, rgba(250,204,21,0.9), rgba(255,255,200,0))`,
        rotate: angle,
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{
        duration: 0.5 + Math.random() * 0.4,
        delay: 0.7 + Math.random() * 0.35,
        ease: "easeOut",
      }}
    />
  );
};

const AmbientSpark = ({ index }: { index: number }) => {
  const x = (Math.random() - 0.5) * 300;
  const y = (Math.random() - 0.5) * 200;
  const delay = 2 + Math.random() * 4;
  const dur = 0.4 + Math.random() * 0.6;

  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-yellow-300"
      style={{ left: "50%", top: "50%", boxShadow: "0 0 4px rgba(250,204,21,0.6)" }}
      initial={{ x, y, opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 5 }}
      key={`amb-${index}`}
    />
  );
};

const ClashEffects = () => (
  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
    {Array.from({ length: RING_COUNT }, (_, i) => (
      <EnergyRing key={`ring-${i}`} index={i} />
    ))}

    <motion.div
      className="absolute h-48 w-48 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(250,204,21,0.5) 0%, rgba(250,204,21,0) 70%)",
        filter: "blur(30px)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0] }}
      transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
    />

    <motion.div
      className="absolute h-2 w-2 rounded-full bg-white"
      style={{ boxShadow: "0 0 20px 10px rgba(255,255,255,0.8), 0 0 60px 20px rgba(250,204,21,0.4)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 3, 1], opacity: [0, 1, 0.6] }}
      transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
    />

    {Array.from({ length: SPARK_COUNT }, (_, i) => (
      <Spark key={`spark-${i}`} index={i} />
    ))}

    {Array.from({ length: 8 }, (_, i) => (
      <AmbientSpark key={`amb-${i}`} index={i} />
    ))}
  </div>
);

const VsBadge = () => (
  <div className="relative z-20 mx-4 my-6 flex items-center justify-center sm:mx-12 sm:my-0">
    <ClashEffects />

    <motion.div
      className="absolute h-28 w-28 rounded-full sm:h-36 sm:w-36"
      style={{
        background: "conic-gradient(from 0deg, rgba(0,220,255,0.3), rgba(250,204,21,0.3), rgba(239,68,68,0.3), rgba(0,220,255,0.3))",
        filter: "blur(8px)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: 360 }}
      transition={{ scale: { delay: 0.5, duration: 0.5 }, opacity: { delay: 0.5, duration: 0.5 }, rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
    />

    <motion.div
      className="absolute h-20 w-20 rounded-full border-2 border-slate-400/30 sm:h-28 sm:w-28"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 200 }}
    />

    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 12 }}
      className="relative z-10 flex items-center justify-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center bg-slate-900/90 shadow-2xl sm:h-24 sm:w-24"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          boxShadow: "0 0 30px rgba(0,220,255,0.3), inset 0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <span className="font-kode text-xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] sm:text-4xl">
          VS
        </span>
      </div>
    </motion.div>
  </div>
);

const PLAYER_CLIP = "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";
const CPU_CLIP = "polygon(16px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 16px)";

const TeamCard = ({
  mon,
  side,
  index,
}: {
  mon: { id: number; name: string; image: string; type1: string; type2?: string | null };
  side: "player" | "cpu";
  index: number;
}) => {
  const isPlayer = side === "player";
  const clip = isPlayer ? PLAYER_CLIP : CPU_CLIP;
  const slideDir = isPlayer ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: 0, x: slideDir }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.15, type: "spring", stiffness: 120 }}
      className="group w-[20rem] sm:w-[22rem]"
      style={{ alignSelf: isPlayer ? "flex-start" : "flex-end" }}
    >
      <div
        className={`p-px shadow-lg transition-all duration-300 ${
          isPlayer
            ? "pr-4 hover:pr-2 bg-gradient-to-r from-cyan-500 to-cyan-400 dark:from-cyan-600 dark:to-cyan-500"
            : "pl-4 hover:pl-2 bg-gradient-to-l from-red-500 to-red-400 dark:from-red-600 dark:to-red-500"
        }`}
        style={{ clipPath: clip }}
      >
        <div
          className={`flex h-full w-full items-center gap-3 bg-slate-100/90 p-2 backdrop-blur-sm dark:bg-slate-800/90 sm:gap-4 sm:p-3 ${
            !isPlayer ? "flex-row-reverse text-right" : ""
          }`}
          style={{ clipPath: clip }}
        >
          <div
            className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-slate-200/60 dark:bg-slate-900/60 sm:h-16 sm:w-24"
            style={{
              clipPath: isPlayer
                ? "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)"
                : "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <Image src={mon.image} alt={mon.name} fill className="object-contain p-0.5" />
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                isPlayer
                  ? "bg-gradient-to-r from-cyan-400/20 to-transparent"
                  : "bg-gradient-to-l from-red-400/20 to-transparent"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-white sm:text-base">
              {mon.name}
            </p>
            <div className={`mt-1 flex gap-1 ${!isPlayer ? "justify-end" : ""}`}>
              <TypeBadge type={mon.type1} size="xs" />
              {mon.type2 && <TypeBadge type={mon.type2} size="xs" />}
            </div>
          </div>

          <motion.div
            className={`hidden h-full w-0.5 rounded-full sm:block ${
              isPlayer ? "bg-cyan-400/40" : "bg-red-400/40"
            }`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8 + index * 0.15, duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const TeamPreviewScreen = () => {
  const { playerTeamState, cpuTeamState, startBattle, background } = useGame();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
      <AnimatedBackground />
      <HighTechEffects />
      <PulsingCircuit />

      <div className="absolute inset-0 h-full w-full overflow-hidden opacity-25">
        <Image
          src={`/images/backgrounds/background-${background}.jpg`}
          alt={`Background ${background}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900/60" />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />

      <div className="relative z-20 flex h-full w-full max-w-6xl flex-col items-center px-4 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -inset-x-8 -inset-y-2"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,220,255,0.1), transparent)",
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <h1 className="relative font-kode text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-cyan-400 via-white to-red-400 bg-clip-text text-transparent dark:from-cyan-400 dark:via-white dark:to-red-400">
                BATTLE START
              </span>
              <motion.span
                className="text-yellow-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                !
              </motion.span>
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 hidden text-sm tracking-wide text-slate-500 dark:text-slate-400 sm:block sm:text-base"
          >
            Your team is ready for the challenge.
          </motion.p>
        </motion.div>

        {/* Teams + VS */}
        <div className="mt-4 flex w-full flex-1 flex-col items-center justify-center sm:mt-8 sm:flex-row sm:items-center">
          {/* Player Team */}
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:gap-3">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm font-bold tracking-widest text-cyan-600 uppercase dark:text-cyan-400 sm:text-lg"
            >
              <motion.div
                className="h-px w-6 bg-cyan-500 sm:w-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{ originX: 1 }}
              />
              YOUR TEAM
              <motion.div
                className="h-px w-6 bg-cyan-500 sm:w-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </motion.h2>
            {playerTeamState.map((p, i) => (
              <TeamCard key={p.id} mon={p} side="player" index={i} />
            ))}
          </div>

          <VsBadge />

          {/* CPU Team */}
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:gap-3">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm font-bold tracking-widest text-red-500 uppercase sm:text-lg"
            >
              <motion.div
                className="h-px w-6 bg-red-500 sm:w-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{ originX: 1 }}
              />
              CPU TEAM
              <motion.div
                className="h-px w-6 bg-red-500 sm:w-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </motion.h2>
            {cpuTeamState.map((p, i) => (
              <TeamCard key={p.id} mon={p} side="cpu" index={i} />
            ))}
          </div>
        </div>

        {/* Fight Button */}
        <motion.div
          className="mt-6 sm:mt-10"
          initial={{ scale: 0, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.2)" }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={startBattle}
            className="group relative overflow-hidden px-12 py-4 shadow-xl"
            style={{
              clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-2 font-kode text-xl font-black text-white drop-shadow-lg sm:text-2xl">
              <Swords className="h-5 w-5 sm:h-6 sm:w-6" />
              FIGHT!
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
