import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Images,
  Linkedin,
  Mail,
  Maximize2,
  Play,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SOCIAL_LINKS } from "../../constants/site";
import {
  ACTIVE_CONTRIBUTION_DAYS,
  COMMIT_CELLS,
  CONTRIBUTION_SNAPSHOT,
  DEFAULT_ACTIVE_DAY,
  TOTAL_CONTRIBUTIONS,
} from "../../data/commitActivity";
import { PHILOSOPHIES, type Philosophy } from "../../data/philosophies";
import OperatorLab from "./operatorLab";

type GalleryShot = {
  readonly image?: string;
  readonly title: string;
  readonly caption: string;
  readonly fit?: "cover" | "contain";
};

type FeaturedProject = {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  readonly url: string;
  readonly github: string;
  readonly summary: string;
  readonly detail: string;
  readonly types: readonly [string, string];
  readonly year: string;
  readonly gallery: readonly GalleryShot[];
  readonly internal?: boolean;
};

const FEATURED_PROJECTS = [
  {
    id: 10,
    name: "Princeton Tower Defense",
    image: "/images/princetontd.png",
    url: "https://ptd.quest/",
    github: "https://github.com/Kevin-Liu-01/Princeton-Tower-Defense",
    summary: "Defend Princeton, one campus at a time.",
    detail:
      "A browser tower-defense world with 26 maps, seven towers, nine heroes, and more than 100 enemies.",
    types: ["Game", "Canvas"],
    year: "2025",
    gallery: [
      {
        image: "/images/princetontd/gameplay_desert_ui.png",
        title: "Desert campaign",
        caption: "A complete desert level with the live tower and wave HUD.",
      },
      {
        image: "/images/princetontd/gameplay_frontier_ui.png",
        title: "Frontier",
        caption: "Campus defense pushed into a wide frontier encounter.",
      },
      {
        image: "/images/princetontd/gameplay_grounds_ui.png",
        title: "The Grounds",
        caption: "One of 26 maps, framed as a playable Princeton miniature.",
      },
      {
        image: "/images/princetontd/gameplay_swamp_ui.png",
        title: "Swamp route",
        caption: "A darker biome with a completely different pathing read.",
      },
      {
        image: "/images/princetontd/gameplay_volcano_ui.png",
        title: "Volcano",
        caption: "Late-game pressure, hot palette, and maximum screen energy.",
      },
      {
        image: "/images/princetontd/gameplay_winter_ui.png",
        title: "Winter campus",
        caption: "The same system re-authored as a cold Princeton encounter.",
      },
    ],
  },
  {
    id: 9,
    name: "Loop",
    image: "/images/loop-homepage.png",
    url: "https://loooop.dev/",
    github: "https://github.com/Kevin-Liu-01/Loop",
    summary: "Skills that never go stale.",
    detail:
      "An operator desk that monitors upstream sources, reviews changes, and keeps agent playbooks current.",
    types: ["Agents", "Knowledge"],
    year: "2026",
    gallery: [
      {
        image: "/images/loop-homepage.png",
        title: "Loop home",
        caption: "The public promise: skills that evolve on their own.",
      },
      {
        image: "/images/project-galleries/loop/catalog.png",
        title: "Skill catalog",
        caption: "A working inventory of playbooks, sources, and freshness.",
      },
      {
        image: "/images/project-galleries/loop/skill.png",
        title: "Skill detail",
        caption:
          "Version history, evidence, sources, and the current artifact.",
      },
      {
        image: "/images/project-galleries/loop/scheduled-runs.png",
        title: "Scheduled intelligence",
        caption:
          "Every maintenance run is visible, inspectable, and replayable.",
      },
      {
        image: "/images/project-galleries/loop/edit-automation.png",
        title: "Automation editor",
        caption: "The operator controls what changes, when, and why.",
      },
    ],
  },
  {
    id: 5,
    name: "Agent Machines",
    image: "/images/agentmachines.png",
    url: "https://www.agent-machines.dev/",
    github: "https://github.com/Kevin-Liu-01/Agent-Machines",
    summary: "Durable computers for persistent workers.",
    detail:
      "Provision and inspect always-on agent machines with filesystem state, tools, and resumable work.",
    types: ["Agents", "Systems"],
    year: "2026",
    gallery: [
      {
        image: "/images/agentmachines.png",
        title: "Machine surface",
        caption: "Provision, inspect, and return to a persistent computer.",
      },
      {
        image: "/images/project-galleries/agent-machines/machines.png",
        title: "Machines",
        caption: "Long-lived computers organized as first-class agent objects.",
      },
      {
        image: "/images/project-galleries/agent-machines/agents.png",
        title: "Agents",
        caption:
          "Workers, state, and execution history in one visual language.",
      },
      {
        image: "/images/project-galleries/agent-machines/console.png",
        title: "Console",
        caption: "A direct operational view into the machine while it works.",
      },
    ],
  },
  {
    id: 0,
    name: "Reticle",
    image: "/images/reticle.png",
    url: "https://reticle-demo.vercel.app/",
    github: "https://github.com/dedalus-labs",
    summary: "Persistent computers for agents.",
    detail:
      "Sub-second machines, durable runtime, and a motion-rich control surface for agent compute.",
    types: ["Infrastructure", "Interface"],
    year: "2026",
    gallery: [
      {
        image: "/images/reticle.png",
        title: "Reticle control surface",
        caption: "Persistent computers presented as fast, inspectable objects.",
      },
      {
        title: "Machine inspection",
        caption: "ADD HERE — authenticated machine detail capture needed.",
      },
      {
        title: "Live terminal",
        caption: "ADD HERE — private running-computer capture needed.",
      },
    ],
  },
  {
    id: 1,
    name: "Ariadne",
    image: "/images/ariadne.png",
    url: "https://ariadne.dedaluslabs.ai/",
    github: "https://github.com/Kevin-Liu-01/Ariadne",
    summary: "A phone-first agent for runway night.",
    detail:
      "An AI companion built around immediacy, place, live quests, music, and a little drama.",
    types: ["Agents", "Product"],
    year: "2026",
    gallery: [
      {
        image: "/images/project-galleries/ariadne/landing.png",
        title: "Run(way)time",
        caption: "The public invitation into Ariadne's one-night world.",
      },
      {
        image: "/images/project-galleries/ariadne/join.png",
        title: "Join flow",
        caption: "A phone-first path from guest to active participant.",
      },
      {
        image: "/images/project-galleries/ariadne/operator.png",
        title: "Operator view",
        caption: "The live control system behind the event and its agent.",
      },
      {
        image: "/images/project-galleries/ariadne/projection.png",
        title: "Room-scale output",
        caption: "Ariadne leaves the phone and becomes part of the venue.",
      },
    ],
  },
  {
    id: 2,
    name: "Sandbox Arena",
    image: "/images/sandbox-arena.png",
    url: "https://sandboxarena.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sandbox-Arena",
    summary: "Cloud sandboxes, put under pressure.",
    detail:
      "A live benchmark where infrastructure providers race head to head with objective metrics and crowd Elo.",
    types: ["Data", "Experiment"],
    year: "2026",
    gallery: [
      {
        image: "/images/sandbox-arena.png",
        title: "Arena board",
        caption: "Providers race on visible timings, status, and crowd Elo.",
      },
      {
        image: "/images/project-galleries/sandbox-arena/cold-start.jpg",
        title: "Cold start",
        caption: "A workload built to expose provisioning latency.",
        fit: "cover",
      },
      {
        image: "/images/project-galleries/sandbox-arena/fs-storm.jpg",
        title: "Filesystem storm",
        caption: "Pressure on many small reads and writes inside the sandbox.",
        fit: "cover",
      },
      {
        image: "/images/project-galleries/sandbox-arena/npm-install.jpg",
        title: "Package install",
        caption: "A familiar developer workload turned into a benchmark.",
        fit: "cover",
      },
    ],
  },
  {
    id: 7,
    name: "Sigil UI",
    image: "/images/sigil-ui.png",
    url: "https://sigil-ui-web.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sigil-UI",
    summary: "An agent-first design system.",
    detail:
      "A broad component language with 350+ pieces, 46 presets, and one token-driven visual system.",
    types: ["Design system", "Web"],
    year: "2025",
    gallery: [
      {
        image: "/images/sigil-ui.png",
        title: "Sigil index",
        caption: "A component language organized for humans and agents.",
      },
      {
        title: "Component laboratory",
        caption: "ADD HERE — authenticated component explorer capture needed.",
      },
      {
        title: "Preset composer",
        caption: "ADD HERE — private preset workflow capture needed.",
      },
    ],
  },
  {
    id: 11,
    name: "Dedalus Demo",
    image: "/images/dedalus.png",
    url: "https://dedalus-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Dedalus-Demo",
    summary: "Model-agnostic agents, made tangible.",
    detail:
      "An interactive product demo for MCP orchestration, tool connections, authentication, and the Dedalus SDK.",
    types: ["Agents", "Developer tools"],
    year: "2025",
    gallery: [
      {
        image: "/images/dedalus.png",
        title: "Interactive SDK demo",
        caption: "Model routing, tools, and MCP made tangible in the browser.",
      },
      {
        image: "/images/project-galleries/dedalus-demo/deploy.png",
        title: "Deploy",
        caption: "A visual explanation of how an agent reaches production.",
      },
      {
        image: "/images/project-galleries/dedalus-demo/sdk.png",
        title: "SDK",
        caption:
          "The core developer loop expressed as a concise product frame.",
      },
    ],
  },
  {
    id: 13,
    name: "Sevenfold",
    image: "/images/sevenfold.png",
    url: "https://sevenfold-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sevenfold-Demo",
    summary: "Research without losing the trail.",
    detail:
      "A workspace for semantic paper search, inline annotations, corpus-wide chat, and citation tracing.",
    types: ["Research", "AI"],
    year: "2025",
    gallery: [
      {
        image: "/images/project-galleries/sevenfold/mockup.webp",
        title: "Research workspace",
        caption: "Search, reading, notes, and corpus context share one desk.",
      },
      {
        image: "/images/project-galleries/sevenfold/search.png",
        title: "Semantic search",
        caption: "Find papers by idea, not merely by exact wording.",
      },
      {
        image: "/images/project-galleries/sevenfold/pdf.png",
        title: "PDF viewer",
        caption: "Read and annotate without leaving the research trail.",
      },
      {
        image: "/images/project-galleries/sevenfold/chat.png",
        title: "Corpus chat",
        caption: "Ask across the collection while keeping citations attached.",
      },
    ],
  },
  {
    id: 15,
    name: "Lumachor",
    image: "/images/lumachor.png",
    url: "https://lumachor.vercel.app/home",
    github: "https://github.com/Kevin-Liu-01/Lumachor",
    summary: "Context engineering without the ceremony.",
    detail:
      "A document and vector-search engine that assembles useful context before an LLM ever sees the prompt.",
    types: ["AI", "Data"],
    year: "2024",
    gallery: [
      {
        image: "/images/lumachor.png",
        title: "Lumachor home",
        caption: "Context engineering presented as a calm working surface.",
      },
      {
        image: "/images/project-galleries/lumachor/library.png",
        title: "Library",
        caption: "Documents, collections, and source state in one place.",
      },
      {
        image: "/images/project-galleries/lumachor/search.png",
        title: "Search",
        caption: "Find the right evidence before a model sees the prompt.",
      },
      {
        image: "/images/project-galleries/lumachor/context.png",
        title: "Context assembly",
        caption: "Inspect and shape the exact bundle sent downstream.",
      },
      {
        image: "/images/project-galleries/lumachor/chat.png",
        title: "Grounded chat",
        caption: "Conversation stays attached to selected source material.",
      },
    ],
  },
  {
    id: 12,
    name: "Podium",
    image: "/images/podium.png",
    url: "https://hackprinceton-podium.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Podium",
    summary: "A control room for hackathon judging.",
    detail:
      "Judge assignments, score aggregation, live leaderboards, and abuse prevention for HackPrinceton.",
    types: ["Events", "Data"],
    year: "2025",
    gallery: [
      {
        image: "/images/project-galleries/podium/demo.png",
        title: "Judging control room",
        caption: "Assignments, submissions, scores, and rankings at a glance.",
      },
      {
        title: "Judge assignment",
        caption: "ADD HERE — authenticated judging workflow capture needed.",
      },
      {
        title: "Live leaderboard",
        caption: "ADD HERE — event-day leaderboard capture needed.",
      },
    ],
  },
  {
    id: 14,
    name: "PortfolioMon",
    image: "/images/kevinportfolio.png",
    url: "/?play=1",
    github: "https://github.com/Kevin-Liu-01/PortfolioMon-Showdown",
    summary: "My old portfolio, preserved as a game.",
    detail:
      "Forty real projects become a team-building, turn-based battle system.",
    types: ["Game", "Archive"],
    year: "2025—26",
    gallery: [
      {
        image: "/images/kevinportfolio.png",
        title: "PortfolioMon world",
        caption: "The original game portfolio preserved as a playable project.",
      },
      {
        image: "/images/gameplay.png",
        title: "Battle system",
        caption: "Projects become a party with moves, stats, and encounters.",
      },
      {
        image: "/images/tutorial.png",
        title: "Trainer onboarding",
        caption: "The rules of the portfolio explained through play.",
      },
      {
        image: "/images/backgrounds/background-3.jpg",
        title: "Arena atmosphere",
        caption: "One of the environmental frames behind the showdown.",
        fit: "cover",
      },
    ],
    internal: true,
  },
] as const satisfies readonly FeaturedProject[];

