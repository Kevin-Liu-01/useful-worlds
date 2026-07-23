import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  ACTIVE_CONTRIBUTION_DAYS,
  COMMIT_CELLS,
  DEFAULT_ACTIVE_DAY,
  TOTAL_CONTRIBUTIONS,
} from "../../data/commitActivity";
import DitherMedia from "./ditherMedia";

const VAULT_EASE = [0.22, 1, 0.36, 1] as const;
const VAULT_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 25,
  mass: 0.75,
};

const FRAME_CLIPS = [
  "polygon(0 18px,18px 0,calc(100% - 38px) 0,calc(100% - 24px) 14px,100% 14px,100% calc(100% - 18px),calc(100% - 18px) 100%,28px 100%,16px calc(100% - 12px),0 calc(100% - 12px))",
  "polygon(0 10px,10px 0,calc(100% - 64px) 0,calc(100% - 44px) 20px,100% 20px,100% calc(100% - 30px),calc(100% - 30px) 100%,18px 100%,0 calc(100% - 18px),0 calc(100% - 18px))",
  "polygon(0 28px,28px 0,calc(100% - 18px) 0,100% 18px,100% calc(100% - 12px),calc(100% - 12px) 100%,58px 100%,40px calc(100% - 18px),0 calc(100% - 18px),0 calc(100% - 18px))",
] as const;

const FRAME_SURFACES = [
  { name: "Paper", background: "#f4f3ec", foreground: "#0b0b0b" },
  { name: "Ink", background: "#090909", foreground: "#f4f3ec" },
  { name: "Acid", background: "#d8ff36", foreground: "#0b0b0b" },
] as const;

