// --- HELPER & NEW UI COMPONENTS ---
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  XCircle,
  ArrowLeft,
  Heart,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  X,
} from "lucide-react";
import type {
  PlayerInventory,
  Item,
  BattleReadyMon,
  AnimationState,
  BattleEffect,
  SelfEffectType,
} from "../../context/gameContext";
import { typeChart as sharedTypeChart } from "../../context/gameContext";
import { CLIP } from "../../constants/clipPaths";
import { MAX_HP_VALUE, MAX_STAT_VALUE } from "../../constants/game";

import { TypeBadge, TYPE_STYLES } from "../ui/TypeBadge";
export { TypeBadge, TYPE_STYLES as typeStyles };

export const ForcedSwitchScreen = () => (
  <motion.div
    key="forced-switch"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex h-full flex-col items-center justify-center text-center"
  >
    <XCircle className="h-12 w-12 text-red-500" />
    <p className="mt-4 text-lg font-bold">Your Project has fainted!</p>
    <p className="text-sm text-slate-400">
      Choose another Project from your team to continue.
    </p>
  </motion.div>
);

const ATTACK_PARTICLES = 10;

const TypeParticles = ({
  originX,
  originY,
  color,
}: {
  originX: string;
  originY: string;
  color: string;
}) => (
  <>
    {Array.from({ length: ATTACK_PARTICLES }, (_, i) => {
      const angle = (i / ATTACK_PARTICLES) * 360;
      const rad = (angle * Math.PI) / 180;
      const dist = 40 + Math.random() * 80;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: originX,
            top: originY,
            background: `rgba(${color}, ${0.6 + Math.random() * 0.4})`,
            boxShadow: `0 0 8px rgba(${color}, 0.8)`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(rad) * dist,
            y: Math.sin(rad) * dist,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.4 + Math.random() * 0.2, ease: "easeOut" }}
        />
      );
    })}
  </>
);

const SlashLines = ({
  color,
  isPlayer,
}: {
  color: string;
  isPlayer: boolean;
}) => (
  <>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: isPlayer ? "60%" : "15%",
          top: isPlayer ? "20%" : "50%",
          width: 60 + i * 15,
          height: 2,
          background: `linear-gradient(90deg, transparent, rgba(${color}, 0.9), transparent)`,
          transformOrigin: "center",
          rotate: -30 + i * 25,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
      />
    ))}
  </>
);

