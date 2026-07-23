import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Zap,
  Sparkles,
  Flame,
  AlertTriangle,
  ArrowRightLeft,
  XCircle,
  BookOpen,
  ShoppingBag,
  ArrowLeft,
  X,
  BedDouble,
  Bubbles,
  Bot,
  Swords,
  Users,
  FileText,
  ArrowUp,
  Heart,
  Droplets,
  Shield,
  Gauge,
} from "lucide-react";
import type {
  BattleReadyMon,
  BattleReadyMove,
  StatusEffect,
  AnimationState,
  PlayerInventory,
  Item,
  NotificationType,
  ActionState,
  StatModifiers,
} from "../../context/gameContext";
import {
  statusEffectStyles,
  statusEffectIcons,
} from "../../context/gameContext";
import {
  GuideModal,
  BackgroundEffects,
  InfoBox,
  ForcedSwitchScreen,
  ActionButton,
  TypeBadge,
  typeStyles,
  SelfEffectOverlay,
} from "./battle";
import { useGame } from "../../providers/gameProvider";
import type { SelfEffectType, SelfEffect } from "../../context/gameContext";
import { CLIP } from "../../constants/clipPaths";
import { MonFrame } from "./monFrames";

interface SelfEffectStyle {
  label: string;
  icon: JSX.Element;
  bg: string;
  border: string;
  text: string;
}

const SELF_EFFECT_STYLES: Record<SelfEffectType, SelfEffectStyle> = {
  atkUp: {
    label: "ATK ▲",
    icon: <Swords className="h-full w-full" />,
    bg: "bg-red-600",
    border: "bg-red-400",
    text: "text-white",
  },
  defUp: {
    label: "DEF ▲",
    icon: <Shield className="h-full w-full" />,
    bg: "bg-blue-600",
    border: "bg-blue-400",
    text: "text-white",
  },
  spdUp: {
    label: "SPD ▲",
    icon: <Gauge className="h-full w-full" />,
    bg: "bg-yellow-500",
    border: "bg-yellow-300",
    text: "text-black",
  },
  heal: {
    label: "HEAL",
    icon: <Heart className="h-full w-full" />,
    bg: "bg-emerald-600",
    border: "bg-emerald-400",
    text: "text-white",
  },
  drain: {
    label: "DRAIN",
    icon: <Droplets className="h-full w-full" />,
    bg: "bg-violet-600",
    border: "bg-violet-400",
    text: "text-white",
  },
  recoil: {
    label: "RECOIL",
    icon: <Flame className="h-full w-full" />,
    bg: "bg-orange-600",
    border: "bg-orange-400",
    text: "text-white",
  },
};

