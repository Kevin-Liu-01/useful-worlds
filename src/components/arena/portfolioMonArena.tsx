import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Backpack,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Crosshair,
  Gauge,
  HeartPulse,
  Layers3,
  LockKeyhole,
  Radio,
  RotateCcw,
  ScanLine,
  Search,
  Shield,
  Shuffle,
  Signal,
  Skull,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import projectProfileData from "../../data/portfolioMonProfiles.json";
import {
  portfolioMonData,
  type BattleReadyMove,
  type PortfolioMon,
} from "../../context/gameContext";
import {
  BATTLE_ITEMS,
  applyStatusTick,
  chooseAiAction,
  chooseReplacement,
  cloneSide,
  createBattleInventory,
  createArenaSide,
  effectiveSpeed,
  firstLivingIndex,
  getEffectiveness,
  livingCount,
  resolveMove,
  applyBattleItem,
  type AiMemory,
  type ArenaAction,
  type ArenaFighter,
  type ArenaSide,
  type BattleInventory,
  type BattleItemId,
} from "./battleEngine";
import {
  ARENA_CLIP,
  ArenaBackdrop,
  ArenaFrameArt,
  ArenaImage,
  ArenaSigil,
  BattlefieldVector,
  CircuitRule,
  FighterVisual,
  HealthBar,
  MoveEffectLayer,
  ResultSeal,
  StatMeter,
  TYPE_COLORS,
  TrainerSprite,
  TypePill,
  VersusCore,
  type ArenaVisualEvent,
} from "./arenaVisuals";
import {
  getTrainer,
  TRAINER_ROSTER,
  type TrainerId,
  type TrainerRenderMode,
} from "./trainerRoster";

type ArenaPhase = "select" | "versus" | "battle" | "result";
type Outcome = "victory" | "defeat" | null;
type FighterState = "idle" | "attack" | "hit" | "faint" | "switch";
type CommandMode = "moves" | "bag";

type BattleNotice = {
  id: number;
  title: string;
  detail: string;
  accent: string;
  eyebrow: string;
};

type ProjectProfile = {
  tagline: string;
  category: string;
  role: string;
  summary: string;
  highlights: string[];
};

const PROJECT_PROFILES = projectProfileData as Record<string, ProjectProfile>;

const getProjectProfile = (mon: PortfolioMon): ProjectProfile =>
  PROJECT_PROFILES[String(mon.id)] ?? {
    tagline: mon.description,
    category: `${mon.type1}${mon.type2 ? ` · ${mon.type2}` : ""}`,
    role: "Independent build",
    summary: mon.description,
    highlights: mon.moves.slice(0, 3).map((move) => move.name),
  };

const PROJECT_TYPES = [
  "All",
  ...Array.from(
    new Set(
      portfolioMonData.flatMap((mon) =>
        [mon.type1, mon.type2].filter((type): type is string => Boolean(type))
      )
    )
  ).sort(),
];

type MatchStats = {
  turns: number;
  damageDealt: number;
  damageTaken: number;
  criticals: number;
  switches: number;
  itemsUsed: number;
};

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const INITIAL_STATS: MatchStats = {
  turns: 1,
  damageDealt: 0,
  damageTaken: 0,
  criticals: 0,
  switches: 0,
  itemsUsed: 0,
};

const initialMemory = (): AiMemory => ({
  repeatedMoveCount: 0,
  observedPlayerTypes: [],
});

const chooseCpuBattleItem = (
  side: ArenaSide,
  inventory: BattleInventory
): BattleItemId | null => {
  const active = side.team[side.activeIndex]!;
  const healthRatio = active.currentHp / active.mon.hp;
  if (
    side.team.some((fighter) => fighter.currentHp <= 0) &&
    inventory.rollback > 0 &&
    livingCount(side) === 1
  )
    return "rollback";
  if (active.status && inventory["full-restore"] > 0) return "full-restore";
  if (healthRatio < 0.28 && inventory["patch-kit"] > 0) return "patch-kit";
  if (healthRatio < 0.58 && !active.barrier && inventory["null-shield"] > 0)
    return "null-shield";
  if (!active.critBoost && inventory["focus-lens"] > 0 && Math.random() < 0.24)
    return "focus-lens";
  return null;
};

const randomTeam = (excludedIds: number[] = []) => {
  const candidates = portfolioMonData.filter(
    (mon) => !excludedIds.includes(mon.id)
  );
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = candidates[index];
    candidates[index] = candidates[swapIndex]!;
    candidates[swapIndex] = current!;
  }
  return candidates.slice(0, 3);
};

const getMons = (ids: number[]) =>
  ids
    .map((id) => portfolioMonData.find((mon) => mon.id === id))
    .filter((mon): mon is PortfolioMon => Boolean(mon));

const getStatusLabel = (fighter: ArenaFighter) => {
  if (!fighter.status) return "Nominal";
  return `${fighter.status.toUpperCase()} / ${fighter.statusTurns}`;
};

const getBuildScore = (mon: PortfolioMon) =>
  Math.round(
    (mon.stats.hp / 350 +
      mon.stats.atk / 160 +
      mon.stats.def / 160 +
      mon.stats.spd / 160) *
      25
  );

const getTeamMetrics = (team: Array<{ mon: PortfolioMon }>) => {
  const mons = team.map(({ mon }) => mon);
  const divisor = Math.max(1, mons.length);
  const average = (key: "atk" | "def" | "spd") =>
    Math.round(
      mons.reduce((total, mon) => total + mon.stats[key], 0) / divisor
    );
  return {
    hp: mons.reduce((total, mon) => total + mon.hp, 0),
    atk: average("atk"),
    def: average("def"),
    spd: average("spd"),
    types: new Set(
      mons.flatMap((mon) => [mon.type1, mon.type2].filter(Boolean))
    ).size,
  };
};