const TOOL_ARCHIVE = [
  {
    name: "local-search",
    category: "Rust CLI",
    description:
      "Free structured web search for agents, powered by your local browser.",
    url: "https://github.com/Kevin-Liu-01/Local-Search",
  },
  {
    name: "Agent Ping",
    category: "Human-in-the-loop",
    description:
      "Lets any coding agent ask for approval or a decision without silently stalling.",
    url: "https://github.com/Kevin-Liu-01/Agent-Ping",
  },
  {
    name: "Agent Broom",
    category: "Process hygiene",
    description:
      "Audits ports, agent-owned processes, caches, and safe cleanup targets.",
    url: "https://github.com/Kevin-Liu-01/Agent-Broom",
  },
  {
    name: "Agent Pets",
    category: "Codex companions",
    description:
      "Versioned, installable pixel companions with repaired sprite atlases and QA sheets.",
    url: "https://github.com/Kevin-Liu-01/Agent-Pets",
  },
  {
    name: "Loop",
    category: "Skill operations",
    description:
      "An operator desk that watches agent-skill sources and ships inspectable refreshes.",
    url: "https://loooop.dev/",
  },
  {
    name: "Agent Machines",
    category: "Agent control plane",
    description:
      "Deploys persistent agent workers across runtimes and compute substrates.",
    url: "https://www.agent-machines.dev/",
  },
  {
    name: "Minecraft Agent",
    category: "MCP stack",
    description:
      "A planning, memory, building, and survival agent inside a live Minecraft world.",
    url: "https://github.com/Kevin-Liu-01/Minecraft-Agent",
  },
  {
    name: "DJ Agent",
    category: "Natural-language CLI",
    description:
      "A terminal Spotify DJ that searches, queues, and controls playback conversationally.",
    url: "https://github.com/Kevin-Liu-01/dj-agent",
  },
  {
    name: "X Agent",
    category: "Social agent",
    description:
      "A read-and-write agent interface for X with cookie reads and official API writes.",
    url: "https://github.com/Kevin-Liu-01/X-Agent",
  },
] as const;

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

const DEFAULT_MEDIA_FOCUS = [0.5, 0.5] as const;

const CHOPPED =
  "polygon(0 18px, 18px 0, calc(100% - 44px) 0, calc(100% - 32px) 12px, 100% 12px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 32px 100%, 20px calc(100% - 12px), 0 calc(100% - 12px))";

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const MOTION_SPRING = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
  mass: 0.8,
};

const SECTION_FRAME =
  "circuit-chassis mx-3 max-w-[1520px] sm:mx-6 lg:mx-10 2xl:mx-auto";

type FrameSurface = "paper" | "ink" | "acid";

const FRAME_SURFACE: Record<
  FrameSurface,
  {
    glyph: string;
    line: string;
    label: string;
    muted: string;
    signal: string;
  }
> = {
  paper: {
    glyph: "bg-[#f4f3ec] text-black",
    line: "border-black/35",
    label: "border-black/35 bg-[#f4f3ec] text-black/55",
    muted: "text-black/30",
    signal: "bg-black dark:bg-white",
  },
  ink: {
    glyph: "bg-black text-white",
    line: "border-white/35",
    label: "border-white/30 bg-black text-white/60",
    muted: "text-white/35",
    signal: "bg-white",
  },
  acid: {
    glyph: "bg-[#d8ff36] text-black",
    line: "border-black/40",
    label: "border-black/35 bg-[#d8ff36] text-black/60",
    muted: "text-black/35",
    signal: "bg-black",
  },
};

const RoundedBracketCross = ({
  surface = "paper",
  className = "",
}: {
  surface?: FrameSurface;
  className?: string;
}) => (
  <span
    className={`flex h-6 w-6 items-center justify-center sm:h-9 sm:w-9 ${FRAME_SURFACE[surface].glyph} ${className}`}
  >
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path
        d="M14 4H9L4 9v5M22 4h5l5 5v5M32 22v5l-5 5h-5M14 32H9l-5-5v-5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M18 12.5v11M12.5 18h11"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m18 15 3 3-3 3-3-3 3-3Z" fill="currentColor" />
    </svg>
  </span>
);

const SECTION_RAIL_STOPS = [220, 500, 780] as const;
const SECTION_RAIL_PATTERNS = [
  [20, 34, 12],
  [32, 10, 28],
  [14, 30, 18],
  [28, 14, 34],
] as const;

const SectionCircuitRail = ({
  side,
  index,
  surface,
}: {
  side: "left" | "right";
  index: string;
  surface: FrameSurface;
}) => {
  const seed = Array.from(index).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const pattern =
    SECTION_RAIL_PATTERNS[seed % SECTION_RAIL_PATTERNS.length] ??
    SECTION_RAIL_PATTERNS[0];
  const mapRailX = (value: number) => (side === "left" ? value : 40 - value);
  const base = mapRailX(39);
  const path = [
    `M ${base} 0`,
    ...SECTION_RAIL_STOPS.flatMap((stop, stopIndex) => [
      `V ${stop - 25}`,
      `L ${mapRailX(pattern[stopIndex] ?? 20)} ${stop + 25}`,
    ]),
    `V 940 L ${base} 980 V 1000`,
  ].join(" ");
  const traceColor =
    surface === "ink"
      ? "text-white/38"
      : surface === "acid"
        ? "text-black/45"
        : "text-black/38 dark:text-white/38";
  const signalColor = surface === "acid" ? "#0b0b0b" : "#d8ff36";

  return (
    <div
      className={`absolute inset-y-0 ${side}-0 !hidden w-7 overflow-visible opacity-70 transition-opacity duration-300 group-hover/section:opacity-100 lg:w-10 ${traceColor}`}
    >
      <svg
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {SECTION_RAIL_STOPS.map((stop, stopIndex) => (
          <rect
            key={stop}
            x={mapRailX(pattern[stopIndex] ?? 20) - 2}
            y={stop + 23}
            width="4"
            height="4"
            fill={stopIndex === 1 ? signalColor : "currentColor"}
            opacity={stopIndex === 1 ? 0.9 : 0.42}
          />
        ))}
      </svg>
    </div>
  );
};

const SectionChrome = ({
  index,
  label,
  surface = "paper",
}: {
  index: string;
  label: string;
  surface?: FrameSurface;
}) => {
  const styles = FRAME_SURFACE[surface];

  return (
    <div
      aria-hidden="true"
      data-frame-label={label}
      className="pointer-events-none absolute inset-0 z-20"
    >
      <div className={`absolute inset-x-10 top-0 border-t ${styles.line}`} />
      <SectionCircuitRail side="left" index={index} surface={surface} />
      <SectionCircuitRail side="right" index={index} surface={surface} />

      <RoundedBracketCross
        surface={surface}
        className="absolute left-1 top-1"
      />
      <RoundedBracketCross
        surface={surface}
        className="absolute right-1 top-1 rotate-90"
      />
      <RoundedBracketCross
        surface={surface}
        className="absolute bottom-1 left-1 -rotate-90"
      />
      <RoundedBracketCross
        surface={surface}
        className="absolute bottom-1 right-1 rotate-180"
      />

      {["top-[28%]", "top-1/2", "top-[72%]"].map((position) => (
        <span
          key={`left-${position}`}
          className={`absolute left-0 hidden ${position} h-px w-3 -translate-x-1/2 border-t ${styles.line}`}
        />
      ))}
      {["top-[28%]", "top-1/2", "top-[72%]"].map((position) => (
        <span
          key={`right-${position}`}
          className={`absolute right-0 hidden ${position} h-px w-3 translate-x-1/2 border-t ${styles.line}`}
        />
      ))}
    </div>
  );
};

const SectionSpacer = ({ index, label }: { index: string; label: string }) => (
  <motion.div
    aria-hidden="true"
    data-scene={index}
    className={`relative flex h-[16dvh] max-h-[180px] min-h-[120px] items-center justify-center gap-4 overflow-hidden bg-black sm:gap-5 ${SECTION_FRAME}`}
    initial={{ opacity: 0.35 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.45 }}
    transition={{ duration: 0.7, ease: MOTION_EASE }}
  >
    <svg
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-white"
    >
      <motion.path
        d="M 0 14 H 72 L 90 26 H 392 L 416 38 H 446 M 1000 14 H 928 L 910 26 H 608 L 584 38 H 554"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        className="opacity-25"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 1.1, ease: MOTION_EASE }}
      />
      <motion.path
        d="M 0 86 H 58 L 78 74 H 402 L 424 61 H 446 M 1000 86 H 942 L 922 74 H 598 L 576 61 H 554"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        className="opacity-25"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 1.1, delay: 0.08, ease: MOTION_EASE }}
      />
      <motion.path
        d="M 28 0 V 27 L 42 41 V 59 L 28 73 V 100 M 972 0 V 27 L 958 41 V 59 L 972 73 V 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        className="opacity-35"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.9, delay: 0.16, ease: MOTION_EASE }}
      />
      {[28, 42, 958, 972].map((x) => (
        <rect
          key={x}
          x={x - 1.8}
          y="48.2"
          width="3.6"
          height="3.6"
          fill="currentColor"
          className="opacity-45"
        />
      ))}
    </svg>

    <motion.span
      className="h-2 w-2 rotate-45 bg-[#d8ff36]"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 45 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ ...MOTION_SPRING, delay: 0.12 }}
    />
    <motion.span
      className="font-telegraf text-xl font-black tracking-[-0.025em] text-white sm:text-2xl"
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ ...MOTION_SPRING, delay: 0.08 }}
    >
      {label}
    </motion.span>
  </motion.div>
);

const SceneCurtain = ({
  index,
  label,
  tone = "ink",
}: {
  index: string;
  label: string;
  tone?: "ink" | "paper" | "acid";
}) => {
  const reduceMotion = useReducedMotion();
  const background =
    tone === "paper"
      ? "bg-[#f4f3ec] text-black"
      : tone === "acid"
        ? "bg-[#d8ff36] text-black"
        : "bg-black text-white";

  return (
    <motion.div
      aria-hidden="true"
      data-scene={index}
      className={`pointer-events-none absolute inset-0 z-[45] flex items-center justify-center overflow-hidden ${background}`}
      initial={{ clipPath: "inset(0 0 0 0)" }}
      whileInView={{ clipPath: "inset(0 0 100% 0)" }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0.12 : 0.9,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <motion.div
        className="flex items-center gap-4"
        initial={{ y: 0, opacity: 1 }}
        whileInView={{ y: -56, opacity: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.55 }}
      >
        <span className="h-2 w-2 rotate-45 bg-[#d8ff36] mix-blend-difference" />
        <strong className="font-telegraf text-3xl font-black tracking-[-0.035em] sm:text-5xl">
          {label}
        </strong>
      </motion.div>
    </motion.div>
  );
};

const RevealBlock = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.72, delay, ease: MOTION_EASE }}
  >
    {children}
  </motion.div>
);