const SpeedLineField = ({
  color,
  isPlayer,
}: {
  color: string;
  isPlayer: boolean;
}) => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 18 }, (_, index) => {
      const top = 4 + ((index * 5.7) % 88);
      const width = 10 + ((index * 17) % 28);
      return (
        <motion.div
          key={index}
          className="absolute h-px"
          style={{
            top: `${top}%`,
            width: `${width}%`,
            left: isPlayer ? "-34%" : "104%",
            background: `linear-gradient(${
              isPlayer ? "90deg" : "270deg"
            }, transparent, rgba(${color}, ${
              0.28 + (index % 4) * 0.12
            }), white)`,
            boxShadow: `0 0 8px rgba(${color}, .45)`,
          }}
          animate={{
            x: isPlayer ? [0, "980%"] : [0, "-980%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.34 + (index % 5) * 0.045,
            delay: (index % 6) * 0.025,
            ease: "circIn",
          }}
        />
      );
    })}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${
          isPlayer ? "105deg" : "255deg"
        }, transparent 35%, rgba(${color}, .18) 50%, transparent 65%)`,
      }}
      initial={{ x: isPlayer ? "-100%" : "100%" }}
      animate={{ x: isPlayer ? "100%" : "-100%" }}
      transition={{ duration: 0.48, ease: "circIn" }}
    />
  </div>
);

const ImpactReticle = ({
  color,
  x,
  y,
}: {
  color: string;
  x: string;
  y: string;
}) => (
  <div
    className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2"
    style={{ left: x, top: y }}
  >
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: `rgba(${color}, ${0.9 - index * 0.22})` }}
        initial={{ scale: 0.05, opacity: 1, rotate: index * 30 }}
        animate={{
          scale: 1.2 + index * 0.35,
          opacity: 0,
          rotate: 90 + index * 45,
        }}
        transition={{ duration: 0.52 + index * 0.09, ease: "circOut" }}
      />
    ))}
    {[0, 45, 90, 135].map((angle) => (
      <motion.span
        key={angle}
        className="absolute left-1/2 top-1/2 h-px w-[170%] -translate-x-1/2 -translate-y-1/2"
        style={{
          rotate: angle,
          background: `linear-gradient(90deg, transparent, rgba(${color}, .95), white, rgba(${color}, .95), transparent)`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0.55], opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    ))}
  </div>
);

export const BackgroundEffects = ({
  playerAnimation,
  cpuAnimation,
  lastMoveType,
}: {
  playerAnimation: AnimationState;
  cpuAnimation: AnimationState;
  lastMoveType: string | null;
}) => {
  const typeColor = lastMoveType
    ? TYPE_ATTACK_COLORS[lastMoveType] ?? "0, 220, 255"
    : "0, 220, 255";

  return (
    <>
      {playerAnimation === "attack" && (
        <>
          <motion.div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background: `radial-gradient(circle at 30% 65%, rgba(${typeColor}, 0.5), transparent 40%)`,
            }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          />
          <SlashLines color={typeColor} isPlayer={true} />
          <SpeedLineField color={typeColor} isPlayer={true} />
        </>
      )}

      {cpuAnimation === "hit" && (
        <>
          <motion.div
            className="absolute right-[10%] top-[15%] h-1/4 w-1/4"
            style={{
              background: `radial-gradient(circle at center, rgba(${typeColor}, 0.8), transparent 60%)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <TypeParticles originX="70%" originY="25%" color={typeColor} />
          <ImpactReticle color={typeColor} x="70%" y="25%" />
          <motion.div
            className="absolute inset-0 bg-white mix-blend-overlay"
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.18 }}
          />
        </>
      )}

      {cpuAnimation === "attack" && (
        <>
          <motion.div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background: `radial-gradient(circle at 70% 30%, rgba(${typeColor}, 0.5), transparent 40%)`,
            }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          />
          <SlashLines color={typeColor} isPlayer={false} />
          <SpeedLineField color={typeColor} isPlayer={false} />
        </>
      )}

      {playerAnimation === "hit" && (
        <>
          <motion.div
            className="absolute bottom-[40%] left-[12%] h-1/3 w-1/3"
            style={{
              background: `radial-gradient(circle at center, rgba(${typeColor}, 0.8), transparent 60%)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <TypeParticles originX="25%" originY="55%" color={typeColor} />
          <ImpactReticle color={typeColor} x="25%" y="55%" />
          <motion.div
            className="absolute inset-0 bg-white mix-blend-overlay"
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.18 }}
          />
        </>
      )}
    </>
  );
};

const TYPE_ATTACK_COLORS: Record<string, string> = {
  AI: "138, 43, 226",
  Data: "59, 130, 246",
  Web: "34, 197, 94",
  Design: "236, 72, 153",
  Hardware: "107, 114, 128",
  Health: "239, 68, 68",
  Mobile: "234, 179, 8",
  Game: "249, 115, 22",
  Infra: "8, 145, 178",
};

// --- SELF EFFECT VISUAL OVERLAYS ---

const EFFECT_COLORS: Record<SelfEffectType, { primary: string; glow: string }> =
  {
    atkUp: { primary: "239, 68, 68", glow: "248, 113, 113" },
    defUp: { primary: "59, 130, 246", glow: "96, 165, 250" },
    spdUp: { primary: "234, 179, 8", glow: "250, 204, 21" },
    heal: { primary: "34, 197, 94", glow: "74, 222, 128" },
    drain: { primary: "139, 92, 246", glow: "167, 139, 250" },
    recoil: { primary: "249, 115, 22", glow: "251, 146, 60" },
  };

const StatBoostEffect = ({
  color,
}: {
  color: { primary: string; glow: string };
}) => (
  <>
    {Array.from({ length: 8 }, (_, i) => {
      const x = 20 + Math.random() * 60;
      const delay = i * 0.06;
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            bottom: "10%",
            width: 3,
            height: 14 + Math.random() * 10,
            background: `rgba(${color.glow}, 0.9)`,
            boxShadow: `0 0 10px rgba(${color.primary}, 0.8)`,
            borderRadius: 2,
          }}
          initial={{ y: 0, opacity: 0, scaleY: 0.5 }}
          animate={{
            y: -80 - Math.random() * 40,
            opacity: [0, 1, 1, 0],
            scaleY: 1,
          }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
        />
      );
    })}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 80%, rgba(${color.primary}, 0.3), transparent 60%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0] }}
      transition={{ duration: 0.8 }}
    />
  </>
);

const HealEffect = ({
  color,
}: {
  color: { primary: string; glow: string };
}) => (
  <>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 15 + Math.random() * 70;
      const delay = i * 0.05;
      const size = 4 + Math.random() * 5;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${x}%`,
            bottom: "20%",
            width: size,
            height: size,
            background: `rgba(${color.glow}, 0.9)`,
            boxShadow: `0 0 8px rgba(${color.primary}, 0.6)`,
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: -60 - Math.random() * 50,
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.2, 0.6],
          }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      );
    })}
    <motion.div
      className="absolute inset-x-[20%] bottom-[30%] h-[40%]"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(${color.primary}, 0.25), transparent 70%)`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 1.5] }}
      transition={{ duration: 0.9 }}
    />
  </>
);

const DrainEffect = ({
  color,
}: {
  color: { primary: string; glow: string };
}) => (
  <>
    {Array.from({ length: 10 }, (_, i) => {
      const startX = 30 + Math.random() * 40;
      const startY = 30 + Math.random() * 40;
      const delay = i * 0.07;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${startX}%`,
            top: `${startY}%`,
            width: 5,
            height: 5,
            background: `rgba(${color.glow}, 0.9)`,
            boxShadow: `0 0 12px rgba(${color.primary}, 0.8)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: [0, (50 - startX) * 0.5],
            y: [0, (50 - startY) * 0.5],
            scale: [0, 1.5, 0.3],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.7, delay, ease: "easeIn" }}
        />
      );
    })}
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(${color.primary}, 0.2), transparent 50%)`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.1, 0.9] }}
      transition={{ duration: 0.8 }}
    />
  </>
);