const PhaseRail = ({ phase }: { phase: ArenaPhase }) => {
  const phases: Array<{ key: ArenaPhase; label: string; code: string }> = [
    { key: "select", label: "Draft", code: "01" },
    { key: "versus", label: "Compile", code: "02" },
    { key: "battle", label: "Battle", code: "03" },
    { key: "result", label: "Result", code: "04" },
  ];
  const activeIndex = phases.findIndex((item) => item.key === phase);

  return (
    <div className="hidden items-center md:flex" aria-label="Match progress">
      {phases.map((item, index) => {
        const active = index === activeIndex;
        const complete = index < activeIndex;
        return (
          <div key={item.key} className="flex items-center">
            <div
              className={`arena-interactive relative flex h-8 items-center gap-2.5 overflow-hidden border px-3 font-kode text-[6px] uppercase tracking-[0.17em] transition-colors ${
                active
                  ? "border-[#d8ff36] bg-[#d8ff36] text-black"
                  : complete
                  ? "border-white/[0.28] bg-white/[0.07] text-white"
                  : "border-white/[0.12] bg-black/[0.18] text-white/[0.34]"
              }`}
              style={{
                clipPath:
                  "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
              }}
            >
              <span className="border-current/[0.32] flex h-3 w-3 items-center justify-center border text-[5px]">
                {complete ? <Check className="h-2.5 w-2.5" /> : item.code}
              </span>
              <span>{item.label}</span>
              {active && (
                <motion.span
                  className="absolute inset-y-0 w-8 skew-x-[-18deg] bg-white/[0.38]"
                  animate={{ x: [-60, 120] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 1.8,
                  }}
                />
              )}
            </div>
            {index < phases.length - 1 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 10"
                className="h-3 w-5 text-white/[0.22]"
                fill="none"
              >
                <path d="M0 5h18l-4-4m4 4-4 4" stroke="currentColor" />
                <circle cx="3" cy="5" r="1.5" fill="currentColor" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ArenaHeader = ({
  phase,
  trainerMode,
  onExit,
  onHelp,
  onTrainerMode,
}: {
  phase: ArenaPhase;
  trainerMode: TrainerRenderMode;
  onExit: () => void;
  onHelp: () => void;
  onTrainerMode: (mode: TrainerRenderMode) => void;
}) => (
  <header className="relative z-50 flex h-[68px] items-center justify-between border-b border-white/[0.12] bg-[#07090d]/[0.94] px-4 text-white shadow-[0_18px_50px_rgba(0,0,0,.28)] backdrop-blur-xl sm:h-20 sm:px-8">
    <button
      type="button"
      onClick={onExit}
      className="group flex h-9 items-center gap-2 border border-transparent px-1 font-kode text-[8px] uppercase tracking-[0.18em] text-white/[0.62] transition hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white sm:px-2"
    >
      <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
      <span className="hidden sm:inline">Exit to portfolio</span>
      <span className="sm:hidden">Exit</span>
    </button>
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3.5 text-center md:static md:translate-x-0 md:translate-y-0">
      <div className="relative hidden h-10 w-10 items-center justify-center bg-[#d8ff36]/[0.035] md:flex">
        <ArenaSigil className="h-9 w-9" />
        <motion.span
          className="absolute inset-0 border border-[#d8ff36]/[0.22]"
          animate={{ rotate: [0, 90, 90, 180, 180, 270, 270, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div>
        <p className="font-telegraf text-lg font-black tracking-[-0.03em] sm:text-2xl">
          PORTFOLIO<span className="text-[#d8ff36]">MON</span>
        </p>
        <p className="font-kode text-[5px] uppercase tracking-[0.34em] text-white/[0.36] sm:text-[6px]">
          Showdown / build archive
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <PhaseRail phase={phase} />
      <button
        type="button"
        onClick={() =>
          onTrainerMode(trainerMode === "battle" ? "chibi" : "battle")
        }
        aria-label={`Switch trainer sprites to ${
          trainerMode === "battle" ? "chibi" : "full battle"
        } mode`}
        className="arena-interactive relative flex h-9 items-center gap-1.5 overflow-hidden border border-white/[0.16] bg-white/[0.025] px-2.5 font-kode text-[7px] uppercase tracking-[0.14em] text-white/[0.58] transition hover:border-[#d8ff36] hover:bg-[#d8ff36]/[0.06] hover:text-[#d8ff36]"
        style={{
          ["--arena-stroke" as string]: "rgba(216,255,54,.40)",
          clipPath:
            "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)",
        }}
      >
        <ArenaFrameArt accent="#d8ff36" />
        <ScanLine className="h-3 w-3" />
        <span className="hidden sm:inline">Sprite:</span>
        <strong>{trainerMode === "battle" ? "Full" : "Chibi"}</strong>
      </button>
      <button
        type="button"
        onClick={onHelp}
        aria-label="Open battle manual"
        className="arena-interactive flex h-9 items-center gap-1.5 border border-transparent px-1.5 font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.46] transition hover:border-white/[0.14] hover:text-[#d8ff36]"
      >
        <CircleHelp className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">Battle manual</span>
      </button>
      <div className="arena-data-flicker hidden items-center gap-1.5 border-l border-white/[0.12] pl-3 font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.45] sm:flex sm:text-[8px]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping bg-[#d8ff36]/[0.45]" />
          <span className="relative inline-flex h-2 w-2 bg-[#d8ff36]" />
        </span>
        Live
      </div>
    </div>
    <CircuitRule className="pointer-events-none absolute inset-x-0 -bottom-2 opacity-50" />
    <motion.div
      className="absolute -bottom-px left-0 h-[2px] bg-[#d8ff36] shadow-[0_0_14px_rgba(216,255,54,.55)]"
      animate={{
        width:
          phase === "select"
            ? "25%"
            : phase === "versus"
            ? "50%"
            : phase === "battle"
            ? "75%"
            : "100%",
      }}
      transition={{ duration: 0.6, ease: "circOut" }}
    >
      <span className="absolute -right-1 -top-[3px] h-2 w-2 rotate-45 border border-[#d8ff36] bg-[#07090d]" />
    </motion.div>
  </header>
);

const TeamSlots = ({
  selected,
  onRemove,
}: {
  selected: PortfolioMon[];
  onRemove: (id: number) => void;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {[0, 1, 2].map((slot) => {
      const mon = selected[slot];
      return (
        <motion.div
          key={slot}
          layout
          className="arena-card arena-panel relative aspect-[2/1] overflow-hidden border bg-white/[0.035]"
          style={{
            ["--arena-accent" as string]: mon
              ? TYPE_COLORS[mon.type1] ?? "#d8ff36"
              : "#ffffff",
            ["--arena-stroke" as string]: mon
              ? `${TYPE_COLORS[mon.type1] ?? "#d8ff36"}99`
              : "rgba(255,255,255,.24)",
            clipPath:
              "polygon(0 9px, 9px 0, calc(100% - 20px) 0, calc(100% - 12px) 8px, 100% 8px, 100% 100%, 0 100%)",
            borderColor: mon
              ? `${TYPE_COLORS[mon.type1] ?? "#d8ff36"}88`
              : "rgba(255,255,255,.14)",
          }}
        >
          <ArenaFrameArt
            accent={mon ? TYPE_COLORS[mon.type1] ?? "#d8ff36" : "#ffffff"}
          />
          {mon ? (
            <motion.div
              key={mon.id}
              initial={{ opacity: 0, scale: 1.08, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute inset-0"
            >
              <ArenaImage
                src={mon.image}
                alt={`${mon.name} selected fighter`}
                sizes="180px"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2">
                <div className="min-w-0">
                  <span className="font-kode text-[6px] uppercase tracking-[0.15em] text-white/[0.45]">
                    0{slot + 1} / {slot === 0 ? "Lead" : "Reserve"}
                  </span>
                  <p className="truncate font-telegraf text-xs font-black text-white sm:text-sm">
                    {mon.name}
                  </p>
                </div>
                <span
                  className="shrink-0 px-1.5 py-1 font-kode text-[6px] font-bold uppercase text-black"
                  style={{
                    backgroundColor: TYPE_COLORS[mon.type1] ?? "#d8ff36",
                  }}
                >
                  {mon.type1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(mon.id)}
                aria-label={`Remove ${mon.name}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center border border-white/[0.20] bg-black/[0.75] text-white transition hover:border-red-300 hover:bg-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <motion.div
                className="flex flex-col items-center gap-1.5 text-white/[0.24]"
                animate={{ opacity: [0.28, 0.58, 0.28] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: slot * 0.3,
                }}
              >
                <ArenaSigil
                  accent="rgba(255,255,255,.38)"
                  className="h-6 w-6"
                />
                <span className="font-kode text-[7px] uppercase tracking-[0.16em]">
                  Slot 0{slot + 1}
                </span>
              </motion.div>
            </div>
          )}
        </motion.div>
      );
    })}
  </div>
);

const TrainerSelector = ({
  label,
  value,
  mode,
  onChange,
  onBrowse,
  reversed = false,
}: {
  label: string;
  value: TrainerId;
  mode: TrainerRenderMode;
  onChange: (id: TrainerId) => void;
  onBrowse: () => void;
  reversed?: boolean;
}) => {
  const trainer = getTrainer(value);
  const index = TRAINER_ROSTER.findIndex((candidate) => candidate.id === value);
  const cycle = (offset: number) => {
    const next =
      (index + offset + TRAINER_ROSTER.length) % TRAINER_ROSTER.length;
    const nextTrainer = TRAINER_ROSTER[next];
    if (nextTrainer) onChange(nextTrainer.id);
  };

  return (
    <div
      className={`arena-card relative grid min-w-0 grid-cols-[30px_56px_minmax(0,1fr)_30px] items-center gap-2.5 overflow-hidden border bg-black/[0.52] p-2 ${
        reversed ? "text-right" : ""
      }`}
      style={{
        ["--arena-stroke" as string]: `${trainer.accent}88`,
        borderColor: `${trainer.accent}66`,
        clipPath:
          "polygon(0 7px, 7px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
      }}
    >
      <ArenaFrameArt accent={trainer.accent} animated />
      <button
        type="button"
        onClick={() => cycle(-1)}
        aria-label={`Previous ${label.toLowerCase()}`}
        className="arena-interactive relative z-[70] flex h-9 items-center justify-center border border-white/[0.12] bg-white/[0.025] text-white/[0.45] transition hover:border-white/[0.40] hover:bg-white/[0.07] hover:text-white"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <div className="relative h-14 overflow-hidden border border-white/[0.08] bg-white/[0.035]">
        <TrainerSprite
          trainer={value}
          mode={mode}
          label={`${trainer.name}, ${trainer.title}, ${mode} sprite`}
        />
      </div>
      <button
        type="button"
        onClick={onBrowse}
        aria-label={`Browse all trainers for ${label.toLowerCase()}`}
        className="group min-w-0 text-left"
      >
        <span
          className="block font-kode text-[6px] uppercase tracking-[0.16em]"
          style={{ color: trainer.accent }}
        >
          {label} · {String(index + 1).padStart(3, "0")}/{TRAINER_ROSTER.length}
        </span>
        <strong className="block truncate font-telegraf text-sm font-black text-white">
          {trainer.name}
        </strong>
        <span className="block truncate font-nacelle text-[8px] text-white/[0.38]">
          {trainer.title} · {mode === "battle" ? "full" : "chibi"} ·
          <span className="ml-1 transition group-hover:text-white">
            browse all
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => cycle(1)}
        aria-label={`Next ${label.toLowerCase()}`}
        className="arena-interactive relative z-[70] flex h-9 items-center justify-center border border-white/[0.12] bg-white/[0.025] text-white/[0.45] transition hover:border-white/[0.40] hover:bg-white/[0.07] hover:text-white"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const TrainerArchiveModal = ({
  label,
  selected,
  mode,
  onSelect,
  onClose,
}: {
  label: string;
  selected: TrainerId;
  mode: TrainerRenderMode;
  onSelect: (id: TrainerId) => void;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [gameFilter, setGameFilter] = useState<"All" | "B2W2" | "BW">("All");
  const [viewFilter, setViewFilter] = useState<"All" | "front" | "back">("All");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return TRAINER_ROSTER.filter((trainer) => {
      const matchesGame =
        gameFilter === "All" || trainer.gameCode === gameFilter;
      const matchesView = viewFilter === "All" || trainer.view === viewFilter;
      const searchText = [
        trainer.name,
        trainer.title,
        trainer.game,
        trainer.sourceFile,
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesGame &&
        matchesView &&
        (!normalized || searchText.includes(normalized))
      );
    });
  }, [gameFilter, query, viewFilter]);
  const chibiCount = TRAINER_ROSTER.filter(
    (trainer) => trainer.hasChibi
  ).length;

  return (
    <motion.div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-black/[0.88] p-3 text-white backdrop-blur-lg sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trainer-archive-title"
        className="arena-panel relative flex max-h-[92svh] w-full max-w-7xl flex-col overflow-hidden border border-[#d8ff36]/[0.45] bg-[#080b10] shadow-[0_32px_120px_rgba(0,0,0,.72)]"
        style={{ clipPath: ARENA_CLIP }}
        initial={{ y: 24, opacity: 0, scale: 0.975 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0, scale: 0.985 }}
      >
        <ArenaFrameArt accent="#d8ff36" animated />
        <header className="relative z-[70] border-b border-white/[0.12] p-4 sm:p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <ArenaSigil className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
              <div>
                <p className="font-kode text-[7px] uppercase tracking-[0.2em] text-[#d8ff36]">
                  Complete Gen V archive / {label}
                </p>
                <h2
                  id="trainer-archive-title"
                  className="mt-1 font-telegraf text-2xl font-black tracking-[-0.035em] sm:text-4xl"
                >
                  Choose from every trainer sprite.
                </h2>
                <p className="mt-1.5 font-nacelle text-[10px] text-white/[0.45] sm:text-xs">
                  {TRAINER_ROSTER.length} source files · {chibiCount} overworld
                  matches · Black/White and Black 2/White 2
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close trainer archive"
              className="arena-interactive flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.18] text-white/[0.55] hover:bg-white hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/[0.32]" />
              <span className="sr-only">Search trainers</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, classes, variants, or source files"
                className="h-11 w-full border border-white/[0.14] bg-white/[0.035] pl-10 pr-3 font-nacelle text-xs text-white outline-none placeholder:text-white/[0.24] focus:border-[#d8ff36]/[0.75]"
              />
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["All", "B2W2", "BW"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setGameFilter(filter)}
                  aria-pressed={gameFilter === filter}
                  className={`arena-interactive h-11 border px-3 font-kode text-[7px] uppercase tracking-[0.14em] ${
                    gameFilter === filter
                      ? "border-[#d8ff36] bg-[#d8ff36] text-black"
                      : "border-white/[0.12] text-white/[0.45] hover:border-white/[0.35] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(["All", "front", "back"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setViewFilter(filter)}
                  aria-pressed={viewFilter === filter}
                  className={`arena-interactive h-11 border px-3 font-kode text-[7px] uppercase tracking-[0.14em] ${
                    viewFilter === filter
                      ? "border-white bg-white text-black"
                      : "border-white/[0.12] text-white/[0.45] hover:border-white/[0.35] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="scrollbar relative z-[70] min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.36]">
            <span>{filtered.length} sprites shown</span>
            <span>
              {mode === "battle" ? "Full battle mode" : "Overworld chibi mode"}
            </span>
          </div>
          {filtered.length ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11">
              {filtered.map((trainer) => {
                const isSelected = trainer.id === selected;
                return (
                  <motion.button
                    key={trainer.id}
                    type="button"
                    onClick={() => {
                      onSelect(trainer.id);
                      onClose();
                    }}
                    aria-label={
                      "Select " +
                      trainer.name +
                      ", " +
                      trainer.gameCode +
                      " " +
                      trainer.view +
                      ", as " +
                      label
                    }
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`arena-card relative min-w-0 overflow-hidden border bg-white/[0.025] p-2 text-left ${
                      isSelected
                        ? "border-[#d8ff36] bg-[#d8ff36]/[0.07]"
                        : "border-white/[0.11] hover:border-white/[0.32]"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                    }}
                  >
                    <div className="relative h-20 overflow-hidden border border-white/[0.06] bg-black/[0.36] sm:h-24">
                      <TrainerSprite
                        trainer={trainer.id}
                        mode={mode}
                        priority={false}
                        animated={false}
                        label={`${trainer.name}, ${trainer.gameCode} ${trainer.view}`}
                      />
                    </div>
                    <strong className="mt-2 block truncate font-telegraf text-[10px] font-black text-white sm:text-xs">
                      {trainer.name}
                    </strong>
                    <span className="mt-0.5 block truncate font-kode text-[6px] uppercase tracking-[0.1em] text-white/[0.36]">
                      {trainer.gameCode} · {trainer.view}
                    </span>
                    {mode === "chibi" && !trainer.hasChibi && (
                      <span className="mt-1 block font-kode text-[5px] uppercase tracking-[0.08em] text-orange-300">
                        Full-only fallback
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center bg-[#d8ff36] text-black">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center border border-dashed border-white/[0.14] text-center">
              <Search className="h-7 w-7 text-white/[0.18]" />
              <strong className="mt-3 font-telegraf text-xl font-black">
                No trainer sprites found.
              </strong>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGameFilter("All");
                  setViewFilter("All");
                }}
                className="mt-3 border border-white/[0.20] px-4 py-2 font-kode text-[7px] uppercase tracking-[0.14em] hover:bg-white hover:text-black"
              >
                Reset archive
              </button>
            </div>
          )}
        </div>

        <footer className="relative z-[70] flex flex-col justify-between gap-2 border-t border-white/[0.10] px-4 py-3 font-nacelle text-[9px] text-white/[0.38] sm:flex-row sm:items-center sm:px-6">
          <span>
            Four ensemble or special-effect sprites have no matching overworld
            file and retain their full sprite in chibi mode.
          </span>
          <a
            href="https://archives.bulbagarden.net/wiki/Category:Generation_V_Trainer_sprites"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 font-kode text-[6px] uppercase tracking-[0.14em] text-[#d8ff36] hover:text-white"
          >
            Open source archive ↗
          </a>
        </footer>
      </motion.section>
    </motion.div>
  );
};

const BattleNoticeStack = ({ notices }: { notices: BattleNotice[] }) => (
  <div className="pointer-events-none fixed left-3 top-20 z-[150] flex w-[min(390px,calc(100vw-24px))] flex-col items-start gap-3 sm:left-6 sm:top-24">
    <AnimatePresence initial={false}>
      {notices.map((notice) => (
        <motion.div
          key={notice.id}
          layout
          initial={{ x: 90, opacity: 0, scale: 0.94, rotateY: -8 }}
          animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ x: 55, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="arena-panel relative w-full overflow-hidden border bg-[#080b10]/[0.96] p-4 text-white shadow-2xl backdrop-blur-xl"
          style={{
            ["--arena-stroke" as string]: `${notice.accent}aa`,
            borderColor: `${notice.accent}88`,
            clipPath: ARENA_CLIP,
            boxShadow: `0 14px 42px rgba(0,0,0,.45), 0 0 24px ${notice.accent}20`,
          }}
        >
          <ArenaFrameArt accent={notice.accent} animated />
          <motion.span
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: notice.accent }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
          />
          <div className="grid grid-cols-[42px_1fr] gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center border bg-black/[0.35]"
              style={{ borderColor: `${notice.accent}66` }}
            >
              <ArenaSigil accent={notice.accent} className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <span
                className="font-kode text-[7px] uppercase tracking-[0.18em]"
                style={{ color: notice.accent }}
              >
                {notice.eyebrow}
              </span>
              <strong className="mt-0.5 block font-telegraf text-lg font-black leading-tight">
                {notice.title}
              </strong>
              <p className="mt-1.5 font-nacelle text-[10px] leading-relaxed text-white/[0.52]">
                {notice.detail}
              </p>
            </div>
          </div>
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: notice.accent }}
            initial={{ width: "100%" }}
            animate={{ width: 0 }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const BattleGuideModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[180] flex items-center justify-center bg-black/[0.84] p-3 text-white backdrop-blur-md sm:p-7"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-labelledby="battle-guide-title"
      className="arena-panel relative max-h-[88svh] w-full max-w-5xl overflow-y-auto border border-[#d8ff36]/[0.50] bg-[#080b10] p-5 shadow-[0_30px_100px_rgba(0,0,0,.68)] sm:p-8"
      style={{
        ["--arena-stroke" as string]: "rgba(216,255,54,.75)",
        clipPath: ARENA_CLIP,
      }}
      initial={{ y: 24, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 16, opacity: 0, scale: 0.98 }}
    >
      <ArenaFrameArt accent="#d8ff36" animated />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close battle manual"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/[0.16] text-white/[0.55] hover:bg-white hover:text-black"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-4 pr-12">
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center border border-[#d8ff36]/[0.35] bg-[#d8ff36]/[0.04] sm:flex">
          <ArenaSigil className="h-10 w-10" />
        </div>
        <div>
          <p className="font-kode text-[8px] uppercase tracking-[0.22em] text-[#d8ff36]">
            Operator manual / ruleset 02
          </p>
          <h2
            id="battle-guide-title"
            className="mt-2 font-telegraf text-3xl font-black tracking-[-0.035em] sm:text-5xl"
          >
            Build a team. Read the turn. Break the matchup.
          </h2>
        </div>
      </div>
      <CircuitRule className="mt-5 opacity-70" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [
            "01 / Draft + trainers",
            "Inspect all 40 projects, lock three, then browse all 258 Generation V source sprites for both trainer slots. Trainers are visual identities; your projects determine the stats.",
          ],
          [
            "02 / Turn order",
            "Switches and items resolve first. Priority moves beat normal moves; ties are decided by modified speed.",
          ],
          [
            "03 / Damage stack",
            "Type matchup, 1.2× native-type STAB, stat stages, random variance, barriers, then critical damage are resolved in order.",
          ],
          [
            "04 / Critical hits",
            "Critical hits deal 1.5× damage and ignore the attacker's negative ATK stages plus the defender's positive DEF stages.",
          ],
          [
            "05 / Special commands",
            "PRIORITY acts early. MULTI strikes repeatedly. PIERCE ignores DEF stages. EXECUTE surges below its listed HP threshold.",
          ],
          [
            "06 / Bag + switching",
            "Items consume the turn: heal, cure, focus, shield, or revive. Swap builds to absorb bad matchups; the rival can do both too.",
          ],
          [
            "07 / Status",
            "Burn lowers ATK and chips HP. Poison deals heavier chip damage. Sleep can stop turns. Stun has a chance to stall commands.",
          ],
          [
            "08 / Barriers + focus",
            "Null Shield halves the next damaging command. Focus Lens adds 35% critical chance to the next damaging move.",
          ],
          [
            "09 / Sprite modes",
            "The archive preserves every Generation V battle, alternate, and back sprite. 254 entries have matched overworld art; four ensemble or special-effect sprites visibly retain their full sprite in chibi mode.",
          ],
        ].map(([title, description]) => (
          <article
            key={title}
            className="arena-card relative min-h-[132px] overflow-hidden border border-white/[0.12] bg-[#0b0e14] p-4"
          >
            <ArenaFrameArt accent="#d8ff36" />
            <h3 className="relative z-10 font-kode text-[8px] uppercase tracking-[0.15em] text-[#d8ff36]">
              {title}
            </h3>
            <p className="relative z-10 mt-3 font-nacelle text-[11px] leading-relaxed text-white/[0.54]">
              {description}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-white/[0.12] pt-4 sm:flex-row sm:items-center">
        <p className="font-nacelle text-[10px] text-white/[0.38]">
          Tip: the move cards expose every special rule before you commit.
        </p>
        <a
          href="https://archives.bulbagarden.net/wiki/Category:Generation_V_Trainer_sprites"
          target="_blank"
          rel="noreferrer"
          className="font-kode text-[7px] uppercase tracking-[0.15em] text-[#d8ff36] hover:text-white"
        >
          Sprite source / Gen V archive ↗
        </a>
      </div>
    </motion.section>
  </motion.div>
);

const FocusedFighterPanel = ({
  mon,
  isSelected,
  selectedCount,
  browseIndex,
  browseTotal,
  onToggle,
  onPrevious,
  onNext,
}: {
  mon: PortfolioMon;
  isSelected: boolean;
  selectedCount: number;
  browseIndex: number;
  browseTotal: number;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const mainColor = TYPE_COLORS[mon.type1] ?? "#d8ff36";
  const profile = getProjectProfile(mon);
  const buildScore = getBuildScore(mon);

  return (
    <motion.div
      key={mon.id}
      initial={{ opacity: 0, x: -22, filter: "blur(5px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full min-h-0 min-w-0 flex-col bg-[#080b10]"
    >
      <div className="relative min-h-[220px] flex-[0.9] overflow-hidden sm:min-h-[240px]">
        <ArenaImage
          src={mon.image}
          alt={`${mon.name} large roster preview`}
          priority
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-black/45" />
        <div className="arena-scanlines absolute inset-0 opacity-30" />
        <motion.div
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          animate={{ x: ["-150%", "620%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "linear",
          }}
        />
        <div className="absolute left-4 top-4 flex max-w-[52%] flex-wrap gap-1">
          <span className="border border-white/[0.20] bg-black/[0.75] px-2 py-1 font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.60]">
            {profile.category}
          </span>
          <TypePill type={mon.type1} />
          {mon.type2 && <TypePill type={mon.type2} />}
        </div>
        <a
          href={mon.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${mon.name} project`}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center gap-2 border border-white/[0.20] bg-black/[0.80] font-kode text-[7px] uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black sm:h-auto sm:w-auto sm:px-2.5 sm:py-2"
        >
          <span className="hidden sm:inline">
            No.{String(mon.id).padStart(3, "0")} / Open build
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <div className="absolute right-4 top-14 z-10 flex items-center border border-white/[0.18] bg-black/[0.82]">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous project"
            className="flex h-8 w-8 items-center justify-center text-white/[0.55] transition hover:bg-white hover:text-black"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="border-x border-white/[0.14] px-2 font-kode text-[6px] tracking-[0.14em] text-white/[0.50]">
            {String(browseIndex + 1).padStart(2, "0")} /{" "}
            {String(browseTotal).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next project"
            className="flex h-8 w-8 items-center justify-center text-white/[0.55] transition hover:bg-white hover:text-black"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-4 right-3 font-telegraf text-[7rem] font-black leading-none opacity-[0.08] sm:text-[9rem]"
          style={{ color: mainColor }}
        >
          {String(mon.id).padStart(3, "0")}
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/[0.96] to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="max-w-[78%] font-telegraf text-4xl font-black leading-[0.88] tracking-[-0.035em] text-white sm:text-6xl">
              {mon.name}
            </h2>
            <div className="shrink-0 text-right">
              <span className="block font-kode text-[6px] uppercase tracking-[0.18em] text-white/[0.35]">
                Build index
              </span>
              <strong
                className="font-telegraf text-2xl font-black"
                style={{ color: mainColor }}
              >
                {buildScore}
              </strong>
              <span className="font-kode text-[7px] text-white/[0.30]">
                /100
              </span>
            </div>
          </div>
          <p
            className="mt-3 font-kode text-[7px] font-bold uppercase tracking-[0.13em]"
            style={{ color: mainColor }}
          >
            {profile.tagline}
          </p>
          <p className="mt-1.5 line-clamp-2 max-w-xl font-nacelle text-[11px] leading-relaxed text-white/[0.64] sm:text-xs">
            {profile.summary}
          </p>
        </div>
      </div>

      <div className="grid min-w-0 flex-1 gap-5 border-t border-white/[0.12] bg-[#0a0d12] p-4 sm:grid-cols-[0.64fr_1.36fr] sm:p-5">
        <div className="flex min-w-0 flex-col justify-between gap-4">
          <div className="space-y-2">
            <p className="mb-3 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.38]">
              Core telemetry
              <Activity className="h-3 w-3" style={{ color: mainColor }} />
            </p>
            <StatMeter
              label="HP"
              value={mon.stats.hp}
              max={350}
              color={mainColor}
            />
            <StatMeter label="ATK" value={mon.stats.atk} color={mainColor} />
            <StatMeter label="DEF" value={mon.stats.def} color={mainColor} />
            <StatMeter label="SPD" value={mon.stats.spd} color={mainColor} />
          </div>
          <div className="relative overflow-hidden border border-white/[0.10] bg-white/[0.025] p-3">
            <ArenaFrameArt accent={mainColor} />
            <span className="font-kode text-[6px] uppercase tracking-[0.13em] text-white/[0.30]">
              Build role
            </span>
            <strong className="mt-1 block font-telegraf text-[11px] font-black leading-snug text-white">
              {profile.role}
            </strong>
            <p className="mt-1.5 line-clamp-1 font-nacelle text-[8px] leading-relaxed text-white/[0.42]">
              {profile.highlights.join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            disabled={!isSelected && selectedCount >= 3}
            className={`arena-cut-outline relative flex w-full items-center justify-between px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-30 ${
              isSelected
                ? "bg-white text-black"
                : "bg-[#d8ff36] text-black hover:bg-white"
            }`}
            style={{
              ["--arena-stroke" as string]: isSelected
                ? "rgba(255,255,255,.7)"
                : mainColor,
              clipPath:
                "polygon(0 7px, 7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
            }}
          >
            <span>
              <span className="block font-kode text-[6px] uppercase tracking-[0.14em] opacity-55">
                {selectedCount}/3 team slots
              </span>
              <strong className="block whitespace-nowrap font-telegraf text-[11px] font-black leading-none">
                {isSelected
                  ? "Remove from team"
                  : selectedCount >= 3
                  ? "Team is full"
                  : "Lock into team"}
              </strong>
            </span>
            {isSelected ? (
              <X className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="min-w-0">
          <p className="mb-2.5 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.38]">
            Signature commands <span>04 loaded</span>
          </p>
          <div className="grid min-w-0 grid-cols-2 gap-2">
            {mon.moves.map((move, index) => {
              const moveColor = TYPE_COLORS[move.type] ?? "#64748b";
              const effectLabel =
                move.effect?.type ?? move.selfEffect?.type ?? "direct";
              return (
                <motion.div
                  key={move.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.045 }}
                  className="arena-card group relative min-h-[96px] min-w-0 overflow-hidden border p-3"
                  style={{
                    ["--arena-stroke" as string]: `${moveColor}88`,
                    borderColor: `${moveColor}72`,
                    background: `linear-gradient(135deg, ${moveColor}24, rgba(255,255,255,.018) 64%)`,
                    clipPath:
                      "polygon(0 7px, 7px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
                  }}
                >
                  <ArenaFrameArt accent={moveColor} />
                  <span
                    className="absolute inset-y-0 left-0 w-0.5 transition-all group-hover:w-1"
                    style={{ backgroundColor: moveColor }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-telegraf text-xs font-black leading-tight text-white">
                      {move.name}
                    </p>
                    <TypePill type={move.type} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 font-nacelle text-[9px] leading-snug text-white/[0.52]">
                    {move.description}
                  </p>
                  <div className="mt-2.5 grid grid-cols-3 gap-1 font-kode text-[6px] uppercase tracking-[0.08em] text-white/[0.40]">
                    <span>{move.power ? `PWR ${move.power}` : "Utility"}</span>
                    <span className="text-center">
                      {Math.round(move.accuracy * 100)}% ACC
                    </span>
                    <span className="text-right" style={{ color: moveColor }}>
                      {effectLabel}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RosterSelect = ({
  selectedIds,
  focusedId,
  playerTrainer,
  cpuTrainer,
  trainerMode,
  onFocus,
  onToggle,
  onPlayerTrainer,
  onCpuTrainer,
  onRandom,
  onBegin,
}: {
  selectedIds: number[];
  focusedId: number;
  playerTrainer: TrainerId;
  cpuTrainer: TrainerId;
  trainerMode: TrainerRenderMode;
  onFocus: (id: number) => void;
  onToggle: (id: number) => void;
  onPlayerTrainer: (id: TrainerId) => void;
  onCpuTrainer: (id: TrainerId) => void;
  onRandom: () => void;
  onBegin: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [trainerBrowser, setTrainerBrowser] = useState<"player" | "cpu" | null>(
    null
  );
  const filteredMons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return portfolioMonData.filter((mon) => {
      const profile = getProjectProfile(mon);
      const matchesType =
        activeType === "All" ||
        mon.type1 === activeType ||
        mon.type2 === activeType;
      const matchesFavorite = !favoritesOnly || Boolean(mon.favorite);
      const searchable = [
        mon.name,
        mon.description,
        mon.type1,
        mon.type2 ?? "",
        profile.tagline,
        profile.category,
        profile.role,
        profile.summary,
        ...profile.highlights,
        ...mon.moves.flatMap((move) => [
          move.name,
          move.description,
          move.type,
        ]),
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesType &&
        matchesFavorite &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [activeType, favoritesOnly, query]);
  const browseMons = filteredMons.length ? filteredMons : portfolioMonData;
  const focused =
    browseMons.find((mon) => mon.id === focusedId) ?? browseMons[0]!;
  const browseIndex = Math.max(
    0,
    browseMons.findIndex((mon) => mon.id === focused.id)
  );
  const selected = getMons(selectedIds);
  const draftMetrics = getTeamMetrics(selected.map((mon) => ({ mon })));

  useEffect(() => {
    if (
      filteredMons.length &&
      !filteredMons.some((mon) => mon.id === focusedId)
    ) {
      onFocus(filteredMons[0]!.id);
    }
  }, [filteredMons, focusedId, onFocus]);

  const browseBy = (offset: number) => {
    const nextIndex =
      (browseIndex + offset + browseMons.length) % browseMons.length;
    onFocus(browseMons[nextIndex]!.id);
  };

  return (
    <>
      <motion.div
        key="select"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.985 }}
        className="relative z-10 flex min-h-[calc(100svh-68px)] flex-col px-3 py-4 sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:py-6"
      >
        <div className="mx-auto mb-5 flex w-full max-w-[1600px] items-end justify-between gap-5 px-1 sm:mb-6">
          <div className="flex items-end gap-5">
            <div>
              <p className="flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.22em] text-[#d8ff36]">
                <ScanLine className="h-3.5 w-3.5" /> Player one / Draft three
              </p>
              <h1 className="mt-2 font-telegraf text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">
                Assemble your trio.
              </h1>
            </div>
            <div className="mb-1 hidden items-center gap-3 border-l border-white/[0.15] pl-5 xl:flex">
              <div>
                <strong className="block font-telegraf text-xl font-black text-white">
                  {portfolioMonData.length}
                </strong>
                <span className="font-kode text-[6px] uppercase tracking-[0.15em] text-white/[0.35]">
                  Builds indexed
                </span>
              </div>
              <div>
                <strong className="block font-telegraf text-xl font-black text-white">
                  09
                </strong>
                <span className="font-kode text-[6px] uppercase tracking-[0.15em] text-white/[0.35]">
                  Native types
                </span>
              </div>
              <div>
                <strong className="block font-telegraf text-xl font-black text-white">
                  {TRAINER_ROSTER.length}
                </strong>
                <span className="font-kode text-[6px] uppercase tracking-[0.15em] text-white/[0.35]">
                  Trainer sprites
                </span>
              </div>
            </div>
          </div>
          <div className="hidden w-[560px] grid-cols-2 gap-3 lg:grid">
            <TrainerSelector
              label="Your trainer"
              value={playerTrainer}
              mode={trainerMode}
              onChange={onPlayerTrainer}
              onBrowse={() => setTrainerBrowser("player")}
            />
            <TrainerSelector
              label="Rival"
              value={cpuTrainer}
              mode={trainerMode}
              onChange={onCpuTrainer}
              onBrowse={() => setTrainerBrowser("cpu")}
              reversed
            />
          </div>
        </div>

        <div className="mx-auto mb-4 grid w-full max-w-[1600px] gap-3 sm:grid-cols-2 lg:hidden">
          <TrainerSelector
            label="Your trainer"
            value={playerTrainer}
            mode={trainerMode}
            onChange={onPlayerTrainer}
            onBrowse={() => setTrainerBrowser("player")}
          />
          <TrainerSelector
            label="Rival"
            value={cpuTrainer}
            mode={trainerMode}
            onChange={onCpuTrainer}
            onBrowse={() => setTrainerBrowser("cpu")}
            reversed
          />
        </div>

        <div className="mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 gap-4 lg:h-[calc(100svh-218px)] lg:flex-none lg:grid-cols-[minmax(380px,0.92fr)_minmax(0,1.58fr)]">
          <div
            className="arena-cut-outline arena-panel relative min-h-[460px] min-w-0 overflow-hidden border bg-[#090c12] sm:min-h-[520px] lg:min-h-[460px]"
            style={{
              ["--arena-accent" as string]:
                TYPE_COLORS[focused.type1] ?? "#d8ff36",
              ["--arena-stroke" as string]: `${
                TYPE_COLORS[focused.type1] ?? "#d8ff36"
              }88`,
              borderColor: `${TYPE_COLORS[focused.type1] ?? "#d8ff36"}66`,
              clipPath: ARENA_CLIP,
            }}
          >
            <ArenaFrameArt
              accent={TYPE_COLORS[focused.type1] ?? "#d8ff36"}
              animated
            />
            <FocusedFighterPanel
              mon={focused}
              isSelected={selectedIds.includes(focused.id)}
              selectedCount={selected.length}
              browseIndex={browseIndex}
              browseTotal={browseMons.length}
              onToggle={() => onToggle(focused.id)}
              onPrevious={() => browseBy(-1)}
              onNext={() => browseBy(1)}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <div
              className="scrollbar relative min-h-[360px] flex-1 overflow-y-auto border border-white/[0.15] bg-black/[0.30] p-3 sm:min-h-[420px] sm:p-4 lg:min-h-[350px]"
              style={{
                ["--arena-stroke" as string]: "rgba(255,255,255,.28)",
                clipPath: ARENA_CLIP,
              }}
            >
              <ArenaFrameArt accent="#d8ff36" />
              <div className="sticky top-0 z-20 mb-4 space-y-3 border-b border-white/[0.10] bg-[#07090d]/[0.96] px-1 pb-3 pt-1 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-3.5 w-3.5 text-[#d8ff36]" />
                    <span className="font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.55]">
                      Build registry / inspect before locking
                    </span>
                  </div>
                  <span className="shrink-0 font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.30]">
                    {filteredMons.length} shown · {selected.length}/3 locked
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <label className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/[0.35]" />
                    <span className="sr-only">Search project archive</span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search projects, capabilities, or moves"
                      className="h-9 w-full border border-white/[0.14] bg-white/[0.035] pl-8 pr-3 font-nacelle text-[11px] text-white outline-none placeholder:text-white/[0.25] focus:border-[#d8ff36]/[0.70]"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFavoritesOnly((current) => !current)}
                    aria-pressed={favoritesOnly}
                    className={`flex h-9 shrink-0 items-center gap-1.5 border px-3 font-kode text-[7px] uppercase tracking-[0.12em] transition ${
                      favoritesOnly
                        ? "border-[#d8ff36] bg-[#d8ff36] text-black"
                        : "border-white/[0.14] text-white/[0.55] hover:border-white/[0.35] hover:text-white"
                    }`}
                  >
                    <Star
                      className="h-3 w-3"
                      fill={favoritesOnly ? "currentColor" : "none"}
                    />
                    <span className="hidden sm:inline">Favorites</span>
                  </button>
                </div>
                <div className="scrollbar flex gap-1 overflow-x-auto pb-0.5">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveType(type)}
                      aria-pressed={activeType === type}
                      className={`shrink-0 border px-2 py-1 font-kode text-[6px] uppercase tracking-[0.12em] transition ${
                        activeType === type
                          ? "border-white bg-white text-black"
                          : "border-white/[0.10] text-white/[0.38] hover:border-white/[0.28] hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {filteredMons.length ? (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                  {filteredMons.map((mon) => {
                    const selectedIndex = selectedIds.indexOf(mon.id);
                    const isSelected = selectedIndex >= 0;
                    const isFocused = focused.id === mon.id;
                    const typeColor = TYPE_COLORS[mon.type1] ?? "#64748b";
                    return (
                      <motion.button
                        key={mon.id}
                        type="button"
                        onMouseEnter={() => onFocus(mon.id)}
                        onFocus={() => onFocus(mon.id)}
                        onClick={() => onFocus(mon.id)}
                        aria-current={isFocused ? "true" : undefined}
                        aria-label={`Inspect ${mon.name}`}
                        whileHover={{ y: -3, scale: 1.015 }}
                        whileTap={{ scale: 0.96 }}
                        className="arena-interactive group relative aspect-square overflow-hidden border bg-black"
                        style={{
                          ["--arena-stroke" as string]:
                            isFocused || isSelected
                              ? typeColor
                              : `${typeColor}66`,
                          clipPath:
                            "polygon(0 7px, 7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
                          borderColor:
                            isFocused || isSelected
                              ? typeColor
                              : `${typeColor}55`,
                          boxShadow: isFocused
                            ? `0 0 0 1px ${typeColor}, 0 0 22px ${typeColor}35`
                            : undefined,
                        }}
                      >
                        <ArenaImage
                          src={mon.image}
                          alt={mon.name}
                          sizes="110px"
                          className="absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="arena-scanlines absolute inset-0 opacity-0 transition-opacity group-hover:opacity-35" />
                        <span
                          className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5"
                          style={{ backgroundColor: typeColor }}
                        />
                        <span className="absolute inset-x-1.5 bottom-1.5 truncate text-left font-telegraf text-[10px] font-black text-white sm:text-xs">
                          {mon.name}
                        </span>
                        <span className="absolute left-1 top-1 bg-black/[0.80] px-1 font-kode text-[6px] text-white/[0.65]">
                          {String(mon.id).padStart(3, "0")}
                        </span>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center border border-white bg-black font-kode text-[8px] font-bold text-white"
                            style={{ boxShadow: `0 0 16px ${typeColor}` }}
                          >
                            {selectedIndex + 1}
                          </motion.span>
                        )}
                        {isSelected && (
                          <motion.span
                            className="pointer-events-none absolute inset-0 border-2"
                            style={{ borderColor: typeColor }}
                            initial={{ opacity: 0.9, scale: 0.86 }}
                            animate={{ opacity: 0, scale: 1.08 }}
                            transition={{ duration: 0.55 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center border border-dashed border-white/[0.14] px-6 text-center">
                  <Search className="h-6 w-6 text-white/[0.20]" />
                  <p className="mt-3 font-telegraf text-lg font-black text-white">
                    No matching builds.
                  </p>
                  <p className="mt-1 max-w-xs font-nacelle text-[10px] leading-relaxed text-white/[0.38]">
                    Try another capability, clear the query, or show the full
                    archive.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveType("All");
                      setFavoritesOnly(false);
                    }}
                    className="mt-3 border border-white/[0.20] px-3 py-2 font-kode text-[7px] uppercase tracking-[0.14em] text-white hover:bg-white hover:text-black"
                  >
                    Reset archive
                  </button>
                </div>
              )}
            </div>

            <div
              className="relative grid gap-4 overflow-hidden border border-white/[0.15] bg-[#090c12] p-4 sm:grid-cols-[1fr_auto] sm:p-5 lg:p-4"
              style={{
                ["--arena-stroke" as string]: "rgba(255,255,255,.30)",
                clipPath: ARENA_CLIP,
              }}
            >
              <ArenaFrameArt
                accent="#d8ff36"
                animated={selected.length === 3}
              />
              <div>
                <div className="mb-2 flex items-center justify-between px-0.5">
                  <span className="flex items-center gap-1.5 font-kode text-[7px] uppercase tracking-[0.17em] text-white/[0.45]">
                    <LockKeyhole className="h-3 w-3 text-[#d8ff36]" /> Launch
                    order
                  </span>
                  <span className="hidden font-kode text-[6px] uppercase tracking-[0.12em] text-white/[0.30] md:block">
                    {selected.length
                      ? `${draftMetrics.hp} HP · ${draftMetrics.types} types · ${draftMetrics.spd} avg SPD`
                      : "Awaiting first lock"}
                  </span>
                </div>
                <TeamSlots selected={selected} onRemove={onToggle} />
              </div>
              <div className="flex gap-2 sm:w-56 sm:flex-col">
                <button
                  type="button"
                  onClick={onRandom}
                  className="flex flex-1 items-center justify-center gap-2 border border-white/[0.20] px-4 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-white transition hover:border-[#d8ff36] hover:text-[#d8ff36]"
                >
                  <Shuffle className="h-4 w-4" /> Randomize
                </button>
                <button
                  type="button"
                  onClick={onBegin}
                  disabled={selected.length !== 3}
                  className="arena-cut-outline group relative flex flex-[1.4] items-center justify-between overflow-hidden bg-[#d8ff36] px-4 py-3 text-left text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/[0.10] disabled:text-white/[0.25]"
                  style={{
                    ["--arena-stroke" as string]: "rgba(216,255,54,.8)",
                    clipPath: ARENA_CLIP,
                  }}
                >
                  {selected.length === 3 && (
                    <motion.span
                      className="absolute inset-y-0 w-12 bg-white/[0.50] blur-md"
                      animate={{ x: [-90, 260] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                      }}
                    />
                  )}
                  <span>
                    <span className="block font-kode text-[7px] uppercase tracking-[0.16em] opacity-55">
                      {selected.length}/3 locked
                    </span>
                    <span className="relative font-telegraf text-lg font-black">
                      {selected.length === 3 ? "Launch match" : "Lock trio"}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {trainerBrowser && (
          <TrainerArchiveModal
            label={trainerBrowser === "player" ? "Your trainer" : "Rival"}
            selected={trainerBrowser === "player" ? playerTrainer : cpuTrainer}
            mode={trainerMode}
            onSelect={
              trainerBrowser === "player" ? onPlayerTrainer : onCpuTrainer
            }
            onClose={() => setTrainerBrowser(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const VersusScreen = ({
  player,
  cpu,
  playerTrainerId,
  cpuTrainerId,
  trainerMode,
  onStart,
}: {
  player: ArenaSide;
  cpu: ArenaSide;
  playerTrainerId: TrainerId;
  cpuTrainerId: TrainerId;
  trainerMode: TrainerRenderMode;
  onStart: () => void;
}) => {
  const playerTrainer = getTrainer(playerTrainerId);
  const cpuTrainer = getTrainer(cpuTrainerId);
  const sides = [
    {
      key: "player",
      side: player,
      label: `Player one / ${playerTrainer.name}`,
      role: "Selected builds",
      accent: "#41d9ff",
      trainer: playerTrainerId,
      trainerLabel: `${playerTrainer.name}, ${playerTrainer.title}`,
    },
    {
      key: "cpu",
      side: cpu,
      label: `${cpuTrainer.title} / ${cpuTrainer.name}`,
      role: "Adaptive counter-team",
      accent: "#ff4f9a",
      trainer: cpuTrainerId,
      trainerLabel: `${cpuTrainer.name}, ${cpuTrainer.title}`,
    },
  ];

  return (
    <motion.div
      key="versus"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
      className="relative z-10 flex min-h-[calc(100svh-68px)] flex-col items-center justify-center overflow-y-auto px-3 py-4 text-white sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:py-5"
    >
      <BattlefieldVector playerColor="#41d9ff" cpuColor="#ff4f9a" />
      <motion.div
        className="absolute inset-y-0 left-0 w-[58%] bg-cyan-400/[0.08]"
        style={{ clipPath: "polygon(0 0, 82% 0, 100% 100%, 0 100%)" }}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.65, ease: "circOut" }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-[58%] bg-pink-500/[0.08]"
        style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.65, ease: "circOut" }}
      />
      <motion.div
        className="absolute inset-y-[-20%] left-1/2 w-px -translate-x-1/2 bg-[#d8ff36]/[0.50]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1, rotate: 7 }}
        transition={{ delay: 0.35, duration: 0.55 }}
      />

      <div className="relative w-full max-w-[1500px]">
        <div className="mb-3 flex items-end justify-between gap-5 px-1">
          <div>
            <p className="flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.2em] text-[#d8ff36]">
              <Sparkles className="h-3.5 w-3.5" /> Match compiler / seeded
            </p>
            <h1 className="mt-2 font-telegraf text-3xl font-black tracking-[-0.04em] sm:text-4xl xl:text-5xl">
              Systems about to collide.
            </h1>
          </div>
          <div className="hidden text-right sm:block">
            <span className="font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.35]">
              Arena handshake
            </span>
            <p className="mt-1 flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.16em] text-white/[0.65]">
              <Signal className="h-3 w-3 text-[#d8ff36]" /> Both teams online
            </p>
          </div>
        </div>

        <div className="relative grid items-stretch gap-4 lg:grid-cols-[1fr_176px_1fr] lg:gap-5">
          {sides.map((config, sideIndex) => {
            const metrics = getTeamMetrics(config.side.team);
            const lead = config.side.team[0]!;
            const reversed = sideIndex === 1;
            return (
              <motion.section
                key={config.key}
                initial={{ x: reversed ? 120 : -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`arena-cut-outline arena-panel relative overflow-hidden border bg-[#080b10]/[0.95] ${
                  reversed ? "order-3" : "order-1"
                }`}
                style={{
                  ["--arena-accent" as string]: config.accent,
                  ["--arena-stroke" as string]: `${config.accent}99`,
                  borderColor: `${config.accent}62`,
                  clipPath: reversed
                    ? "polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)"
                    : "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
                }}
              >
                <ArenaFrameArt accent={config.accent} animated />
                <div
                  className={`relative z-10 flex items-center justify-between border-b px-5 py-3.5 ${
                    reversed ? "flex-row-reverse text-right" : ""
                  }`}
                  style={{ borderColor: `${config.accent}3d` }}
                >
                  <div>
                    <span className="font-kode text-[7px] uppercase tracking-[0.18em] text-white/[0.35]">
                      {config.role}
                    </span>
                    <p className="font-telegraf text-base font-black text-white">
                      {config.label}
                    </p>
                  </div>
                  <span
                    className="flex h-8 w-8 items-center justify-center border font-kode text-[8px] font-bold"
                    style={{ borderColor: config.accent, color: config.accent }}
                  >
                    P{sideIndex + 1}
                  </span>
                </div>

                <div className="relative h-[150px] overflow-hidden sm:h-[190px] xl:h-[205px]">
                  <ArenaImage
                    src={lead.mon.image}
                    alt={`${lead.mon.name} lead build`}
                    priority
                    sizes="(min-width: 1024px) 42vw, 92vw"
                    className="absolute inset-0"
                  />
                  <div
                    className={`absolute inset-0 ${
                      reversed
                        ? "bg-gradient-to-l from-[#080b10] via-transparent to-black/20"
                        : "bg-gradient-to-r from-[#080b10] via-transparent to-black/20"
                    }`}
                  />
                  <div className="arena-scanlines absolute inset-0 opacity-25" />
                  <span
                    className={`absolute top-4 font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.45] ${
                      reversed ? "right-4" : "left-4"
                    }`}
                  >
                    Lead build / No.{String(lead.mon.id).padStart(3, "0")}
                  </span>
                  <div
                    className={`absolute bottom-5 max-w-[78%] ${
                      reversed ? "right-5 text-right" : "left-5"
                    }`}
                  >
                    <h2 className="font-telegraf text-3xl font-black leading-[0.88] tracking-[-0.035em] text-white sm:text-4xl xl:text-5xl">
                      {lead.mon.name}
                    </h2>
                    <div
                      className={`mt-3 flex gap-1 ${
                        reversed ? "justify-end" : ""
                      }`}
                    >
                      <TypePill type={lead.mon.type1} />
                      {lead.mon.type2 && <TypePill type={lead.mon.type2} />}
                    </div>
                  </div>
                  <strong
                    className={`absolute bottom-4 font-telegraf text-2xl font-black ${
                      reversed ? "left-4" : "right-4"
                    }`}
                    style={{ color: config.accent }}
                  >
                    {getBuildScore(lead.mon)}
                  </strong>
                </div>

                <div className="hidden grid-cols-2 gap-px border-y border-white/[0.10] bg-white/[0.10] sm:grid">
                  {config.side.team.slice(1).map((fighter, index) => (
                    <motion.div
                      key={fighter.mon.id}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 + index * 0.1 }}
                      className={`grid items-center bg-[#090c12] ${
                        reversed
                          ? "grid-cols-[1fr_64px] text-right"
                          : "grid-cols-[64px_1fr]"
                      }`}
                    >
                      <ArenaImage
                        src={fighter.mon.image}
                        alt={fighter.mon.name}
                        priority
                        sizes="80px"
                        className={`relative aspect-square ${
                          reversed ? "order-2" : ""
                        }`}
                      />
                      <div
                        className={`min-w-0 px-3 ${reversed ? "order-1" : ""}`}
                      >
                        <span className="font-kode text-[6px] uppercase tracking-[0.13em] text-white/[0.30]">
                          Reserve / 0{index + 2}
                        </span>
                        <p className="truncate font-telegraf text-sm font-black text-white">
                          {fighter.mon.name}
                        </p>
                        <p className="font-kode text-[6px] uppercase tracking-[0.1em] text-white/[0.35]">
                          {fighter.mon.type1} · IDX {getBuildScore(fighter.mon)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="hidden grid-cols-5 gap-px bg-white/[0.10] sm:grid">
                  {[
                    [metrics.hp, "HP"],
                    [metrics.atk, "ATK"],
                    [metrics.def, "DEF"],
                    [metrics.spd, "SPD"],
                    [metrics.types, "TYPES"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="bg-[#0b0e14] px-2 py-1.5 text-center"
                    >
                      <strong className="block font-telegraf text-sm font-black text-white">
                        {value}
                      </strong>
                      <span className="font-kode text-[5px] uppercase tracking-[0.12em] text-white/[0.30]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}

          <div className="relative z-20 order-2 flex min-h-[126px] items-center justify-center lg:min-h-[140px]">
            <VersusCore />
            <div className="absolute -left-2 bottom-0 h-24 w-20 lg:-left-7 lg:h-32 lg:w-24">
              <TrainerSprite
                trainer={playerTrainerId}
                mode={trainerMode}
                label={`${playerTrainer.name}, ${playerTrainer.title}`}
              />
            </div>
            <div className="absolute -right-2 bottom-0 h-24 w-20 lg:-right-7 lg:h-32 lg:w-24">
              <TrainerSprite
                trainer={cpuTrainerId}
                mode={trainerMode}
                flip
                label={`${cpuTrainer.name}, ${cpuTrainer.title}`}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-3 flex flex-col items-center">
          <button
            type="button"
            onClick={onStart}
            className="arena-interactive group relative z-10 flex min-w-[280px] items-center justify-between overflow-hidden bg-[#d8ff36] px-7 py-3 text-black transition hover:-translate-y-0.5 hover:bg-white"
            style={{
              ["--arena-stroke" as string]: "rgba(216,255,54,.9)",
              clipPath: ARENA_CLIP,
            }}
          >
            <ArenaFrameArt accent="#07090d" />
            <span className="text-left">
              <span className="block font-kode text-[6px] uppercase tracking-[0.18em] opacity-55">
                Auto launch / 03.2 sec
              </span>
              <span className="font-telegraf text-lg font-black">
                Enter arena
              </span>
            </span>
            <Zap className="h-4 w-4 transition group-hover:rotate-12" />
          </button>
          <div className="mt-1.5 h-px w-full max-w-sm overflow-hidden bg-white/[0.10]">
            <motion.div
              className="h-full bg-[#d8ff36]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.2, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MoveButton = ({
  move,
  effectiveness,
  disabled,
  onClick,
}: {
  move: BattleReadyMove;
  effectiveness: number;
  disabled: boolean;
  onClick: () => void;
}) => {
  const color = TYPE_COLORS[move.type] ?? "#64748b";
  const specialRules = [
    move.priority ? `Priority +${move.priority}` : null,
    move.hits ? `${move.hits.min}–${move.hits.max} hits` : null,
    move.piercing ? `${Math.round(move.piercing * 100)}% pierce` : null,
    move.executeThreshold
      ? `Execute <${Math.round(move.executeThreshold * 100)}%`
      : null,
    move.effect?.type,
    move.selfEffect?.type,
  ].filter((rule): rule is string => Boolean(rule));
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || move.currentPp <= 0}
      whileHover={disabled ? undefined : { y: -3, scale: 1.008 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className="arena-card group relative overflow-hidden border p-3 text-left text-white disabled:cursor-not-allowed disabled:opacity-25 lg:h-[96px]"
      style={{
        ["--arena-stroke" as string]: `${color}88`,
        clipPath:
          "polygon(0 9px, 9px 0, calc(100% - 18px) 0, calc(100% - 10px) 8px, 100% 8px, 100% 100%, 0 100%)",
        borderColor: `${color}68`,
        background: `linear-gradient(130deg, ${color}16, #11141a 58%)`,
      }}
    >
      <ArenaFrameArt accent={color} />
      <span
        className="absolute inset-y-0 left-0 w-1 transition-all group-hover:w-2"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="font-kode text-[7px] uppercase tracking-[0.15em]"
            style={{ color }}
          >
            {move.type} / {move.power ? `PWR ${move.power}` : "Utility"}
          </span>
          <p className="mt-1 font-telegraf text-sm font-black tracking-[-0.01em] sm:text-base">
            {move.name}
          </p>
          <p className="mt-1 line-clamp-1 font-nacelle text-[9px] leading-snug text-white/[0.38]">
            {move.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="block font-kode text-[7px] text-white/[0.45]">
            {move.currentPp}/{move.pp}
          </span>
          <span className="font-kode text-[5px] uppercase tracking-[0.1em] text-white/[0.25]">
            PP
          </span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 items-center gap-2 border-t border-white/[0.08] pt-2 font-kode text-[7px] uppercase tracking-[0.1em] text-white/[0.35]">
        <span className="flex items-center gap-1">
          <Target className="h-2.5 w-2.5" /> {Math.round(move.accuracy * 100)}%
        </span>
        <span
          className="truncate text-center font-bold"
          style={{ color }}
          title={specialRules.join(" · ")}
        >
          {specialRules[0] ?? "direct"}
        </span>
        <span
          className={`text-right ${
            effectiveness > 1
              ? "text-[#d8ff36]"
              : effectiveness < 1
              ? "text-orange-300"
              : ""
          }`}
        >
          {effectiveness > 1 ? "WEAK" : effectiveness < 1 ? "RESIST" : "EVEN"}{" "}
          {effectiveness}×
        </span>
      </div>
      <ArenaSigil
        accent={`${color}88`}
        className="pointer-events-none absolute -bottom-2 -right-2 h-14 w-14 opacity-20 transition duration-300 group-hover:rotate-45 group-hover:opacity-40"
      />
    </motion.button>
  );
};

const TeamSwitchRail = ({
  side,
  disabled,
  onSwitch,
}: {
  side: ArenaSide;
  disabled: boolean;
  onSwitch: (index: number) => void;
}) => (
  <div className="grid grid-cols-3 gap-1.5">
    {side.team.map((fighter, index) => {
      const active = side.activeIndex === index;
      const fainted = fighter.currentHp <= 0;
      return (
        <button
          key={fighter.mon.id}
          type="button"
          onClick={() => onSwitch(index)}
          disabled={disabled || active || fainted}
          className={`arena-card relative grid min-w-0 grid-cols-[34px_1fr] items-center gap-2.5 overflow-hidden border p-2 text-left transition ${
            active
              ? "border-[#d8ff36]/[0.80] bg-[#d8ff36]/[0.07]"
              : "border-white/[0.10] bg-white/[0.02] hover:border-white/[0.35] disabled:opacity-30"
          }`}
          style={{
            ["--arena-stroke" as string]: active
              ? "rgba(216,255,54,.8)"
              : "rgba(255,255,255,.20)",
            clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <ArenaFrameArt accent={active ? "#d8ff36" : "#ffffff"} />
          <ArenaImage
            src={fighter.mon.image}
            alt=""
            sizes="30px"
            className="relative aspect-square"
          />
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate font-telegraf text-[9px] font-bold text-white sm:text-[10px]">
                {fighter.mon.name}
              </p>
              <span className="font-kode text-[6px] text-white/[0.35]">
                {fighter.currentHp}HP
              </span>
            </div>
            <div className="mt-1 h-1 bg-white/[0.10]">
              <div
                className="h-full"
                style={{
                  width: `${Math.max(
                    0,
                    (fighter.currentHp / fighter.mon.hp) * 100
                  )}%`,
                  backgroundColor: active ? "#d8ff36" : "#fff",
                }}
              />
            </div>
            <span className="mt-0.5 block truncate font-kode text-[5px] uppercase tracking-[0.09em] text-white/[0.25]">
              {active ? "Active" : fainted ? "Offline" : fighter.mon.type1}
            </span>
          </div>
        </button>
      );
    })}
  </div>
);

const BattleBag = ({
  inventory,
  side,
  disabled,
  onUse,
}: {
  inventory: BattleInventory;
  side: ArenaSide;
  disabled: boolean;
  onUse: (itemId: BattleItemId) => void;
}) => {
  const active = side.team[side.activeIndex]!;
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
      {BATTLE_ITEMS.map((item) => {
        const quantity = inventory[item.id];
        const hasFainted = side.team.some((fighter) => fighter.currentHp <= 0);
        const useless =
          item.id === "rollback"
            ? !hasFainted
            : item.id === "patch-kit"
            ? active.currentHp >= active.mon.hp
            : item.id === "full-restore"
            ? active.currentHp >= active.mon.hp && !active.status
            : false;
        return (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => onUse(item.id)}
            disabled={disabled || quantity <= 0 || useless}
            whileHover={disabled ? undefined : { y: -2 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            className="arena-card relative min-h-[88px] overflow-hidden border p-3 text-left text-white transition disabled:cursor-not-allowed disabled:opacity-25"
            style={{
              ["--arena-stroke" as string]: `${item.accent}88`,
              borderColor: `${item.accent}55`,
              background: `linear-gradient(130deg, ${item.accent}14, #11141a 64%)`,
              clipPath:
                "polygon(0 8px, 8px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
            }}
          >
            <ArenaFrameArt accent={item.accent} />
            <span
              className="absolute inset-y-0 left-0 w-1"
              style={{ backgroundColor: item.accent }}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="font-kode text-[6px] uppercase tracking-[0.14em]"
                  style={{ color: item.accent }}
                >
                  {item.short}
                </span>
                <strong className="mt-0.5 block font-telegraf text-sm font-black">
                  {item.name}
                </strong>
              </div>
              <span className="border border-white/[0.18] px-1.5 py-1 font-kode text-[7px]">
                ×{quantity}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 font-nacelle text-[8px] text-white/[0.38]">
              {item.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
};

const BattlePlatform = ({ color }: { color: string }) => (
  <div className="pointer-events-none absolute -bottom-[8%] left-[-5%] h-[34%] w-[110%]">
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 520 150"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full overflow-visible"
      fill="none"
      animate={{ opacity: [0.66, 1, 0.66] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse
        cx="260"
        cy="76"
        rx="247"
        ry="63"
        stroke={color}
        strokeOpacity=".78"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <motion.ellipse
        cx="260"
        cy="76"
        rx="205"
        ry="46"
        stroke={color}
        strokeOpacity=".62"
        strokeDasharray="8 14 2 14"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        animate={{ strokeDashoffset: [0, -76] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <ellipse
        cx="260"
        cy="76"
        rx="148"
        ry="30"
        fill={color}
        fillOpacity=".08"
        stroke={color}
        strokeOpacity=".34"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M14 76h86m320 0h86M260 13v22m0 82v22"
        stroke={color}
        strokeOpacity=".7"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="m260 64 18 12-18 12-18-12Z"
        fill={color}
        fillOpacity=".18"
        stroke={color}
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
    <div
      className="absolute inset-x-[12%] bottom-[2%] h-[54%] rounded-[50%] blur-xl"
      style={{ backgroundColor: `${color}24` }}
    />
  </div>
);

const BattleScreen = ({
  player,
  cpu,
  playerTrainerId,
  cpuTrainerId,
  trainerMode,
  inventory,
  turn,
  log,
  busy,
  fighterState,
  aiReadout,
  onMove,
  onSwitch,
  onItem,
}: {
  player: ArenaSide;
  cpu: ArenaSide;
  playerTrainerId: TrainerId;
  cpuTrainerId: TrainerId;
  trainerMode: TrainerRenderMode;
  inventory: BattleInventory;
  turn: number;
  log: string[];
  busy: boolean;
  fighterState: { player: FighterState; cpu: FighterState };
  aiReadout: string;
  onMove: (moveIndex: number) => void;
  onSwitch: (fighterIndex: number) => void;
  onItem: (itemId: BattleItemId) => void;
}) => {
  const [commandMode, setCommandMode] = useState<CommandMode>("moves");
  const playerFighter = player.team[player.activeIndex]!;
  const cpuFighter = cpu.team[cpu.activeIndex]!;
  const playerTrainer = getTrainer(playerTrainerId);
  const cpuTrainer = getTrainer(cpuTrainerId);
  const advisorTrainer =
    TRAINER_ROSTER.find(
      (trainer) =>
        trainer.id !== playerTrainerId &&
        trainer.id !== cpuTrainerId &&
        trainer.view === "front"
    ) ?? getTrainer("bianca");
  const playerColor = TYPE_COLORS[playerFighter.mon.type1] ?? "#22c55e";
  const cpuColor = TYPE_COLORS[cpuFighter.mon.type1] ?? "#ec4899";
  const backgroundIndex =
    (((player.team[0]?.mon.id ?? 0) + (cpu.team[0]?.mon.id ?? 0)) % 6) + 1;
  const playerTrainerState =
    fighterState.player === "attack" || fighterState.player === "switch"
      ? "commanding"
      : fighterState.player === "faint"
      ? "lose"
      : "idle";
  const cpuTrainerState =
    fighterState.cpu === "attack" || fighterState.cpu === "switch"
      ? "commanding"
      : fighterState.cpu === "faint"
      ? "lose"
      : "idle";

  useEffect(() => {
    if (busy) setCommandMode("moves");
  }, [busy]);

  return (
    <motion.div
      key="battle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-[calc(100svh-68px)] text-white sm:min-h-[calc(100svh-5rem)]"
    >
      <div className="relative mx-auto grid min-h-[calc(100svh-68px)] max-w-[1600px] grid-rows-[minmax(490px,1fr)_auto] gap-3 p-3 sm:min-h-[calc(100svh-5rem)] sm:gap-4 sm:p-4 lg:grid-rows-[minmax(320px,1fr)_auto]">
        <motion.section
          className="arena-panel relative min-h-0 overflow-hidden border border-white/[0.12] bg-black shadow-[0_24px_70px_rgba(0,0,0,.34)]"
          animate={
            fighterState.player === "hit" || fighterState.cpu === "hit"
              ? { x: [0, -5, 5, -3, 3, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.35 }}
          style={{
            ["--arena-accent" as string]: playerColor,
            ["--arena-stroke" as string]: `${playerColor}88`,
            clipPath: ARENA_CLIP,
          }}
        >
          <ArenaFrameArt accent={playerColor} animated />
          <ArenaImage
            src={`/images/backgrounds/background-${backgroundIndex}.jpg`}
            alt={`PortfolioMon arena ${backgroundIndex}`}
            priority
            sizes="100vw"
            className="absolute inset-0 opacity-80 brightness-[0.66] contrast-[1.12] saturate-[0.78]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_20%,rgba(0,0,0,.42)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="arena-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
          <div className="arena-scanlines absolute inset-0 opacity-25" />
          <BattlefieldVector playerColor={playerColor} cpuColor={cpuColor} />
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 bg-white"
            animate={{
              opacity:
                fighterState.player === "hit" || fighterState.cpu === "hit"
                  ? [0, 0.2, 0]
                  : 0,
            }}
            transition={{ duration: 0.28 }}
          />
          <div
            className="absolute inset-y-[-30%] left-1/2 w-px -rotate-[18deg] opacity-40"
            style={{
              background: `linear-gradient(transparent, ${playerColor}, ${cpuColor}, transparent)`,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-35 sm:h-60 sm:w-60"
            animate={{ rotate: 360, opacity: [0.2, 0.42, 0.2] }}
            transition={{
              rotate: { duration: 24, repeat: Infinity, ease: "linear" },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <ArenaSigil accent="#ffffff" className="h-full w-full" />
          </motion.div>

          <div
            className="arena-cut-outline arena-panel absolute right-3 top-12 z-40 w-[68%] max-w-sm border bg-[#0b0d11]/[0.95] p-3 shadow-2xl sm:right-5 sm:top-5"
            style={{
              ["--arena-accent" as string]: cpuColor,
              ["--arena-stroke" as string]: `${cpuColor}aa`,
              borderColor: `${cpuColor}b5`,
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 12px)",
              boxShadow: "0 16px 40px rgba(0,0,0,.32)",
            }}
          >
            <ArenaFrameArt accent={cpuColor} />
            <div className="mb-1 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
              <span>
                {cpuTrainer.name} / {cpuTrainer.title}
              </span>
              <span className="flex items-center gap-1.5">
                {cpu.team.map((fighter, index) => (
                  <i
                    key={fighter.mon.id}
                    className="h-1.5 w-4"
                    style={{
                      backgroundColor:
                        fighter.currentHp > 0
                          ? cpuColor
                          : "rgba(255,255,255,.14)",
                      opacity: index === cpu.activeIndex ? 1 : 0.45,
                    }}
                  />
                ))}
                CPU
              </span>
            </div>
            <HealthBar fighter={cpuFighter} compact />
          </div>

          <div
            className="arena-cut-outline arena-panel absolute bottom-3 left-3 z-40 w-[70%] max-w-sm border bg-[#0b0d11]/[0.95] p-3 shadow-2xl sm:bottom-5 sm:left-5"
            style={{
              ["--arena-accent" as string]: playerColor,
              ["--arena-stroke" as string]: `${playerColor}aa`,
              borderColor: `${playerColor}b5`,
              clipPath:
                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              boxShadow: "0 16px 40px rgba(0,0,0,.32)",
            }}
          >
            <ArenaFrameArt accent={playerColor} />
            <div className="mb-1 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
              <span>{playerTrainer.name} / Player one</span>
              <span className="flex items-center gap-1.5">
                YOU
                {player.team.map((fighter, index) => (
                  <i
                    key={fighter.mon.id}
                    className="h-1.5 w-4"
                    style={{
                      backgroundColor:
                        fighter.currentHp > 0
                          ? playerColor
                          : "rgba(255,255,255,.14)",
                      opacity: index === player.activeIndex ? 1 : 0.45,
                    }}
                  />
                ))}
              </span>
            </div>
            <HealthBar fighter={playerFighter} compact />
          </div>

          <div className="absolute left-3 top-4 z-40 sm:left-1/2 sm:top-5 sm:-translate-x-1/2">
            <motion.div
              key={turn}
              initial={{ y: -20, scale: 1.35, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              className="arena-cut-outline relative flex items-center gap-3 border border-white/[0.20] bg-black/[0.80] px-4 py-2"
              style={{
                ["--arena-stroke" as string]: "rgba(216,255,54,.55)",
                clipPath: ARENA_CLIP,
              }}
            >
              <ArenaFrameArt accent="#d8ff36" />
              <Swords className="h-3.5 w-3.5 text-[#d8ff36]" />
              <span className="font-kode text-[8px] uppercase tracking-[0.2em]">
                Turn {String(turn).padStart(2, "0")}
              </span>
              <span className="h-3 w-px bg-white/[0.20]" />
              <span
                className={`font-kode text-[6px] uppercase tracking-[0.15em] ${
                  busy ? "text-[#d8ff36]" : "text-white/[0.35]"
                }`}
              >
                {busy ? "Executing" : "Awaiting command"}
              </span>
            </motion.div>
          </div>

          <AnimatePresence>
            {busy && (
              <motion.div
                className="pointer-events-none absolute inset-x-[22%] bottom-[9%] z-30 overflow-hidden border border-[#d8ff36]/[0.38] bg-black/[0.72] px-5 py-2.5 text-center backdrop-blur-sm sm:inset-x-[30%]"
                initial={{ opacity: 0, scaleX: 0.72, y: 8 }}
                animate={{ opacity: 1, scaleX: 1, y: 0 }}
                exit={{ opacity: 0, scaleX: 0.82, y: 5 }}
              >
                <ArenaFrameArt accent="#d8ff36" animated />
                <span className="font-kode text-[7px] uppercase tracking-[0.22em] text-[#d8ff36]">
                  Resolving action queue
                </span>
                <CircuitRule className="-mb-1 mt-1 h-2 opacity-80" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute right-[3%] top-[27%] z-30 h-28 w-20 sm:right-[5%] sm:h-40 sm:w-28 lg:right-[40%] lg:top-[25%]">
            <TrainerSprite
              trainer={cpuTrainerId}
              state={cpuTrainerState}
              mode={trainerMode}
              flip
              label={`${cpuTrainer.name} commanding the opposing team`}
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/[0.80] px-2 py-1 font-kode text-[6px] uppercase tracking-[0.14em] text-pink-300">
              {cpuTrainer.name}
            </span>
          </div>
          <div className="absolute right-[3%] top-[33%] z-20 w-[48%] max-w-[450px] sm:w-[42%] lg:right-[4%] lg:top-[27%] lg:w-[34%]">
            <BattlePlatform color={cpuColor} />
            <FighterVisual
              fighter={cpuFighter}
              side="cpu"
              state={fighterState.cpu}
            />
          </div>

          <div className="absolute bottom-[17%] left-[42%] z-30 h-28 w-20 sm:bottom-[12%] sm:h-40 sm:w-28 lg:left-[37%]">
            <TrainerSprite
              trainer={playerTrainerId}
              state={playerTrainerState}
              mode={trainerMode}
              label={`${playerTrainer.name}, ${playerTrainer.title}`}
            />
          </div>
          <div className="absolute bottom-[19%] left-[2%] z-20 w-[53%] max-w-[520px] sm:bottom-[13%] sm:w-[46%] lg:left-[4%] lg:w-[38%]">
            <BattlePlatform color={playerColor} />
            <FighterVisual
              fighter={playerFighter}
              side="player"
              state={fighterState.player}
            />
          </div>
        </motion.section>

        <section
          className="arena-panel relative grid overflow-hidden border border-t-2 border-white/[0.12] bg-[#0b0d12] shadow-[0_18px_60px_rgba(0,0,0,.28)] lg:grid-cols-[0.88fr_0.96fr_1.82fr]"
          style={{
            ["--arena-accent" as string]: playerColor,
            ["--arena-stroke" as string]: `${playerColor}88`,
            clipPath: ARENA_CLIP,
            borderTopColor: `${playerColor}9c`,
          }}
        >
          <ArenaFrameArt accent={playerColor} animated={busy} />
          <div className="order-2 min-h-[140px] border-t border-white/[0.12] p-3 sm:p-4 lg:order-1 lg:border-r lg:border-t-0">
            <div className="mb-3 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3 w-3" /> Execution feed
              </span>
              <span className="flex items-center gap-1.5 text-[#d8ff36]">
                <Radio className="h-3 w-3" /> Live
              </span>
            </div>
            <div className="space-y-2">
              {log.slice(-4).map((entry, index) => (
                <motion.p
                  key={`${entry}-${index}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border-l pl-2.5 font-nacelle text-[11px] leading-relaxed ${
                    index === log.slice(-4).length - 1
                      ? "border-[#d8ff36] text-white"
                      : "border-white/[0.15] text-white/[0.38]"
                  }`}
                >
                  {entry}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="order-3 grid content-between gap-3 border-t border-white/[0.12] p-3 sm:p-4 lg:order-2 lg:border-r lg:border-t-0">
            <div className="flex items-start gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-cyan-300/[0.30] bg-white/[0.03]">
                <ArenaFrameArt accent="#67e8f9" />
                <TrainerSprite
                  trainer={advisorTrainer.id}
                  mode={trainerMode}
                  label={`${advisorTrainer.name} tactical operator`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-kode text-[7px] uppercase tracking-[0.16em] text-cyan-300">
                  <BrainCircuit className="h-3.5 w-3.5" /> {advisorTrainer.name}
                  / tactical link
                </div>
                <p className="mt-1.5 line-clamp-3 font-nacelle text-[10px] leading-relaxed text-white/[0.48]">
                  {aiReadout}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center justify-between font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.38]">
                Switch build{" "}
                <span>
                  {
                    player.team.filter((fighter) => fighter.currentHp > 0)
                      .length
                  }
                  /3 online
                </span>
              </p>
              <TeamSwitchRail
                side={player}
                disabled={busy}
                onSwitch={onSwitch}
              />
            </div>
          </div>

          <div className="order-1 p-3 sm:p-4 lg:order-3">
            <div className="mb-3 flex items-center justify-between gap-4 px-1 font-kode text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCommandMode("moves")}
                  aria-pressed={commandMode === "moves"}
                  className={`flex items-center gap-1.5 border px-2 py-1 transition ${
                    commandMode === "moves"
                      ? "border-[#d8ff36] bg-[#d8ff36] text-black"
                      : "border-white/[0.12] text-white/[0.45] hover:text-white"
                  }`}
                >
                  <Crosshair className="h-3 w-3" /> Moves
                </button>
                <button
                  type="button"
                  onClick={() => setCommandMode("bag")}
                  aria-pressed={commandMode === "bag"}
                  className={`flex items-center gap-1.5 border px-2 py-1 transition ${
                    commandMode === "bag"
                      ? "border-[#d8ff36] bg-[#d8ff36] text-black"
                      : "border-white/[0.12] text-white/[0.45] hover:text-white"
                  }`}
                >
                  <Backpack className="h-3 w-3" /> Bag
                  <span>
                    {Object.values(inventory).reduce(
                      (total, quantity) => total + quantity,
                      0
                    )}
                  </span>
                </button>
              </div>
              <span className="hidden items-center gap-2 xl:flex">
                <Crosshair
                  className={`h-3.5 w-3.5 ${
                    busy ? "animate-spin text-[#d8ff36]" : "text-white/[0.45]"
                  }`}
                />
                {busy ? "Executing command..." : "Command deck / select move"}
              </span>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1">
                  <HeartPulse className="h-3 w-3" />{" "}
                  {getStatusLabel(playerFighter)}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-3 w-3" /> SPD{" "}
                  {playerFighter.mon.stats.spd}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> DEF{" "}
                  {playerFighter.mon.stats.def}
                </span>
              </div>
            </div>
            {commandMode === "moves" ? (
              <div className="grid grid-cols-2 gap-2">
                {playerFighter.moves.map((move, index) => (
                  <MoveButton
                    key={move.name}
                    move={move}
                    disabled={busy}
                    effectiveness={getEffectiveness(move.type, cpuFighter.mon)}
                    onClick={() => onMove(index)}
                  />
                ))}
              </div>
            ) : (
              <BattleBag
                inventory={inventory}
                side={player}
                disabled={busy}
                onUse={onItem}
              />
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const ResultScreen = ({
  outcome,
  player,
  cpu,
  playerTrainerId,
  cpuTrainerId,
  trainerMode,
  stats,
  onRematch,
  onRoster,
  onExit,
}: {
  outcome: Exclude<Outcome, null>;
  player: ArenaSide;
  cpu: ArenaSide;
  playerTrainerId: TrainerId;
  cpuTrainerId: TrainerId;
  trainerMode: TrainerRenderMode;
  stats: MatchStats;
  onRematch: () => void;
  onRoster: () => void;
  onExit: () => void;
}) => {
  const victory = outcome === "victory";
  const team = victory ? player : cpu;
  const winningTrainer = getTrainer(victory ? playerTrainerId : cpuTrainerId);
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex min-h-[calc(100svh-68px)] items-center justify-center overflow-hidden px-4 py-6 text-white sm:min-h-[calc(100svh-5rem)] sm:px-7 sm:py-8"
    >
      <motion.div
        className={`absolute inset-0 ${
          victory ? "bg-[#d8ff36]/[0.16]" : "bg-[#ff5151]/[0.18]"
        }`}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(90% at 50% 50%)" }}
        transition={{ duration: 1, ease: "circOut" }}
      />
      <BattlefieldVector
        playerColor={victory ? "#d8ff36" : "#ff5151"}
        cpuColor={victory ? "#41d9ff" : "#ff9c51"}
      />
      <div
        className="relative grid w-full max-w-[1250px] overflow-hidden border border-black bg-[#07090d]/[0.97] shadow-[0_38px_120px_rgba(0,0,0,.6)] lg:grid-cols-12"
        style={{
          ["--arena-stroke" as string]: victory
            ? "rgba(216,255,54,.9)"
            : "rgba(255,81,81,.9)",
          clipPath: ARENA_CLIP,
        }}
      >
        <ArenaFrameArt accent={victory ? "#d8ff36" : "#ff5151"} animated />
        <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-8">
          <div className="flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.2em] text-white/[0.45]">
            {victory ? (
              <Trophy className="h-4 w-4 text-[#d8ff36]" />
            ) : (
              <Skull className="h-4 w-4 text-red-400" />
            )}
            Match complete / {victory ? "Winner" : "Defeated"}
          </div>
          <div className="my-7 sm:my-8">
            <ResultSeal victory={victory} className="mb-5 h-16 w-16" />
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, ease: "circOut" }}
              className="font-telegraf text-[clamp(4.2rem,8vw,8rem)] font-black leading-[0.8] tracking-[-0.055em]"
            >
              {victory ? "Victory." : "Defeat."}
            </motion.h1>
            <p className="mt-5 max-w-md border-l border-white/[0.18] pl-4 font-nacelle text-sm leading-relaxed text-white/[0.58] sm:text-base">
              {victory
                ? "Your lineup survived the adaptive bracket. Every remaining build ships with the win."
                : "The opponent found the pattern first. Recompile the team, change the matchup, and run it back."}
            </p>
          </div>

          <CircuitRule
            accent={victory ? "#d8ff36" : "#ff5151"}
            className="mb-3 opacity-65"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              [stats.turns, "Turns"],
              [stats.damageDealt, "Damage"],
              [stats.criticals, "Criticals"],
              [stats.itemsUsed, "Items"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="arena-card relative overflow-hidden border border-white/[0.15] p-3.5"
              >
                <ArenaFrameArt accent={victory ? "#d8ff36" : "#ff5151"} />
                <strong className="block font-telegraf text-2xl font-black">
                  {value}
                </strong>
                <span className="font-kode text-[7px] uppercase tracking-[0.14em] text-white/[0.35]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] border-t border-white/[0.15] bg-black lg:col-span-7 lg:border-l lg:border-t-0">
          <ArenaFrameArt accent={victory ? "#d8ff36" : "#ff5151"} />
          <div className="absolute inset-0 grid grid-cols-3">
            {team.team.map((fighter, index) => (
              <motion.div
                key={fighter.mon.id}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: index === 0 ? 0 : 28, opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.13, ease: "backOut" }}
                className="relative overflow-hidden border-r border-white/[0.10] last:border-r-0"
              >
                <ArenaImage
                  src={fighter.mon.image}
                  alt={`${fighter.mon.name} result portrait`}
                  priority
                  sizes="280px"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/[0.72] to-transparent p-3 pt-10 sm:p-5 sm:pt-12">
                  <span className="font-kode text-[7px] uppercase tracking-[0.14em] text-white/[0.42]">
                    0{index + 1}
                  </span>
                  <p className="mt-1 font-telegraf text-sm font-black sm:text-xl">
                    {fighter.mon.name}
                  </p>
                  <p className="mt-1 font-kode text-[7px] text-white/[0.45]">
                    {fighter.currentHp} HP
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-0 right-2 z-20 h-52 w-36 sm:h-72 sm:w-48">
            <TrainerSprite
              trainer={victory ? playerTrainerId : cpuTrainerId}
              state="win"
              mode={trainerMode}
              flip={!victory}
              label={`${winningTrainer.name} celebrates the win`}
            />
          </div>
        </div>

        <div className="relative z-[70] grid gap-3 border-t border-white/[0.15] bg-[#080b10] p-4 sm:grid-cols-3 lg:col-span-12 lg:p-5">
          <button
            type="button"
            onClick={onRematch}
            className="arena-interactive flex items-center justify-center gap-2 bg-[#d8ff36] px-5 py-4 font-kode text-[8px] font-bold uppercase tracking-[0.16em] text-black hover:-translate-y-0.5 hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" /> Rematch
          </button>
          <button
            type="button"
            onClick={onRoster}
            className="arena-interactive border border-white/[0.20] px-5 py-4 font-kode text-[8px] uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            Change lineup
          </button>
          <button
            type="button"
            onClick={onExit}
            className="arena-interactive border border-white/[0.20] px-5 py-4 font-kode text-[8px] uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            Return to portfolio
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PortfolioMonArena = ({ onExit }: { onExit: () => void }) => {
  const [phase, setPhase] = useState<ArenaPhase>("select");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [focusedId, setFocusedId] = useState(0);
  const [playerTrainerId, setPlayerTrainerId] = useState<TrainerId>("hilbert");
  const [cpuTrainerId, setCpuTrainerId] = useState<TrainerId>("cynthia");
  const [trainerMode, setTrainerMode] = useState<TrainerRenderMode>("battle");
  const [playerSide, setPlayerSide] = useState<ArenaSide | null>(null);
  const [cpuSide, setCpuSide] = useState<ArenaSide | null>(null);
  const [playerInventory, setPlayerInventory] = useState<BattleInventory>(
    createBattleInventory
  );
  const [cpuInventory, setCpuInventory] = useState<BattleInventory>(
    createBattleInventory
  );
  const [turn, setTurn] = useState(1);
  const [busy, setBusy] = useState(false);
  const [visual, setVisual] = useState<ArenaVisualEvent | null>(null);
  const [fighterState, setFighterState] = useState<{
    player: FighterState;
    cpu: FighterState;
  }>({ player: "idle", cpu: "idle" });
  const [log, setLog] = useState<string[]>([
    "Select three builds to initialize a match.",
  ]);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [notices, setNotices] = useState<BattleNotice[]>([]);
  const [stats, setStats] = useState<MatchStats>(INITIAL_STATS);
  const [aiReadout, setAiReadout] = useState(
    "Waiting for your lineup. The opponent scores matchups, finishing damage, status pressure, and repeated patterns."
  );
  const actionLock = useRef(false);
  const visualId = useRef(0);
  const noticeId = useRef(0);
  const aiMemory = useRef<AiMemory>(initialMemory());

  const addLog = useCallback((message: string) => {
    setLog((current) => [...current.slice(-7), message]);
  }, []);

  const pushNotice = useCallback(
    (notice: Omit<BattleNotice, "id">, duration = 2500) => {
      const id = ++noticeId.current;
      setNotices((current) => [...current.slice(-2), { ...notice, id }]);
      window.setTimeout(
        () => setNotices((current) => current.filter((item) => item.id !== id)),
        duration
      );
    },
    []
  );

  const toggleSelected = (id: number) => {
    setFocusedId(id);
    setSelectedIds((current) => {
      if (current.includes(id))
        return current.filter((selected) => selected !== id);
      if (current.length >= 3) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const randomizeSelection = () => {
    const team = randomTeam();
    setSelectedIds(team.map((mon) => mon.id));
    setFocusedId(team[0]?.id ?? 0);
  };

  const initializeMatch = () => {
    const playerMons = getMons(selectedIds);
    if (playerMons.length !== 3) return;
    const cpuMons = randomTeam(selectedIds);
    setPlayerSide(createArenaSide(playerMons));
    setCpuSide(createArenaSide(cpuMons));
    setPlayerInventory(createBattleInventory());
    setCpuInventory(createBattleInventory());
    setTurn(1);
    setStats(INITIAL_STATS);
    setOutcome(null);
    setLog([`${playerMons[0]!.name} enters the arena.`]);
    setFighterState({ player: "idle", cpu: "idle" });
    setNotices([]);
    aiMemory.current = initialMemory();
    setAiReadout(
      "Lineup parsed. Building a counter-plan from type pressure and expected damage."
    );
    setPhase("versus");
  };

  const startBattle = useCallback(() => {
    setPhase("battle");
    setBusy(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  useEffect(() => {
    if (phase !== "versus") return;
    const timer = window.setTimeout(startBattle, 3200);
    return () => window.clearTimeout(timer);
  }, [phase, startBattle]);

  const showVisual = async (
    event: Omit<ArenaVisualEvent, "id">,
    duration = 520
  ) => {
    const next = { ...event, id: ++visualId.current };
    setVisual(next);
    await wait(duration);
    setVisual(null);
  };

  const animateSwitch = async (
    side: "player" | "cpu",
    arenaSide: ArenaSide,
    fighterIndex: number
  ) => {
    const incoming = arenaSide.team[fighterIndex];
    const name = incoming?.mon.name ?? "Unknown build";
    setFighterState((current) => ({ ...current, [side]: "switch" }));
    addLog(`${side === "player" ? "You" : "CPU"} switched to ${name}.`);
    pushNotice({
      eyebrow: side === "player" ? "Player switch" : "Rival switch",
      title: `${name} deployed`,
      detail: "A fresh matchup entered the active slot.",
      accent:
        TYPE_COLORS[incoming?.mon.type1 ?? ""] ??
        (side === "player" ? "#d8ff36" : "#ff4f9a"),
    });
    await showVisual(
      {
        moveName: name,
        moveType: incoming?.mon.type1 ?? "Infra",
        source: side,
        stage: "switch",
      },
      360
    );
    arenaSide.activeIndex = fighterIndex;
    if (side === "player") setPlayerSide(cloneSide(arenaSide));
    else setCpuSide(cloneSide(arenaSide));
    setFighterState((current) => ({ ...current, [side]: "idle" }));
    await wait(280);
  };

  const animateItemUse = async (
    side: "player" | "cpu",
    arenaSide: ArenaSide,
    itemId: BattleItemId
  ) => {
    const item = BATTLE_ITEMS.find((candidate) => candidate.id === itemId)!;
    const resolution = applyBattleItem(arenaSide, itemId);
    if (!resolution.success) return false;

    arenaSide.team = resolution.side.team;
    arenaSide.activeIndex = resolution.side.activeIndex;
    if (side === "player") {
      setPlayerInventory((current) => ({
        ...current,
        [itemId]: Math.max(0, current[itemId] - 1),
      }));
      setPlayerSide(cloneSide(arenaSide));
      setStats((current) => ({
        ...current,
        itemsUsed: current.itemsUsed + 1,
      }));
    } else {
      setCpuInventory((current) => ({
        ...current,
        [itemId]: Math.max(0, current[itemId] - 1),
      }));
      setCpuSide(cloneSide(arenaSide));
    }
    addLog(`${side === "player" ? "You" : "CPU"} used ${item.name}.`);
    addLog(resolution.detail);
    pushNotice({
      eyebrow: side === "player" ? "Bag command" : "Rival item",
      title: item.name,
      detail: resolution.detail,
      accent: item.accent,
    });
    setFighterState((current) => ({ ...current, [side]: "attack" }));
    await showVisual(
      {
        moveName: item.name,
        moveType: resolution.target.mon.type1,
        source: side,
        stage: "item",
      },
      540
    );
    setFighterState((current) => ({ ...current, [side]: "idle" }));
    return true;
  };

  const animateAttack = async (
    source: "player" | "cpu",
    player: ArenaSide,
    cpu: ArenaSide,
    moveIndex: number
  ) => {
    const attackerSide = source === "player" ? player : cpu;
    const defenderSide = source === "player" ? cpu : player;
    const targetSide = source === "player" ? "cpu" : "player";
    const attacker = attackerSide.team[attackerSide.activeIndex]!;
    const defender = defenderSide.team[defenderSide.activeIndex]!;
    const move = attacker.moves[moveIndex] ?? attacker.moves[0]!;

    addLog(`${attacker.mon.name} initiated ${move.name}.`);
    setFighterState((current) => ({ ...current, [source]: "attack" }));
    await showVisual(
      {
        moveName: move.name,
        moveType: move.type,
        source,
        stage: "charge",
      },
      390
    );

    const resolution = resolveMove(attacker, defender, moveIndex);
    attackerSide.team[attackerSide.activeIndex] = resolution.attacker;
    defenderSide.team[defenderSide.activeIndex] = resolution.defender;
    setPlayerSide(cloneSide(player));
    setCpuSide(cloneSide(cpu));

    if (resolution.skipped || resolution.missed) {
      addLog(resolution.notes[0] ?? `${move.name} failed.`);
      await showVisual(
        {
          moveName: resolution.missed ? "MISS" : "STALLED",
          moveType: move.type,
          source,
          stage: "miss",
        },
        460
      );
    } else {
      setFighterState((current) => ({ ...current, [targetSide]: "hit" }));
      await showVisual(
        {
          moveName: move.name,
          moveType: move.type,
          source,
          stage: "impact",
          damage: resolution.damage,
          critical: resolution.critical,
          hitCount: resolution.hitCount,
          effectiveness: resolution.effectiveness,
          barrierAbsorbed: resolution.barrierAbsorbed,
          executed: resolution.executed,
          stab: resolution.stab,
        },
        resolution.hitCount > 1 ? 760 : 650
      );
      addLog(
        `${move.name} dealt ${resolution.damage} damage${
          resolution.critical ? " — critical." : "."
        }`
      );
      resolution.notes.forEach(addLog);
      if (resolution.critical) {
        pushNotice({
          eyebrow: "Critical path / 1.5×",
          title: "Defense stages bypassed",
          detail: `${move.name} found a critical execution window.`,
          accent: "#fff36b",
        });
      }
      if (resolution.effectiveness > 1) {
        pushNotice({
          eyebrow: "Type advantage",
          title: "Super effective",
          detail: `${move.type} pressure hit for ${resolution.effectiveness}× matchup value.`,
          accent: "#d8ff36",
        });
      }
      if (resolution.inflictedStatus) {
        pushNotice({
          eyebrow: "Status injected",
          title: resolution.inflictedStatus.toUpperCase(),
          detail: `${defender.mon.name} will carry the condition into later turns.`,
          accent: TYPE_COLORS[move.type] ?? "#c084fc",
        });
      }
      if (resolution.barrierAbsorbed > 0) {
        pushNotice({
          eyebrow: "Defensive protocol",
          title: "Null Shield consumed",
          detail: `${resolution.barrierAbsorbed} incoming damage was absorbed.`,
          accent: "#60a5fa",
        });
      }
      if (resolution.selfEffect) {
        pushNotice({
          eyebrow: "Secondary effect",
          title: resolution.selfEffect.replace(/([A-Z])/g, " $1").toUpperCase(),
          detail:
            resolution.healing > 0
              ? `${attacker.mon.name} recovered ${resolution.healing} HP.`
              : resolution.recoil > 0
              ? `${attacker.mon.name} took ${resolution.recoil} recoil damage.`
              : `${attacker.mon.name} modified its combat telemetry.`,
          accent: TYPE_COLORS[attacker.mon.type1] ?? "#41d9ff",
        });
      }
      setStats((current) => ({
        ...current,
        damageDealt:
          current.damageDealt + (source === "player" ? resolution.damage : 0),
        damageTaken:
          current.damageTaken + (source === "cpu" ? resolution.damage : 0),
        criticals:
          current.criticals +
          (source === "player" && resolution.critical ? 1 : 0),
      }));
    }

    setFighterState({ player: "idle", cpu: "idle" });
    await wait(170);

    if (source === "player") {
      const previous = aiMemory.current.observedPlayerTypes;
      aiMemory.current.observedPlayerTypes = [...previous.slice(-3), move.type];
    } else {
      aiMemory.current.repeatedMoveCount =
        aiMemory.current.lastMoveName === move.name
          ? aiMemory.current.repeatedMoveCount + 1
          : 0;
      aiMemory.current.lastMoveName = move.name;
    }
  };

  const settleFaintsAndStatus = async (player: ArenaSide, cpu: ArenaSide) => {
    for (const [key, side] of [
      ["player", player],
      ["cpu", cpu],
    ] as const) {
      const current = side.team[side.activeIndex]!;
      if (current.currentHp <= 0) continue;
      const tick = applyStatusTick(current);
      side.team[side.activeIndex] = tick.fighter;
      if (tick.damage > 0) {
        addLog(
          `${current.mon.name} took ${tick.damage} ${
            current.status ?? "status"
          } damage.`
        );
        pushNotice({
          eyebrow: "End-of-turn status",
          title: `${(current.status ?? "status").toUpperCase()} tick`,
          detail: `${current.mon.name} lost ${tick.damage} HP after the action queue.`,
          accent: current.status === "burn" ? "#fb923c" : "#c084fc",
        });
        setFighterState((state) => ({ ...state, [key]: "hit" }));
        await wait(280);
      }
    }
    setPlayerSide(cloneSide(player));
    setCpuSide(cloneSide(cpu));
    setFighterState({ player: "idle", cpu: "idle" });

    const playerRemaining = livingCount(player);
    const cpuRemaining = livingCount(cpu);
    if (playerRemaining === 0 || cpuRemaining === 0) {
      const result: Exclude<Outcome, null> =
        cpuRemaining === 0 ? "victory" : "defeat";
      setOutcome(result);
      setPhase("result");
      return true;
    }

    if (player.team[player.activeIndex]!.currentHp <= 0) {
      setFighterState((current) => ({ ...current, player: "faint" }));
      addLog(`${player.team[player.activeIndex]!.mon.name} was defeated.`);
      pushNotice({
        eyebrow: "Build offline",
        title: player.team[player.activeIndex]!.mon.name,
        detail: "An available reserve will enter automatically.",
        accent: "#ff5151",
      });
      await wait(500);
      const replacement = firstLivingIndex(player);
      await animateSwitch("player", player, replacement);
    }

    if (cpu.team[cpu.activeIndex]!.currentHp <= 0) {
      setFighterState((current) => ({ ...current, cpu: "faint" }));
      addLog(`${cpu.team[cpu.activeIndex]!.mon.name} was defeated.`);
      pushNotice({
        eyebrow: "Rival build offline",
        title: cpu.team[cpu.activeIndex]!.mon.name,
        detail: "The rival is compiling its best remaining matchup.",
        accent: "#ff5151",
      });
      await wait(500);
      const replacement = chooseReplacement(
        cpu,
        player.team[player.activeIndex]!
      );
      await animateSwitch(
        "cpu",
        cpu,
        replacement >= 0 ? replacement : firstLivingIndex(cpu)
      );
    }

    setPlayerSide(cloneSide(player));
    setCpuSide(cloneSide(cpu));
    return false;
  };

  const executeTurn = async (moveIndex: number) => {
    if (!playerSide || !cpuSide || actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    const player = cloneSide(playerSide);
    const cpu = cloneSide(cpuSide);
    const aiAction = chooseAiAction(cpu, player, aiMemory.current);
    const cpuItem = chooseCpuBattleItem(cpu, cpuInventory);

    if (cpuItem) {
      setAiReadout(
        "Item threshold reached. Spending a limited bag resource before the incoming command."
      );
      await animateItemUse("cpu", cpu, cpuItem);
      await animateAttack("player", player, cpu, moveIndex);
    } else if (aiAction.kind === "switch") {
      setAiReadout(
        "Your last pattern created a weak matchup. Re-routing to a better defender."
      );
      await animateSwitch("cpu", cpu, aiAction.fighterIndex);
      await animateAttack("player", player, cpu, moveIndex);
    } else {
      const playerSpeed = effectiveSpeed(player.team[player.activeIndex]!);
      const cpuSpeed = effectiveSpeed(cpu.team[cpu.activeIndex]!);
      const playerPriority =
        player.team[player.activeIndex]!.moves[moveIndex]?.priority ?? 0;
      const cpuPriority =
        cpu.team[cpu.activeIndex]!.moves[aiAction.moveIndex]?.priority ?? 0;
      const order: Array<{ side: "player" | "cpu"; action: ArenaAction }> =
        playerPriority > cpuPriority ||
        (playerPriority === cpuPriority && playerSpeed >= cpuSpeed)
          ? [
              { side: "player", action: { kind: "move", moveIndex } },
              { side: "cpu", action: aiAction },
            ]
          : [
              { side: "cpu", action: aiAction },
              { side: "player", action: { kind: "move", moveIndex } },
            ];

      setAiReadout(
        playerPriority !== cpuPriority
          ? `Priority command detected. +${Math.max(
              playerPriority,
              cpuPriority
            )} resolves before modified speed.`
          : aiMemory.current.repeatedMoveCount > 0
          ? "Repeated output detected. Applying a diversity penalty and searching for a punish."
          : "Scoring damage, accuracy, status value, finishing range, and your recent move types."
      );

      for (const item of order) {
        const actingSide = item.side === "player" ? player : cpu;
        if (actingSide.team[actingSide.activeIndex]!.currentHp <= 0) continue;
        if (item.action.kind === "move") {
          await animateAttack(item.side, player, cpu, item.action.moveIndex);
        }
      }
    }

    const ended = await settleFaintsAndStatus(player, cpu);
    if (!ended) {
      setTurn((current) => current + 1);
      setStats((current) => ({ ...current, turns: current.turns + 1 }));
      setBusy(false);
      actionLock.current = false;
    }
  };

  const executePlayerSwitch = async (fighterIndex: number) => {
    if (!playerSide || !cpuSide || actionLock.current) return;
    if (
      fighterIndex === playerSide.activeIndex ||
      playerSide.team[fighterIndex]?.currentHp === 0
    )
      return;

    actionLock.current = true;
    setBusy(true);
    const player = cloneSide(playerSide);
    const cpu = cloneSide(cpuSide);
    await animateSwitch("player", player, fighterIndex);
    setStats((current) => ({ ...current, switches: current.switches + 1 }));

    const aiAction = chooseAiAction(cpu, player, aiMemory.current);
    const cpuItem = chooseCpuBattleItem(cpu, cpuInventory);
    if (cpuItem) {
      await animateItemUse("cpu", cpu, cpuItem);
    } else if (aiAction.kind === "switch") {
      await animateSwitch("cpu", cpu, aiAction.fighterIndex);
    } else {
      await animateAttack("cpu", player, cpu, aiAction.moveIndex);
    }

    const ended = await settleFaintsAndStatus(player, cpu);
    if (!ended) {
      setTurn((current) => current + 1);
      setStats((current) => ({ ...current, turns: current.turns + 1 }));
      setBusy(false);
      actionLock.current = false;
    }
  };

  const executePlayerItem = async (itemId: BattleItemId) => {
    if (!playerSide || !cpuSide || actionLock.current) return;
    if (playerInventory[itemId] <= 0) return;

    const preview = applyBattleItem(playerSide, itemId);
    if (!preview.success) {
      const item = BATTLE_ITEMS.find((candidate) => candidate.id === itemId)!;
      pushNotice({
        eyebrow: "Bag command rejected",
        title: `${item.name} has no valid target`,
        detail: "Choose another item or issue a move instead.",
        accent: "#ff5151",
      });
      return;
    }

    actionLock.current = true;
    setBusy(true);
    const player = cloneSide(playerSide);
    const cpu = cloneSide(cpuSide);
    await animateItemUse("player", player, itemId);

    const cpuItem = chooseCpuBattleItem(cpu, cpuInventory);
    const aiAction = chooseAiAction(cpu, player, aiMemory.current);
    if (cpuItem) {
      await animateItemUse("cpu", cpu, cpuItem);
    } else if (aiAction.kind === "switch") {
      await animateSwitch("cpu", cpu, aiAction.fighterIndex);
    } else {
      await animateAttack("cpu", player, cpu, aiAction.moveIndex);
    }

    const ended = await settleFaintsAndStatus(player, cpu);
    if (!ended) {
      setTurn((current) => current + 1);
      setStats((current) => ({ ...current, turns: current.turns + 1 }));
      setBusy(false);
      actionLock.current = false;
    }
  };

  const rematch = () => {
    if (!playerSide || !cpuSide) return;
    setPlayerSide(
      createArenaSide(playerSide.team.map((fighter) => fighter.mon))
    );
    setCpuSide(createArenaSide(cpuSide.team.map((fighter) => fighter.mon)));
    setPlayerInventory(createBattleInventory());
    setCpuInventory(createBattleInventory());
    setTurn(1);
    setStats(INITIAL_STATS);
    setOutcome(null);
    setLog(["Rematch initialized."]);
    setNotices([]);
    setBusy(false);
    actionLock.current = false;
    aiMemory.current = initialMemory();
    setPhase("versus");
  };

  const returnToRoster = () => {
    setPhase("select");
    setOutcome(null);
    setBusy(false);
    actionLock.current = false;
  };

  const selectedPreview = useMemo(() => getMons(selectedIds), [selectedIds]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090d] font-nacelle">
      <ArenaBackdrop />
      <ArenaHeader
        phase={phase}
        trainerMode={trainerMode}
        onExit={onExit}
        onHelp={() => setShowGuide(true)}
        onTrainerMode={setTrainerMode}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      >
        {selectedPreview.map((mon) => (
          <ArenaImage
            key={mon.id}
            src={mon.image}
            alt=""
            priority
            sizes="1px"
            className="relative h-px w-px"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "select" && (
          <RosterSelect
            selectedIds={selectedIds}
            focusedId={focusedId}
            playerTrainer={playerTrainerId}
            cpuTrainer={cpuTrainerId}
            trainerMode={trainerMode}
            onFocus={setFocusedId}
            onToggle={toggleSelected}
            onPlayerTrainer={setPlayerTrainerId}
            onCpuTrainer={setCpuTrainerId}
            onRandom={randomizeSelection}
            onBegin={initializeMatch}
          />
        )}
        {phase === "versus" && playerSide && cpuSide && (
          <VersusScreen
            player={playerSide}
            cpu={cpuSide}
            playerTrainerId={playerTrainerId}
            cpuTrainerId={cpuTrainerId}
            trainerMode={trainerMode}
            onStart={startBattle}
          />
        )}
        {phase === "battle" && playerSide && cpuSide && (
          <BattleScreen
            player={playerSide}
            cpu={cpuSide}
            playerTrainerId={playerTrainerId}
            cpuTrainerId={cpuTrainerId}
            trainerMode={trainerMode}
            inventory={playerInventory}
            turn={turn}
            log={log}
            busy={busy}
            fighterState={fighterState}
            aiReadout={aiReadout}
            onMove={(moveIndex) => void executeTurn(moveIndex)}
            onSwitch={(fighterIndex) => void executePlayerSwitch(fighterIndex)}
            onItem={(itemId) => void executePlayerItem(itemId)}
          />
        )}
        {phase === "result" && outcome && playerSide && cpuSide && (
          <ResultScreen
            outcome={outcome}
            player={playerSide}
            cpu={cpuSide}
            playerTrainerId={playerTrainerId}
            cpuTrainerId={cpuTrainerId}
            trainerMode={trainerMode}
            stats={stats}
            onRematch={rematch}
            onRoster={returnToRoster}
            onExit={onExit}
          />
        )}
      </AnimatePresence>

      <MoveEffectLayer event={visual} />
      <BattleNoticeStack notices={notices} />
      <AnimatePresence>
        {showGuide && <BattleGuideModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </main>
  );
};

export default PortfolioMonArena;
