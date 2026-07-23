import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MonFrame } from "../battle/monFrames";
import type { ArenaFighter } from "./battleEngine";
import {
  getTrainerSpriteSrc,
  type TrainerId,
  type TrainerPose,
  type TrainerRenderMode,
} from "./trainerRoster";

export const TYPE_COLORS: Record<string, string> = {
  AI: "#a855f7",
  Data: "#3b82f6",
  Web: "#22c55e",
  Design: "#ec4899",
  Hardware: "#6b7280",
  Health: "#ef4444",
  Mobile: "#eab308",
  Game: "#f97316",
  Infra: "#0891b2",
};

export const TYPE_RGB: Record<string, string> = {
  AI: "168, 85, 247",
  Data: "59, 130, 246",
  Web: "34, 197, 94",
  Design: "236, 72, 153",
  Hardware: "107, 114, 128",
  Health: "239, 68, 68",
  Mobile: "234, 179, 8",
  Game: "249, 115, 22",
  Infra: "8, 145, 178",
};

export const ARENA_CLIP =
  "polygon(0 16px, 16px 0, calc(100% - 36px) 0, calc(100% - 24px) 12px, 100% 12px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 24px 100%, 12px calc(100% - 12px), 0 calc(100% - 12px))";

export const ArenaSigil = ({
  accent = "#d8ff36",
  className = "h-8 w-8",
}: {
  accent?: string;
  className?: string;
}) => (
  <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="none">
    <path
      d="M8 2.5h12l7.5 7.5v12L20 29.5H8L2.5 24V8Z"
      stroke={accent}
      strokeWidth="1.2"
    />
    <path d="M3 16h7m12 0h7" stroke={accent} strokeWidth="1.2" />
    <circle cx="16" cy="16" r="6" stroke={accent} strokeWidth="1.2" />
    <path d="m16 11 5 5-5 5-5-5Z" fill={accent} fillOpacity=".16" />
    <path d="M16 4v3m0 18v3" stroke={accent} strokeWidth="1.2" />
    <circle cx="16" cy="16" r="1.75" fill={accent} />
  </svg>
);