const VaultSpecimen = ({
  index,
  title,
  description,
  children,
  className = "",
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) => (
  <motion.article
    className={`group flex min-h-0 flex-col border border-black/25 bg-[#f4f3ec] p-4 sm:p-5 ${className}`}
    initial={{ opacity: 0, y: 32, filter: "blur(9px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-70px" }}
    whileHover={{ y: -5, boxShadow: "0 16px 0 rgba(0,0,0,.13)" }}
    transition={VAULT_SPRING}
  >
    <header className="flex items-start justify-between gap-6 border-b border-black/25 pb-4">
      <div>
        <h3 className="font-telegraf text-2xl font-black tracking-[-0.03em] sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-[48ch] text-sm leading-[1.6] text-black/55">
          {description}
        </p>
      </div>
      <span className="shrink-0 font-kode text-[8px] uppercase tracking-[0.16em] text-black/40">
        V-{index}
      </span>
    </header>
    <div className="mt-4 min-h-0 flex-1">{children}</div>
  </motion.article>
);

const FrameSpecimen = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const surface = FRAME_SURFACES[frameIndex % FRAME_SURFACES.length];
  const clipPath = FRAME_CLIPS[frameIndex % FRAME_CLIPS.length];

  return (
    <div className="flex h-full min-h-[380px] flex-col gap-3">
      <motion.button
        type="button"
        onClick={() => setFrameIndex((current) => (current + 1) % 3)}
        aria-label="Cycle portfolio frame"
        className="relative flex-1 bg-black p-px text-left"
        animate={{ clipPath }}
        transition={VAULT_SPRING}
      >
        <motion.div
          className="relative flex h-full min-h-[310px] flex-col justify-between overflow-hidden p-7"
          animate={{
            clipPath,
            backgroundColor: surface.background,
            color: surface.foreground,
          }}
          transition={VAULT_SPRING}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 600 360"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full opacity-35"
          >
            <motion.path
              d="M 0 78 H 74 L 110 112 H 490 L 526 78 H 600 M 0 286 H 92 L 124 254 H 476 L 508 286 H 600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: VAULT_EASE }}
            />
          </svg>
          <div className="relative flex items-center justify-between font-kode text-[8px] uppercase tracking-[0.16em] opacity-55">
            <span>Adaptive chassis</span>
            <span>{String(frameIndex + 1).padStart(2, "0")} / 03</span>
          </div>
          <div className="relative max-w-md">
            <span className="mb-4 block h-2 w-2 rotate-45 bg-[#d8ff36]" />
            <strong className="font-telegraf text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-6xl">
              Shape is part of the interface.
            </strong>
          </div>
          <div className="border-current/25 relative flex items-center justify-between border-t pt-4 font-kode text-[8px] uppercase tracking-[0.15em]">
            <span>{surface.name} surface</span>
            <span className="flex items-center gap-2">
              Cycle frame <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </motion.div>
      </motion.button>
      <div className="grid grid-cols-3 gap-2">
        {FRAME_SURFACES.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setFrameIndex(index)}
            className={`border border-black px-3 py-2 font-kode text-[7px] uppercase tracking-[0.14em] transition ${
              index === frameIndex
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const VAULT_COMMIT_CELLS = COMMIT_CELLS.filter((cell) => !cell.future);

const CommitSpecimen = () => {
  const defaultIndex = Math.max(
    0,
    VAULT_COMMIT_CELLS.findIndex((cell) => cell.key === DEFAULT_ACTIVE_DAY.key),
  );
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const activeCell = VAULT_COMMIT_CELLS[activeIndex] ?? DEFAULT_ACTIVE_DAY;

  return (
    <div className="flex min-h-[380px] flex-col justify-between bg-black p-5 text-white sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <strong className="font-telegraf text-4xl font-black tracking-[-0.04em]">
            {TOTAL_CONTRIBUTIONS.toLocaleString()}
          </strong>
          <span className="ml-2 font-kode text-[8px] uppercase tracking-[0.15em] text-white/40">
            contributions
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCell.key}
            className="text-right font-kode text-[7px] uppercase tracking-[0.13em] text-white/45"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          >
            <span className="block text-[#d8ff36]">{activeCell.label}</span>
            {activeCell.count} contributions
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto py-8">
        <div
          className="mx-auto grid w-max gap-[3px]"
          style={{
            gridTemplateRows: "repeat(7, 8px)",
            gridAutoFlow: "column",
            gridAutoColumns: "8px",
          }}
          role="grid"
          aria-label="Vault contribution graph"
        >
          {VAULT_COMMIT_CELLS.map((cell, index) => {
            const columnDistance = Math.abs(
              Math.floor(index / 7) - Math.floor(activeIndex / 7),
            );
            const rowDistance = Math.abs((index % 7) - (activeIndex % 7));
            const energy = Math.max(0, 3 - columnDistance - rowDistance);
            const intensity =
              cell.count === 0
                ? 0.12
                : Math.min(1, 0.18 + Math.log2(cell.count + 1) / 7);

            return (
              <motion.button
                key={cell.key}
                type="button"
                role="gridcell"
                disabled={!cell.inYear}
                aria-label={`${cell.label}: ${cell.count} contributions`}
                onPointerEnter={() => cell.inYear && setActiveIndex(index)}
                onFocus={() => cell.inYear && setActiveIndex(index)}
                onClick={() => cell.inYear && setActiveIndex(index)}
                className="h-2 w-2 outline-none ring-[#d8ff36] focus-visible:ring-2 disabled:opacity-20"
                animate={{
                  scale: index === activeIndex ? 1.9 : 1 + energy * 0.11,
                  rotate: index === activeIndex ? 45 : 0,
                  backgroundColor:
                    index === activeIndex
                      ? "#d8ff36"
                      : `rgba(255,255,255,${Math.max(intensity, energy * 0.18)})`,
                }}
                transition={{ type: "spring", stiffness: 520, damping: 25 }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-end justify-between gap-5 border-t border-white/20 pt-4">
        <span className="font-kode text-[7px] uppercase tracking-[0.14em] text-white/40">
          {ACTIVE_CONTRIBUTION_DAYS} active days / trace a cell
        </span>
        <Link
          href="https://github.com/Kevin-Liu-01"
          target="_blank"
          className="flex items-center gap-2 font-kode text-[7px] uppercase tracking-[0.14em] text-[#d8ff36] hover:text-white"
        >
          GitHub <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

const DITHER_FRAMES = [
  {
    src: "/images/kevin_powerlifting_color.png",
    alt: "Kevin Liu walking onto the powerlifting platform",
    label: "Platform / New Jersey",
  },
  {
    src: "/images/hero-social/ariadne-stage.jpg",
    alt: "Kevin Liu inside the Ariadne runway installation",
    label: "Ariadne / New York",
  },
  {
    src: "/images/moments/hackprinceton-02.jpg",
    alt: "Kevin Liu speaking at HackPrinceton",
    label: "HackPrinceton / Princeton",
  },
] as const;

const DitherSpecimen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const frame = DITHER_FRAMES[activeIndex];

  return (
    <div className="group/sequence relative min-h-[410px] overflow-hidden bg-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={frame.src}
          className="absolute inset-0"
          initial={{
            opacity: 0,
            x: 22,
            filter: "blur(8px)",
            clipPath: "polygon(10% 0,100% 0,90% 100%,0 100%)",
          }}
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
          }}
          exit={{ opacity: 0, x: -18, filter: "blur(7px)" }}
          transition={{ duration: 0.58, ease: VAULT_EASE }}
        >
          <DitherMedia
            src={frame.src}
            alt={frame.alt}
            tone="soft"
            revealOnParentHover
            className="absolute inset-0"
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        key={`dither-${activeIndex}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/35 mix-blend-hard-light"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(255,255,255,.95) 0 26%,rgba(8,8,8,.9) 30% 44%,transparent 48%)",
          backgroundSize: "5px 5px",
        }}
        initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={{
          opacity: [0, 0.9, 0],
          clipPath: [
            "inset(0 100% 0 0)",
            "inset(0 0% 0 0)",
            "inset(0 0 0 100%)",
          ],
          backgroundSize: ["4px 4px", "12px 12px", "5px 5px"],
        }}
        transition={{ duration: 1.05, ease: VAULT_EASE }}
      />

      <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-4 border-t border-white/45 pt-4 text-white sm:inset-x-6 sm:bottom-6">
        <div>
          <p className="font-kode text-[8px] uppercase tracking-[0.16em]">
            {frame.label}
          </p>
          <p className="mt-1 text-xs text-white/55">Hover to reveal color.</p>
        </div>
        <div className="flex gap-1.5">
          {DITHER_FRAMES.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.label}`}
              className={`h-3 transition-all ${
                index === activeIndex
                  ? "w-8 bg-[#d8ff36]"
                  : "w-3 bg-white/45 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LEGO_COLORS = ["#d8ff36", "#0b0b0b", "#ff5a36", "#2d6bff"] as const;
const LEGO_PLAN = [
  43, 44, 42, 45, 35, 36, 34, 37, 27, 28, 26, 29, 19, 20, 21, 11, 12, 13, 4, 5,
] as const;

const LegoSpecimen = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [blocks, setBlocks] = useState<Record<number, string>>({
    43: LEGO_COLORS[0],
    44: LEGO_COLORS[0],
    35: LEGO_COLORS[2],
    36: LEGO_COLORS[2],
    27: LEGO_COLORS[1],
  });
  const cells = useMemo(
    () => Array.from({ length: 48 }, (_, index) => index),
    [],
  );

  const toggleBlock = (index: number) => {
    setBlocks((current) => {
      const next = { ...current };
      if (next[index]) delete next[index];
      else next[index] = LEGO_COLORS[colorIndex];
      return next;
    });
  };

  const buildNext = () => {
    setBlocks((current) => {
      const nextCell = LEGO_PLAN.find((cell) => !current[cell]);
      if (nextCell === undefined) return {};
      return {
        ...current,
        [nextCell]:
          LEGO_COLORS[Object.keys(current).length % LEGO_COLORS.length],
      };
    });
  };

  return (
    <div className="flex min-h-[410px] flex-col bg-[#deddd5] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {LEGO_COLORS.map((color, index) => (
            <button
              key={color}
              type="button"
              onClick={() => setColorIndex(index)}
              aria-label={`Use LEGO color ${index + 1}`}
              className={`h-7 w-7 border border-black transition-transform ${
                colorIndex === index ? "rotate-45 scale-110" : "hover:scale-110"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="font-kode text-[7px] uppercase tracking-[0.14em] text-black/45">
          Click cells to build
        </span>
      </div>

      <div className="grid flex-1 grid-cols-8 gap-1 border border-black/25 bg-[#f4f3ec] p-3 shadow-[inset_0_0_28px_rgba(0,0,0,.08)]">
        {cells.map((cell) => {
          const block = blocks[cell];
          return (
            <button
              key={cell}
              type="button"
              onClick={() => toggleBlock(cell)}
              aria-label={`${block ? "Remove" : "Add"} LEGO block ${cell + 1}`}
              className="relative aspect-square border border-black/[0.06] bg-black/[0.025] outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <AnimatePresence>
                {block && (
                  <motion.span
                    className="absolute inset-[2px] border border-black/40 shadow-[0_5px_0_rgba(0,0,0,.28)]"
                    style={{ backgroundColor: block }}
                    initial={{ opacity: 0, y: -18, rotate: -8, scale: 0.75 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, rotate: 6, scale: 0.7 }}
                    transition={VAULT_SPRING}
                  >
                    <span className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-white/20 shadow-[0_2px_0_rgba(0,0,0,.25)]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={buildNext}
          className="flex items-center justify-between bg-black px-4 py-3 font-kode text-[8px] uppercase tracking-[0.14em] text-white hover:bg-[#d8ff36] hover:text-black"
        >
          Build next <Boxes className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setBlocks({})}
          className="flex items-center justify-between border border-black px-4 py-3 font-kode text-[8px] uppercase tracking-[0.14em] hover:bg-black hover:text-white"
        >
          Clear plate <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const PokeballSpecimen = () => {
  const [run, setRun] = useState(0);

  return (
    <div className="relative min-h-[420px] overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:9px_9px]" />
      <div className="absolute inset-x-6 top-6 z-20 flex items-start justify-between gap-5">
        <div>
          <strong className="font-telegraf text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Enter the other world.
          </strong>
          <p className="mt-3 max-w-md text-sm leading-[1.65] text-white/55">
            The portfolio’s calm shell gives way to the full PortfolioMon game.
          </p>
        </div>
        <Sparkles className="h-7 w-7 text-[#d8ff36]" strokeWidth={1.3} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={run} className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[10px] border-black bg-[linear-gradient(to_bottom,#f4f3ec_0%,#f4f3ec_44%,#0b0b0b_44%,#0b0b0b_56%,#d8ff36_56%,#d8ff36_100%)] shadow-[0_0_0_2px_rgba(255,255,255,.3),0_0_80px_rgba(216,255,54,.5)]"
            initial={{ scale: 0.06, rotate: -35, opacity: 0 }}
            animate={{
              scale: [0.06, 0.9, 0.82, 7.4, 7.8],
              rotate: [-35, 8, -4, 0, 0],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1.65,
              times: [0, 0.32, 0.48, 0.82, 1],
              ease: [0.7, 0, 0.2, 1],
            }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[7px] border-black bg-white">
              <motion.span
                className="h-3 w-3 rounded-full bg-[#d8ff36]"
                animate={{ scale: [0.6, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.7, repeat: 1 }}
              />
            </span>
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.95, 0] }}
            transition={{ duration: 1.65, times: [0, 0.72, 0.84, 1] }}
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setRun((current) => current + 1)}
        className="circuit-action absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-[#d8ff36] px-5 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-black transition hover:bg-white"
      >
        Replay transition <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
};

const ComponentVault = () => (
  <div className="grid gap-4 lg:grid-cols-12">
    <VaultSpecimen
      index="01"
      title="Portfolio frames"
      description="Adaptive cut corners, circuit rails, surfaces, and spacing that make the page feel like one continuous chassis."
      className="lg:col-span-7"
    >
      <FrameSpecimen />
    </VaultSpecimen>

    <VaultSpecimen
      index="02"
      title="Commit field"
      description="The actual GitHub contribution calendar, turned into a responsive field that reacts to every date you trace."
      className="lg:col-span-5"
    >
      <CommitSpecimen />
    </VaultSpecimen>

    <VaultSpecimen
      index="03"
      title="Dither transitions"
      description="Ordered-dither canvases that resolve into full color on hover and tear diagonally between frames."
      className="lg:col-span-7"
    >
      <DitherSpecimen />
    </VaultSpecimen>

    <VaultSpecimen
      index="04"
      title="LEGO builder"
      description="A tiny construction plate for building, deleting, recoloring, and animating ideas one block at a time."
      className="lg:col-span-5"
    >
      <LegoSpecimen />
    </VaultSpecimen>

    <VaultSpecimen
      index="05"
      title="Poké Ball transition"
      description="The oversized iris that marks the jump from quiet portfolio to the playable PortfolioMon world."
      className="lg:col-span-12"
    >
      <PokeballSpecimen />
    </VaultSpecimen>
  </div>
);

export default ComponentVault;