const HERO_SOCIAL_FRAMES = [
  {
    src: "/images/kevin_powerlifting_color.png",
    alt: "Kevin Liu walking onto the platform for Princeton Powerlifting",
    source: "Princeton Powerlifting",
    label: "Before the next attempt",
    note: "The same patience, under a different load",
    focus: [0.5, 0.42] as const,
  },
  {
    src: "/images/hero-social/ariadne-stage.jpg",
    alt: "Kevin Liu standing in the Ariadne runway installation",
    source: "LinkedIn",
    label: "Ariadne / Run(way)time",
    note: "Built for New York Tech Week",
    focus: [0.5, 0.5] as const,
  },
  {
    src: "/images/moments/hackprinceton-02.jpg",
    alt: "Kevin Liu throwing a Dedalus hoodie into a packed HackPrinceton room",
    source: "LinkedIn",
    label: "Throw the hoodie",
    note: "Technical depth with a little unhinged energy",
    focus: [0.78, 0.5] as const,
  },
  {
    src: "/images/moments/ariadne-03.jpg",
    alt: "Kevin Liu operating the Ariadne event system with his team",
    source: "LinkedIn",
    label: "Operating the room",
    note: "One agent across a live New York night",
    focus: [0.47, 0.5] as const,
  },
  {
    src: "/images/moments/hackprinceton-05.jpg",
    alt: "Kevin Liu posing playfully with a Dedalus teammate at HackPrinceton",
    source: "LinkedIn",
    label: "Still a little unserious",
    note: "Ambitious systems, generous people, dumb poses",
    focus: [0.7, 0.5] as const,
  },
  {
    src: "/images/moments/ariadne-04.jpg",
    alt: "Kevin Liu surrounded by the Ariadne team during a live demo",
    source: "LinkedIn",
    label: "The demo became a crowd",
    note: "The room leaning toward something that works",
    focus: [0.52, 0.5] as const,
  },
] as const;

const FIELD_MOMENTS = [
  {
    image: "/images/kevin_powerlifting_color.png",
    alt: "Kevin Liu walking onto the platform for Princeton Powerlifting",
    kicker: "Competition / Princeton Powerlifting",
    title: "One more clean rep.",
    story:
      "Powerlifting and software reward the same quiet thing: showing up, recording the work, and trusting that boring consistency will eventually look dramatic from the outside.",
    meta: "New Jersey / 2025",
    source: "Princeton Powerlifting",
    sourceUrl: "https://www.instagram.com/princetonpowerlifting/",
  },
  {
    image: "/images/moments/hackprinceton-04.jpg",
    alt: "Kevin Liu presenting Dedalus Machines to a packed HackPrinceton lecture hall",
    kicker: "Speaking / HackPrinceton S26",
    title: "From hacker to sponsor.",
    story:
      "Two years after my last high-school hackathon, I came back on the other side of the room—presenting Dedalus Machines, taking questions, and giving builders infrastructure to push against all weekend.",
    meta: "Princeton / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/moments/ariadne-03.jpg",
    alt: "Kevin Liu operating the Ariadne event system from a laptop with his team",
    kicker: "Demoing / Ariadne",
    title: "Operating the room.",
    story:
      "At Ariadne Run(way)time, one agent moved across texts, calls, a web player, and live projections. I stayed behind the screen with the team while 76 guests turned it into a living system.",
    meta: "New York / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/moments/ariadne-04.jpg",
    alt: "Kevin Liu and the Dedalus team gathered around a live Ariadne demo",
    kicker: "Showing / Ariadne",
    title: "The demo became a crowd.",
    story:
      "The good kind of launch is a little hard to explain because people are already leaning over the laptop, pulling in friends, and finding the next thing the system can do.",
    meta: "New York Tech Week",
    source: "X + LinkedIn",
    sourceUrl: "https://x.com/kevskgs/status/2065110236944588869",
  },
  {
    image: "/images/moments/hackprinceton-03.jpg",
    alt: "Kevin Liu debugging with HackPrinceton builders at their table",
    kicker: "Building / HackPrinceton S26",
    title: "Beside the builders.",
    story:
      "The stage is fun; the table is the real work. We sat with teams, traced failures, answered the weird questions, and helped ideas survive contact with the deadline.",
    meta: "Princeton / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/moments/hackprinceton-01.jpg",
    alt: "Kevin Liu with HackPrinceton teams and sponsor prizes",
    kicker: "Teams / HackPrinceton S26",
    title: "Builders on the board.",
    story:
      "A weekend is measured in what people ship and who they meet while shipping it. The prize table mattered less than the teams standing behind it with something new in the world.",
    meta: "Princeton / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/moments/hackprinceton-02.jpg",
    alt: "Kevin Liu throwing a Dedalus hoodie into a HackPrinceton lecture hall",
    kicker: "Energy / HackPrinceton S26",
    title: "Throw the hoodie.",
    story:
      "A packed room should feel packed. We brought technical depth, but also noise, prizes, and the kind of slightly unhinged energy that makes a long build night memorable.",
    meta: "Princeton / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/moments/ariadne-01.jpg",
    alt: "Kevin Liu standing in front of the Ariadne runway installation before the event",
    kicker: "On site / Ariadne",
    title: "Before the doors opened.",
    story:
      "A one-night product still deserves a world: narrative, interfaces, music, missions, physical space, and a system sturdy enough to disappear once the room fills up.",
    meta: "New York / 2026",
    source: "X + LinkedIn",
    sourceUrl: "https://x.com/kevskgs/status/2064508774317203549",
  },
  {
    image: "/images/moments/hackprinceton-05.jpg",
    alt: "Kevin Liu and a Dedalus teammate posing playfully at HackPrinceton",
    kicker: "People / Dedalus",
    title: "Still a little unserious.",
    story:
      "I care about ambitious systems and precise craft. I also want the people building them to be curious, generous, and capable of laughing in the middle of the sprint.",
    meta: "Princeton / 2026",
    source: "LinkedIn",
    sourceUrl:
      "https://www.linkedin.com/in/kevin-liu-princeton/recent-activity/images/",
  },
  {
    image: "/images/hero-social/gym-mirror.jpg",
    alt: "Kevin Liu coding from a gym bench between sets",
    kicker: "Routine / Between sets",
    title: "The work travels.",
    story:
      "Some ideas begin at a desk. Others arrive between sets with a laptop balanced on a bench. I like tools and routines that survive outside the ideal studio setup.",
    meta: "New Jersey / 2026",
    source: "X",
    sourceUrl: "https://x.com/kevskgs",
  },
] as const;