export const ArenaFrameArt = ({
  accent = "#d8ff36",
  animated = false,
  className = "",
}: {
  accent?: string;
  animated?: boolean;
  className?: string;
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className={`arena-frame-art pointer-events-none absolute inset-0 z-[65] h-full w-full ${className}`}
    fill="none"
  >
    <path
      d="M.65 9 9 .65h71l7 5.5h12.35V91L91 99.35H18l-8-5.5H.65Z"
      stroke={accent}
      strokeOpacity=".62"
      strokeWidth="1.15"
      vectorEffect="non-scaling-stroke"
    />
    <path
      className={animated ? "arena-frame-trace" : undefined}
      d="M1 9 9 1h27m11 0h33l7 5.5h12M99 91l-8 8H57m-12 0H18l-8-5.5H1"
      stroke={accent}
      strokeWidth="1.9"
      strokeLinecap="square"
      vectorEffect="non-scaling-stroke"
      pathLength="1"
    />
    <path
      d="M4 18V12l8-8h8M96 82v6l-8 8h-8"
      stroke={accent}
      strokeOpacity=".34"
      strokeWidth=".8"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M38 1h7M48 1h2M53 99h2"
      stroke={accent}
      strokeOpacity=".8"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
    />
    <rect x="3" y="91" width="1.4" height="1.4" fill={accent} />
    <rect x="95.6" y="9" width="1.4" height="1.4" fill={accent} />
  </svg>
);

export const CircuitRule = ({
  accent = "#d8ff36",
  className = "",
}: {
  accent?: string;
  className?: string;
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 640 16"
    preserveAspectRatio="none"
    className={`h-4 w-full ${className}`}
    fill="none"
  >
    <path
      d="M0 8h124l8-6h98l8 6h164l8 6h98l8-6h124"
      stroke={accent}
      strokeOpacity=".38"
      vectorEffect="non-scaling-stroke"
    />
    <path
      className="arena-rule-signal"
      d="M0 8h124l8-6h98l8 6h164l8 6h98l8-6h124"
      stroke={accent}
      strokeWidth="1.5"
      strokeLinecap="square"
      vectorEffect="non-scaling-stroke"
      pathLength="1"
    />
    <rect x="316" y="4" width="8" height="8" rx="1" fill={accent} />
  </svg>
);

export const BattlefieldVector = ({
  playerColor = "#41d9ff",
  cpuColor = "#ff4f9a",
}: {
  playerColor?: string;
  cpuColor?: string;
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 1200 520"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-0 h-full w-full"
    fill="none"
  >
    <path
      d="M0 252h236l42-34h232l90 68 90-68h232l42 34h236"
      stroke="white"
      strokeOpacity=".1"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M0 410h220l70-82h190l120 88M1200 132H980l-70 82H720L600 108"
      stroke="white"
      strokeOpacity=".07"
      vectorEffect="non-scaling-stroke"
    />
    <path
      className="arena-vector-dash"
      d="M42 438 234 330h276L600 278l90-52h276l192-108"
      stroke="white"
      strokeOpacity=".22"
      strokeDasharray="5 12"
      vectorEffect="non-scaling-stroke"
    />
    <ellipse
      cx="280"
      cy="388"
      rx="210"
      ry="64"
      stroke={playerColor}
      strokeOpacity=".24"
      vectorEffect="non-scaling-stroke"
    />
    <ellipse
      cx="920"
      cy="152"
      rx="210"
      ry="64"
      stroke={cpuColor}
      strokeOpacity=".24"
      vectorEffect="non-scaling-stroke"
    />
    <path d="m600 252 12 12-12 12-12-12Z" fill="#d8ff36" fillOpacity=".62" />
    <path
      d="M90 42h78m-78 0v30M1110 478h-78m78 0v-30"
      stroke="#d8ff36"
      strokeOpacity=".42"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export const VersusCore = () => (
  <div className="relative flex h-40 w-40 items-center justify-center lg:h-48 lg:w-48">
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 180 180"
      className="absolute inset-0 h-full w-full"
      fill="none"
    >
      <motion.g
        style={{ transformOrigin: "90px 90px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="m90 4 58 24 28 62-28 62-58 24-58-24L4 90l28-62Z"
          stroke="#d8ff36"
          strokeOpacity=".42"
          strokeDasharray="16 8 2 8"
        />
        <path
          d="M90 14v18m0 116v18M14 90h18m116 0h18"
          stroke="#d8ff36"
          strokeWidth="2"
        />
      </motion.g>
      <motion.g
        style={{ transformOrigin: "90px 90px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="90"
          cy="90"
          r="57"
          stroke="white"
          strokeOpacity=".24"
          strokeDasharray="2 9"
        />
        <path
          d="M90 40 140 90 90 140 40 90Z"
          stroke="white"
          strokeOpacity=".18"
        />
      </motion.g>
      <path
        d="m90 50 35 17 9 38-25 30H71l-25-30 9-38Z"
        fill="#06080b"
        stroke="#d8ff36"
        strokeOpacity=".72"
      />
      <path d="M50 90h80" stroke="#d8ff36" strokeOpacity=".38" />
    </motion.svg>
    <motion.strong
      initial={{ scale: 0, rotate: -18, opacity: 0 }}
      animate={{ scale: [0, 1.16, 1], rotate: 0, opacity: 1 }}
      transition={{ delay: 0.32, duration: 0.62, ease: "backOut" }}
      className="relative z-10 font-telegraf text-5xl font-black italic tracking-[-0.08em] text-white lg:text-6xl"
    >
      VS
    </motion.strong>
    <motion.span
      className="absolute left-[18%] right-[18%] top-1/2 h-px bg-[#d8ff36] shadow-[0_0_16px_#d8ff36]"
      animate={{ scaleX: [0.25, 1, 0.25], opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export const ResultSeal = ({
  victory,
  className = "h-24 w-24",
}: {
  victory: boolean;
  className?: string;
}) => {
  const accent = victory ? "#d8ff36" : "#ff5151";
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      initial={{ scale: 0.6, rotate: -24, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.65, ease: "backOut" }}
    >
      <path
        d="m60 4 14 10 17-2 7 16 15 8-3 17 8 15-12 13-1 18-17 4-10 14-18-6-18 6-10-14-17-4-1-18L2 68l8-15-3-17 15-8 7-16 17 2Z"
        stroke={accent}
        strokeWidth="2"
      />
      <circle cx="60" cy="60" r="40" stroke={accent} strokeOpacity=".35" />
      <circle
        cx="60"
        cy="60"
        r="31"
        fill={accent}
        fillOpacity=".1"
        stroke={accent}
      />
      <path
        d={victory ? "m40 61 13 13 28-31" : "m43 43 34 34M77 43 43 77"}
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path d="M60 10v10m0 80v10M10 60h10m80 0h10" stroke={accent} />
    </motion.svg>
  );
};

export const ArenaImage = ({
  src,
  alt,
  priority = false,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  return (
    <div className={`overflow-hidden bg-[#0a0d12] ${className}`}>
      <div
        className={`absolute inset-0 bg-[linear-gradient(110deg,#111827_20%,#283244_42%,#111827_64%)] bg-[length:220%_100%] transition-opacity duration-300 ${
          loaded
            ? "opacity-0"
            : "animate-[arena-shimmer_1.2s_linear_infinite] opacity-100"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition duration-300 ease-out ${
          loaded
            ? "scale-100 opacity-100 blur-0"
            : "scale-[1.03] opacity-0 blur-sm"
        }`}
      />
    </div>
  );
};

export const TrainerSprite = ({
  trainer,
  state = "idle",
  mode = "battle",
  flip = false,
  priority = true,
  animated = true,
  label,
}: {
  trainer: TrainerId;
  state?: TrainerPose;
  mode?: TrainerRenderMode;
  flip?: boolean;
  priority?: boolean;
  animated?: boolean;
  label: string;
}) => {
  const src = getTrainerSpriteSrc(trainer, mode);

  return (
    <motion.div
      className={`relative h-full w-full origin-bottom ${
        flip ? "-scale-x-100" : ""
      }`}
      animate={
        !animated
          ? undefined
          : state === "commanding"
          ? {
              y: [0, -5, -2, 0],
              x: flip ? [0, -7, -3, 0] : [0, 7, 3, 0],
              scale: [1, 1.045, 1.02, 1],
            }
          : state === "win"
          ? {
              y: [0, -10, 0, -5, 0],
              rotate: [0, 2, -1, 1, 0],
              scale: [1, 1.04, 1, 1.025, 1],
            }
          : state === "lose"
          ? { y: 7, rotate: flip ? -4 : 4, opacity: 0.68, scale: 0.96 }
          : { y: [0, -2.5, 0], scale: [1, 1.008, 1] }
      }
      transition={{
        duration: state === "idle" ? 3.6 : state === "win" ? 1 : 0.56,
        repeat: animated && state === "idle" ? Infinity : 0,
        ease: state === "idle" ? "easeInOut" : [0.22, 1, 0.36, 1],
      }}
    >
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 120 36"
        preserveAspectRatio="none"
        className="absolute inset-x-[8%] bottom-[1%] h-[24%] w-[84%] overflow-visible"
        fill="none"
        animate={
          animated
            ? { opacity: [0.22, 0.52, 0.22], scaleX: [0.94, 1.04, 0.94] }
            : { opacity: 0.34, scaleX: 1 }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse
          cx="60"
          cy="18"
          rx="54"
          ry="11"
          stroke="#d8ff36"
          strokeOpacity=".42"
          vectorEffect="non-scaling-stroke"
        />
        <ellipse
          cx="60"
          cy="18"
          rx="39"
          ry="7"
          stroke="white"
          strokeOpacity=".22"
          strokeDasharray="3 7"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
      <Image
        key={src}
        src={src}
        alt={label}
        fill
        sizes="180px"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        unoptimized
        className={`z-10 object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,.75)] [image-rendering:pixelated] ${
          mode === "chibi" ? "object-center" : "object-bottom"
        }`}
      />
      {(state === "commanding" || state === "win") && (
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          fill="none"
          initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
          animate={{
            opacity: [0, 0.75, 0],
            scale: [0.72, 1.05, 1.22],
            rotate: 18,
          }}
          transition={{
            duration: state === "win" ? 0.9 : 0.56,
            ease: "circOut",
          }}
        >
          <path
            d="M18 58c8-28 52-40 70-10M14 69c18 17 54 18 75-3"
            stroke="#d8ff36"
            strokeWidth="1.4"
            strokeDasharray="8 7"
          />
          <path d="m84 43 8 5-8 5M20 64l-9 5 8 6" stroke="white" />
        </motion.svg>
      )}
    </motion.div>
  );
};

export const TypePill = ({ type }: { type: string }) => (
  <span
    className="arena-cut-outline relative inline-flex items-center gap-1.5 border px-2 py-1 font-kode text-[7px] font-bold uppercase tracking-[0.14em] text-white"
    style={{
      ["--arena-stroke" as string]: `${TYPE_COLORS[type] ?? "#5f6877"}bb`,
      borderColor: `${TYPE_COLORS[type] ?? "#5f6877"}aa`,
      background: `linear-gradient(110deg, ${
        TYPE_COLORS[type] ?? "#5f6877"
      }d9, ${TYPE_COLORS[type] ?? "#5f6877"}78)`,
      clipPath:
        "polygon(5px 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%, 0 5px)",
    }}
  >
    <span className="h-1 w-1 rotate-45 bg-white/[0.90]" />
    {type}
  </span>
);

export const StatMeter = ({
  label,
  value,
  max = 160,
  color = "#d8ff36",
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
}) => (
  <div className="grid grid-cols-[36px_1fr_34px] items-center gap-2">
    <span className="font-kode text-[7px] uppercase tracking-[0.14em] text-white/[0.48]">
      {label}
    </span>
    <div className="relative h-1.5 overflow-hidden bg-white/[0.10]">
      <motion.div
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        transition={{ duration: 0.55, ease: "circOut" }}
      />
      <span className="absolute inset-y-0 left-1/4 w-px bg-black/[0.35]" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-black/[0.35]" />
      <span className="absolute inset-y-0 left-3/4 w-px bg-black/[0.35]" />
    </div>
    <span className="text-right font-kode text-[8px] text-white/[0.72]">
      {value}
    </span>
  </div>
);

export const HealthBar = ({
  fighter,
  compact = false,
}: {
  fighter: ArenaFighter;
  compact?: boolean;
}) => {
  const percentage = Math.max(0, (fighter.currentHp / fighter.mon.hp) * 100);
  const color =
    percentage > 55 ? "#d8ff36" : percentage > 24 ? "#ffbd2e" : "#ff5151";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="shrink-0 font-kode text-[7px] tracking-[0.13em] text-white/[0.35]">
              NO.{String(fighter.mon.id).padStart(3, "0")}
            </span>
            <p className="truncate font-telegraf text-lg font-black tracking-[-0.02em] text-white sm:text-2xl">
              {fighter.mon.name}
            </p>
          </div>
          <div className="mt-1 flex gap-1">
            <TypePill type={fighter.mon.type1} />
            {fighter.mon.type2 && <TypePill type={fighter.mon.type2} />}
            {fighter.status && (
              <span className="bg-white px-2 py-1 font-kode text-[8px] uppercase text-black">
                {fighter.status}
              </span>
            )}
            {fighter.barrier > 0 && (
              <span className="border border-blue-300 bg-blue-400/[0.16] px-2 py-1 font-kode text-[7px] uppercase text-blue-200">
                Guard {Math.round(fighter.barrier * 100)}%
              </span>
            )}
            {fighter.critBoost > 0 && (
              <span className="border border-purple-300 bg-purple-400/[0.16] px-2 py-1 font-kode text-[7px] uppercase text-purple-200">
                Focus +{Math.round(fighter.critBoost * 100)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className="block font-kode text-[9px] text-white/[0.72]">
            {fighter.currentHp}/{fighter.mon.hp}
          </span>
          <span className="font-kode text-[6px] uppercase tracking-[0.12em] text-white/[0.30]">
            {Math.round(percentage)}% integrity
          </span>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden bg-white/[0.12]">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="absolute inset-y-0 left-1/4 w-px bg-black/[0.40]" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-black/[0.40]" />
        <span className="absolute inset-y-0 left-3/4 w-px bg-black/[0.40]" />
      </div>
    </div>
  );
};

export const FighterVisual = ({
  fighter,
  side,
  state = "idle",
}: {
  fighter: ArenaFighter;
  side: "player" | "cpu";
  state?: "idle" | "attack" | "hit" | "faint" | "switch";
}) => {
  const type = fighter.mon.type1;
  const color = TYPE_COLORS[type] ?? "#d8ff36";
  const rgb = TYPE_RGB[type] ?? "216, 255, 54";

  return (
    <motion.div
      key={`${side}-${fighter.mon.id}`}
      className="relative aspect-[16/10] w-full"
      initial={{ opacity: 0, x: side === "player" ? -70 : 70, scale: 0.92 }}
      animate={
        state === "attack"
          ? {
              opacity: 1,
              x: side === "player" ? [0, 12, 62, 0] : [0, -12, -62, 0],
              y: [0, -5, -16, 0],
              rotate: side === "player" ? [0, -1, 2, 0] : [0, 1, -2, 0],
              scale: [1, 1.02, 1.075, 1],
              filter: [
                "brightness(1)",
                "brightness(1.12)",
                "brightness(1.3)",
                "brightness(1)",
              ],
            }
          : state === "hit"
          ? {
              opacity: 1,
              x: side === "player" ? [0, -14, 9, -6, 0] : [0, 14, -9, 6, 0],
              rotate: side === "player" ? [0, -2, 1, 0] : [0, 2, -1, 0],
              scale: [1, 0.955, 1.02, 1],
              filter: [
                "brightness(1)",
                "brightness(1.65)",
                "brightness(1)",
                "brightness(1)",
              ],
            }
          : state === "faint"
          ? {
              opacity: 0,
              y: 70,
              rotate: side === "player" ? -5 : 5,
              scale: 0.78,
            }
          : state === "switch"
          ? {
              opacity: [1, 0.25, 0],
              x: side === "player" ? [0, -35, -90] : [0, 35, 90],
              scale: [1, 0.82, 0.45],
              filter: ["blur(0px)", "blur(2px)", "blur(10px)"],
            }
          : { opacity: 1, x: 0, y: [0, -2.5, 0], scale: [1, 1.006, 1] }
      }
      transition={{
        duration: state === "idle" ? 4.2 : 0.5,
        repeat: state === "idle" ? Infinity : 0,
        ease: state === "idle" ? "easeInOut" : [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="absolute inset-[3%] border opacity-35"
        style={{
          borderColor: color,
          clipPath: "polygon(50% 0, 100% 20%, 92% 100%, 10% 94%, 0 24%)",
        }}
        animate={{ rotate: side === "player" ? [0, 1.5, 0] : [0, -1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[-5%]"
        animate={{ opacity: [0.18, 0.38, 0.18], scale: [0.99, 1.015, 0.99] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <MonFrame monId={fighter.mon.id} color={rgb} />
      </motion.div>

      <div
        className="arena-cut-outline arena-panel absolute inset-[5%] overflow-hidden border bg-black"
        style={{
          ["--arena-accent" as string]: color,
          ["--arena-stroke" as string]: `${color}aa`,
          borderColor: `${color}aa`,
          boxShadow: `0 14px 36px rgba(0,0,0,.42), 0 0 18px ${color}18`,
          clipPath: ARENA_CLIP,
        }}
      >
        <ArenaFrameArt accent={color} />
        <ArenaImage
          src={fighter.mon.image}
          alt={`${fighter.mon.name} battle sprite`}
          priority
          sizes="(min-width: 1024px) 38vw, 85vw"
          className="absolute inset-0"
        />
        <div className="from-black/58 absolute inset-0 bg-gradient-to-t via-transparent to-black/5" />
        <motion.div
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-150%", "450%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: color, boxShadow: `0 0 14px ${color}` }}
          animate={{ y: [0, 170, 0], opacity: [0.25, 0.8, 0.25] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 font-kode text-[8px] uppercase tracking-[0.16em] text-black"
          style={{ backgroundColor: color }}
        >
          <ArenaSigil accent="#07090d" className="h-3 w-3" /> No.
          {String(fighter.mon.id).padStart(3, "0")} / {type}
        </span>
      </div>
    </motion.div>
  );
};

export type ArenaVisualEvent = {
  id: number;
  moveName: string;
  moveType: string;
  source: "player" | "cpu";
  stage: "charge" | "impact" | "miss" | "status" | "item" | "switch";
  damage?: number;
  critical?: boolean;
  hitCount?: number;
  effectiveness?: number;
  barrierAbsorbed?: number;
  executed?: boolean;
  stab?: boolean;
};

const EffectGeometry = ({ type, color }: { type: string; color: string }) => {
  if (type === "AI") {
    return (
      <>
        {[0, 1, 2].map((row) => (
          <motion.div
            key={row}
            className="absolute left-[12%] right-[12%] h-px"
            style={{ top: `${30 + row * 18}%`, backgroundColor: color }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 0.7], opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, delay: row * 0.06 }}
          />
        ))}
        {[0, 1, 2, 3].map((node) => (
          <motion.span
            key={node}
            className="absolute h-3 w-3 rounded-full border-2"
            style={{
              left: `${22 + node * 18}%`,
              top: `${25 + (node % 2) * 34}%`,
              borderColor: color,
            }}
            animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, delay: node * 0.05 }}
          />
        ))}
      </>
    );
  }

  if (type === "Data" || type === "Infra") {
    return (
      <>
        {Array.from({ length: 12 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute top-0 w-px"
            style={{ left: `${7 + index * 8}%`, backgroundColor: color }}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: [0, `${35 + (index % 4) * 15}%`, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.7, delay: index * 0.025 }}
          />
        ))}
        <motion.div
          className="absolute inset-x-[8%] h-px"
          style={{ backgroundColor: color }}
          animate={{ top: ["8%", "92%"], opacity: [0, 1, 0] }}
          transition={{ duration: 0.65, ease: "circIn" }}
        />
      </>
    );
  }

  if (type === "Design" || type === "Web") {
    return (
      <>
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 border"
            style={{
              width: 90 + index * 70,
              height: 55 + index * 42,
              borderColor: color,
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              scale: 0,
              rotate: index * 20,
              opacity: 1,
            }}
            animate={{ scale: 1.7, rotate: 120 + index * 34, opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: index * 0.045,
              ease: "circOut",
            }}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 h-2 w-10 origin-left"
            style={{
              background: `linear-gradient(90deg, ${color}, transparent)`,
              rotate: `${angle}rad`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * 170,
              y: Math.sin(angle) * 170,
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.7,
              delay: (index % 4) * 0.025,
              ease: "circOut",
            }}
          />
        );
      })}
    </>
  );
};

export const MoveEffectLayer = ({
  event,
}: {
  event: ArenaVisualEvent | null;
}) => {
  const color = event ? TYPE_COLORS[event.moveType] ?? "#d8ff36" : "#d8ff36";
  const target = event?.source === "player" ? "72% 38%" : "28% 60%";

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{
              opacity: event.stage === "impact" ? [0, 0.18, 0] : [0, 0.08, 0],
            }}
            transition={{ duration: 0.65 }}
          />
          {event.stage === "impact" && (
            <motion.div
              className="absolute inset-y-[-20%] w-[18%] -skew-x-[18deg] bg-white"
              style={{
                left: event.source === "player" ? "54%" : "28%",
                boxShadow: `0 0 60px ${color}`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 0.2], opacity: [0, 0.48, 0] }}
              transition={{ duration: 0.34, ease: "circOut" }}
            />
          )}
          <div className="arena-scanlines absolute inset-0 opacity-45" />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${
                event.source === "player" ? "70% 34%" : "28% 62%"
              }, ${color}55, transparent 34%)`,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.78 }}
          />

          {event.stage === "charge" && (
            <motion.div
              className="absolute top-1/2 h-px"
              style={{
                left: event.source === "player" ? "22%" : "28%",
                right: event.source === "player" ? "28%" : "22%",
                background: `linear-gradient(90deg, transparent, ${color}, white, ${color}, transparent)`,
                boxShadow: `0 0 24px ${color}`,
                transformOrigin: event.source === "player" ? "left" : "right",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1.08], opacity: [0, 1, 0] }}
              transition={{ duration: 0.62, ease: "circIn" }}
            />
          )}

          <EffectGeometry type={event.moveType} color={color} />

          <motion.div
            className="absolute left-1/2 top-[11%] min-w-[280px] -translate-x-1/2 overflow-hidden border px-7 py-3.5 text-center text-white"
            style={{
              ["--arena-stroke" as string]: `${color}aa`,
              borderColor: `${color}99`,
              background: "rgba(0,0,0,.88)",
              boxShadow: `0 0 34px ${color}24`,
              clipPath: ARENA_CLIP,
            }}
            initial={{ y: -25, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: [0, 1, 1, 0], scale: [0.94, 1.04, 1, 1] }}
            transition={{ duration: 0.95, times: [0, 0.18, 0.74, 1] }}
          >
            <ArenaFrameArt accent={color} animated />
            <ArenaSigil
              accent={`${color}66`}
              className="absolute -left-4 -top-5 h-20 w-20 opacity-25"
            />
            <span
              className="block font-kode text-[8px] uppercase tracking-[0.2em]"
              style={{ color }}
            >
              {event.stage === "impact"
                ? "Impact confirmed"
                : event.stage === "miss"
                ? "Targeting fault"
                : event.stage === "item"
                ? "Inventory protocol"
                : event.stage === "switch"
                ? "Active slot rerouted"
                : event.stage === "status"
                ? "Status protocol"
                : "Command uplink / executing"}
            </span>
            <strong className="mt-1 block font-telegraf text-2xl font-black tracking-[-0.02em] sm:text-4xl">
              {event.moveName}
            </strong>
          </motion.div>

          {event.stage === "impact" && (
            <>
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                  style={{
                    left: target.split(" ")[0],
                    top: target.split(" ")[1],
                    borderColor: color,
                    boxShadow: `0 0 30px ${color}44`,
                  }}
                  initial={{ scale: 0.15, opacity: 0.9 }}
                  animate={{ scale: 1.4 + ring * 0.45, opacity: 0 }}
                  transition={{
                    duration: 0.62,
                    delay: ring * 0.06,
                    ease: "circOut",
                  }}
                />
              ))}
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-telegraf text-6xl font-black text-white sm:text-8xl"
                style={{
                  left: target.split(" ")[0],
                  top: target.split(" ")[1],
                  textShadow: `0 0 28px ${color}`,
                }}
                initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
                animate={{
                  scale: [0.2, 1.25, 1],
                  opacity: [0, 1, 0],
                  rotate: [8, -4, 0],
                }}
                transition={{ duration: 0.65, ease: "circOut" }}
              >
                {event.damage ? `−${event.damage}` : "!"}
                {Boolean(event.hitCount && event.hitCount > 1) && (
                  <span className="absolute -right-12 top-1/2 font-kode text-sm tracking-[0.1em] text-white sm:-right-16 sm:text-xl">
                    ×{event.hitCount}
                  </span>
                )}
              </motion.div>
              {Array.from(
                { length: Math.max(0, (event.hitCount ?? 1) - 1) },
                (_, index) => (
                  <motion.span
                    key={`hit-${index}`}
                    className="absolute h-1.5 w-16"
                    style={{
                      left: target.split(" ")[0],
                      top: target.split(" ")[1],
                      background: `linear-gradient(90deg, transparent, ${color}, white)`,
                    }}
                    initial={{
                      x: index % 2 ? 80 : -80,
                      opacity: 0,
                      rotate: -25 + index * 16,
                    }}
                    animate={{
                      x: 0,
                      opacity: [0, 1, 0],
                      scaleX: [0.4, 1.4, 0.2],
                    }}
                    transition={{ duration: 0.34, delay: 0.1 + index * 0.08 }}
                  />
                )
              )}
            </>
          )}

          {(event.stage === "item" || event.stage === "switch") && (
            <>
              {[0, 1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border"
                  style={{ borderColor: color }}
                  initial={{ rotate: ring * 22, scale: 0.2, opacity: 0 }}
                  animate={{
                    rotate: ring % 2 ? -120 : 120,
                    scale: 1 + ring * 0.35,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{ duration: 0.7, delay: ring * 0.05 }}
                />
              ))}
              <motion.div
                className="absolute left-1/2 top-1/2 h-px w-[70vw] -translate-x-1/2 bg-white"
                style={{ boxShadow: `0 0 24px ${color}` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 0.4], opacity: [0, 1, 0] }}
                transition={{ duration: 0.55 }}
              />
            </>
          )}

          {event.stage === "miss" && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-y border-white/[0.40] px-12 py-4 font-kode text-3xl font-bold tracking-[0.28em] text-white sm:text-5xl"
              initial={{ opacity: 0, x: -30, skewX: -12 }}
              animate={{ opacity: [0, 1, 1, 0], x: [30, 0, 0, -30] }}
              transition={{ duration: 0.7 }}
            >
              {event.moveName}
            </motion.div>
          )}

          {event.critical && (
            <>
              <motion.div
                className="absolute inset-0 border-[14px]"
                style={{ borderColor: color }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.32 }}
              />
              <motion.span
                className="absolute bottom-[16%] left-1/2 -translate-x-1/2 bg-white px-4 py-2 font-kode text-[10px] font-bold uppercase tracking-[0.24em] text-black"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.7 }}
              >
                Critical execution
              </motion.span>
            </>
          )}

          {event.stage === "impact" &&
            (event.executed ||
              event.stab ||
              Boolean(event.effectiveness && event.effectiveness > 1)) && (
              <motion.div
                className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 gap-1.5 font-kode text-[7px] font-bold uppercase tracking-[0.14em]"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.9 }}
              >
                {event.stab && (
                  <span className="border border-white/[0.35] bg-black/[0.75] px-2 py-1 text-white">
                    STAB 1.2×
                  </span>
                )}
                {Boolean(event.effectiveness && event.effectiveness > 1) && (
                  <span className="bg-[#d8ff36] px-2 py-1 text-black">
                    Super {event.effectiveness}×
                  </span>
                )}
                {event.executed && (
                  <span className="bg-red-500 px-2 py-1 text-white">
                    Execute
                  </span>
                )}
              </motion.div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ArenaBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#07090d]">
    <div className="arena-grid absolute inset-0 opacity-60" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,.065),transparent_38%),radial-gradient(circle_at_8%_85%,rgba(8,145,178,.13),transparent_28%),radial-gradient(circle_at_92%_20%,rgba(236,72,153,.11),transparent_28%)]" />
    <div className="arena-scanlines absolute inset-0 opacity-35" />
    <BattlefieldVector playerColor="#0891b2" cpuColor="#ec4899" />
    <motion.div
      className="absolute inset-x-0 top-0 h-16 border-b border-[#d8ff36]/[0.16] bg-gradient-to-b from-[#d8ff36]/[0.05] to-transparent"
      animate={{ y: ["-120%", "110vh"] }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 5,
      }}
    />
    <motion.div
      className="absolute -right-44 -top-44 h-[520px] w-[520px] opacity-25"
      animate={{ rotate: 360 }}
      transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
    >
      <ArenaSigil accent="#d8ff36" className="h-full w-full" />
    </motion.div>
    <svg
      aria-hidden="true"
      viewBox="0 0 420 780"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-[78%] w-[34%] opacity-20"
      fill="none"
    >
      <path
        d="M0 760h76l42-80V520l66-76V278l72-78V72L312 0"
        stroke="#41d9ff"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="arena-vector-dash"
        d="M0 716h44l42-80V492l66-76V250l72-78V44L268 0"
        stroke="#41d9ff"
        strokeDasharray="4 14"
        vectorEffect="non-scaling-stroke"
      />
      {[120, 260, 410, 566, 690].map((cy) => (
        <circle key={cy} cx="86" cy={cy} r="4" fill="#d8ff36" />
      ))}
    </svg>
    <motion.div
      className="absolute left-[18%] top-[8%] h-72 w-72 rounded-full bg-white/[0.025] blur-3xl"
      animate={{ x: [-30, 55, -30], y: [0, 28, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);