const SelfEffectBadge = ({ selfEffect }: { selfEffect: SelfEffect }) => {
  const style = SELF_EFFECT_STYLES[selfEffect.type];
  const showChance = selfEffect.chance < 1;

  let detail = "";
  if (selfEffect.type === "heal") {
    detail = `+${selfEffect.amount} HP`;
  } else if (selfEffect.type === "drain") {
    detail = `${selfEffect.amount * 100}% DMG`;
  } else if (selfEffect.type === "recoil") {
    detail = `${selfEffect.amount * 100}% DMG`;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 ${style.bg}`}
      style={{ clipPath: CLIP.typeBadge }}
    >
      <div className={`h-3.5 w-3.5 ${style.text}`}>{style.icon}</div>
      <p
        className={`text-[10px] font-bold uppercase tracking-wide ${style.text}`}
      >
        {showChance ? `${selfEffect.chance * 100}% ` : ""}
        {style.label}
        {detail ? ` · ${detail}` : ""}
      </p>
    </div>
  );
};

const AutoBattleOverlay = ({ onStop }: { onStop: () => void }) => {
  const clipPath = "polygon(0 15px, 15px 0, 100% 0, 100% 100%, 0 100%)";

  return (
    <motion.div
      key="auto-battle-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-[100] h-full w-full p-0.5"
      style={{
        clipPath,
        background:
          "linear-gradient(135deg, rgba(6, 182, 212, 0.8), rgba(56, 189, 248, 0.8))",
      }}
    >
      <div
        className="relative h-full w-full bg-white/90 backdrop-blur-sm dark:bg-slate-900/90"
        style={{ clipPath }}
      >
        {/* Grid Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)",
            backgroundSize: "2rem 2rem",
          }}
          animate={{ backgroundPosition: ["0 0", "2rem 2rem"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Barcode Scanner Effect */}
        <motion.div
          className="absolute left-0 right-0 h-1"
          style={{
            background:
              "linear-gradient(to bottom, rgba(107, 237, 255, 0), rgba(107, 237, 255, 0.5) 50%, rgba(107, 237, 255, 0))",
            filter: "blur(5px)",
          }}
          initial={{ top: "15px" }}
          animate={{ top: "calc(100%)" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <div className="h-full w-full bg-cyan-200" />
        </motion.div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 p-4 py-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              color: ["#06b6d4", "#67e8f9", "#06b6d4"],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="h-14 w-14" />
          </motion.div>
          <h3 className="text-2xl font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Auto-Battling
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The AI is in control.
          </p>
          <motion.button
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 flex items-center gap-2 bg-red-600/90 px-6 py-2 text-base font-bold text-white shadow-lg shadow-black/30 transition-colors hover:bg-red-500"
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <XCircle className="h-5 w-5" />
            Take Control
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ItemMenu = ({
  inventory,
  onItemSelect,
  onCancel,
}: {
  inventory: PlayerInventory;
  onItemSelect: (item: Item) => void;
  onCancel: () => void;
}) => {
  const hasItems = Object.values(inventory).some(
    (invItem) => invItem.quantity > 0
  );

  return (
    <motion.div
      key="items"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="flex h-full flex-col overflow-auto"
    >
      <div className="flex flex-shrink-0 items-center justify-between pb-2">
        <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
          Inventory
        </h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Moves
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {hasItems ? (
          <div className="grid grid-cols-1 gap-2">
            {Object.values(inventory)
              .filter(({ quantity }) => quantity > 0)
              .map(({ item, quantity }) => (
                <motion.button
                  layout
                  key={item.name}
                  onClick={() => onItemSelect(item)}
                  className="w-full bg-slate-300 p-0.5 pl-2 text-left transition-colors hover:bg-cyan-300 dark:bg-slate-700 dark:hover:bg-cyan-400"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="bg-white/80 p-2 dark:bg-slate-900/80"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <p className="flex-shrink-0 pl-4 font-kode text-lg font-bold text-cyan-600 dark:text-cyan-300">
                        x{quantity}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-400 dark:text-slate-500">
              No items available.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SwitchItemView = ({
  onCancel,
  title,
}: {
  onCancel: () => void;
  title: string;
}) => (
  <motion.div
    key="switch-item-view"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="flex h-full flex-col items-center justify-center text-center"
  >
    <p className="text-lg font-semibold text-slate-900 dark:text-white">
      {title}
    </p>
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Select a Project from your team list.
    </p>
    <button
      onClick={onCancel}
      className="mt-4 flex items-center gap-2 rounded-full bg-red-600/80 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500"
    >
      <ArrowLeft className="h-4 w-4" /> Cancel
    </button>
  </motion.div>
);

const StatusIcon = ({
  status,
  size = "md",
}: {
  status: StatusEffect | null;
  size?: "sm" | "md";
}) => {
  if (!status) return null;

  const styles: {
    [key in StatusEffect & string]: { icon: JSX.Element; className: string };
  } = {
    burn: {
      icon: <Flame className="h-full w-full" />,
      className: "bg-orange-500 text-white",
    },
    poison: {
      icon: <Bubbles className="h-full w-full" />,
      className: "bg-purple-600 text-white",
    },
    sleep: {
      icon: <BedDouble className="h-full w-full" />,
      className: "bg-gray-400 text-black",
    },
    stun: {
      icon: <Zap className="h-full w-full" />,
      className: "bg-yellow-400 text-black",
    },
  };

  const style = styles[status];
  const containerSizeClasses = size === "md" ? "h-6 w-6" : "h-5 w-5";
  const iconSizeClasses = size === "md" ? "h-4 w-4" : "h-3 w-3";

  return (
    <div
      title={status.charAt(0).toUpperCase() + status.slice(1)}
      className={`flex flex-shrink-0 items-center justify-center shadow-md ${style.className} ${containerSizeClasses}`}
      style={{
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    >
      <div className={iconSizeClasses}>{style.icon}</div>
    </div>
  );
};

const BurnEffect = () => (
  <>
    {/* Base glow */}
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 80%, rgba(251,146,60,0.2) 0%, transparent 60%)",
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Flame tongues */}
    {Array.from({ length: 8 }, (_, i) => {
      const x = 8 + (i * 84) / 7;
      const h = 20 + (i % 3) * 12;
      return (
        <motion.div
          key={`flame-${i}`}
          className="absolute bottom-0 rounded-t-full"
          style={{
            left: `${x}%`,
            width: 6 + (i % 2) * 4,
            height: h,
            background: `linear-gradient(to top, rgba(249,115,22,0.7), rgba(251,191,36,0.5) 60%, transparent)`,
            filter: "blur(2px)",
            transformOrigin: "bottom center",
          }}
          animate={{
            scaleY: [1, 1.4, 0.8, 1.2, 1],
            scaleX: [1, 0.8, 1.2, 0.9, 1],
            opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
          }}
          transition={{
            duration: 0.8 + (i % 3) * 0.3,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      );
    })}
    {/* Rising embers */}
    {Array.from({ length: 6 }, (_, i) => (
      <motion.div
        key={`ember-${i}`}
        className="absolute h-1 w-1 rounded-full"
        style={{
          left: `${15 + i * 14}%`,
          bottom: "10%",
          background: i % 2 === 0 ? "#fb923c" : "#fbbf24",
          boxShadow: `0 0 4px ${i % 2 === 0 ? "#fb923c" : "#fbbf24"}`,
        }}
        animate={{
          y: [0, -60 - i * 10],
          x: [(i % 2 === 0 ? -1 : 1) * 5, (i % 2 === 0 ? 1 : -1) * 15],
          opacity: [0.8, 0],
          scale: [1, 0.3],
        }}
        transition={{
          duration: 1.5 + i * 0.2,
          repeat: Infinity,
          delay: i * 0.25,
          ease: "easeOut",
        }}
      />
    ))}
    {/* Heat shimmer overlay */}
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to top, rgba(249,115,22,0.08), transparent 40%)",
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </>
);

const PoisonEffect = () => (
  <>
    {/* Toxic pool at bottom */}
    <motion.div
      className="absolute bottom-0 left-0 h-[25%] w-full"
      style={{
        background:
          "linear-gradient(to top, rgba(147,51,234,0.3), rgba(34,197,94,0.15) 60%, transparent)",
        borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
      }}
      animate={{ opacity: [0.5, 0.8, 0.5], scaleY: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Rising bubbles */}
    {Array.from({ length: 7 }, (_, i) => {
      const size = 4 + (i % 3) * 3;
      return (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: `${12 + i * 12}%`,
            bottom: "5%",
            border: "1px solid rgba(74,222,128,0.5)",
            background:
              "radial-gradient(circle at 35% 35%, rgba(74,222,128,0.3), rgba(147,51,234,0.2))",
            boxShadow: "0 0 4px rgba(74,222,128,0.3)",
          }}
          animate={{
            y: [0, -60 - i * 8],
            x: [(i % 2 === 0 ? -1 : 1) * 3, (i % 2 === 0 ? 1 : -1) * 8],
            opacity: [0.7, 0.3, 0],
            scale: [0.8, 1.2, 0.6],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeOut",
          }}
        />
      );
    })}
    {/* Toxic drips from top */}
    {Array.from({ length: 3 }, (_, i) => (
      <motion.div
        key={`drip-${i}`}
        className="absolute top-0 w-1 rounded-b-full"
        style={{
          left: `${25 + i * 25}%`,
          background:
            "linear-gradient(to bottom, rgba(147,51,234,0.6), rgba(74,222,128,0.4))",
          height: 12,
        }}
        animate={{
          y: [0, 40, 0],
          opacity: [0.6, 0.3, 0.6],
          scaleY: [1, 2, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
    {/* Green miasma glow */}
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 70%, rgba(74,222,128,0.08) 0%, transparent 60%)",
      }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </>
);

const SleepEffect = () => (
  <>
    {/* Dreamy blue overlay */}
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(30,58,138,0.06) 60%, transparent)",
      }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Floating Z's with glow */}
    {Array.from({ length: 4 }, (_, i) => (
      <motion.div
        key={`z-${i}`}
        className="absolute flex items-center justify-center"
        style={{
          left: `${45 + i * 8}%`,
          top: "40%",
          textShadow:
            "0 0 8px rgba(129,140,248,0.8), 0 0 16px rgba(129,140,248,0.4)",
          fontSize: 16 + i * 6,
          fontWeight: 900,
          color: "rgba(165,180,252,0.9)",
        }}
        animate={{
          y: [0, -50 - i * 15],
          x: [0, 10 + i * 8],
          opacity: [0, 0.9, 0],
          scale: [0.3, 0.6 + i * 0.2],
          rotate: [0, -10 + i * 5],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeOut",
        }}
      >
        Z
      </motion.div>
    ))}
    {/* Sparkle particles */}
    {Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute h-1 w-1 rounded-full"
        style={{
          left: `${20 + i * 15}%`,
          top: `${30 + (i % 3) * 15}%`,
          background: "rgba(165,180,252,0.7)",
          boxShadow: "0 0 4px rgba(165,180,252,0.5)",
        }}
        animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}
      />
    ))}
  </>
);

const StunEffect = () => (
  <>
    {/* Electric field overlay */}
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(250,204,21,0.1) 0%, transparent 60%)",
      }}
      animate={{ opacity: [0.2, 0.6, 0.1, 0.5, 0.2] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
    {/* Lightning bolts using SVG */}
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 4 }, (_, i) => {
        const x = 15 + i * 22;
        const points = `${x},${10 + i * 5} ${x + 8},${35 + i * 3} ${x - 3},${
          38 + i * 3
        } ${x + 5},${65 + i * 4} ${x - 2},${68 + i * 4} ${x + 3},${90}`;
        return (
          <motion.polyline
            key={`bolt-${i}`}
            points={points}
            fill="none"
            stroke="rgba(250,204,21,0.7)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(250,204,21,0.6))" }}
            animate={{ opacity: [0, 1, 0], strokeWidth: [0.5, 1.2, 0.5] }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 1.5 + i * 0.4,
              delay: i * 0.3,
            }}
          />
        );
      })}
    </svg>
    {/* Crackling sparks */}
    {Array.from({ length: 6 }, (_, i) => (
      <motion.div
        key={`spark-${i}`}
        className="absolute h-0.5 rounded-full"
        style={{
          width: 4 + (i % 3) * 4,
          top: `${15 + i * 13}%`,
          left: `${10 + i * 14}%`,
          background: "rgba(250,204,21,0.9)",
          boxShadow:
            "0 0 6px rgba(250,204,21,0.7), 0 0 12px rgba(250,204,21,0.3)",
          rotate: 30 + i * 25,
        }}
        animate={{
          opacity: [0, 1, 0],
          scaleX: [0, 1, 0],
        }}
        transition={{
          duration: 0.12,
          repeat: Infinity,
          repeatDelay: 0.8 + (i % 3) * 0.5,
          delay: i * 0.15,
        }}
      />
    ))}
    {/* Bright flash */}
    <motion.div
      className="absolute inset-0"
      style={{ background: "rgba(250,204,21,0.15)" }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2.5 }}
    />
  </>
);

const STATUS_EFFECTS: Record<string, React.FC> = {
  burn: BurnEffect,
  poison: PoisonEffect,
  sleep: SleepEffect,
  stun: StunEffect,
};

const StatusEffectDisplay = ({ status }: { status: StatusEffect | null }) => {
  if (!status) return null;
  const EffectComponent = STATUS_EFFECTS[status];
  if (!EffectComponent) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <EffectComponent />
    </div>
  );
};

const ScannerRing = ({
  delay,
  duration,
  isThin = false,
  mainColor,
}: {
  delay: number;
  duration: number;
  isThin?: boolean;
  mainColor: string;
}) => (
  <motion.div
    className={`absolute inset-0 rounded-[50%] ${
      isThin ? "border" : "border-2"
    }`}
    style={{
      borderColor: mainColor,
      boxShadow: `0 0 10px 1px ${mainColor}`,
      opacity: isThin ? 0.5 : 1,
    }}
    initial={{ y: "10%" }}
    animate={{ y: ["10%", "-80%", "10%"] }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const GeometricBurst = () => (
  <>
    {[...Array(12)].map((_, i) => {
      const angle = (i / 12) * 360;
      const distance = 50 + Math.random() * 30;
      return (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-3 w-1 bg-yellow-300"
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            rotate: angle + 90,
            origin: "center center",
          }}
          animate={{
            x: [0, Math.cos((angle * Math.PI) / 180) * distance],
            y: [0, Math.sin((angle * Math.PI) / 180) * distance],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      );
    })}
  </>
);

const PlatformEffects = ({
  isPlayer,
  animationState,
  part,
}: {
  isPlayer: boolean;
  animationState: AnimationState;
  part: "back" | "front";
}) => {
  const platformColor = isPlayer ? "rgba(0, 220, 255," : "rgba(255, 80, 80,";
  const mainColor = isPlayer ? "#00dcff" : "#ff5050";

  const shadowVariants = {
    idle: { scale: 1, opacity: 0.5 },
    attack: { scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] },
    hit: { scale: 1.1, opacity: 0.6 },
    faint: { scale: 0.8, opacity: 0 },
    switchIn: { scale: [0, 1], opacity: [0, 0.5] },
    switchOut: { scale: 0, opacity: 0 },
  };

  if (part === "back") {
    return (
      <div className="absolute inset-0 bottom-[-5rem] sm:bottom-[-15rem]">
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: "rotateX(75deg)" }}
        >
          <motion.div
            variants={shadowVariants}
            animate={animationState}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-[50%] bg-black blur-xl"
          />

          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              backgroundImage: `radial-gradient(circle, ${platformColor}0.3) 0%, transparent 60%)`,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-[50%] opacity-30"
            style={{
              "--hex-color": `${platformColor}0.5)`,
              background: `
        linear-gradient(30deg, transparent 48%, var(--hex-color) 49%, var(--hex-color) 51%, transparent 52%),
        linear-gradient(-30deg, transparent 48%, var(--hex-color) 49%, var(--hex-color) 51%, transparent 52%),
        linear-gradient(90deg, transparent 48%, var(--hex-color) 49%, var(--hex-color) 51%, transparent 52%)`,
              backgroundSize: `34.64px 20px`,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: "rotateX(75deg)" }}
        >
          <AnimatePresence>
            {animationState === "idle" && (
              <motion.div
                key="scanner-rings"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ScannerRing duration={3} delay={0} mainColor={mainColor} />
                <ScannerRing
                  duration={2.5}
                  delay={0.5}
                  isThin
                  mainColor={mainColor}
                />
                <ScannerRing
                  duration={3.5}
                  delay={1}
                  isThin
                  mainColor={mainColor}
                />
              </motion.div>
            )}

            {animationState === "switchIn" && (
              <motion.div
                key="switchIn"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0 rounded-[50%] border-4"
                  style={{ borderColor: mainColor }}
                  animate={{ scale: [0, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 0.7, ease: "circOut" }}
                />
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-1/2 left-1/2 w-1 origin-bottom"
                    style={{
                      backgroundColor: mainColor,
                      rotate: i * 60,
                      height: "50%",
                    }}
                    animate={{ scaleY: [0, 1, 0], opacity: [0.8, 1, 0] }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}

            {animationState === "attack" && (
              <motion.div
                key="attack"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0 rounded-[50%] border-4"
                  style={{ borderColor: mainColor }}
                  animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-[50%] border-2"
                  style={{ borderColor: mainColor }}
                  animate={{ scale: [0, 1], opacity: [1, 0] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.div>
            )}

            {animationState === "hit" && (
              <motion.div
                key="hit"
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <GeometricBurst />
                <motion.div
                  className="absolute inset-0 rounded-[50%] border-4 border-yellow-300"
                  animate={{ scale: [0.5, 1.8], opacity: [1, 0] }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-[50%] border-2 border-white"
                  animate={{ scale: [0.3, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 0.5, ease: "circOut", delay: 0.1 }}
                />
              </motion.div>
            )}

            {(animationState === "faint" || animationState === "switchOut") && (
              <motion.div
                key="faint"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: mainColor }}
                    animate={{
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      scale: [1, 0],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: Math.random() * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (part === "front") {
    return (
      <div className="absolute inset-0 bottom-[-5rem] sm:bottom-[-15rem]">
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: "rotateX(75deg)" }}
        >
          <AnimatePresence>
            {animationState === "idle" && (
              <motion.div
                key="scanner-rings-front"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                }}
              >
                <ScannerRing duration={3} delay={0} mainColor={mainColor} />
                <ScannerRing
                  duration={2.5}
                  delay={0.5}
                  isThin
                  mainColor={mainColor}
                />
                <ScannerRing
                  duration={3.5}
                  delay={1}
                  isThin
                  mainColor={mainColor}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
};

const HealthBar = ({
  currentHp,
  maxHp,
  showText = false,
}: {
  currentHp: number;
  maxHp: number;
  showText?: boolean;
}) => {
  const healthPercentage = maxHp > 0 ? currentHp / maxHp : 0;
  const [prevHealth, setPrevHealth] = useState(healthPercentage);

  useEffect(() => {
    const timeout = setTimeout(() => setPrevHealth(healthPercentage), 500);
    return () => clearTimeout(timeout);
  }, [healthPercentage]);

  const barColor =
    healthPercentage < 0.2
      ? "#ef4444" // red-500
      : healthPercentage < 0.5
      ? "#f59e0b" // amber-500
      : "#22c55e"; // green-500

  return (
    <div className="relative w-full">
      <div
        className="w-full bg-slate-300/80 shadow-inner dark:bg-slate-700/80"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
      >
        <motion.div
          className="absolute h-full bg-slate-200/70 dark:bg-white/70"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            height: showText ? "15px" : "12px",
          }}
          initial={false}
          animate={{ width: `${prevHealth * 100}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />

        <motion.div
          className="h-full"
          style={{
            backgroundColor: barColor,
            height: showText ? "15px" : "12px",
            clipPath:
              "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
          initial={{ width: `${prevHealth * 100}%` }}
          animate={{ width: `${healthPercentage * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-kode text-xs font-bold text-black/70 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] dark:text-white dark:drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {currentHp} / {maxHp}
          </span>
        </div>
      )}
    </div>
  );
};

const TeamStatusIcon = React.memo(
  ({ isHealthy, isPlayer }: { isHealthy: boolean; isPlayer: boolean }) => {
    const frameColorClass = isHealthy
      ? isPlayer
        ? "bg-cyan-300"
        : "bg-red-400"
      : "bg-slate-500";
    const fillColorClass = isHealthy
      ? isPlayer
        ? "bg-cyan-500"
        : "bg-red-600"
      : "bg-slate-700";
    const shadowColor = isPlayer ? "rgb(34 211 238)" : "rgb(239 68 68)";
    const hexagonClipPath =
      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

    return (
      <motion.div
        className="relative h-5 w-5"
        style={{
          filter: isHealthy ? `drop-shadow(0 0 3px ${shadowColor})` : "none",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          className={`absolute inset-0 transition-colors ${frameColorClass}`}
          style={{ clipPath: hexagonClipPath }}
        />
        <div
          className={`absolute inset-[2px] transition-colors ${fillColorClass}`}
          style={{ clipPath: hexagonClipPath }}
        />
        {!isHealthy && (
          <X className="relative z-10 h-full w-full p-1 text-slate-400" />
        )}
      </motion.div>
    );
  }
);
TeamStatusIcon.displayName = "TeamStatusIcon";

const STAT_LABELS: {
  key: keyof StatModifiers;
  label: string;
  color: string;
}[] = [
  { key: "atk", label: "ATK", color: "text-red-400" },
  { key: "def", label: "DEF", color: "text-blue-400" },
  { key: "spd", label: "SPD", color: "text-yellow-400" },
];

const StatModifierBar = ({ modifiers }: { modifiers: StatModifiers }) => {
  const hasAny =
    modifiers.atk !== 0 || modifiers.def !== 0 || modifiers.spd !== 0;
  if (!hasAny) return null;

  return (
    <div className="mt-1 flex gap-2">
      {STAT_LABELS.map(({ key, label, color }) => {
        const val = modifiers[key];
        if (val === 0) return null;
        const arrow = val > 0 ? "▲" : "▼";
        const absVal = Math.abs(val);
        return (
          <motion.span
            key={key}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-kode text-[10px] font-bold ${color}`}
          >
            {label} {arrow.repeat(absVal)}
          </motion.span>
        );
      })}
    </div>
  );
};