const RecoilEffect = ({
  color,
}: {
  color: { primary: string; glow: string };
}) => (
  <>
    <motion.div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(${color.primary}, 0.4), transparent 60%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0, 0.6, 0] }}
      transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1] }}
    />
    {Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * 360;
      const rad = (angle * Math.PI) / 180;
      return (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 3,
            height: 8,
            background: `rgba(${color.glow}, 0.8)`,
            transformOrigin: "center",
            rotate: angle,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: Math.cos(rad) * 35,
            y: Math.sin(rad) * 35,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        />
      );
    })}
  </>
);

const EFFECT_RENDERERS: Record<
  SelfEffectType,
  React.FC<{ color: { primary: string; glow: string } }>
> = {
  atkUp: StatBoostEffect,
  defUp: StatBoostEffect,
  spdUp: StatBoostEffect,
  heal: HealEffect,
  drain: DrainEffect,
  recoil: RecoilEffect,
};

export const SelfEffectOverlay = ({
  effect,
}: {
  effect: BattleEffect | null;
}) => {
  if (!effect) return null;
  const color = EFFECT_COLORS[effect.type];
  const Renderer = EFFECT_RENDERERS[effect.type];
  return (
    <motion.div
      key={`${effect.type}-${effect.target}-${Date.now()}`}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Renderer color={color} />
    </motion.div>
  );
};