const DitherMedia = ({
  src,
  alt,
  priority = false,
  tone = "binary",
  revealOnParentHover = false,
  fit = "cover",
  focus = DEFAULT_MEDIA_FOCUS,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  tone?: "binary" | "soft";
  revealOnParentHover?: boolean;
  fit?: "cover" | "contain";
  focus?: readonly [number, number];
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const image = new window.Image();

    const paint = () => {
      if (disposed || !image.naturalWidth || !image.naturalHeight) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelSize =
        tone === "soft"
          ? bounds.width < 520
            ? 2
            : 2.5
          : bounds.width < 520
            ? 2.6
            : 3.2;
      const width = Math.max(1, Math.ceil(bounds.width / pixelSize));
      const height = Math.max(1, Math.ceil(bounds.height / pixelSize));
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.imageSmoothingEnabled = true;

      if (fit === "contain") {
        context.fillStyle = "#111111";
        context.fillRect(0, 0, width, height);
        const scale = Math.min(
          width / image.naturalWidth,
          height / image.naturalHeight,
        );
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.drawImage(
          image,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      } else {
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        const targetRatio = width / height;
        let sourceWidth = image.naturalWidth;
        let sourceHeight = image.naturalHeight;
        let sourceX = 0;
        let sourceY = 0;

        if (sourceRatio > targetRatio) {
          sourceWidth = image.naturalHeight * targetRatio;
          sourceX = (image.naturalWidth - sourceWidth) * focus[0];
        } else {
          sourceHeight = image.naturalWidth / targetRatio;
          sourceY = (image.naturalHeight - sourceHeight) * focus[1];
        }

        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          width,
          height,
        );
      }

      const pixels = context.getImageData(0, 0, width, height);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const offset = (y * width + x) * 4;
          const red = pixels.data[offset] ?? 0;
          const green = pixels.data[offset + 1] ?? 0;
          const blue = pixels.data[offset + 2] ?? 0;
          const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
          const matrixValue = BAYER_4[y % 4]?.[x % 4] ?? 0;
          const threshold = ((matrixValue + 0.5) / 16) * 255;
          const softOffset = (matrixValue / 15 - 0.5) * 46;
          const quantized = Math.round((luminance + softOffset) / 64) * 64;
          const value =
            tone === "soft"
              ? Math.max(16, Math.min(244, quantized))
              : luminance > threshold
                ? 244
                : 12;
          pixels.data[offset] = value;
          pixels.data[offset + 1] = value;
          pixels.data[offset + 2] = value;
          pixels.data[offset + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
    };

    image.onload = paint;
    image.src = src;
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [fit, focus, src, tone]);

  return (
    <div className={`group overflow-hidden bg-[#111] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 55vw, 100vw"
        style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }}
        className={`${
          fit === "contain" ? "object-contain" : "object-cover"
        } opacity-0 saturate-[1.15] transition-opacity duration-700 ease-out ${
          revealOnParentHover
            ? "group-hover/sequence:opacity-100"
            : "group-hover:opacity-100"
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 [image-rendering:pixelated] ${
          revealOnParentHover
            ? "group-hover/sequence:opacity-0"
            : "group-hover:opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,.18)_50%,transparent_65%)] opacity-0 transition duration-500 ${
          revealOnParentHover
            ? "group-hover/sequence:translate-x-1/3 group-hover/sequence:opacity-100"
            : "group-hover:translate-x-1/3 group-hover:opacity-100"
        }`}
      />
    </div>
  );
};

const HeroSocialSequence = ({
  reduceMotion,
  onExpand,
}: {
  reduceMotion: boolean;
  onExpand: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SOCIAL_FRAMES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  const activeFrame = HERO_SOCIAL_FRAMES[activeIndex];

  return (
    <div
      className="group/sequence absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <button
        type="button"
        onClick={onExpand}
        aria-label="Open Kevin's full moments gallery"
        className="absolute inset-0 z-10 cursor-zoom-in outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d8ff36]"
      />
      {HERO_SOCIAL_FRAMES.map((frame, index) => (
        <motion.div
          key={frame.src}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: index === activeIndex ? 1 : 0,
            scale: index === activeIndex ? 1 : 1.025,
            x: index === activeIndex ? 0 : index % 2 === 0 ? -16 : 16,
            rotate: index === activeIndex ? 0 : index % 2 === 0 ? -0.35 : 0.35,
            filter:
              index === activeIndex
                ? "contrast(1) brightness(1)"
                : "contrast(1.35) brightness(.65) blur(5px)",
            clipPath:
              index === activeIndex
                ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                : index % 2 === 0
                  ? "polygon(0 0, 7% 0, 0 100%, 0 100%)"
                  : "polygon(93% 0, 100% 0, 100% 100%, 100% 100%)",
          }}
          transition={{
            duration: reduceMotion ? 0.12 : 1.05,
            ease: MOTION_EASE,
          }}
          style={{ pointerEvents: index === activeIndex ? "auto" : "none" }}
          aria-hidden={index !== activeIndex}
        >
          <DitherMedia
            src={frame.src}
            alt={index === activeIndex ? frame.alt : ""}
            priority={index === 0}
            tone="soft"
            focus={frame.focus}
            revealOnParentHover
            className="absolute inset-0"
          />
        </motion.div>
      ))}

      {!reduceMotion && (
        <motion.div
          key={`dither-transition-${activeIndex}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-black/35 mix-blend-hard-light"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.98) 0 28%, rgba(8,8,8,.92) 31% 45%, transparent 48%)",
            backgroundSize: "4px 4px",
          }}
          initial={{ opacity: 0, backgroundSize: "3px 3px" }}
          animate={{
            opacity: [0, 0.9, 0],
            backgroundSize: ["3px 3px", "12px 12px", "4px 4px"],
            clipPath: [
              "polygon(0 0, 14% 0, 0 100%, 0 100%)",
              "polygon(0 0, 100% 0, 86% 100%, 0 100%)",
              "polygon(100% 0, 100% 0, 100% 100%, 86% 100%)",
            ],
          }}
          transition={{
            duration: 1.15,
            times: [0, 0.48, 1],
            ease: [0.7, 0, 0.2, 1],
          }}
        />
      )}

      <motion.div
        key={`hero-controls-${activeIndex}`}
        className="absolute inset-x-5 top-5 z-30 flex items-center justify-between gap-3 font-kode text-[7px] uppercase tracking-[0.16em] sm:inset-x-6 sm:text-[8px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION_SPRING}
      >
        <span className="circuit-control bg-white px-3 py-2 text-black">
          {String(activeIndex + 1).padStart(2, "0")} /
          {String(HERO_SOCIAL_FRAMES.length).padStart(2, "0")}
        </span>
        <span className="circuit-action flex items-center gap-2 bg-[#d8ff36] px-3 py-2 text-black">
          Expand
          <Maximize2 className="h-3.5 w-3.5" />
        </span>
      </motion.div>

      <div className="absolute inset-x-5 bottom-[116px] z-30 flex items-end justify-between gap-4 border-b border-white/45 pb-3 text-white sm:inset-x-6 sm:bottom-[132px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeFrame.src}
            className="min-w-0"
            initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
            transition={{ duration: 0.38, ease: MOTION_EASE }}
          >
            <p className="truncate font-kode text-[7px] uppercase tracking-[0.18em] sm:text-[8px]">
              {activeFrame.label}
            </p>
            <p className="mt-1 truncate font-nacelle text-[11px] text-white/60 sm:text-xs">
              {activeFrame.note}
            </p>
          </motion.div>
        </AnimatePresence>
        <div
          className="flex shrink-0 items-center gap-1"
          aria-label="Hero image selection"
        >
          {HERO_SOCIAL_FRAMES.map((frame, index) => (
            <motion.button
              key={frame.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${frame.label}`}
              aria-pressed={index === activeIndex}
              className="h-2.5 bg-white/45 hover:bg-white"
              animate={{
                width: index === activeIndex ? 28 : 10,
                backgroundColor:
                  index === activeIndex ? "#d8ff36" : "rgba(255,255,255,.45)",
              }}
              whileHover={{ y: -2 }}
              transition={MOTION_SPRING}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MomentFieldArchive = ({
  onExpand,
}: {
  onExpand: (index: number) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMoment = FIELD_MOMENTS[activeIndex];

  const selectMoment = (index: number) => setActiveIndex(index);

  return (
    <section
      id="moments"
      className={`group/section relative scroll-mt-20 border border-black bg-black text-white ${SECTION_FRAME}`}
    >
      <SceneCurtain index="00" label="Moments in the wild" />
      <SectionChrome index="00" label="Moments in the wild" surface="ink" />

      <RevealBlock className="grid gap-8 px-5 pb-7 pt-16 sm:px-8 sm:pb-10 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pb-7 lg:pt-14">
        <div className="lg:col-span-8">
          <h2 className="max-w-[12ch] font-telegraf text-[clamp(2.9rem,6vw,6.8rem)] font-black leading-[0.9] tracking-[-0.04em]">
            I like being in the room when it becomes real.
          </h2>
        </div>
        <div className="flex items-end lg:col-span-4">
          <p className="max-w-[38ch] font-nacelle text-[15px] leading-[1.7] text-white/60 sm:text-[17px]">
            Speaking, shipping, debugging, and celebrating with the people who
            make the work worth doing. A few frames from outside the mockup.
          </p>
        </div>
      </RevealBlock>

      <div className="border-y border-white/20 lg:grid lg:min-h-[620px] lg:grid-cols-12">
        <button
          type="button"
          onClick={() => onExpand(activeIndex)}
          aria-label={`Expand moment: ${activeMoment.title}`}
          className="group relative aspect-[16/10] cursor-zoom-in overflow-hidden bg-[#141414] text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d8ff36] lg:col-span-8 lg:aspect-auto lg:min-h-0 lg:border-r lg:border-white/20"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMoment.image}
              className="absolute inset-0"
              initial={{
                opacity: 0,
                x: 22,
                filter: "grayscale(1) contrast(1.25) blur(7px)",
                clipPath: "polygon(8% 0,100% 0,92% 100%,0 100%)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                filter: "grayscale(0) contrast(1) blur(0px)",
                clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
              }}
              exit={{
                opacity: 0,
                x: -16,
                filter: "grayscale(1) contrast(1.2) blur(5px)",
              }}
              transition={{ duration: 0.58, ease: MOTION_EASE }}
            >
              <Image
                src={activeMoment.image}
                alt={activeMoment.alt}
                fill
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-2 font-kode text-[7px] uppercase tracking-[0.16em] sm:inset-x-6 sm:top-6 sm:text-[8px]">
            <span className="circuit-control bg-white px-3 py-2 text-black">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {FIELD_MOMENTS.length}
            </span>
            <span className="circuit-action flex items-center gap-1.5 bg-[#d8ff36] px-3 py-2 text-black">
              Expand <Maximize2 className="h-3 w-3" />
            </span>
          </div>
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeMoment.image}-copy`}
            aria-live="polite"
            className="flex min-h-[380px] flex-col justify-between p-5 sm:p-8 lg:col-span-4 lg:min-h-0 lg:p-10"
            initial={{ opacity: 0, y: 18, filter: "blur(7px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.42, ease: MOTION_EASE }}
          >
            <div className="flex items-start justify-between gap-5 border-b border-white/25 pb-5 font-kode text-[7px] uppercase tracking-[0.17em] text-white/45 sm:text-[8px]">
              <span>{activeMoment.meta}</span>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {FIELD_MOMENTS.length}
              </span>
            </div>
            <div className="py-10">
              <h3 className="font-telegraf text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-5xl">
                {activeMoment.title}
              </h3>
              <p className="mt-6 max-w-[38ch] font-nacelle text-[15px] leading-[1.75] text-white/65 sm:text-base">
                {activeMoment.story}
              </p>
            </div>
            <a
              href={activeMoment.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-t border-white/25 pt-5 font-kode text-[8px] uppercase tracking-[0.18em] text-white/70 transition hover:text-[#d8ff36] sm:text-[9px]"
            >
              View the original / {activeMoment.source}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="grid grid-cols-2 gap-px bg-white/20 sm:grid-cols-5 lg:shrink-0 lg:grid-cols-10"
        role="tablist"
        aria-label="Select a field moment"
      >
        {FIELD_MOMENTS.map((moment, index) => {
          const active = index === activeIndex;
          return (
            <motion.button
              key={moment.image}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show moment ${index + 1}: ${moment.title}`}
              onMouseEnter={() => selectMoment(index)}
              onFocus={() => selectMoment(index)}
              onClick={() => {
                selectMoment(index);
                onExpand(index);
              }}
              className={`group relative aspect-[4/3] overflow-hidden bg-black text-left outline-none transition focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d8ff36] lg:aspect-auto lg:h-[78px] ${
                active ? "opacity-100" : "opacity-60 hover:opacity-90"
              }`}
              animate={{ y: active ? -4 : 0 }}
              whileHover={{ y: -4 }}
              transition={MOTION_SPRING}
            >
              <Image
                src={moment.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 12.5vw, (min-width: 640px) 25vw, 50vw"
                className={`object-cover transition-[filter] duration-300 ${
                  active
                    ? "grayscale-0"
                    : "contrast-125 grayscale group-hover:grayscale-0"
                }`}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent px-3 pb-2 pt-8 font-kode text-[7px] uppercase tracking-[0.14em] text-white sm:text-[8px]">
                {String(index + 1).padStart(2, "0")}
                <span
                  className={`h-1.5 w-1.5 ${
                    active ? "bg-[#d8ff36]" : "bg-white/55"
                  }`}
                />
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

const GalleryPlaceholder = ({ shot }: { shot: GalleryShot }) => (
  <div className="relative flex h-full min-h-[48vh] w-full items-center justify-center overflow-hidden bg-[#11110f] p-8 text-center text-white">
    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:9px_9px]" />
    <div className="absolute inset-5 border border-white/15" />
    <div className="absolute left-5 top-5 h-14 w-14 border-l border-t border-[#d8ff36]" />
    <div className="absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#d8ff36]" />
    <div className="relative max-w-xl">
      <span className="mx-auto flex h-16 w-16 items-center justify-center bg-[#d8ff36] text-black [clip-path:polygon(12px_0,100%_0,100%_calc(100%_-_12px),calc(100%_-_12px)_100%,0_100%,0_12px)]">
        <Images className="h-7 w-7" />
      </span>
      <strong className="mt-8 block font-telegraf text-[clamp(3.6rem,9vw,8rem)] font-black leading-[0.82] tracking-[-0.05em]">
        ADD HERE
      </strong>
      <p className="mx-auto mt-6 max-w-[48ch] font-nacelle text-sm leading-relaxed text-white/55 sm:text-base">
        {shot.caption}
      </p>
    </div>
  </div>
);

const GalleryArrowControls = ({
  onPrevious,
  onNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
}) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={onPrevious}
      aria-label="Previous image"
      className="circuit-control flex h-11 w-12 items-center justify-center border border-white/25 bg-black/70 text-white backdrop-blur transition hover:bg-[#d8ff36] hover:text-black"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
    <button
      type="button"
      onClick={onNext}
      aria-label="Next image"
      className="circuit-control-reverse flex h-11 w-12 items-center justify-center border border-white/25 bg-black/70 text-white backdrop-blur transition hover:bg-[#d8ff36] hover:text-black"
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  </div>
);

const MomentGalleryOverlay = ({
  openIndex,
  onClose,
}: {
  openIndex: number | null;
  onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(openIndex ?? 0);

  useEffect(() => {
    if (openIndex !== null) setActiveIndex(openIndex);
  }, [openIndex]);

  const activeMoment = FIELD_MOMENTS[activeIndex] ?? FIELD_MOMENTS[0];
  const move = (direction: number) =>
    setActiveIndex(
      (current) =>
        (current + direction + FIELD_MOMENTS.length) % FIELD_MOMENTS.length,
    );

  return (
    <AnimatePresence>
      {openIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Kevin Liu moments gallery"
          className="fixed inset-0 z-[140] overflow-y-auto bg-black text-white"
          initial={{ opacity: 0, clipPath: "inset(12% 9% 12% 9%)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ opacity: 0, clipPath: "inset(8% 7% 8% 7%)" }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/20 bg-black/75 px-4 py-3 backdrop-blur-xl sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.18em] text-white/70 transition hover:text-[#d8ff36]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to portfolio
            </button>
            <span className="hidden font-kode text-[7px] uppercase tracking-[0.2em] text-white/40 sm:block">
              Hero archive / {String(activeIndex + 1).padStart(2, "0")} of 08
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close moments gallery"
              className="circuit-control-reverse flex h-9 w-10 items-center justify-center bg-white text-black transition hover:bg-[#d8ff36]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid min-h-[100svh] pt-16 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="relative min-h-[44svh] overflow-hidden border-b border-white/20 bg-[#090909] sm:min-h-[58svh] lg:min-h-[calc(100svh-64px)] lg:border-b-0 lg:border-r">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMoment.image}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.025, filter: "grayscale(1)" }}
                  animate={{ opacity: 1, scale: 1, filter: "grayscale(0)" }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={activeMoment.image}
                    alt={activeMoment.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) calc(100vw - 390px), 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="font-kode text-[7px] uppercase tracking-[0.18em] text-white/70 sm:text-[8px]">
                    <span className="mr-2 bg-[#d8ff36] px-2 py-1 text-black">
                      Open frame
                    </span>
                    {activeMoment.kicker}
                  </div>
                  <GalleryArrowControls
                    onPrevious={() => move(-1)}
                    onNext={() => move(1)}
                  />
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {FIELD_MOMENTS.map((moment, index) => (
                    <button
                      key={moment.image}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${moment.title}`}
                      aria-pressed={index === activeIndex}
                      className={`relative aspect-[4/3] overflow-hidden border transition ${
                        index === activeIndex
                          ? "border-[#d8ff36] opacity-100"
                          : "border-white/20 opacity-45 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={moment.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 10vw, (min-width: 640px) 20vw, 33vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.aside
              key={`${activeMoment.image}-expanded-copy`}
              className="flex min-h-[42svh] flex-col justify-between p-6 pt-10 sm:p-9 lg:min-h-0 lg:p-10 lg:pt-12"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/20 pb-4 font-kode text-[7px] uppercase tracking-[0.18em] text-white/40">
                  <span>{activeMoment.meta}</span>
                  <span>{String(activeIndex + 1).padStart(2, "0")} / 08</span>
                </div>
                <h2 className="mt-12 font-telegraf text-[clamp(3rem,5vw,5.8rem)] font-black leading-[0.88] tracking-[-0.045em]">
                  {activeMoment.title}
                </h2>
                <p className="mt-7 font-nacelle text-base leading-[1.8] text-white/65">
                  {activeMoment.story}
                </p>
              </div>
              <a
                href={activeMoment.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-12 flex items-center justify-between border-t border-white/20 pt-5 font-kode text-[8px] uppercase tracking-[0.18em] text-white/65 hover:text-[#d8ff36]"
              >
                Original / {activeMoment.source}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectGalleryOverlay = ({
  project,
  onClose,
  onPlay,
}: {
  project: FeaturedProject | null;
  onClose: () => void;
  onPlay: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [project]);

  const shots = project?.gallery ?? [];
  const activeShot = shots[activeIndex] ?? shots[0];
  const move = (direction: number) => {
    if (!shots.length) return;
    setActiveIndex(
      (current) => (current + direction + shots.length) % shots.length,
    );
  };

  return (
    <AnimatePresence>
      {project && activeShot && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} project gallery`}
          className="fixed inset-0 z-[140] overflow-y-auto bg-[#f4f3ec] text-black"
          initial={{ opacity: 0, clipPath: "inset(10% 8% 10% 8%)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ opacity: 0, clipPath: "inset(8% 6% 8% 6%)" }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/20 bg-black px-4 py-3 text-white sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.18em] text-white/70 transition hover:text-[#d8ff36]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to projects
            </button>
            <span className="hidden font-kode text-[7px] uppercase tracking-[0.2em] text-white/40 sm:block">
              PKMN–{String(project.id).padStart(3, "0")} / visual archive
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${project.name} gallery`}
              className="circuit-control-reverse flex h-9 w-10 items-center justify-center bg-white text-black transition hover:bg-[#d8ff36]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid min-h-[100svh] pt-16 lg:grid-cols-[minmax(0,1fr)_410px]">
            <div className="relative min-h-[44svh] overflow-hidden border-b border-black bg-black sm:min-h-[58svh] lg:min-h-[calc(100svh-64px)] lg:border-b-0 lg:border-r">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${activeIndex}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.02, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.985, x: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeShot.image ? (
                    <Image
                      src={activeShot.image}
                      alt={`${project.name}: ${activeShot.title}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) calc(100vw - 410px), 100vw"
                      className={
                        activeShot.fit === "cover"
                          ? "object-cover"
                          : "object-contain"
                      }
                    />
                  ) : (
                    <GalleryPlaceholder shot={activeShot} />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="bg-black/75 px-3 py-2 font-kode text-[7px] uppercase tracking-[0.18em] text-white backdrop-blur sm:text-[8px]">
                    <span className="mr-2 text-[#d8ff36]">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(shots.length).padStart(2, "0")}
                    </span>
                    {activeShot.title}
                  </div>
                  <GalleryArrowControls
                    onPrevious={() => move(-1)}
                    onNext={() => move(1)}
                  />
                </div>
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))`,
                  }}
                >
                  {shots.map((shot, index) => (
                    <button
                      key={`${shot.title}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${shot.title}`}
                      aria-pressed={index === activeIndex}
                      className={`relative aspect-[16/9] overflow-hidden border bg-[#151515] transition ${
                        index === activeIndex
                          ? "border-[#d8ff36] opacity-100"
                          : "border-white/20 opacity-45 hover:opacity-100"
                      }`}
                    >
                      {shot.image ? (
                        <Image
                          src={shot.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center font-kode text-[5px] uppercase tracking-[0.12em] text-[#d8ff36] sm:text-[6px]">
                          Add here
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.aside
              key={`${project.id}-${activeIndex}-copy`}
              className="flex min-h-[42svh] flex-col justify-between p-6 pt-10 sm:p-9 lg:min-h-0 lg:p-10 lg:pt-12"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32 }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/25 pb-4 font-kode text-[7px] uppercase tracking-[0.18em] text-black/45">
                  <span>{project.year}</span>
                  <span>{project.types.join(" / ")}</span>
                </div>
                <h2 className="mt-10 font-telegraf text-[clamp(3.2rem,5.4vw,6rem)] font-black leading-[0.86] tracking-[-0.05em]">
                  {project.name}
                </h2>
                <p className="mt-5 font-nacelle text-lg font-medium leading-tight">
                  {project.summary}
                </p>
                <p className="mt-5 font-nacelle text-[15px] leading-[1.75] text-black/60">
                  {project.detail}
                </p>
                <div className="mt-9 border-l-2 border-[#d8ff36] pl-4">
                  <strong className="font-telegraf text-xl font-black">
                    {activeShot.title}
                  </strong>
                  <p className="mt-2 font-nacelle text-sm leading-relaxed text-black/55">
                    {activeShot.caption}
                  </p>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-2">
                {project.internal ? (
                  <button
                    type="button"
                    onClick={onPlay}
                    className="circuit-action flex items-center justify-between bg-black px-4 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-white hover:bg-[#d8ff36] hover:text-black"
                  >
                    Play <Play className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="circuit-action flex items-center justify-between bg-black px-4 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-white hover:bg-[#d8ff36] hover:text-black"
                  >
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="circuit-control flex items-center justify-between border border-black px-4 py-3 font-kode text-[8px] uppercase tracking-[0.15em] hover:bg-black hover:text-white"
                >
                  GitHub <Github className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BallGlyph = ({ inverted = false }: { inverted?: boolean }) => (
  <span
    aria-hidden="true"
    className={`relative block h-8 w-8 overflow-hidden rounded-full border ${
      inverted
        ? "border-white bg-black text-white"
        : "border-black bg-white text-black"
    }`}
  >
    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-current" />
    <span
      className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${
        inverted ? "bg-white" : "bg-black"
      }`}
    />
    <span
      className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
        inverted ? "border-white bg-black" : "border-black bg-white"
      }`}
    />
  </span>
);

const ProjectCard = ({
  project,
  index,
  onEnter,
  onOpen,
}: {
  project: FeaturedProject;
  index: number;
  onEnter: () => void;
  onOpen: () => void;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 38, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{
        y: -7,
        boxShadow: "0 20px 0 rgba(11,11,11,.16)",
        transition: MOTION_SPRING,
      }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.65,
        delay: (index % 2) * 0.08,
        ease: MOTION_EASE,
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        onOpen();
      }}
      className="group relative h-full cursor-zoom-in bg-black p-px"
      style={{ clipPath: CHOPPED }}
    >
      <div
        className="flex h-full flex-col bg-[#f4f3ec]"
        style={{ clipPath: CHOPPED }}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${project.name} image gallery`}
          className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden border-b border-black/25 bg-black text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d8ff36]"
        >
          <DitherMedia
            src={project.image}
            alt={`${project.name} project preview`}
            fit="contain"
            className="absolute inset-0"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.16em] sm:left-4 sm:top-4">
            <span className="bg-white px-2 py-1 text-black">
              PKMN–{String(project.id).padStart(3, "0")}
            </span>
            <span className="bg-black px-2 py-1 text-white">
              {project.year}
            </span>
          </div>
          <span className="circuit-action absolute bottom-3 right-3 flex items-center gap-2 bg-[#d8ff36] px-3 py-2 font-kode text-[7px] uppercase tracking-[0.15em] text-black sm:bottom-4 sm:right-4 sm:text-[8px]">
            Expand / {String(project.gallery.length).padStart(2, "0")} views
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </button>

        <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <span className="font-kode text-[8px] uppercase tracking-[0.2em] text-black/45">
              Field note / {String(index + 1).padStart(2, "0")}
            </span>
            {project.internal && <BallGlyph />}
          </div>

          <div className="my-8 flex-1 sm:my-10">
            <h3 className="font-telegraf text-3xl font-black tracking-[-0.025em] sm:text-4xl">
              {project.name}
            </h3>
            <p className="mt-3 max-w-md font-nacelle text-lg font-medium leading-tight sm:text-xl">
              {project.summary}
            </p>
            <p className="mt-3 max-w-[46ch] font-nacelle text-[14px] leading-[1.7] text-black/60 sm:text-[15px]">
              {project.detail}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-black/35 pt-4">
            {project.types.map((type) => (
              <span
                key={type}
                className="border border-black/25 px-2 py-1 font-kode text-[7px] uppercase tracking-[0.14em]"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="circuit-action col-span-2 flex items-center justify-between bg-[#d8ff36] px-3 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
            >
              View full gallery
              <span className="flex items-center gap-2">
                {String(project.gallery.length).padStart(2, "0")} frames
                <Images className="h-3.5 w-3.5" />
              </span>
            </button>
            {project.internal ? (
              <button
                type="button"
                onClick={onEnter}
                className="flex items-center justify-between border border-black bg-black px-3 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-white transition hover:bg-[#d8ff36] hover:text-black"
              >
                Play project <Play className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-black bg-black px-3 py-3 font-kode text-[8px] uppercase tracking-[0.15em] text-white transition hover:bg-[#d8ff36] hover:text-black"
              >
                Open project <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-black px-3 py-3 font-kode text-[8px] uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
            >
              GitHub <Github className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const UnassignedArt = () => (
  <div className="relative h-full min-h-[430px] overflow-hidden bg-black text-white sm:min-h-[560px]">
    <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:7px_7px]" />
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 700 560"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M78 405 C 180 110, 480 90, 620 300 C 690 405, 510 500, 336 430 C 180 368, 230 190, 380 178"
        stroke="rgba(255,255,255,.42)"
        strokeWidth="1"
      />
      <motion.circle
        r="8"
        fill="#d8ff36"
        animate={{
          cx: [78, 190, 420, 620, 500, 336, 210, 380],
          cy: [405, 170, 112, 300, 470, 430, 300, 178],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>

    {[
      ["NO BRIEF", "18%", "14%", -7],
      ["NO RUBRIC", "48%", "27%", 6],
      ["NO PERMISSION", "23%", "62%", -2],
    ].map(([label, left, top, rotate], index) => (
      <motion.div
        key={label}
        className="absolute w-[44%] border border-white/55 bg-black/80 p-4 backdrop-blur-sm sm:p-5"
        style={{
          left: String(left),
          top: String(top),
          rotate: Number(rotate),
          clipPath:
            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
        }}
        animate={{ y: [0, index % 2 === 0 ? -9 : 9, 0] }}
        transition={{
          duration: 3.8 + index * 0.65,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center justify-between font-kode text-[8px] uppercase tracking-[0.18em] text-white/55">
          <span>Constraint / 0{index + 1}</span>
          <span>×</span>
        </div>
        <p className="mt-8 font-telegraf text-2xl font-black tracking-[-0.02em] line-through decoration-1 sm:text-4xl">
          {label}
        </p>
      </motion.div>
    ))}

    <motion.div
      className="absolute bottom-[8%] right-[8%] bg-[#d8ff36] px-5 py-4 text-black"
      style={{
        clipPath:
          "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
      }}
      animate={{ rotate: [-2, 2, -2], scale: [1, 1.025, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <strong className="block font-telegraf text-3xl tracking-[-0.02em] sm:text-5xl">
        MAKE IT.
      </strong>
    </motion.div>
  </div>
);

const TasteArt = () => (
  <div className="relative h-full min-h-[430px] overflow-hidden bg-[#d8ff36] text-black sm:min-h-[560px]">
    <motion.div
      className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[34px] border-black"
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
    </motion.div>

    <div className="absolute left-[7%] top-[8%] font-kode text-[8px] uppercase tracking-[0.2em]">
      Interface calibration / live
    </div>
    <div className="absolute left-[7%] top-[18%] font-telegraf text-[clamp(7rem,20vw,13rem)] font-black leading-none tracking-[-0.035em]">
      Aa
    </div>

    <div className="absolute inset-x-[7%] bottom-[8%] border border-black bg-[#f4f3ec] p-5 sm:p-7">
      <div className="mb-6 flex items-center justify-between font-kode text-[8px] uppercase tracking-[0.18em]">
        <span>Function</span>
        <span>Feeling</span>
      </div>
      {(
        [
          ["Hierarchy", 78],
          ["Spacing", 64],
          ["Motion", 86],
        ] as const
      ).map(([label, value], index) => (
        <div
          key={label}
          className="mb-4 grid grid-cols-[82px_1fr_30px] items-center gap-3 last:mb-0"
        >
          <span className="font-kode text-[8px] uppercase tracking-[0.12em]">
            {label}
          </span>
          <div className="relative h-2 bg-black/15">
            <motion.div
              className="absolute inset-y-0 left-0 bg-black"
              initial={{ width: 0 }}
              whileInView={{ width: `${value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15 + index * 0.12 }}
            />
            <motion.span
              className="absolute top-1/2 h-4 w-1 -translate-y-1/2 bg-black"
              initial={{ left: 0 }}
              whileInView={{ left: `calc(${value}% - 2px)` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15 + index * 0.12 }}
            />
          </div>
          <span className="text-right font-kode text-[8px]">{value}</span>
        </div>
      ))}
      <motion.div
        className="mt-7 flex items-center justify-between border-t border-black pt-4 font-telegraf text-xl font-bold sm:text-2xl"
        animate={{ letterSpacing: ["0em", "0.06em", "0em"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span>CLARITY</span>
        <span>+</span>
        <span>CHARACTER</span>
      </motion.div>
    </div>
  </div>
);

const PlayArt = () => {
  const nodes = [
    [18, 24, "BENCHMARK"],
    [77, 18, "AGENT"],
    [22, 76, "PORTFOLIO"],
    [80, 72, "SYSTEM"],
  ] as const;

  return (
    <div className="relative h-full min-h-[430px] overflow-hidden bg-black text-white sm:min-h-[560px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 700 560"
        fill="none"
        aria-hidden="true"
      >
        <path d="M126 134 L350 280 L539 101" stroke="rgba(255,255,255,.28)" />
        <path d="M154 426 L350 280 L560 403" stroke="rgba(255,255,255,.28)" />
        <path
          d="M126 134 L154 426"
          stroke="rgba(255,255,255,.14)"
          strokeDasharray="5 8"
        />
        <path
          d="M539 101 L560 403"
          stroke="rgba(255,255,255,.14)"
          strokeDasharray="5 8"
        />
        <motion.circle
          r="7"
          fill="#d8ff36"
          animate={{
            cx: [126, 350, 539, 350, 560, 350, 154, 350, 126],
            cy: [134, 280, 101, 280, 403, 280, 426, 280, 134],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {nodes.map(([left, top, label], index) => (
        <motion.div
          key={label}
          className="absolute flex h-20 w-28 items-center justify-center border border-white/50 bg-black font-kode text-[8px] uppercase tracking-[0.15em] sm:h-24 sm:w-36"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            x: "-50%",
            y: "-50%",
            clipPath:
              "polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px)",
          }}
          animate={{
            borderColor: [
              "rgba(255,255,255,.35)",
              "rgba(216,255,54,.95)",
              "rgba(255,255,255,.35)",
            ],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: index * 0.42,
          }}
        >
          {label}
        </motion.div>
      ))}

      <motion.div
        className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#d8ff36] bg-black shadow-[0_0_60px_rgba(216,255,54,.18)] sm:h-44 sm:w-44"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-center">
          <BallGlyph inverted />
          <span className="mt-3 block font-kode text-[8px] uppercase tracking-[0.2em] text-[#d8ff36]">
            Make it playable
          </span>
        </div>
      </motion.div>

      <span className="absolute bottom-5 left-5 font-kode text-[8px] uppercase tracking-[0.18em] text-white/45">
        Input → consequence → understanding
      </span>
    </div>
  );
};

const AdditionalPhilosophyArt = ({
  kind,
}: {
  kind: Extract<Philosophy["id"], "systems" | "proof" | "open">;
}) => {
  const config = {
    systems: {
      code: "SYS / 04",
      title: "THE SECOND RUN",
      labels: ["STATE", "VISIBILITY", "RECOVERY", "TRUST"],
      acid: false,
    },
    proof: {
      code: "PRF / 05",
      title: "SHOW THE PULSE",
      labels: ["CLAIM", "INPUT", "EVIDENCE", "CONVICTION"],
      acid: true,
    },
    open: {
      code: "OPN / 06",
      title: "LEAVE THE SOURCE",
      labels: ["ARTIFACT", "SOURCE", "FORK", "COMPOUND"],
      acid: false,
    },
  }[kind];

  return (
    <div
      className={`relative h-full min-h-[430px] overflow-hidden sm:min-h-[560px] ${
        config.acid ? "bg-[#d8ff36] text-black" : "bg-black text-white"
      }`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(currentColor_1px,transparent_1px)] [background-size:100%_42px]" />
      <div className="border-current/30 absolute inset-6 border sm:inset-10" />
      <strong className="absolute left-10 top-14 max-w-[80%] font-telegraf text-[clamp(3.2rem,7vw,7rem)] font-black leading-[0.84] tracking-[-0.05em] sm:left-14 sm:top-20">
        {config.title}
      </strong>
      <div className="absolute inset-x-10 bottom-10 grid grid-cols-2 gap-2 sm:inset-x-14 sm:bottom-14 sm:grid-cols-4">
        {config.labels.map((label, index) => (
          <motion.div
            key={label}
            className={`border px-3 py-4 font-kode text-[7px] uppercase tracking-[0.15em] sm:py-6 ${
              config.acid
                ? "border-black/35 bg-[#d8ff36]"
                : "border-white/35 bg-black"
            }`}
            animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
            transition={{
              duration: 3.2 + index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="mb-5 block opacity-45">0{index + 1}</span>
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PhilosophyArt = ({ kind }: { kind: Philosophy["id"] }) => {
  if (kind === "unassigned") return <UnassignedArt />;
  if (kind === "taste") return <TasteArt />;
  if (kind === "play") return <PlayArt />;
  return <AdditionalPhilosophyArt kind={kind} />;
};

const PhilosophyChapter = ({
  philosophy,
  index,
}: {
  philosophy: Philosophy;
  index: number;
}) => {
  const inverted = philosophy.id === "taste";
  const artFirst = index % 2 === 1;

  return (
    <Link
      id={`philosophy-${philosophy.id}`}
      href={`/en/philosophy/${philosophy.id}`}
      className={`group/section group relative my-4 block border border-black outline-none focus-visible:ring-4 focus-visible:ring-[#d8ff36] sm:my-6 ${SECTION_FRAME}`}
    >
      <SectionChrome
        index={`P-${philosophy.number}`}
        label="Field note"
        surface={inverted ? "ink" : "paper"}
      />
      <motion.section
        initial={{ opacity: 0, y: 38 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={inverted ? "bg-black text-white" : "bg-[#f4f3ec] text-black"}
      >
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[680px] lg:grid-cols-12">
          <div
            className={`flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:p-12 ${
              artFirst ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="my-14 lg:my-0">
              <h3 className="max-w-2xl font-telegraf text-[clamp(3.2rem,5.6vw,6.8rem)] font-black leading-[0.92] tracking-[-0.025em] transition-[font-style,transform] group-hover:-translate-y-1 group-hover:italic">
                {philosophy.title}
              </h3>
              <div
                className={`mt-9 max-w-[62ch] space-y-5 border-l pl-5 font-nacelle text-base leading-[1.75] sm:pl-7 sm:text-lg ${
                  inverted
                    ? "text-white/67 border-white/30"
                    : "text-black/62 border-black/30"
                }`}
              >
                {philosophy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div
              className={`flex items-center justify-between gap-4 border-t pt-4 font-kode text-[8px] uppercase tracking-[0.18em] ${
                inverted
                  ? "border-white/35 text-white/55"
                  : "border-black/35 text-black/50"
              }`}
            >
              <span>{philosophy.annotation}</span>
              <span className="flex shrink-0 items-center gap-2 opacity-100">
                Read full article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </span>
            </div>
          </div>

          <div
            className={`overflow-hidden p-3 sm:p-5 lg:col-span-7 ${
              artFirst ? "lg:order-1 lg:border-r" : "lg:order-2 lg:border-l"
            } ${inverted ? "border-white/25" : "border-black/25"}`}
          >
            <div
              className="h-full overflow-hidden transition-transform duration-700 group-hover:scale-[0.985]"
              style={{ clipPath: CHOPPED }}
            >
              <PhilosophyArt kind={philosophy.id} />
            </div>
          </div>
        </div>
      </motion.section>
    </Link>
  );
};

type HeroMode = "dither" | "orbit" | "signal";

const HERO_MODES: Array<{ id: HeroMode; short: string }> = [
  { id: "signal", short: "SIG" },
  { id: "dither", short: "DTH" },
  { id: "orbit", short: "ORB" },
];

const HeroMarginRail = ({
  side,
  mode,
  onMode,
}: {
  side: "left" | "right";
  mode: HeroMode;
  onMode: (mode: HeroMode) => void;
}) => (
  <aside
    aria-label={
      side === "left" ? "Responsive pointer trace" : "Hero visual modes"
    }
    className={`relative hidden h-full min-h-0 overflow-hidden bg-[#f4f3ec] text-black xl:block ${
      side === "left" ? "border-r border-black/20" : "border-l border-black/20"
    }`}
  >
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 64 720"
      preserveAspectRatio="none"
    >
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeOpacity=".42"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        animate={{
          d:
            side === "left"
              ? `M 63 0 V 196 L ${mode === "orbit" ? 22 : mode === "signal" ? 38 : 30} 238 V 482 L 63 524 V 720`
              : `M 1 0 V 196 L ${mode === "orbit" ? 42 : mode === "signal" ? 26 : 34} 238 V 482 L 1 524 V 720`,
        }}
        transition={{ type: "spring", stiffness: 105, damping: 24 }}
      />
    </svg>

    <div
      aria-hidden="true"
      className={`absolute top-[var(--spot-y,50%)] h-3 w-3 -translate-y-1/2 rotate-45 bg-[#d8ff36] transition-[left,right] duration-500 ${
        side === "left" ? "right-0" : "left-0"
      }`}
    />

    {side === "right" && (
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col gap-2">
        {HERO_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Use ${item.id} hero mode`}
            aria-pressed={mode === item.id}
            onClick={() => onMode(item.id)}
            className={`h-2.5 w-2.5 rotate-45 border transition ${
              mode === item.id
                ? "border-[#d8ff36] bg-[#d8ff36]"
                : "border-current bg-transparent opacity-35 hover:bg-current hover:opacity-100"
            }`}
          />
        ))}
      </div>
    )}
  </aside>
);

const HERO_COMMIT_CELLS = COMMIT_CELLS.filter((cell) => !cell.future);

const HeroCommitField = ({ onMode }: { onMode: (mode: HeroMode) => void }) => {
  const defaultIndex = Math.max(
    0,
    HERO_COMMIT_CELLS.findIndex((cell) => cell.key === DEFAULT_ACTIVE_DAY.key),
  );
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const activeCell = HERO_COMMIT_CELLS[activeIndex] ?? DEFAULT_ACTIVE_DAY;

  const wakeCell = (index: number) => {
    setActiveIndex(index);
    onMode(HERO_MODES[index % HERO_MODES.length].id);
  };

  return (
    <motion.div
      className="relative min-w-0 overflow-hidden py-5 lg:py-8 lg:pl-4"
      initial={{ opacity: 0, x: 38, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ ...MOTION_SPRING, delay: 0.32 }}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[88%] bg-[radial-gradient(circle_at_82%_48%,rgba(216,255,54,.19),transparent_38%),linear-gradient(90deg,transparent,rgba(10,10,10,.035))]" />

      <div className="relative lg:pl-10 lg:[mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,.28)_12%,black_34%)]">
        <div className="mb-5 flex items-end justify-between gap-5 border-b border-black/25 pb-4">
          <div>
            <p className="font-telegraf text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              {TOTAL_CONTRIBUTIONS.toLocaleString()} contributions
            </p>
            <p className="mt-1 font-kode text-[7px] uppercase tracking-[0.16em] text-black/45 sm:text-[8px]">
              Kevin-Liu-01 / GitHub / 2026
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCell.key}
              initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: MOTION_EASE }}
              className="text-right font-kode text-[6px] uppercase tracking-[0.13em] text-black/50 sm:text-[7px]"
            >
              <strong className="block text-black">{activeCell.label}</strong>
              {activeCell.count} contribution
              {activeCell.count === 1 ? "" : "s"}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="overflow-x-auto overflow-y-visible py-3">
          <div
            className="ml-auto grid min-w-[480px] gap-1"
            style={{
              gridTemplateRows: "repeat(7, 12px)",
              gridAutoFlow: "column",
              gridAutoColumns: "12px",
            }}
            role="grid"
            aria-label={`Interactive GitHub contribution history for 2026, ${TOTAL_CONTRIBUTIONS.toLocaleString()} contributions`}
          >
            {HERO_COMMIT_CELLS.map((cell, index) => {
              const columnDistance = Math.abs(
                Math.floor(index / 7) - Math.floor(activeIndex / 7),
              );
              const rowDistance = Math.abs((index % 7) - (activeIndex % 7));
              const energy = Math.max(0, 3 - columnDistance - rowDistance);
              const unavailable = !cell.inYear;
              const intensity =
                cell.count === 0
                  ? 0.075
                  : Math.min(1, 0.12 + Math.log2(cell.count + 1) / 7);
              const baseColor = unavailable
                ? "rgba(10,10,10,.025)"
                : `rgba(10,10,10,${intensity})`;

              return (
                <motion.button
                  key={cell.key}
                  type="button"
                  role="gridcell"
                  aria-label={`${cell.label}: ${cell.count} contributions`}
                  disabled={unavailable}
                  onPointerEnter={() => !unavailable && wakeCell(index)}
                  onFocus={() => !unavailable && wakeCell(index)}
                  onClick={() => !unavailable && wakeCell(index)}
                  animate={{
                    scale: index === activeIndex ? 1.9 : 1 + energy * 0.13,
                    rotate:
                      index === activeIndex ? 45 : energy > 0 ? energy * 5 : 0,
                    backgroundColor:
                      index === activeIndex
                        ? "#d8ff36"
                        : energy > 0
                          ? `rgba(10,10,10,${Math.max(intensity, 0.2 + energy * 0.18)})`
                          : baseColor,
                    boxShadow:
                      index === activeIndex
                        ? "0 0 0 2px rgba(216,255,54,.25)"
                        : "0 0 0 0 rgba(216,255,54,0)",
                  }}
                  transition={{ type: "spring", stiffness: 520, damping: 25 }}
                  className="h-3 w-3 outline-none ring-black focus-visible:ring-1 disabled:cursor-default"
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/20 pt-4 font-kode text-[6px] uppercase tracking-[0.14em] text-black/40 sm:text-[7px]">
          <span>
            {ACTIVE_CONTRIBUTION_DAYS} active days / through{" "}
            {CONTRIBUTION_SNAPSHOT}
          </span>
          <span className="flex shrink-0 items-center gap-2 text-black/65">
            <span className="h-1.5 w-1.5 rotate-45 bg-[#d8ff36]" />
            Trace the graph
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HeaderContactCluster = ({ compact = false }: { compact?: boolean }) => {
  const contacts = [
    {
      label: "GitHub",
      href: SOCIAL_LINKS.github,
      icon: <Github className="h-3.5 w-3.5" />,
    },
    {
      label: "LinkedIn",
      href: SOCIAL_LINKS.linkedin,
      icon: <Linkedin className="h-3.5 w-3.5" />,
    },
    {
      label: "X",
      href: SOCIAL_LINKS.x,
      icon: <span className="font-telegraf text-[10px] font-black">X</span>,
    },
    {
      label: "Email",
      href: `mailto:${SOCIAL_LINKS.email}`,
      icon: <Mail className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <motion.nav
      layoutId="header-contact-cluster"
      aria-label="Contact Kevin Liu"
      className={`flex items-center overflow-hidden border border-black/20 bg-white ${
        compact ? "h-8" : "h-10"
      }`}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      {!compact && (
        <span className="hidden h-full items-center bg-black px-3 font-kode text-[7px] uppercase tracking-[0.17em] text-white sm:flex">
          Contact
          <span className="ml-2 h-1.5 w-1.5 rotate-45 bg-[#d8ff36]" />
        </span>
      )}
      {contacts.map((contact) => (
        <Link
          key={contact.label}
          href={contact.href}
          target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
          aria-label={contact.label}
          className={`group flex h-full items-center justify-center gap-2 border-l border-black/15 text-black/55 transition first:border-l-0 hover:bg-black hover:text-white ${
            compact ? "w-8" : "w-9 px-2 xl:w-auto xl:px-3"
          }`}
        >
          {contact.icon}
          {!compact && (
            <span className="hidden font-kode text-[7px] uppercase tracking-[0.12em] xl:inline">
              {contact.label}
            </span>
          )}
        </Link>
      ))}
    </motion.nav>
  );
};

const ProjectIndexLanding = ({ onEnter }: { onEnter: () => void }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [heroMode, setHeroMode] = useState<HeroMode>("dither");
  const [navDocked, setNavDocked] = useState(false);
  const [momentGalleryIndex, setMomentGalleryIndex] = useState<number | null>(
    null,
  );
  const [galleryProject, setGalleryProject] = useState<FeaturedProject | null>(
    null,
  );
  const reduceMotion = useReducedMotion();

  const launch = useCallback(() => {
    if (!isLaunching) setIsLaunching(true);
  }, [isLaunching]);

  useEffect(() => {
    if (!isLaunching) return;
    const timer = window.setTimeout(onEnter, reduceMotion ? 120 : 1100);
    return () => window.clearTimeout(timer);
  }, [isLaunching, onEnter, reduceMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "b" &&
        momentGalleryIndex === null &&
        !galleryProject
      ) {
        launch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryProject, launch, momentGalleryIndex]);

  useEffect(() => {
    if (momentGalleryIndex === null && !galleryProject) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMomentGalleryIndex(null);
        setGalleryProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryProject, momentGalleryIndex]);

  useEffect(() => {
    const syncNavToWindow = () => setNavDocked(window.scrollY > 112);
    syncNavToWindow();
    window.addEventListener("scroll", syncNavToWindow, { passive: true });
    return () => window.removeEventListener("scroll", syncNavToWindow);
  }, []);

  const followPointer = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "contrast(1.8) grayscale(1)" }}
      transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
      className="bw-portfolio min-h-screen overflow-x-hidden bg-black pb-20 text-[#0b0b0b] sm:pb-24"
    >
      <div aria-hidden="true" className="h-[68px]" />
      <motion.header
        initial={false}
        animate={{
          top: navDocked ? 12 : 0,
          width: navDocked
            ? "min(410px, calc(100vw - 32px))"
            : "min(1520px, calc(100vw - clamp(20px, 6.25vw, 80px)))",
          height: navDocked ? 50 : 68,
          boxShadow: navDocked
            ? "0 16px 50px rgba(0,0,0,.32)"
            : "0 0 0 rgba(0,0,0,0)",
          clipPath: navDocked
            ? "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)"
            : "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 12px)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 29, mass: 0.8 }}
        className="fixed left-1/2 z-[95] -translate-x-1/2 overflow-hidden border border-black/30 bg-[#f4f3ec]/95 text-black backdrop-blur-xl"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {navDocked ? (
            <motion.div
              key="compact-kevin"
              className="flex h-full items-center justify-center gap-3 px-3"
              initial={{ opacity: 0, scale: 0.86, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              transition={{ duration: 0.22 }}
            >
              <motion.div layoutId="header-kevin-name">
                <Link
                  href="/#top"
                  className="group flex h-8 items-center justify-center gap-2 px-2 font-telegraf text-sm font-black uppercase tracking-[-0.01em]"
                >
                  Kevin Liu
                  <motion.span
                    className="h-1.5 w-1.5 rotate-45 bg-[#d8ff36]"
                    animate={{ rotate: [45, 135, 45] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </Link>
              </motion.div>
              <HeaderContactCluster compact />
            </motion.div>
          ) : (
            <motion.div
              key="opening-nav"
              className="relative flex h-full items-center justify-between gap-4 px-2 sm:px-3"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div layoutId="header-kevin-name">
                <Link
                  href="/#top"
                  className="circuit-control group flex min-w-0 items-center gap-2 px-3 py-2 transition-colors hover:bg-black hover:text-white"
                >
                  <span className="truncate font-telegraf text-sm font-black uppercase tracking-[-0.02em] sm:text-base">
                    Kevin Liu
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#d8ff36]" />
                </Link>
              </motion.div>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
                <span className="hidden h-px min-w-6 flex-1 bg-black/20 sm:block" />
                <HeaderContactCluster />
                <span className="hidden h-px min-w-6 flex-1 bg-black/20 sm:block" />
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={launch}
                  className="circuit-action group relative flex h-10 items-center gap-2 bg-black px-2 pl-4 font-kode text-[7px] uppercase tracking-[0.12em] text-white transition hover:bg-[#d8ff36] hover:text-black sm:pl-5 sm:text-[8px]"
                >
                  <span className="hidden sm:inline">Play PortfolioMon</span>
                  <span className="sm:hidden">Play</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-[360deg]">
                    <Play className="h-3 w-3 fill-current" />
                  </span>
                </button>
              </div>

              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0.5 bg-[#d8ff36]"
                initial={{ width: 0 }}
                animate={{ width: "12%" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <section
        id="top"
        onMouseMove={followPointer}
        className="spotlight-field relative mx-3 max-w-[1520px] border-x border-b border-black/30 bg-[#f4f3ec] text-black sm:mx-6 lg:mx-10 2xl:mx-auto"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))",
        }}
      >
        <div className="mx-auto grid w-full grid-cols-1 items-stretch xl:grid-cols-[64px_minmax(0,1fr)_64px]">
          <HeroMarginRail side="left" mode={heroMode} onMode={setHeroMode} />

          <div className="mx-auto flex w-full flex-col bg-[#f4f3ec]">
            <div className="relative z-10 flex min-h-[520px] min-w-0 flex-col justify-between border-b border-black p-5 sm:min-h-[560px] sm:p-8 lg:min-h-[520px] lg:p-10 xl:p-12">
              <div className="grid flex-1 items-center gap-2 py-5 sm:py-7 xl:grid-cols-[minmax(0,.82fr)_minmax(560px,1.18fr)] xl:py-2">
                <h1 className="relative z-10 max-w-[10ch] font-telegraf text-[clamp(3.8rem,5.9vw,6.4rem)] font-black leading-[0.86] tracking-[-0.045em]">
                  {[
                    { text: "Agents,", italic: false },
                    { text: "games &", italic: false },
                    { text: "sharp tools.", italic: true },
                  ].map((line, index) => (
                    <span
                      key={line.text}
                      className="block overflow-hidden pb-1"
                    >
                      <motion.span
                        className={`block ${line.italic ? "font-normal italic" : ""}`}
                        initial={{ y: "115%", opacity: 0, rotate: 1.4 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{
                          ...MOTION_SPRING,
                          delay: reduceMotion ? 0 : 0.08 + index * 0.09,
                        }}
                      >
                        {line.text}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                <HeroCommitField onMode={setHeroMode} />
              </div>

              <motion.div
                className="grid gap-5 border-t border-black pt-4 sm:grid-cols-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...MOTION_SPRING,
                  delay: reduceMotion ? 0 : 0.42,
                }}
              >
                <p className="max-w-md font-nacelle text-base font-medium leading-snug sm:text-lg">
                  I ship agent systems, browser games, and small tools—then
                  document the people, decisions, and experiments behind them.
                </p>
                <Link
                  href="/#work"
                  className="group flex items-end justify-between font-kode text-[8px] uppercase tracking-[0.18em] sm:text-[9px]"
                >
                  View selected projects
                  <ArrowDown className="h-5 w-5 transition group-hover:translate-y-1" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="relative w-full overflow-hidden bg-black p-3 sm:p-5 lg:p-7"
              initial={{ opacity: 0, y: 42, clipPath: "inset(0 8% 0 8%)" }}
              whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.82, ease: MOTION_EASE }}
            >
              <div
                className="relative aspect-[4/5] w-full overflow-hidden bg-black sm:aspect-[3/2]"
                style={{ clipPath: CHOPPED }}
              >
                <HeroSocialSequence
                  reduceMotion={Boolean(reduceMotion)}
                  onExpand={() => setMomentGalleryIndex(0)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                {heroMode === "orbit" && (
                  <motion.div
                    key="orbit"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, rotate: 360 }}
                    transition={{
                      rotate: {
                        duration: 24,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.5 },
                    }}
                  >
                    {[0, 1, 2, 3].map((item) => (
                      <span
                        key={item}
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
                        style={{
                          transform: `rotate(${item * 90}deg) translateY(-${
                            item % 2 === 0 ? 114 : 96
                          }px)`,
                          transformOrigin: "0 0",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {heroMode === "dither" && (
                  <motion.div
                    key="dither"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pointer-events-none absolute right-5 top-16 border border-white/50 bg-black/55 p-2 backdrop-blur-sm"
                  >
                    <div className="grid grid-cols-6 gap-1">
                      {Array.from({ length: 30 }, (_, index) => (
                        <motion.span
                          key={index}
                          className="h-1.5 w-1.5 bg-white"
                          animate={{
                            opacity: [0.12, (index % 5) / 5 + 0.2, 0.12],
                          }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: (index % 6) * 0.08,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {heroMode === "signal" && (
                  <motion.div
                    key="signal"
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[
                      "left-7 top-[28%] border-l border-t",
                      "right-8 top-[42%] rotate-180 border-l border-t",
                      "left-[38%] top-[66%] -rotate-90 border-l border-t",
                    ].map((position) => (
                      <motion.span
                        key={position}
                        className={`absolute ${position} h-6 w-6 border-[#d8ff36]`}
                        animate={{
                          scale: [0.9, 1.08, 0.9],
                          opacity: [0.35, 0.9, 0.35],
                        }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <div className="flex flex-col items-start justify-between gap-4 border-t border-white/45 pt-4 sm:flex-row sm:items-end sm:gap-5">
                    <p className="max-w-[34ch] font-nacelle text-sm leading-snug text-white/70 sm:text-base">
                      Talks, demos, teams, and the wonderfully odd places the
                      work gets made.
                    </p>
                    <span className="circuit-action flex shrink-0 items-center gap-2 bg-white px-3 py-2 font-kode text-[7px] uppercase tracking-[0.13em] text-black sm:text-[8px]">
                      Open moments <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <HeroMarginRail side="right" mode={heroMode} onMode={setHeroMode} />
        </div>
      </section>

      <MomentFieldArchive onExpand={setMomentGalleryIndex} />

      <SectionSpacer index="01" label="Selected work" />

      <section
        id="work"
        className={`group/section relative scroll-mt-20 border border-black/20 bg-[#f4f3ec] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 ${SECTION_FRAME}`}
      >
        <SceneCurtain index="01" label="Selected work" tone="paper" />
        <SectionChrome index="01" label="Built in the wild" />
        <RevealBlock className="mb-14 grid items-end gap-8 border-b border-black pb-6 sm:mx-4 lg:mx-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="font-telegraf text-5xl font-black tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              Built in the wild.
            </h2>
          </div>
          <p className="max-w-[42ch] font-nacelle text-[17px] leading-[1.7] text-black/60 lg:col-span-4">
            Twelve shipped worlds, arranged as a working contact sheet. Every
            preview opens into a full visual case file with multiple screens,
            context, and direct project links.
          </p>
        </RevealBlock>

        <div className="grid gap-5 sm:px-4 md:grid-cols-2 lg:gap-7 lg:px-8">
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onEnter={launch}
              onOpen={() => setGalleryProject(project)}
            />
          ))}
        </div>
      </section>

      <SectionSpacer index="02" label="Operator lab" />

      <section
        id="components"
        className={`group/section relative scroll-mt-20 border border-black/25 bg-[#f4f3ec] ${SECTION_FRAME}`}
      >
        <SceneCurtain index="02" label="Operator lab" tone="paper" />
        <SectionChrome index="02" label="Copmonents / hidden systems" />
        <OperatorLab />
      </section>

      <SectionSpacer index="03" label="Field manual" />

      <section
        id="philosophy"
        className={`group/section relative flex scroll-mt-20 items-center border border-black bg-[#d8ff36] ${SECTION_FRAME}`}
      >
        <SceneCurtain index="03" label="Field manual" tone="acid" />
        <SectionChrome index="03" label="Personal doctrine" surface="acid" />
        <RevealBlock className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 className="max-w-5xl font-telegraf text-[clamp(3.8rem,7.5vw,8rem)] font-black leading-[0.9] tracking-[-0.025em]">
              How I decide what deserves to exist.
            </h2>
          </div>
          <div className="flex items-end lg:col-span-4">
            <p className="max-w-md border-t border-black pt-5 font-nacelle text-lg leading-relaxed">
              Six full articles behind the work: each principle opens into its
              own field note, argument, and set of operating rules.
            </p>
          </div>
        </RevealBlock>
      </section>

      {PHILOSOPHIES.map((philosophy, index) => (
        <PhilosophyChapter
          key={philosophy.id}
          philosophy={philosophy}
          index={index}
        />
      ))}

      <SectionSpacer index="04" label="Compounding memory" />

      <section
        id="wiki"
        className={`group/section relative flex items-center border border-black bg-black text-white ${SECTION_FRAME}`}
      >
        <SceneCurtain index="04" label="Compounding memory" />
        <SectionChrome index="04" label="Kevin's Wiki" surface="ink" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(216,255,54,.08),transparent_30%),radial-gradient(circle_at_85%_65%,rgba(255,255,255,.07),transparent_32%)]" />
        <RevealBlock className="relative mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <h2 className="font-telegraf text-[clamp(3.8rem,7vw,7.8rem)] font-black leading-[0.9] tracking-[-0.035em]">
              A wiki
              <br />
              that thinks
              <br />
              <span className="font-normal italic">with me.</span>
            </h2>
            <div className="mt-8 max-w-[58ch] space-y-5 font-nacelle text-lg leading-[1.75] text-white/70">
              <p>
                Kevin&apos;s Wiki is a persistent knowledge base that agents
                read from and write to as a codebase. I drop in a source,
                repository, conversation, or half-formed idea; the system files
                it, links it, and keeps it current.
              </p>
              <p>
                The public viewer makes that memory legible: projects, people,
                research, decisions, contradictions, and the trails connecting
                them. Knowledge gets compiled once, then compounds.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Markdown-native",
                "Agent-maintained",
                "Local search",
                "Public",
              ].map((label) => (
                <span
                  key={label}
                  className="border border-white/25 px-2.5 py-1.5 font-kode text-[7px] uppercase tracking-[0.14em] text-white/60"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end lg:col-span-7">
            <div
              className="relative bg-white p-px"
              style={{ clipPath: CHOPPED }}
            >
              <DitherMedia
                src="/images/wiki.png"
                alt="Kevin's Wiki knowledge base"
                className="relative aspect-[16/10]"
              />
              <div className="absolute left-4 top-4 bg-black px-3 py-2 font-kode text-[8px] uppercase tracking-[0.18em] text-white">
                Live knowledge system / wiki.kevinliu.biz
              </div>
            </div>

            <Link
              href="https://wiki.kevinliu.biz/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex w-full items-center justify-between bg-white px-5 py-5 text-left text-black transition hover:bg-[#d8ff36] disabled:cursor-wait sm:px-7 sm:py-6"
              style={{ clipPath: CHOPPED }}
            >
              <span className="font-telegraf text-2xl font-black tracking-[-0.02em] sm:text-4xl">
                Open Kevin&apos;s Wiki
              </span>
              <ArrowRight className="h-7 w-7 transition group-hover:translate-x-2" />
            </Link>
          </div>
        </RevealBlock>
      </section>

      <SectionSpacer index="05" label="Tool archive" />

      <section
        id="archive"
        className={`group/section relative scroll-mt-20 border border-black/20 bg-[#f4f3ec] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 ${SECTION_FRAME}`}
      >
        <SceneCurtain index="05" label="Tool archive" tone="paper" />
        <SectionChrome index="05" label="Utility belt" />
        <RevealBlock className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 className="font-telegraf text-5xl font-black leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              Tools I keep reaching for.
            </h2>
            <p className="mt-6 max-w-sm font-nacelle text-base leading-relaxed text-black/55">
              Small, opinionated software for agents, local workflows, and the
              recurring annoyances I got tired of accepting.
            </p>
          </div>
          <div className="border-t border-black lg:col-span-9">
            {TOOL_ARCHIVE.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-black py-5 transition-[padding,background-color,color] duration-300 ease-out hover:bg-black hover:px-3 hover:text-white sm:grid-cols-[58px_minmax(0,1fr)_160px_minmax(0,1.35fr)_auto]"
              >
                <span className="font-kode text-[8px] text-black/40 transition-colors group-hover:text-white/45">
                  T-{String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-telegraf text-xl font-bold tracking-[-0.03em] sm:text-2xl">
                  {tool.name}
                </span>
                <span className="text-black/42 hidden font-kode text-[7px] uppercase tracking-[0.14em] transition-colors group-hover:text-white/50 sm:block">
                  {tool.category}
                </span>
                <span className="col-start-2 max-w-[48ch] font-nacelle text-[15px] leading-[1.65] text-black/60 transition-colors group-hover:text-white/65 sm:col-start-auto">
                  {tool.description}
                </span>
                <ArrowUpRight className="h-5 w-5 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-45" />
              </Link>
            ))}
          </div>
        </RevealBlock>
      </section>

      <SectionSpacer index="06" label="Contact" />

      <footer
        id="contact"
        className={`group/section relative mb-3 flex items-center border border-black bg-[#d8ff36] ${SECTION_FRAME}`}
      >
        <SceneCurtain index="06" label="Open channel" tone="acid" />
        <SectionChrome index="06" label="Open channel" surface="acid" />
        <RevealBlock className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <Link
              href="mailto:k.bowen.liu@gmail.com"
              className="font-telegraf text-[clamp(3.4rem,8vw,8.5rem)] font-black leading-[0.88] tracking-[-0.035em] hover:italic"
            >
              Let’s talk.
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={SOCIAL_LINKS.github}
                target="_blank"
                aria-label="GitHub"
                className="border border-black p-3 hover:bg-black hover:text-white"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                aria-label="LinkedIn"
                className="border border-black p-3 hover:bg-black hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <span className="ml-3 font-kode text-[8px] uppercase tracking-[0.18em]">
                LA / Princeton
                <br />
                2026
              </span>
            </div>
          </div>
        </RevealBlock>
      </footer>

      <MomentGalleryOverlay
        openIndex={momentGalleryIndex}
        onClose={() => setMomentGalleryIndex(null)}
      />
      <ProjectGalleryOverlay
        project={galleryProject}
        onClose={() => setGalleryProject(null)}
        onPlay={() => {
          setGalleryProject(null);
          launch();
        }}
      />

      {isLaunching && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[90] bg-black [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px]"
            initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
            animate={{
              opacity: [0, 0.92, 1],
              clipPath: "circle(90% at 50% 50%)",
            }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.62,
              ease: "circOut",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-1/2 top-1/2 z-[100] h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[10px] border-white bg-black shadow-[0_0_0_10px_#101010]"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: reduceMotion ? 1 : 30, rotate: 540 }}
            transition={{
              duration: reduceMotion ? 0.1 : 1,
              delay: reduceMotion ? 0 : 0.18,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(100deg,#ff5b35,#ffb800,#8b5cf6,#22d3ee)]" />
            <span className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 bg-white" />
            <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-black" />
          </motion.div>
        </>
      )}
    </motion.main>
  );
};

export default ProjectIndexLanding;