const Hud = ({
  mon,
  team,
  isPlayer,
}: {
  mon: BattleReadyMon;
  team: BattleReadyMon[];
  isPlayer: boolean;
}) => {
  const mainClipPath = isPlayer
    ? "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)"
    : "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))";

  const hudStyle = isPlayer
    ? {
        background: "linear-gradient(to right, #06b6d4, #22d3ee)",
        filter: "drop-shadow(0 0 10px #06b6d4)",
      }
    : {
        background: "linear-gradient(to right, #ef4444, #f87171)",
        filter: "drop-shadow(0 0 10px #ef4444)",
      };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isPlayer ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className={`relative w-full`}
    >
      <div
        className="relative p-0.5"
        style={{
          clipPath: mainClipPath,
          ...hudStyle,
        }}
      >
        <div
          className="relative bg-white/90 p-3 pb-5 backdrop-blur-sm dark:bg-slate-900/90"
          style={{ clipPath: mainClipPath }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <span className="truncate text-base uppercase tracking-wider text-slate-900 dark:text-white sm:text-lg">
                    {mon.name}
                  </span>
                  <StatusIcon status={mon.status} size="md" />
                </div>
              </div>

              <div
                className={`my-1.5 flex items-center gap-2 ${
                  isPlayer ? "justify-start" : "justify-end"
                }`}
              >
                <TypeBadge type={mon.type1} />
                {mon.type2 && <TypeBadge type={mon.type2} />}
              </div>
            </div>
          </div>

          <div className="relative mt-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold ${
                  isPlayer ? "text-cyan-500" : "text-red-500"
                }`}
              >
                HP
              </span>

              <HealthBar currentHp={mon.currentHp} maxHp={mon.hp} />
            </div>

            <p className="absolute -bottom-4 right-0 px-3 font-kode text-xs text-slate-600 dark:text-slate-300">
              {mon.currentHp} / {mon.hp}
            </p>
          </div>

          <StatModifierBar modifiers={mon.statModifiers} />
        </div>
      </div>

      <div
        className={`absolute flex items-center gap-1.5 ${
          isPlayer ? "-bottom-2 left-6" : "-top-2 right-6"
        }`}
      >
        {team.map((teamMon) => (
          <TeamStatusIcon
            key={`status-${teamMon.id}`}
            isHealthy={teamMon.currentHp > 0}
            isPlayer={isPlayer}
          />
        ))}
      </div>
    </motion.div>
  );
};

const PortfolioMonSprite = ({
  mon,
  animationState,
  isPlayer,
}: {
  mon: BattleReadyMon;
  animationState: AnimationState;
  isPlayer: boolean;
}) => {
  const mainColor = isPlayer ? "#00dcff" : "#ff5050";
  const colorRgb = isPlayer ? "0, 220, 255" : "255, 80, 80";
  const defaultShadow = "drop-shadow(0px 5px 10px rgba(0,0,0,0.5))";

  const variants = {
    idle: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      filter: `brightness(100%) ${defaultShadow}`,
      transition: { duration: 0.4 },
    },
    attack: {
      x: isPlayer ? [0, 60, 0] : [0, -60, 0],
      y: [0, -15, 0],
      scale: [1, 0.9, 1.15, 1],
      opacity: 1,
      filter: [
        `brightness(100%) ${defaultShadow}`,
        `brightness(120%) drop-shadow(0px 0px 15px ${mainColor})`,
        `brightness(100%) ${defaultShadow}`,
      ],
      transition: { duration: 0.5, ease: "easeInOut", times: [0, 0.4, 1] },
    },
    hit: {
      x: [0, -8, 8, -8, 8, 0],
      y: [0, -4, 0],
      scale: [1, 0.95, 1.05, 1],
      opacity: 1,
      rotate: [0, -2, 2, -2, 2, 0],
      filter: [
        `brightness(100%) ${defaultShadow}`,
        `brightness(300%) ${defaultShadow}`,
        `brightness(100%) ${defaultShadow}`,
        `brightness(200%) ${defaultShadow}`,
        `brightness(100%) ${defaultShadow}`,
      ],
      transition: { duration: 0.5 },
    },
    faint: {
      y: 40,
      opacity: 0,
      scale: 0.8,
      filter: `brightness(50%) ${defaultShadow}`,
      transition: { duration: 1, ease: "easeIn" },
    },
    switchOut: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    switchIn: {
      opacity: [0, 1],
      scale: [0.5, 1],
      y: [50, 0],
      filter: [
        `brightness(150%) drop-shadow(0px 0px 25px ${mainColor})`,
        `brightness(100%) ${defaultShadow}`,
      ],
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={variants}
      animate={animationState}
      className="relative h-full w-full"
    >
      <motion.div
        className="absolute h-full w-full"
        animate={{ y: animationState === "idle" ? [0, -10, 0] : 0 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <MonFrame monId={mon.id} color={colorRgb} />

        <div className="absolute inset-[2%]" style={{ opacity: 0.95 }}>
          <Image
            src={mon.image}
            fill
            alt={mon.name}
            priority
            className="object-contain drop-shadow-lg"
          />
        </div>

        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${colorRgb}, 0.12) 0%, transparent 50%)`,
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

const EffectivenessBadge = ({ multiplier }: { multiplier: number }) => {
  if (multiplier === 1) return null;

  const isSuperEffective = multiplier > 1;
  const colorClasses = isSuperEffective
    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";

  return (
    <span
      className={`flex-shrink-0 rounded-md px-1.5 py-0.5 font-kode text-[10px] font-bold leading-none ${colorClasses}`}
    >
      {multiplier}x
    </span>
  );
};

const TeamBar = ({
  team,
  onSwitch,
  isSwitchView,
  activeMonId,
  onItemTargetSelect,
  isItemTargetView,
  isReviveMode,
  opponentMon,
  getTypeEffectiveness,
}: {
  team: BattleReadyMon[];
  onSwitch: (index: number) => void;
  isSwitchView: boolean;
  activeMonId: number;
  onItemTargetSelect?: (index: number) => void;
  isItemTargetView: boolean;
  isReviveMode: boolean;
  opponentMon: BattleReadyMon;
  getTypeEffectiveness: (
    moveType: string,
    targetMon: BattleReadyMon
  ) => { multiplier: number; message: string };
}) => {
  const cardClipPath =
    "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)";

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-2 lg:pr-2">
      {team.map((mon, index) => {
        const isActive = mon.id === activeMonId;
        const isFainted = mon.currentHp <= 0;
        const isDisabled =
          (!isSwitchView && !isItemTargetView) ||
          (isReviveMode ? !isFainted : isFainted) ||
          (isSwitchView && isActive);

        return (
          <motion.button
            layout
            key={mon.id}
            disabled={isDisabled}
            onClick={() => {
              if (isSwitchView) onSwitch(index);
              if (isItemTargetView && onItemTargetSelect)
                onItemTargetSelect(index);
            }}
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            className={`group relative w-full text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div
              className={`p-0.5 ${
                isActive
                  ? "bg-cyan-500"
                  : "bg-slate-300 enabled:hover:bg-cyan-300 dark:bg-slate-700 dark:enabled:hover:bg-cyan-400"
              }`}
              style={{ clipPath: cardClipPath }}
            >
              <div
                className="bg-white/80 p-2 dark:bg-slate-900/80"
                style={{ clipPath: cardClipPath }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`relative h-10 w-14 flex-shrink-0 bg-slate-200 p-1 dark:bg-slate-800 ${
                      mon.currentHp <= 0 ? "grayscale" : ""
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    }}
                  >
                    <Image
                      src={mon.image}
                      fill
                      alt={mon.name}
                      className="object-cover object-left"
                    />
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {mon.name}
                      </p>

                      <div className="flex gap-1">
                        <TypeBadge type={mon.type1} />
                        {mon.type2 && <TypeBadge type={mon.type2} />}
                      </div>
                    </div>

                    <div className="mt-2">
                      <HealthBar
                        currentHp={mon.currentHp}
                        maxHp={mon.hp}
                        showText
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-slate-300 pt-2 dark:border-slate-700">
                  {mon.moves.map((move) => {
                    const { multiplier } = getTypeEffectiveness(
                      move.type,
                      opponentMon
                    );

                    return (
                      <div
                        key={move.name}
                        className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400"
                      >
                        {/* This container ensures the move name truncates correctly */}
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate">{move.name}</span>
                          <EffectivenessBadge multiplier={multiplier} />
                        </div>
                        <span className="flex-shrink-0 font-kode">
                          {move.currentPp}/{move.pp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isActive && (
              <Star className="absolute left-1 top-1 z-10 h-4 w-4 text-yellow-400 drop-shadow-[0_0_2px_#facc15]" />
            )}
            <div className="absolute right-1 top-1 z-10">
              <StatusIcon status={mon.status} size="sm" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const BattleLog = ({ battleLog }: { battleLog: string[] }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLog]);

  return (
    <div
      ref={logContainerRef}
      className="flex h-full flex-col gap-1.5 overflow-y-auto scroll-smooth bg-gradient-to-t from-white/80 to-slate-100/80 p-4 pt-2 [mask-image:linear-gradient(to_bottom,transparent_0,_black_24px,_black_calc(100%-24px),transparent_100%)] dark:from-slate-900/80 dark:to-slate-800/80"
    >
      {battleLog.map((msg, i) => (
        <BattleLogMessage key={`${i}-${msg}`} msg={msg} />
      ))}
    </div>
  );
};

const BattleLogMessage = ({ msg }: { msg: string }) => {
  const turnMatch = msg.match(/--- Turn (\d+) ---/i);
  if (turnMatch) {
    const turnNumber = parseInt(turnMatch[1], 10);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative my-3 flex items-center text-center"
        aria-hidden="true"
      >
        <div className="flex-grow border-t border-slate-300/50 dark:border-slate-700/50" />

        <span className="flex-shrink-0 px-4 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-500">
          Turn {turnNumber}
        </span>
        <div className="flex-grow border-t border-slate-300/50 dark:border-slate-700/50" />
      </motion.div>
    );
  }

  const getMessageInfo = (message: string) => {
    const lowerMsg = message.toLowerCase();
    const statusInfo: {
      [key in StatusEffect & string]: {
        icon: JSX.Element;
        color: string;
        verb: string;
      };
    } = {
      burn: {
        icon: <Flame className="h-full w-full" />,
        color: "text-orange-400",
        verb: "burn",
      },
      poison: {
        icon: <Bubbles className="h-full w-full" />,
        color: "text-purple-400",
        verb: "poison",
      },
      sleep: {
        icon: <BedDouble className="h-full w-full" />,
        color: "text-gray-400",
        verb: "asleep",
      },
      stun: {
        icon: <Zap className="h-full w-full" />,
        color: "text-yellow-400",
        verb: "stun",
      },
    };

    for (const status in statusInfo) {
      if (lowerMsg.includes(status)) {
        const { icon, color, verb } = statusInfo[status as StatusEffect];
        const correctedText = message.replace(
          new RegExp(`(is|was) ${status}`, "gi"),
          `$1 ${verb}`
        );
        return { icon, color, text: correctedText };
      }
    }

    if (lowerMsg.includes("super effective"))
      return {
        icon: <Sparkles className="h-full w-full" />,
        color: "text-green-400 font-bold",
        text: message,
      };
    if (lowerMsg.includes("not very effective"))
      return {
        icon: <ShieldCheck className="h-full w-full" />,
        color: "text-red-400 font-bold",
        text: message,
      };
    if (lowerMsg.includes("critical hit"))
      return {
        icon: <AlertTriangle className="h-full w-full" />,
        color: "text-yellow-400 font-bold",
        text: message,
      };
    if (lowerMsg.includes("fainted"))
      return {
        icon: <XCircle className="h-full w-full" />,
        color: "text-red-500 font-bold",
        text: message,
      };
    if (lowerMsg.includes("missed"))
      return {
        icon: <XCircle className="h-full w-full" />,
        color: "text-gray-500 italic",
        text: message,
      };
    if (lowerMsg.includes("switched"))
      return {
        icon: <ArrowRightLeft className="h-full w-full" />,
        color: "text-cyan-400",
        text: message,
      };
    if (lowerMsg.includes("ran away"))
      return {
        icon: <ArrowRightLeft className="h-full w-full" />,
        color: "text-gray-400",
        text: message,
      };
    if (lowerMsg.includes("used"))
      return {
        icon: <Star className="h-full w-full" />,
        color: "text-slate-800 dark:text-white",
        text: message,
      };

    return {
      icon: null,
      color: "text-slate-600 dark:text-slate-400",
      text: message,
    };
  };

  const { icon, color, text } = getMessageInfo(msg);

  return (
    <motion.p
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-start gap-2 text-sm transition-colors duration-300 ${color}`}
    >
      {icon && <span className="mt-0.5 h-4 w-4 flex-shrink-0">{icon}</span>}
      <span>{text}</span>
    </motion.p>
  );
};

const EffectivenessTag = ({ multiplier }: { multiplier: number }) => {
  if (multiplier === 1) return null;
  const tagColor =
    multiplier > 1
      ? "bg-green-500"
      : multiplier < 1
      ? "bg-red-500"
      : "bg-gray-600";
  return (
    <span
      className={`absolute -right-1 -top-1.5 z-20 pb-0.5 pl-2 pr-1.5 font-kode text-[10px] font-bold text-white ${tagColor}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)" }}
    >
      {multiplier}x
    </span>
  );
};

const MoveInfoHover = ({
  move,
  clipPath,
}: {
  move: BattleReadyMove;
  clipPath: string;
}) => {
  const statusType = move.effect?.type;
  const statusStyle =
    statusType && statusEffectStyles[statusType as StatusEffect];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 z-10"
    >
      <div className="bg-cyan-400/80 p-0.5" style={{ clipPath }}>
        <div
          className="h-full bg-white/95 backdrop-blur-sm dark:bg-slate-900/95"
          style={{ clipPath }}
        >
          <div className="flex h-full flex-col justify-between p-2">
            <div className="flex min-h-0 flex-grow items-start gap-2">
              <div className="flex-grow basis-3/5">
                <p className="text-xs leading-snug text-slate-700 dark:text-slate-300">
                  {move.description}
                </p>
              </div>

              <div className="flex basis-2/5 flex-col justify-center gap-1 border-l border-slate-300/50 pl-2 dark:border-slate-700/50">
                <div className="flex flex-col items-end">
                  <p className="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    Accuracy
                  </p>
                  <p className="font-kode text-sm font-bold text-cyan-600 dark:text-cyan-300">
                    {move.accuracy * 100}%
                  </p>
                </div>
                {move.critChance > 0 && (
                  <div className="flex flex-col items-end">
                    <p className="text-end text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400">
                      Crit Chance
                    </p>
                    <p className="font-kode text-sm font-bold text-yellow-500 dark:text-yellow-300">
                      {move.critChance * 100}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {move.effect && statusType && statusStyle && (
              <div className="mt-1 flex-shrink-0 border-t border-slate-300/50 pt-1 text-center dark:border-slate-700/50">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 ${statusStyle.bg}`}
                  style={{ clipPath: CLIP.typeBadge }}
                >
                  <div className={`h-3.5 w-3.5 ${statusStyle.text}`}>
                    {statusEffectIcons[statusType as StatusEffect]}
                  </div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wide ${statusStyle.text}`}
                  >
                    {move.effect.chance * 100}% {move.effect.type}
                  </p>
                </div>
              </div>
            )}
            {move.selfEffect && (
              <div className="mt-1 flex-shrink-0 border-t border-slate-300/50 pt-1 text-center dark:border-slate-700/50">
                <SelfEffectBadge selfEffect={move.selfEffect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MoveButton = ({
  move,
  onSelect,
  disabled,
  opponentMon,
  getTypeEffectiveness,
}: {
  move: BattleReadyMove;
  onSelect: (move: BattleReadyMove) => void;
  disabled: boolean;
  opponentMon: BattleReadyMon;
  getTypeEffectiveness: (
    moveType: string,
    targetMon: BattleReadyMon
  ) => { multiplier: number; message: string };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { multiplier } = getTypeEffectiveness(move.type, opponentMon);

  const outOfPP = move.currentPp <= 0;
  const isHighPower = move.power && move.power >= 90;
  const hasStatusEffect = !!move.effect;
  const hasSelfEffect = !!move.selfEffect;
  const statusType = move.effect?.type;

  const typeStyle = typeStyles[move.type] || {
    bg: "bg-gray-600",
    border: "border-gray-500",
    text: "text-white",
  };
  const statusStyle =
    hasStatusEffect && statusType
      ? statusEffectStyles[statusType as StatusEffect]
      : null;

  let frameBgClass =
    "bg-slate-400 enabled:hover:bg-cyan-300 dark:bg-slate-600 dark:enabled:hover:bg-cyan-400";
  let contentBgClass = `${typeStyle.bg}/50`;
  let textColorClass = "text-slate-900 dark:text-white";
  let isAccented = false;

  const selfEffectStyle = hasSelfEffect
    ? SELF_EFFECT_STYLES[move.selfEffect!.type]
    : null;

  if (hasStatusEffect && statusStyle) {
    frameBgClass = statusStyle.border;
    contentBgClass = statusStyle.bg;
    textColorClass = statusStyle.text;
  } else if (hasSelfEffect && selfEffectStyle) {
    frameBgClass = selfEffectStyle.border;
    contentBgClass = selfEffectStyle.bg;
    textColorClass = selfEffectStyle.text;
  } else if (isHighPower) {
    frameBgClass = typeStyle.border.replace("border-", "bg-");
    contentBgClass = typeStyle.bg;
    textColorClass = typeStyle.text;
    isAccented = true;
  }

  if (outOfPP) {
    frameBgClass = "bg-red-500/50";
    contentBgClass = "bg-slate-300 dark:bg-slate-800";
    textColorClass = "text-slate-400 dark:text-slate-500";
    isAccented = false;
  }

  const buttonClipPath =
    "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))";

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      className={`group relative h-full text-left transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50`}
      disabled={disabled || outOfPP}
      onClick={() => onSelect(move)}
    >
      <div
        className={`p-0.5 transition-colors duration-300 ${frameBgClass}`}
        style={{ clipPath: buttonClipPath }}
      >
        <div
          className={`relative flex h-full flex-col justify-start p-2 ${contentBgClass}`}
          style={{ clipPath: buttonClipPath }}
        >
          {isAccented && (
            <div
              className="pointer-events-none absolute inset-0 border-2 border-black/30"
              style={{ clipPath: buttonClipPath }}
            />
          )}
          <div className="relative z-10 flex h-full flex-col">
            <div
              className={`flex w-full items-start justify-between ${textColorClass}`}
            >
              <p className="text-xs font-bold sm:text-sm">{move.name}</p>
              <p className="font-kode text-[0.6rem] sm:text-xs">
                Pwr: {move.power || "--"}
              </p>
            </div>
            {hasStatusEffect && move.effect && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 flex h-8 items-center justify-center">
                <div
                  className={`flex items-center gap-1 bg-white/40 px-3 py-1 text-sm sm:gap-2 sm:px-4 ${textColorClass}`}
                  style={{
                    clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)",
                  }}
                >
                  <div className="size-4">
                    {statusEffectIcons[statusType as StatusEffect]}
                  </div>
                  <span className="font-kode text-[10px] font-bold sm:text-sm">
                    {move.effect.chance * 100}%
                  </span>
                </div>
              </div>
            )}
            {!hasStatusEffect &&
              hasSelfEffect &&
              move.selfEffect &&
              selfEffectStyle && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 flex h-8 items-center justify-center">
                  <div
                    className={`flex items-center gap-1 bg-white/40 px-3 py-1 text-sm sm:gap-2 sm:px-4 ${selfEffectStyle.text}`}
                    style={{
                      clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div className="size-4">{selfEffectStyle.icon}</div>
                    <span className="font-kode text-[10px] font-bold sm:text-sm">
                      {move.selfEffect.chance < 1
                        ? `${move.selfEffect.chance * 100}%`
                        : selfEffectStyle.label}
                    </span>
                  </div>
                </div>
              )}
            <div className="mt-auto flex items-center gap-1 pt-1 sm:grid sm:grid-cols-3">
              <div className="flex justify-start">
                <TypeBadge type={move.type} />
              </div>
              <div className="flex justify-center"></div>
              <div className="ml-auto flex justify-end">
                <p
                  className={`font-kode text-[0.6rem] font-bold sm:text-xs ${
                    outOfPP ? "text-red-500" : textColorClass
                  }`}
                >
                  PP {move.currentPp}/{move.pp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && !disabled && (
          <MoveInfoHover move={move} clipPath={buttonClipPath} />
        )}
      </AnimatePresence>

      <EffectivenessTag multiplier={multiplier} />
    </motion.button>
  );
};

const SpeechBubble = ({
  text,
  isPlayer,
}: {
  text: string;
  isPlayer: boolean;
}) => {
  const shadowColor = isPlayer
    ? "rgba(34, 211, 238, 0.5)"
    : "rgba(239, 68, 68, 0.5)";

  const playerClipPath =
    "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)";
  const gruntClipPath =
    "polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px))";

  const clipPath = isPlayer ? playerClipPath : gruntClipPath;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute z-[80] w-36 md:w-48 ${
        isPlayer
          ? "bottom-full left-0 md:bottom-[90%] md:left-[-10%]"
          : "bottom-full right-0 md:bottom-[90%] md:right-[-10%]"
      }`}
      style={{
        filter: `drop-shadow(0 4px 8px ${shadowColor})`,
      }}
    >
      <div
        className={`p-0.5 ${isPlayer ? "bg-cyan-400" : "bg-red-500"}`}
        style={{ clipPath }}
      >
        <div
          className="bg-white/90 px-2 py-2 text-center text-xs font-semibold text-slate-900 backdrop-blur-sm dark:bg-slate-900/90 dark:text-white sm:px-4 sm:text-sm"
          style={{ clipPath }}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationDisplay = ({
  notification,
}: {
  notification: { id: number; message: string; type: NotificationType } | null;
}) => {
  const getNotificationStyle = (type: NotificationType, message = "") => {
    const lowerMsg = message.toLowerCase();
    switch (type) {
      case "critical":
        return {
          bg: "bg-yellow-500/90",
          borderBg: "bg-yellow-300",
          text: "text-white",
          icon: <AlertTriangle className="h-full w-full" />,
        };
      case "effectiveness":
        return {
          bg: "bg-green-500/90",
          borderBg: "bg-green-300",
          text: "text-white",
          icon: <Sparkles className="h-full w-full" />,
        };
      case "status":
        let icon: JSX.Element = <AlertTriangle className="h-full w-full" />;
        if (lowerMsg.includes("burn"))
          icon = <Flame className="h-full w-full" />;
        if (lowerMsg.includes("poison"))
          icon = <Bubbles className="h-full w-full" />;
        if (lowerMsg.includes("sleep"))
          icon = <BedDouble className="h-full w-full" />;
        if (lowerMsg.includes("stun")) icon = <Zap className="h-full w-full" />;
        return {
          bg: "bg-purple-500/90",
          borderBg: "bg-purple-300",
          text: "text-white",
          icon: icon,
        };
      case "turn":
        return {
          bg: "bg-cyan-500/90",
          borderBg: "bg-cyan-300",
          text: "text-white",
          icon: <ArrowRightLeft className="h-full w-full" />,
        };
      case "miss":
        return {
          bg: "bg-slate-600/90",
          borderBg: "bg-slate-400",
          text: "text-slate-100",
          icon: <XCircle className="h-full w-full" />,
        };
      case "boost":
        return {
          bg: "bg-orange-500/90",
          borderBg: "bg-orange-300",
          text: "text-white",
          icon: <ArrowUp className="h-full w-full" />,
        };
      case "heal":
        return {
          bg: "bg-emerald-500/90",
          borderBg: "bg-emerald-300",
          text: "text-white",
          icon: <Heart className="h-full w-full" />,
        };
      case "drain":
        return {
          bg: "bg-violet-500/90",
          borderBg: "bg-violet-300",
          text: "text-white",
          icon: <Droplets className="h-full w-full" />,
        };
      default:
        return {
          bg: "bg-slate-700/90",
          borderBg: "bg-slate-500",
          text: "text-slate-100",
          icon: null,
        };
    }
  };

  const style = notification
    ? getNotificationStyle(notification.type, notification.message)
    : getNotificationStyle("info");
  const clipPath =
    "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)";
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 z-50 flex w-full max-w-lg -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence mode="popLayout">
        {notification && (
          <motion.div
            key={notification.id}
            layout
            className={`w-auto p-0.5 shadow-lg backdrop-blur-md ${style.borderBg}`}
            style={{ clipPath }}
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div
              className={`flex items-center gap-4 px-5 py-3 ${style.bg}`}
              style={{ clipPath }}
            >
              {style.icon && (
                <div
                  className={`h-4 w-4 flex-shrink-0 sm:h-7 sm:w-7 ${style.text}`}
                >
                  {style.icon}
                </div>
              )}

              <span
                className={`text-sm font-bold tracking-wide sm:text-lg ${style.text}`}
              >
                {notification.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Corner = ({ position }: { position: string }) => (
  <motion.div
    className={`pointer-events-none absolute z-[60] h-12 w-12 text-cyan-400 ${position}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.7, 1] }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
  >
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      style={{ filter: "drop-shadow(0 0 5px currentColor)" }}
    >
      <path
        d="M0 20V0H20"
        stroke="currentColor"
        strokeWidth="3"
        transform={
          position.includes("top-8 left-8")
            ? ""
            : position.includes("top-8 right-8")
            ? "rotate(90 25 25)"
            : position.includes("bottom") && position.includes("right")
            ? "rotate(180 25 25)"
            : "rotate(270 25 25)"
        }
      />
    </svg>
  </motion.div>
);

const SciFiFrame = () => {
  return (
    <>
      <div className="scanline-effect pointer-events-none fixed inset-0 z-[70] opacity-10 mix-blend-soft-light" />

      <div
        className="grid-overlay pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 220, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 220, 255, 0.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <Corner position="top-4 left-4 rotate-90" />
      <Corner position="bottom-[35%] right-4" />
    </>
  );
};

const TargetingReticule = () => (
  <motion.div
    className="absolute inset-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      style={{ filter: "drop-shadow(0 0 5px #ff5050)" }}
    >
      <motion.path
        d="M50 10 V 0 M50 90 V 100 M10 50 H 0 M90 50 H 100"
        stroke="#ff5050"
        strokeWidth="2"
      />

      <motion.circle
        cx="50"
        cy="50"
        r="30"
        stroke="#ff5050"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      <motion.circle
        cx="50"
        cy="50"
        r="20"
        stroke="#ff5050"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </motion.div>
);

const MobileTabButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full p-2 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
      isActive
        ? "border-b-2 border-cyan-400 bg-cyan-400/20 text-cyan-400"
        : "border-b-2 border-transparent text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-700/50"
    }`}
  >
    {children}
  </button>
);

export const FightScreen = () => {
  const {
    playerTeamState: playerTeam,
    cpuTeamState: cpuTeam,
    activePlayerIndex,
    activeCpuIndex,
    battleLog,
    isPlayerTurn,
    handleMoveSelect: onMoveSelect,
    handleSwitchSelect: onSwitchSelect,
    handleRun: onRun,
    playerAnimation,
    cpuAnimation,
    playerTrainerState,
    gruntTrainerState,
    dialogue,
    getTypeEffectiveness,
    inventory,
    handleItemUse: onItemUse,
    turnCount,
    notification,
    gameState,
    isAutoBattleActive,
    toggleAutoBattle,
    background,
    lastMoveType,
    activeBattleEffect,
  } = useGame();

  const playerMon = playerTeam[activePlayerIndex];
  const cpuMon = cpuTeam[activeCpuIndex];

  const [actionState, setActionState] = useState<ActionState>("moves");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isPlayerHudHovered, setPlayerHudHovered] = useState(false);
  const [isCpuHudHovered, setCpuHudHovered] = useState(false);
  const [mobileView, setMobileView] = useState<"actions" | "team" | "log">(
    "actions"
  );

  useEffect(() => {
    if (isPlayerTurn && gameState !== "forcedSwitch") {
      setActionState("moves");
      setSelectedItem(null);
      setMobileView("actions");
    }
  }, [isPlayerTurn, playerMon, gameState]);

  const handleItemSelect = (item: Item) => {
    const t = item.effect.type;
    if (t === "boostAtk" || t === "boostDef" || t === "boostSpd") {
      onItemUse(item.name, activePlayerIndex);
      setActionState("moves");
      return;
    }
    setSelectedItem(item);
    setActionState("itemTarget");
  };

  const handleSwitch = (index: number) => {
    onSwitchSelect(index);
    if (gameState !== "forcedSwitch") {
      setActionState("moves");
    }
  };

  const playerTrainerVariants = {
    idle: { y: 0 },
    commanding: { y: -5, x: 5 },
    win: {
      y: -10,
      rotate: [0, 5, -5, 0],
      transition: {
        rotate: { duration: 0.5, ease: "easeInOut", repeat: Infinity },
      },
    },
    lose: { y: 5, rotate: 2, opacity: 0.8 },
  };
  const cpuTrainerVariants = {
    idle: { y: 0 },
    commanding: { y: -5, x: -5 },
    win: {
      y: -10,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: { duration: 0.5, ease: "easeInOut", repeat: Infinity },
      },
    },
    lose: { y: 5, rotate: -2, opacity: 0.8 },
  };

  const isImpacting = playerAnimation === "hit" || cpuAnimation === "hit";

  return (
    <motion.div
      className="relative h-full w-full select-none overflow-hidden text-slate-900 transition-all duration-500 dark:text-white"
      animate={
        isImpacting
          ? { x: [0, -7, 6, -4, 3, 0], y: [0, 2, -2, 1, 0] }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.34, ease: "easeOut" }}
      style={{
        backgroundImage: `url(/images/backgrounds/background-${background}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <SciFiFrame />
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <NotificationDisplay notification={notification} />
      <div className="z-5 pointer-events-none absolute inset-0">
        <AnimatePresence>
          <BackgroundEffects
            key={turnCount}
            playerAnimation={playerAnimation}
            cpuAnimation={cpuAnimation}
            lastMoveType={lastMoveType}
          />
        </AnimatePresence>
      </div>

      <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={turnCount}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: [1, 1.2, 1] }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="bg-white/50 px-4 py-1.5 text-sm font-bold tracking-wider text-slate-900 backdrop-blur-sm dark:bg-black/50 dark:text-white"
            style={{
              clipPath:
                "polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)",
            }}
          >
            TURN {turnCount}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {dialogue.cpu && (
          <div className="absolute right-[-11%] top-[25%] z-[80] aspect-[2/1] w-[45%] max-w-lg sm:right-[5%] sm:top-[8%]">
            <div className="absolute -bottom-[15%] -left-[25%] h-[110%] w-[60%] sm:-left-[15%]">
              <SpeechBubble text={dialogue.cpu} isPlayer={false} />
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {dialogue.player && (
          <div className="absolute bottom-[51%] left-[-10%] z-[80] aspect-[2/1] w-[55%] max-w-2xl sm:bottom-[36%] sm:left-[5%] md:bottom-[34%]">
            <div className="absolute -bottom-[20%] -right-[18%] h-[110%] w-[55%] sm:-bottom-[30%] sm:-right-[20%]">
              <SpeechBubble text={dialogue.player} isPlayer={true} />
            </div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute right-[5%] top-[12%] z-10 aspect-[2/1] w-[45%] max-w-lg [perspective:1000px]"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -bottom-[150%] -left-[45%] z-20 h-[120%] w-[60%] sm:-bottom-[20%] sm:-left-[25%]">
          <motion.div
            variants={cpuTrainerVariants}
            animate={gruntTrainerState}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="h-full w-full -scale-x-100"
          >
            <Image
              src={`/images/cynthia/${gruntTrainerState}.png`}
              key={`/images/cynthia/${gruntTrainerState}.png`}
              fill
              alt="CPU Trainer"
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        <div className="absolute -bottom-[130%] right-[-5%] h-full w-[95%] sm:bottom-[-10%] sm:w-[75%]">
          <PlatformEffects
            isPlayer={false}
            animationState={cpuAnimation}
            part="front"
          />

          <div className="absolute inset-0 z-20 ">
            <AnimatePresence>
              {isPlayerTurn &&
                actionState === "moves" &&
                !isAutoBattleActive && <TargetingReticule />}
            </AnimatePresence>

            <PortfolioMonSprite
              key={cpuMon.id}
              mon={cpuMon}
              animationState={cpuAnimation}
              isPlayer={false}
            />

            <AnimatePresence>
              {activeBattleEffect?.target === "cpu" && (
                <SelfEffectOverlay effect={activeBattleEffect} />
              )}
            </AnimatePresence>

            <StatusEffectDisplay
              key={`${cpuMon.id}-status`}
              status={cpuMon.status}
            />
          </div>

          <PlatformEffects
            isPlayer={false}
            animationState={cpuAnimation}
            part="back"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[36%] left-[5%] z-10 aspect-[2/1] w-[55%] max-w-2xl [perspective:1000px] md:bottom-[34%]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -right-[18%] bottom-[100%] z-20 h-[110%] w-[55%] sm:-bottom-[20%]">
          <motion.div
            variants={playerTrainerVariants}
            animate={playerTrainerState}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="h-full w-full"
          >
            <Image
              src={`/images/trainer/${playerTrainerState}.png`}
              key={`/images/trainer/${playerTrainerState}.png`}
              fill
              alt="Player Trainer"
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        <div className="absolute bottom-[100%] left-[-5%] z-10 h-full w-[75%] sm:bottom-0">
          <PlatformEffects
            isPlayer={true}
            animationState={playerAnimation}
            part="back"
          />

          <div className="absolute inset-0 z-10 [transform:translateY(-15%)]">
            <PortfolioMonSprite
              key={playerMon.id}
              mon={playerMon}
              animationState={playerAnimation}
              isPlayer={true}
            />

            <AnimatePresence>
              {activeBattleEffect?.target === "player" && (
                <SelfEffectOverlay effect={activeBattleEffect} />
              )}
            </AnimatePresence>

            <StatusEffectDisplay
              key={`${playerMon.id}-status`}
              status={playerMon.status}
            />
          </div>

          <PlatformEffects
            isPlayer={true}
            animationState={playerAnimation}
            part="front"
          />
        </div>
      </motion.div>

      <div className="pointer-events-none relative z-30 h-full w-full p-4">
        <div
          onMouseEnter={() => setCpuHudHovered(true)}
          onMouseLeave={() => setCpuHudHovered(false)}
          className="pointer-events-auto absolute right-4 top-14 w-[68%] max-w-none sm:top-4 sm:w-full md:max-w-xs lg:max-w-sm"
        >
          <Hud mon={cpuMon} team={cpuTeam} isPlayer={false} />

          <AnimatePresence>
            {isCpuHudHovered && cpuMon.currentHp > 0 && (
              <InfoBox mon={cpuMon} isPlayer={false} />
            )}
          </AnimatePresence>
        </div>

        <div
          onMouseEnter={() => setPlayerHudHovered(true)}
          onMouseLeave={() => setPlayerHudHovered(false)}
          className="pointer-events-auto absolute bottom-[36%] left-4 w-[68%] max-w-none md:bottom-[34%] md:w-full md:max-w-xs lg:max-w-sm"
        >
          <Hud mon={playerMon} team={playerTeam} isPlayer={true} />

          <AnimatePresence>
            {isPlayerHudHovered && playerMon.currentHp > 0 && (
              <InfoBox mon={playerMon} isPlayer={true} />
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-40 h-[32%] bg-white/80 p-1 backdrop-blur-sm dark:bg-slate-800/80 sm:h-[31%]"
        style={{
          clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div
          className="relative h-full w-full bg-cyan-400 p-0.5"
          style={{
            clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% 100%, 0 100%)",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.5)",
          }}
        >
          <AnimatePresence>
            {isAutoBattleActive &&
              isPlayerTurn &&
              gameState !== "forcedSwitch" && (
                <AutoBattleOverlay onStop={toggleAutoBattle} />
              )}
          </AnimatePresence>
          <div
            className="h-full w-full flex-col overflow-hidden bg-white/90 dark:bg-slate-900/90"
            style={{
              clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            {/* --- MOBILE TABS --- */}
            <div className="flex flex-shrink-0 border-b-2 border-slate-300/50 dark:border-cyan-400/50 lg:hidden">
              <MobileTabButton
                onClick={() => setMobileView("actions")}
                isActive={mobileView === "actions"}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Swords className="h-3.5 w-3.5" /> Actions
                </div>
              </MobileTabButton>
              <MobileTabButton
                onClick={() => setMobileView("team")}
                isActive={mobileView === "team"}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Team
                </div>
              </MobileTabButton>
              <MobileTabButton
                onClick={() => setMobileView("log")}
                isActive={mobileView === "log"}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Log
                </div>
              </MobileTabButton>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="relative flex h-full min-h-0 flex-grow flex-col lg:flex-row">
              {/* --- LOG (Left) --- */}
              <div
                className={`relative h-full w-full lg:order-1 lg:block lg:w-[35%] ${
                  mobileView === "log" ? "block" : "hidden"
                }`}
              >
                <BattleLog battleLog={battleLog} />
              </div>

              {/* --- TEAM (Middle) --- */}
              <div
                className={`relative h-full w-full border-x-2 border-slate-300/50 dark:border-cyan-400/50 lg:order-2 lg:block lg:w-[26%] ${
                  mobileView === "team" ? "block" : "hidden"
                }`}
              >
                <TeamBar
                  team={playerTeam}
                  onSwitch={handleSwitch}
                  isSwitchView={
                    (actionState === "switch" ||
                      gameState === "forcedSwitch") &&
                    isPlayerTurn
                  }
                  activeMonId={playerMon.id}
                  isItemTargetView={actionState === "itemTarget"}
                  isReviveMode={selectedItem?.effect.type === "revive"}
                  onItemTargetSelect={(index) => {
                    if (selectedItem) onItemUse(selectedItem.name, index);
                  }}
                  opponentMon={cpuMon}
                  getTypeEffectiveness={getTypeEffectiveness}
                />
              </div>

              {/* --- ACTIONS (Right) --- */}
              <div
                className={`relative flex h-[calc(100%-2.5rem)] w-full flex-col sm:h-full lg:order-3 lg:flex lg:w-[39%] ${
                  mobileView === "actions" ? "flex" : "hidden"
                }`}
              >
                <div className="sm:min-h-auto relative h-full min-h-0 flex-grow p-2 sm:p-3">
                  <AnimatePresence mode="wait">
                    {gameState === "forcedSwitch" ? (
                      <ForcedSwitchScreen key="forced-switch" />
                    ) : actionState === "moves" ? (
                      <motion.div
                        key="moves"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="my-auto grid h-full grid-cols-2 grid-rows-2 gap-1.5 sm:my-0 sm:gap-3 "
                      >
                        {playerMon.moves.map((move) => (
                          <MoveButton
                            key={move.name}
                            move={move}
                            onSelect={onMoveSelect}
                            disabled={!isPlayerTurn || playerMon.currentHp <= 0}
                            opponentMon={cpuMon}
                            getTypeEffectiveness={getTypeEffectiveness}
                          />
                        ))}
                      </motion.div>
                    ) : actionState === "switch" ? (
                      <SwitchItemView
                        key="switch-view"
                        onCancel={() => setActionState("moves")}
                        title="Choose a Project to switch to."
                      />
                    ) : actionState === "items" ? (
                      <div className="h-full overflow-y-auto" key="items-view">
                        <ItemMenu
                          inventory={inventory}
                          onItemSelect={handleItemSelect}
                          onCancel={() => setActionState("moves")}
                        />
                      </div>
                    ) : actionState === "itemTarget" ? (
                      <SwitchItemView
                        key="item-target-view"
                        onCancel={() => setActionState("items")}
                        title={`Use ${selectedItem?.name || "Item"} on...`}
                      />
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-auto grid flex-shrink-0 grid-cols-4 gap-2 border-t-2 border-slate-300/50 p-2 pt-2 dark:border-cyan-400/50">
                  <ActionButton
                    icon={<ArrowRightLeft className="h-4 w-4" />}
                    onClick={() => {
                      setActionState("switch");
                      setMobileView("team");
                    }}
                    disabled={
                      !isPlayerTurn ||
                      gameState === "forcedSwitch" ||
                      isAutoBattleActive
                    }
                    color="bg-yellow-600/80 hover:bg-yellow-500"
                  >
                    Switch
                  </ActionButton>

                  <ActionButton
                    icon={<ShoppingBag className="h-4 w-4" />}
                    onClick={() => setActionState("items")}
                    disabled={
                      !isPlayerTurn ||
                      gameState === "forcedSwitch" ||
                      isAutoBattleActive
                    }
                    color="bg-blue-600/80 hover:bg-blue-500"
                  >
                    Items
                  </ActionButton>

                  <ActionButton
                    icon={<BookOpen className="h-4 w-4" />}
                    onClick={() => setShowGuide(true)}
                    color="bg-green-600/80 hover:bg-green-500"
                  >
                    Guide
                  </ActionButton>

                  <ActionButton
                    icon={<XCircle className="h-4 w-4" />}
                    onClick={onRun}
                    disabled={
                      !isPlayerTurn ||
                      gameState === "forcedSwitch" ||
                      isAutoBattleActive
                    }
                    color="bg-slate-600/80 hover:bg-slate-500"
                  >
                    Run
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