export const ActionButton = ({
  onClick,
  disabled = false,
  children,
  icon,
  color,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon: JSX.Element;
  color: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 py-2 text-[0.6rem] text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50 ${color}`}
    disabled={disabled}
    style={{ clipPath: CLIP.cornerBR }}
  >
    {icon} {children}
  </motion.button>
);

export const SwitchItemView = ({
  onCancel,
  title,
}: {
  onCancel: () => void;
  title: string;
}) => (
  <motion.div
    key="switch-item-view"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex h-full flex-col items-center justify-center text-center"
  >
    <p className="mb-4 text-lg font-bold">{title}</p>
    <motion.button
      onClick={onCancel}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-2 bg-red-600 px-6 py-2 font-bold text-white shadow-md transition-colors hover:bg-red-500"
      style={{ clipPath: CLIP.cornerBR }}
    >
      <ArrowLeft className="h-5 w-5" /> Back
    </motion.button>
  </motion.div>
);

export const ItemMenu = ({
  inventory,
  onItemSelect,
  onCancel,
}: {
  inventory: PlayerInventory;
  onItemSelect: (item: Item) => void;
  onCancel: () => void;
}) => {
  const items = Object.values(inventory).filter((i) => i.quantity > 0);

  const itemIcons: { [key: string]: JSX.Element } = {
    "API Key": <Heart className="h-5 w-5 text-red-400" />,
    Debugger: <PlusCircle className="h-5 w-5 text-green-400" />,
  };

  return (
    <motion.div
      key="items"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="relative flex h-full flex-col"
    >
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-lg font-bold">Your Items</h3>
        <button
          onClick={onCancel}
          className="rounded-full bg-slate-600 p-1 text-white shadow-md transition hover:bg-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto pr-2">
        {items.length > 0 ? (
          items.map(({ item, quantity }) => (
            <motion.button
              key={item.name}
              onClick={() => onItemSelect(item)}
              className="w-full bg-slate-700/80 p-2 text-left shadow-sm transition hover:bg-slate-700"
              style={{ clipPath: CLIP.cornerBR }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {itemIcons[item.name] || (
                    <HelpCircle className="h-5 w-5 text-slate-400" />
                  )}

                  <div>
                    <p className="font-bold">{item.name}</p>

                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>

                <span
                  className="bg-slate-600 px-3 py-1 text-sm font-bold"
                  style={{ clipPath: CLIP.quantityBadge }}
                >
                  x{quantity}
                </span>
              </div>
            </motion.button>
          ))
        ) : (
          <p className="pt-8 text-center text-slate-400">No items available.</p>
        )}
      </div>
    </motion.div>
  );
};

const StatBar = ({
  label,
  value,
  maxValue = MAX_STAT_VALUE,
}: {
  label: string;
  value: number;
  maxValue?: number;
}) => {
  const pct = Math.min(100, (value / maxValue) * 100);
  const gradient =
    pct >= 75
      ? "from-emerald-400 to-cyan-400 shadow-[0_0_8px_theme(colors.emerald.500)]"
      : pct >= 50
      ? "from-cyan-400 to-blue-500 shadow-[0_0_8px_theme(colors.cyan.500)]"
      : pct >= 30
      ? "from-amber-400 to-orange-500 shadow-[0_0_8px_theme(colors.amber.500)]"
      : "from-red-400 to-rose-600 shadow-[0_0_8px_theme(colors.red.500)]";

  return (
    <div className="grid grid-cols-6 items-center gap-2">
      <span className="col-span-1 font-kode text-[10px] uppercase text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div
        className="col-span-4 h-1.5 bg-slate-300 p-0.5 dark:bg-slate-900/70"
        style={{ clipPath: CLIP.statBar }}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "circOut", delay: 0.5 }}
          style={{ clipPath: CLIP.statBar }}
        />
      </div>
      <span className="col-span-1 font-kode text-xs font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
};

export const InfoBox = ({
  mon,
  isPlayer,
}: {
  mon: BattleReadyMon;
  isPlayer: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ ease: "easeOut", duration: 0.2 }}
    className={`pointer-events-auto absolute left-0 z-20 w-full border border-slate-600 bg-slate-800/90 p-3 text-white shadow-lg backdrop-blur-sm ${
      isPlayer ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
    }`}
    style={{
      clipPath: isPlayer
        ? "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)"
        : "polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)",
    }}
  >
    <h4 className="font-bold text-cyan-300">{mon.name}</h4>
    <p className="my-2 text-sm text-slate-300">{mon.description}</p>
    <div className="my-3 space-y-1 border-t border-slate-600 pt-2">
      <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
        Base Stats
      </h5>
      <StatBar label="HP" value={mon.stats.hp} maxValue={MAX_HP_VALUE} />
      <StatBar label="ATK" value={mon.stats.atk} />
      <StatBar label="DEF" value={mon.stats.def} />
      <StatBar label="SPD" value={mon.stats.spd} />
    </div>

    <Link
      href={mon.url}
      className="mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-cyan-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
      style={{ clipPath: CLIP.cornerBR }}
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit Project <ExternalLink className="h-4 w-4" />
    </Link>
  </motion.div>
);

export const GuideModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const types = Object.keys(sharedTypeChart);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* This outer div now acts as the border */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-slate-600 p-px pl-2 shadow-2xl"
            style={{ clipPath: CLIP.modal }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <div
              className="relative flex h-full max-h-[60vh] w-full flex-col bg-slate-800"
              style={{ clipPath: CLIP.modal }}
            >
              <div className="flex items-center justify-between border-b border-slate-700 p-4">
                <h2 className="text-2xl font-bold text-cyan-300">
                  Battle Guide
                </h2>

                <button
                  onClick={onClose}
                  className="rounded-full bg-slate-700 p-1 text-white transition hover:bg-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Turn Actions</h3>

                    <ul className="list-inside list-disc space-y-2 text-slate-300">
                      <li>
                        <strong>Fight:</strong> Attack with a chosen move.
                      </li>
                      <li>
                        <strong>Switch:</strong> Swap your active Project with
                        another.
                      </li>
                      <li>
                        <strong>Items:</strong> Use an item from your bag.
                      </li>
                      <li>
                        <strong>Run:</strong> Forfeit the battle.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Status Conditions
                    </h3>

                    <ul className="list-inside list-disc space-y-2 text-slate-300">
                      <li>
                        <strong className="text-orange-400">Burn:</strong> Takes
                        damage each turn.
                      </li>
                      <li>
                        <strong className="text-purple-400">Poison:</strong>{" "}
                        Takes damage each turn.
                      </li>
                      <li>
                        <strong className="text-gray-400">Sleep:</strong>{" "}
                        Can&apos;t move for 1-3 turns.
                      </li>
                      <li>
                        <strong className="text-yellow-400">Stun:</strong> 25%
                        chance to skip your turn. Lasts 3 turns.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Move Effects</h3>
                    <ul className="list-inside list-disc space-y-2 text-slate-300">
                      <li>
                        <strong className="text-red-400">ATK Up:</strong> Raises
                        the user&apos;s ATK by 1 stage (+25% per stage, max +3).
                      </li>
                      <li>
                        <strong className="text-blue-400">DEF Up:</strong>{" "}
                        Raises the user&apos;s DEF by 1 stage.
                      </li>
                      <li>
                        <strong className="text-yellow-400">SPD Up:</strong>{" "}
                        Raises the user&apos;s SPD by 1 stage.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Special Effects
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-slate-300">
                      <li>
                        <strong className="text-emerald-400">Heal:</strong>{" "}
                        Restores a fixed amount of HP.
                      </li>
                      <li>
                        <strong className="text-violet-400">Drain:</strong>{" "}
                        Recovers HP equal to 50% of damage dealt.
                      </li>
                      <li>
                        <strong className="text-orange-400">Recoil:</strong>{" "}
                        User takes a fraction of damage dealt as self-damage.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-semibold">
                    Type Effectiveness Chart
                  </h3>

                  <p className="mb-4 text-sm text-slate-400">
                    Rows are Attacking types, Columns are Defending types.
                  </p>

                  <div
                    className="overflow-x-auto border border-slate-700"
                    style={{
                      clipPath:
                        "polygon(0 8px, 8px 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  >
                    <table className="w-full min-w-[500px] border-collapse text-center text-xs">
                      <thead>
                        <tr className="bg-slate-900/50">
                          <th className="sticky left-0 z-10 bg-slate-800 p-2 font-semibold text-slate-400">
                            ATK \ DEF
                          </th>

                          {types.map((def) => (
                            <th key={def} className="p-1">
                              <TypeBadge type={def} />
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-700">
                        {types.map((atk) => (
                          <tr key={atk} className="hover:bg-slate-700/50">
                            <td className="sticky left-0 z-10 bg-slate-800 p-1">
                              <TypeBadge type={atk} />
                            </td>

                            {types.map((def) => {
                              const multiplier =
                                sharedTypeChart[atk]?.[def] ?? 1;
                              return (
                                <td key={def} className="p-1 font-mono">
                                  <span
                                    className={`flex h-6 w-8 items-center justify-center text-white ${
                                      multiplier > 1
                                        ? "bg-green-500/80"
                                        : multiplier < 1
                                        ? "bg-red-500/80"
                                        : "bg-slate-700 text-slate-400"
                                    }`}
                                    style={{
                                      clipPath:
                                        "polygon(0 0, 100% 0, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                                    }}
                                  >
                                    {multiplier}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
