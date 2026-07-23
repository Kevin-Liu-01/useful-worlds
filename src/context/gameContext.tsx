import React from "react";
import {
  Sparkles,
  Code,
  Scale,
  Trash2,
  Lightbulb,
  Archive,
  Cpu,
  Server,
  Expand,
  Bookmark,
  Calculator,
  CreditCard,
  FileSearch,
  Eye,
  User,
  Library,
  Mic,
  Paperclip,
  Puzzle,
  Terminal,
  Variable,
  Flame,
  Bubbles,
  BedDouble,
  Zap,
  Trophy, // <-- Added Trophy
} from "lucide-react";
import { HIDDEN_PROJECT_GITHUB } from "../constants/game";

// --- CORE TYPE DEFINITIONS ---

export type StatusEffect = "burn" | "poison" | "sleep" | "stun" | null;

export type AnimationState =
  "idle" | "attack" | "hit" | "faint" | "switchIn" | "switchOut";

export type TrainerState = "idle" | "commanding" | "win" | "lose";

export interface BattleEffect {
  type: SelfEffectType;
  target: "player" | "cpu";
}
export type DialogueState = { player: string; cpu: string };
export type NotificationType =
  | "info"
  | "turn"
  | "effectiveness"
  | "critical"
  | "status"
  | "miss"
  | "boost"
  | "heal"
  | "drain";

export interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
}

export type StatusEffectType = "burn" | "poison" | "sleep" | "stun";
export type SelfEffectType =
  | "atkUp"
  | "defUp"
  | "spdUp"
  | "critUp"
  | "barrier"
  | "heal"
  | "drain"
  | "recoil";

export interface Effect {
  type: StatusEffectType;
  chance: number;
}

export interface SelfEffect {
  type: SelfEffectType;
  chance: number;
  /** For stat boosts: stages (1-3). For drain: fraction of damage (0.5 = 50%). For recoil: fraction of damage. For heal: flat HP amount. */
  amount: number;
}

export interface StatModifiers {
  atk: number;
  def: number;
  spd: number;
}

/** Maps a stage number to a multiplier. Stages range from -3 to +3. */
export function getStatMultiplier(stage: number): number {
  const clamped = Math.max(-3, Math.min(3, stage));
  return 1 + clamped * 0.25;
}

export interface Move {
  name: string;
  power: number;
  type: string;
  accuracy: number;
  pp: number;
  critChance?: number;
  /** Acts before normal-priority moves. */
  priority?: number;
  /** Resolves as a sequence of hits, each contributing to the listed power. */
  hits?: { min: number; max: number };
  /** Fraction of positive defensive stat stages ignored, from 0 to 1. */
  piercing?: number;
  /** Deals bonus damage when the target is below this HP fraction. */
  executeThreshold?: number;
  effect?: Effect;
  selfEffect?: SelfEffect;
  description: string;
}

export interface BattleReadyMove extends Move {
  currentPp: number;
}

export interface MonVariant {
  image: string;
  nameSuffix: string;
}

export interface PortfolioMon {
  id: number;
  name: string;
  url: string;
  /** Omit for no button; use HIDDEN_PROJECT_GITHUB to link profile instead of repo. */
  github?: string;
  description: string;
  image: string;
  sprite: React.ReactElement;
  type1: string;
  type2?: string;
  hp: number;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
  moves: Move[];
  variants?: MonVariant[];
  favorite?: boolean;
}

export interface BattleReadyMon extends PortfolioMon {
  currentHp: number;
  status: StatusEffect;
  statusTurns: number;
  moves: BattleReadyMove[];
  statModifiers: StatModifiers;
}

export interface Item {
  name: string;
  description: string;
  effect: ItemEffect;
}

export interface PlayerInventory {
  [itemName: string]: {
    item: Item;
    quantity: number;
  };
}

export type ItemEffect =
  | { type: "heal"; amount: number }
  | { type: "cureStatus" }
  | { type: "boostAtk"; stages: number }
  | { type: "boostDef"; stages: number }
  | { type: "boostSpd"; stages: number }
  | { type: "revive"; hpFraction: number };

// --- UI SPECIFIC TYPES / STATES ---
export type ActionState = "moves" | "switch" | "items" | "itemTarget";

// --- STYLING & ICONS ---
export const statusEffectStyles: {
  [key in StatusEffect & string]: { bg: string; border: string; text: string };
} = {
  burn: { bg: "bg-orange-600", border: "bg-orange-400", text: "text-white" },
  poison: { bg: "bg-purple-600", border: "bg-purple-400", text: "text-white" },
  sleep: { bg: "bg-gray-500", border: "bg-gray-400", text: "text-white" },
  stun: { bg: "bg-yellow-500", border: "bg-yellow-300", text: "text-black" },
};

export const statusEffectIcons: {
  [key in StatusEffect & string]: React.ReactElement;
} = {
  burn: <Flame className="h-3 w-3 sm:h-4 sm:w-4" />,
  poison: <Bubbles className="h-3 w-3 sm:h-4 sm:w-4" />,
  sleep: <BedDouble className="h-3 w-3 sm:h-4 sm:w-4" />,
  stun: <Zap className="h-3 w-3 sm:h-4 sm:w-4" />,
};

// --- ITEM DEFINITIONS ---
export const gameItems: { [key: string]: Item } = {
  "Code Snippet": {
    name: "Code Snippet",
    description: "A small, reusable piece of code. Restores 20 HP.",
    effect: { type: "heal", amount: 20 },
  },
  "API Key": {
    name: "API Key",
    description: "A consumable key that restores 50 HP.",
    effect: { type: "heal", amount: 50 },
  },
  "Server Patch": {
    name: "Server Patch",
    description: "A full server patch that restores 150 HP.",
    effect: { type: "heal", amount: 150 },
  },
  "System Restore": {
    name: "System Restore",
    description: "Restores a Project's HP to its maximum.",
    effect: { type: "heal", amount: 9999 },
  },
  Debugger: {
    name: "Debugger",
    description: "A tool that cures any status condition.",
    effect: { type: "cureStatus" },
  },
  Overclock: {
    name: "Overclock",
    description: "Overclocks your Project's processor, sharply raising ATK.",
    effect: { type: "boostAtk", stages: 2 },
  },
  Firewall: {
    name: "Firewall",
    description: "Deploys a firewall, sharply raising DEF.",
    effect: { type: "boostDef", stages: 2 },
  },
  "Turbo Mode": {
    name: "Turbo Mode",
    description: "Enables turbo mode, sharply raising SPD.",
    effect: { type: "boostSpd", stages: 2 },
  },
  Rollback: {
    name: "Rollback",
    description: "Revives a fainted Project with 50% HP.",
    effect: { type: "revive", hpFraction: 0.5 },
  },
};

export const initialInventory: PlayerInventory = {
  "Code Snippet": { item: gameItems["Code Snippet"]!, quantity: 5 },
  "API Key": { item: gameItems["API Key"]!, quantity: 3 },
  "Server Patch": { item: gameItems["Server Patch"]!, quantity: 1 },
  "System Restore": { item: gameItems["System Restore"]!, quantity: 1 },
  Debugger: { item: gameItems["Debugger"]!, quantity: 2 },
  Overclock: { item: gameItems["Overclock"]!, quantity: 2 },
  Firewall: { item: gameItems["Firewall"]!, quantity: 2 },
  "Turbo Mode": { item: gameItems["Turbo Mode"]!, quantity: 1 },
  Rollback: { item: gameItems["Rollback"]!, quantity: 1 },
};

// --- PORTFOLIO-MON DATA ---
export const portfolioMonData: PortfolioMon[] = [
  {
    id: 0,
    name: "Reticle",
    url: "https://reticle-demo.vercel.app/",
    github: "https://github.com/dedalus-labs",
    favorite: true,
    description:
      "Launch site for Dedalus's persistent Linux computers for AI agents. Presents sub-second machine startup, durable runtime state, and usage-based compute through an interactive, motion-rich product experience.",
    image: "/images/reticle.png",
    sprite: <Eye />,
    type1: "Infra",
    type2: "Design",
    hp: 320,
    stats: { hp: 320, atk: 130, def: 125, spd: 130 },
    moves: [
      {
        name: "Reticle Lock",
        power: 95,
        type: "Design",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.2,
        description:
          "Acquires the target and calibrates the next move's critical path.",
        selfEffect: { type: "critUp", chance: 1.0, amount: 0.2 },
      },
      {
        name: "Instant Boot",
        power: 105,
        type: "Infra",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        priority: 1,
        description: "Starts a persistent machine before the foe can react.",
      },
      {
        name: "Never Sleep",
        power: 0,
        type: "Infra",
        accuracy: 1.0,
        pp: 10,
        description: "Keeps the runtime warm, sharply raising DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 2 },
      },
      {
        name: "Active Compute",
        power: 70,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        description: "Meters every active cycle and drains the foe's energy.",
        selfEffect: { type: "drain", chance: 1.0, amount: 0.5 },
      },
    ],
  },

  {
    id: 1,
    name: "Ariadne",
    url: "https://ariadne.dedaluslabs.ai/",
    github: "https://github.com/Kevin-Liu-01/Ariadne",
    favorite: true,
    description:
      "Phone-first agent experience for Dedalus's Run(way)time event at Lume Studios. Guests text Ariadne to check in, receive a color gem and secret word, complete live quests, request songs, and order drinks.",
    image: "/images/ariadne.png",
    sprite: <Puzzle />,
    type1: "AI",
    type2: "Design",
    hp: 285,
    stats: { hp: 285, atk: 125, def: 95, spd: 130 },
    moves: [
      {
        name: "Thread of Fate",
        power: 90,
        type: "AI",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.15,
        priority: 1,
        description:
          "Guides the target through the labyrinth with perfect timing.",
      },
      {
        name: "Gem Assignment",
        power: 70,
        type: "Design",
        accuracy: 1.0,
        pp: 15,
        description: "Marks the foe with one of six shifting colors.",
      },
      {
        name: "Secret Quest",
        power: 85,
        type: "Game",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "stun", chance: 0.3 },
        description:
          "Sends the foe into a live mission that may leave them stunned.",
      },
      {
        name: "Room Pulse",
        power: 0,
        type: "AI",
        accuracy: 1.0,
        pp: 10,
        description: "Reads the whole event at once, sharply raising SPD.",
        selfEffect: { type: "spdUp", chance: 1.0, amount: 2 },
      },
    ],
  },

  {
    id: 2,
    name: "Sandbox Arena",
    url: "https://sandboxarena.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sandbox-Arena",
    favorite: true,
    description:
      "Public head-to-head benchmark for cloud code-execution sandboxes. Runs open workloads across providers, streams both races live, scores objective performance metrics, and combines results with crowd Elo rankings.",
    image: "/images/sandbox-arena.png",
    sprite: <Trophy />,
    type1: "Infra",
    type2: "Data",
    hp: 310,
    stats: { hp: 310, atk: 135, def: 110, spd: 125 },
    moves: [
      {
        name: "Green Flag",
        power: 80,
        type: "Infra",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Starts two sandboxes side by side at full speed.",
      },
      {
        name: "Live Timing",
        power: 100,
        type: "Data",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.2,
        description: "Streams auditable timing data for a decisive hit.",
      },
      {
        name: "Crowd Elo",
        power: 65,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        description:
          "Turns every matchup into ranking pressure and raises ATK.",
        selfEffect: { type: "atkUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Checkered Flag",
        power: 115,
        type: "Infra",
        accuracy: 0.85,
        pp: 5,
        critChance: 0.2,
        executeThreshold: 0.35,
        description:
          "Takes the flag with a finisher that surges against weakened builds.",
      },
    ],
  },

  {
    id: 3,
    name: "Aryan 21",
    url: "https://aryan-birthday.vercel.app/",
    github: HIDDEN_PROJECT_GITHUB,
    favorite: true,
    description:
      "Interactive birthday shrine built for Aryan's twenty-first. Combines liquid-chrome typography, a cinematic monochrome hero, an explorable labyrinth, photo archives, and an atmospheric reliquary into a personal web experience.",
    image: "/images/aryan-21.png",
    sprite: <Sparkles />,
    type1: "Design",
    type2: "Web",
    hp: 275,
    stats: { hp: 275, atk: 115, def: 90, spd: 125 },
    moves: [
      {
        name: "Liquid Chrome",
        power: 95,
        type: "Design",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "Warps metallic type into a fluid visual strike.",
      },
      {
        name: "Pocha Anointing",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        description: "Calls on birthday tradition to restore HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 55 },
      },
      {
        name: "Labyrinth Walk",
        power: 80,
        type: "Game",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "stun", chance: 0.25 },
        description: "Draws the foe into a maze that may leave them stunned.",
      },
      {
        name: "Archive Flash",
        power: 75,
        type: "Design",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Unleashes a rapid sequence of memories from the archive.",
      },
    ],
  },

  {
    id: 4,
    name: "Kevin's Wiki",
    url: "https://wiki.kevinliu.biz/",
    github: HIDDEN_PROJECT_GITHUB,
    favorite: true,
    description:
      "Compiled personal knowledge base spanning architecture, agent operations, design, tools, skills, projects, and philosophy. Keeps flat Markdown canonical while adding instant search, native diagrams, a knowledge graph, and Wikibot.",
    image: "/images/wiki.png",
    sprite: <Library />,
    type1: "Data",
    type2: "AI",
    hp: 315,
    stats: { hp: 315, atk: 120, def: 130, spd: 105 },
    moves: [
      {
        name: "Compiled Brain",
        power: 90,
        type: "Data",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.15,
        description: "Compiles raw notes into durable, searchable knowledge.",
      },
      {
        name: "Knowledge Graph",
        power: 80,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        description:
          "Connects distant concepts to expose the foe's weak point.",
      },
      {
        name: "Wikibot Query",
        power: 95,
        type: "AI",
        accuracy: 0.9,
        pp: 10,
        effect: { type: "stun", chance: 0.25 },
        description: "Answers from the full corpus and may overwhelm the foe.",
      },
      {
        name: "Canonical Markdown",
        power: 0,
        type: "Web",
        accuracy: 1.0,
        pp: 10,
        description: "Returns to the source of truth, sharply raising DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 2 },
      },
    ],
  },

  {
    id: 5,
    name: "Agent Machines",
    url: "https://www.agent-machines.dev/",
    github: "https://github.com/Kevin-Liu-01/Agent-Machines",
    favorite: true,
    description:
      "Persistent Linux machines built for AI agents. Agent Machines gives coding agents durable compute, filesystem state, and tool access so work can survive beyond a single chat session.",
    image: "/images/agentmachines.png",
    sprite: <Server />,
    type1: "AI",
    type2: "Infra",
    hp: 345,
    stats: { hp: 345, atk: 145, def: 125, spd: 90 },
    moves: [
      {
        name: "Machine Spawn",
        power: 0,
        type: "Infra",
        accuracy: 1.0,
        pp: 10,
        description: "Boots a persistent agent machine, sharply raising DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 2 },
      },
      {
        name: "Agent Shell",
        power: 105,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "Runs an agent inside a live shell for heavy damage.",
      },
      {
        name: "Filesystem Snapshot",
        power: 70,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Captures durable state, anchoring the next strike.",
      },
      {
        name: "Resume State",
        power: 0,
        type: "Infra",
        accuracy: 1.0,
        pp: 10,
        description: "Restores progress from disk, recovering HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 65 },
      },
    ],
  },

  {
    id: 6,
    name: "Dedalus",
    url: "https://dedaluslabs.ai/",
    github: "https://github.com/dedalus-labs",
    favorite: true,
    description:
      "Building the fastest Linux machines for agentic workloads. Persistent environments with filesystem, compute, and tool access that AI agents can actually live in, not just call into.",
    image: "/images/dedaluslabs.ai.png",
    sprite: <Cpu />, // or something more “machine”-y if you have it
    type1: "AI",
    type2: "Infra",
    hp: 340,
    stats: { hp: 340, atk: 140, def: 130, spd: 85 },
    moves: [
      {
        name: "Machine Spawn",
        power: 0,
        type: "Infra",
        accuracy: 1.0,
        pp: 10,
        description:
          "Boots a persistent cloud machine, raising DEF and enabling future moves.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 2 },
      },
      {
        name: "Filesystem Bind",
        power: 65,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description:
          "Anchors context to disk, ensuring continuity across turns.",
      },
      {
        name: "Agent Runtime",
        power: 110,
        type: "AI",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.2,
        description:
          "Executes a full agent loop inside the machine for heavy damage.",
      },
      {
        name: "State Persistence",
        power: 0,
        type: "Infra",
        accuracy: 1.0,
        pp: 10,
        description: "Locks in progress across sessions, restoring HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 20 },
      },
    ],
  },

  {
    id: 7,
    name: "Sigil UI",
    url: "https://sigil-ui-web.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sigil-UI",
    favorite: true,
    description:
      "Agent-first design system shipping 350+ React components, 46 visual presets, and a single token file that controls color, typography, radius, and motion across an entire app. Built with Tailwind v4, Radix primitives, and Framer Motion.",
    image: "/images/sigil-ui.png",
    sprite: <Variable />,
    type1: "Design",
    type2: "Web",
    hp: 285,
    stats: { hp: 285, atk: 120, def: 110, spd: 115 },
    moves: [
      {
        name: "Token Cascade",
        power: 95,
        type: "Design",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.15,
        description:
          "Launches a dense burst of design tokens with precise force.",
      },
      {
        name: "Preset Forge",
        power: 80,
        type: "Web",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description: "Builds a reusable preset layer that lands consistently.",
      },
      {
        name: "One-File Theme",
        power: 45,
        type: "Design",
        accuracy: 1.0,
        pp: 20,
        description: "Centralizes every visual control point, raising DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Agent Sync",
        power: 70,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.3 },
        description:
          "Humans and agents edit the same surface, may stun the foe.",
      },
    ],
  },

  {
    id: 8,
    name: "050525",
    url: "https://050525.vercel.app/",
    github: HIDDEN_PROJECT_GITHUB,
    favorite: true,
    description:
      "Interactive CRT terminal celebrating Dedalus's first birthday. A nostalgic DCD Terminal v1.9 on a cluttered desk, where you can type commands, explore polaroid memories, and unlock hidden moments from year one of Dedalus.",
    image: "/images/050525.png",
    sprite: <Terminal />,
    type1: "Web",
    type2: "Design",
    hp: 275,
    stats: { hp: 275, atk: 110, def: 95, spd: 105 },
    moves: [
      {
        name: "Terminal Boot",
        power: 0,
        type: "Web",
        accuracy: 1.0,
        pp: 10,
        description: "Boots DCD Terminal v1.9, raising DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Password Gate",
        power: 85,
        type: "Design",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "Unlocks a hidden layer with a command-line strike.",
      },
      {
        name: "Polaroid Scroll",
        power: 70,
        type: "Design",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Cycles through crew memories for steady damage.",
      },
      {
        name: "Birthday Candle",
        power: 45,
        type: "Web",
        accuracy: 1.0,
        pp: 20,
        description: "Lights all four candles, recovering HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 50 },
      },
    ],
  },

  {
    id: 9,
    name: "Loop",
    url: "https://loooop.dev/",
    github: "https://github.com/Kevin-Liu-01/Loop",
    favorite: true,
    description:
      "Operator desk for AI agent skills that auto-refresh from tracked docs, changelogs, and repos. Monitors upstream sources, diffs changes, and rewrites skill files — keeping agent playbooks current without manual updates.",
    image: "/images/loop-homepage.png",
    sprite: <Bookmark />,
    type1: "AI",
    type2: "Web",
    hp: 290,
    stats: { hp: 290, atk: 125, def: 100, spd: 120 },
    moves: [
      {
        name: "Source Track",
        power: 75,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description:
          "Tracks docs, changelogs, and repos to keep pressure constant.",
      },
      {
        name: "Research Refresh",
        power: 95,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description:
          "Runs a research agent on upstream changes for a high-impact strike.",
      },
      {
        name: "Full Diff",
        power: 70,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        piercing: 0.75,
        effect: { type: "stun", chance: 0.3 },
        description:
          "Drops an armor-piercing rewrite that may also stun the foe.",
      },
      {
        name: "Skill Rewrite",
        power: 45,
        type: "AI",
        accuracy: 1.0,
        pp: 20,
        description: "Publishes a stronger playbook version, raising ATK.",
        selfEffect: { type: "atkUp", chance: 1.0, amount: 1 },
      },
    ],
  },

  {
    id: 10,
    name: "Princeton TD",
    url: "https://ptd.quest/",
    github: "https://github.com/Kevin-Liu-01/Princeton-Tower-Defense",
    favorite: true,
    description:
      "Browser-based tower defense game set on Princeton's campus. 26 hand-crafted maps, 7 tower types, 9 heroes, and 100+ enemies. Built with just Next.js, React, and HTML5 Canvas with custom sprite rendering.",
    image: "/images/princetontd.png",
    sprite: <Scale />,
    type1: "Game",
    type2: "Web",
    hp: 300,
    stats: { hp: 300, atk: 120, def: 90, spd: 90 },
    variants: [
      {
        image: "/images/princetontd/gameplay_desert_ui.png",
        nameSuffix: "Desert",
      },
      {
        image: "/images/princetontd/gameplay_grounds_ui.png",
        nameSuffix: "Grounds",
      },
      {
        image: "/images/princetontd/gameplay_frontier_ui.png",
        nameSuffix: "Frontier",
      },
      {
        image: "/images/princetontd/gameplay_volcano_ui.png",
        nameSuffix: "Volcano",
      },
      {
        image: "/images/princetontd/gameplay_swamp_ui.png",
        nameSuffix: "Swamp",
      },
    ],
    moves: [
      {
        name: "Nassau Cannon Blast",
        power: 100,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.15,
        description: "A powerful cannon attack that hits hard.",
      },
      {
        name: "Fortify Walls",
        power: 35,
        type: "Game",
        accuracy: 1.0,
        pp: 20,
        description:
          "Deals chip damage and deploys a barrier against the next attack.",
        selfEffect: { type: "barrier", chance: 1.0, amount: 0.45 },
      },
      // abilities
      {
        name: "E-Quad Lab Lightning",
        power: 70,
        type: "Game",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.2 },
        description: "Tesla coil strike that may stun the opponent.",
      },
      {
        name: "Blair Arch Resonance",
        power: 80,
        type: "Web",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.1,
        effect: { type: "sleep", chance: 0.2 },
        description: "Beautiful sonic lullaby that may put the foe to sleep.",
      },
    ],
  },
  {
    id: 11,
    name: "Dedalus Demo",
    url: "https://dedalus-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Dedalus-Demo",
    favorite: true,
    description:
      "Interactive demo site for the Dedalus platform. Showcases the SDK for building model-agnostic AI agents powered by MCP, with live examples of tool orchestration, multi-tenant auth, and a marketplace of connectable servers.",
    image: "/images/dedalus.png",
    sprite: <Server />,
    type1: "AI",
    type2: "Web",
    hp: 295,
    stats: { hp: 295, atk: 130, def: 95, spd: 110 },
    moves: [
      {
        name: "MCP Orchestrate",
        power: 95,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "Routes models and tools with a high-impact command.",
      },
      {
        name: "SDK Deploy",
        power: 85,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Ships agents quickly with reliable delivery power.",
      },
      {
        name: "Auth Relay",
        power: 70,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.3 },
        description: "Secures access and disrupts the foe, may stun.",
      },
      {
        name: "Marketplace Sync",
        power: 65,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        description:
          "Connects tools and servers, siphoning energy from the foe.",
        selfEffect: { type: "drain", chance: 1.0, amount: 0.5 },
      },
    ],
  },
  {
    id: 12,
    name: "Podium",
    url: "https://hackprinceton-podium.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Podium",
    description:
      "Full-stack hackathon judging and event management platform built for HackPrinceton. Real-time leaderboards, judge assignment, spam prevention, score aggregation, and live results.",
    image: "/images/podium.png",
    sprite: <Trophy />,
    type1: "Web",
    type2: "Data",
    hp: 290,
    stats: { hp: 290, atk: 115, def: 100, spd: 110 },
    moves: [
      {
        name: "Final Judging",
        power: 100,
        type: "Data",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.15,
        description: "A powerful final decision that hits hard.",
      },
      {
        name: "Live Leaderboard",
        power: 85,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "A real-time update that reliably strikes the foe.",
      },
      {
        name: "Spam Prevention",
        power: 70,
        type: "Web",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.3 },
        description: "Blocks the foe's advance, may cause a stun.",
      },
      {
        name: "Score Finalize",
        power: 45,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        description: "Locks in the score, boosting ATK for the next assault.",
        selfEffect: { type: "atkUp", chance: 1.0, amount: 1 },
      },
    ],
  },
  {
    id: 13,
    name: "Sevenfold",
    url: "https://sevenfold-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Sevenfold-Demo",
    description:
      "AI-powered research workspace that helps users find, annotate, and synthesize academic papers in one place. Features semantic search, inline annotations, corpus-wide chat, and citation tracing — built as a founding engineer.",
    image: "/images/sevenfold.png",
    sprite: <FileSearch />,
    type1: "AI",
    type2: "Data",
    hp: 285,
    stats: { hp: 285, atk: 135, def: 85, spd: 105 },
    moves: [
      {
        name: "Smart Results",
        power: 90,
        type: "AI",
        accuracy: 1.0,
        pp: 12,
        critChance: 0.15,
        description: "Synthesizes findings into a precise, high-impact strike.",
      },
      {
        name: "Annotation Sweep",
        power: 75,
        type: "Data",
        accuracy: 0.95,
        pp: 18,
        critChance: 0.1,
        description: "Highlights key sections to chip away at the foe.",
      },
      {
        name: "Corpus Chat",
        power: 65,
        type: "AI",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.35 },
        description: "Unravels arguments to disorient the foe, may stun.",
      },
      {
        name: "Citation Trace",
        power: 0,
        type: "Data",
        accuracy: 1.0,
        pp: 10,
        description: "Compiles sources to recover HP. Restores 60 HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 60 },
      },
    ],
  },
  {
    id: 14,
    name: "PortfolioMon",
    url: "https://github.com/Kevin-Liu-01/PortfolioMon-Showdown",
    github: "https://github.com/Kevin-Liu-01/PortfolioMon-Showdown",
    favorite: true,
    description:
      "This site — a fully playable turn-based battle game inspired by Pokemon Showdown, where every fighter is a real project. Type matchups, stat bars, status effects, team building, and a full battle engine, all in Next.js + Framer Motion.",
    image: "/images/kevinportfolio.png",
    sprite: <Code />,
    type1: "Web",
    type2: "Game",
    hp: 310,
    stats: { hp: 310, atk: 110, def: 110, spd: 110 },
    moves: [
      {
        name: "Source Code",
        power: 95,
        type: "Data",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.15,
        description:
          "Reveals the underlying code, a powerful and precise strike.",
      },
      {
        name: "UI Overhaul",
        power: 38,
        type: "Design",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        hits: { min: 2, max: 3 },
        description:
          "A two-to-three pass redesign that stacks multiple clean hits.",
      },
      {
        name: "Game Logic",
        power: 85,
        type: "Game",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description:
          "Executes complex game logic to outsmart and damage the foe.",
      },
      {
        name: "Responsive Breakpoint",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 20,
        description: "Adapts its structure to always land a solid hit.",
      },
    ],
  },
  {
    id: 15,
    name: "Lumachor",
    url: "https://lumachor.vercel.app/home",
    github: "https://github.com/Kevin-Liu-01/Lumachor",
    description:
      "Context engine that turns any user into an expert prompt engineer. Upload documents, auto-chunk and embed them with vector search, then inject the most relevant context into LLM prompts — no prompt engineering required.",
    image: "/images/lumachor.png",
    sprite: <Sparkles />,
    type1: "AI",
    type2: "Web",
    hp: 280,
    stats: { hp: 280, atk: 140, def: 80, spd: 100 },
    moves: [
      {
        name: "Context Injection",
        power: 95,
        type: "AI",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.2,
        description: "A powerful strike with a high critical-hit ratio.",
      },
      {
        name: "Vectorize",
        power: 70,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description: "Converts data into a solid attack vector.",
      },
      {
        name: "Logic Overload",
        power: 60,
        type: "AI",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.4 },
        description: "Confuses the foe with complex data, may cause a stun.",
      },
      {
        name: "Prompt Tuning",
        power: 40,
        type: "AI",
        accuracy: 1.0,
        pp: 20,
        description: "Optimizes the model's output, raising SPD.",
        selfEffect: { type: "spdUp", chance: 1.0, amount: 1 },
      },
    ],
  },

  {
    id: 16,
    name: "HackPrinceton '25F",
    url: "https://hack-princeton-fall-2025-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/HackPrinceton-Demo-Fall-2025",
    description:
      "Landing page for HackPrinceton Fall 2025, Princeton's flagship hackathon. Designed and built as lead developer with animated hero sections, schedule timelines, sponsor carousels, and a custom applicant portal. Next.js + Framer Motion.",
    image: "/images/hackprinceton25f.png",
    sprite: <Code />,
    type1: "Web",
    type2: "Design",
    hp: 270,
    stats: { hp: 270, atk: 115, def: 75, spd: 130 },
    moves: [
      {
        name: "Vercel Deploy",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description: "A swift deployment that strikes reliably and fast.",
      },
      {
        name: "Next.js Build",
        power: 90,
        type: "Web",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.15,
        description: "A fast and powerful server-side attack.",
      },
      {
        name: "DDoS Attack",
        power: 30,
        type: "Web",
        accuracy: 0.85,
        pp: 10,
        critChance: 0.1,
        hits: { min: 2, max: 4 },
        effect: { type: "stun", chance: 0.3 },
        description:
          "Floods the opponent with two-to-four packets and may cause a stun.",
      },
      {
        name: "Framer Motion",
        power: 110,
        type: "Design",
        accuracy: 0.9,
        pp: 8,
        critChance: 0.1,
        description: "A flashy, reckless animation with intense recoil.",
        selfEffect: { type: "recoil", chance: 1.0, amount: 0.25 },
      },
    ],
  },
  {
    id: 17,
    name: "Splitway",
    url: "https://splitway.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/SplitWay",
    description:
      "Expense tracking and bill-splitting app with real-time sync. Create groups, log expenses, auto-calculate debts, and settle up, all backed by Firebase Realtime Database with instant updates across all connected devices.",
    image: "/images/splitway.png",
    sprite: <Expand />,
    type1: "Web",
    type2: "Data",
    hp: 280,
    stats: { hp: 280, atk: 105, def: 100, spd: 95 },
    moves: [
      {
        name: "Calculate Split",
        power: 38,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        hits: { min: 2, max: 2 },
        description: "Divides the target's focus into two guaranteed hits.",
      },
      {
        name: "Firebase Sync",
        power: 85,
        type: "Web",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description: "A real-time strike that's hard to counter.",
      },
      {
        name: "Corrupted Data",
        power: 45,
        type: "Data",
        accuracy: 0.9,
        pp: 20,
        critChance: 0.05,
        effect: { type: "poison", chance: 0.4 },
        description: "Injects bad data that slowly drains the foe's HP.",
      },
      {
        name: "Debt Collector",
        power: 60,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        description: "Collects what's owed, draining the foe's energy.",
        selfEffect: { type: "drain", chance: 1.0, amount: 0.5 },
      },
    ],
  },
  {
    id: 18,
    name: "Lootbox Simulator",
    url: "https://lootboxsimulator.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Lootbox-Simulator",
    description:
      "Browser game simulating the lootbox mechanic with weighted drop tables, rarity tiers, animated unboxing sequences, and a persistent inventory. Multiple box types with distinct loot pools and probability distributions.",
    image: "/images/lootboxsimulator.png",
    sprite: <Archive />,
    type1: "Game",
    type2: "Web",
    hp: 250,
    stats: { hp: 250, atk: 145, def: 55, spd: 125 },
    moves: [
      {
        name: "Jackpot",
        power: 120,
        type: "Game",
        accuracy: 0.8,
        pp: 5,
        critChance: 0.1,
        description: "A high-risk, high-reward attack with massive power.",
      },
      {
        name: "Gacha Pull",
        power: 40,
        type: "Game",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.05,
        description: "A flashy pull that powers up ATK. May raise ATK.",
        selfEffect: { type: "atkUp", chance: 0.5, amount: 1 },
      },
      {
        name: "Legendary Roll",
        power: 95,
        type: "Game",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.25,
        description: "A lucky pull that results in a powerful critical hit.",
      },
      {
        name: "Rage Quit",
        power: 80,
        type: "Game",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.3,
        effect: { type: "burn", chance: 0.25 },
        description: "An angry outburst that can leave the opponent burned.",
      },
    ],
  },
  {
    id: 19,
    name: "PawPointClicker",
    url: "https://pawpointclicker.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/PawPointClicker",
    favorite: true,
    description:
      "Princeton-themed idle clicker game inspired by Cookie Clicker. Earn Paw Points through clicks and automated generators, unlock campus-themed upgrades, and climb through prestige tiers. Built with React and persistent local storage.",
    image: "/images/pawpointclicker.png",
    sprite: <CreditCard />,
    type1: "Game",
    type2: "Web",
    hp: 240,
    stats: { hp: 240, atk: 150, def: 50, spd: 130 },
    moves: [
      {
        name: "100 Clicks Per Second",
        power: 24,
        type: "Game",
        accuracy: 0.9,
        pp: 5,
        critChance: 0.1,
        hits: { min: 3, max: 5 },
        description: "A rapid three-to-five hit input burst.",
      },
      {
        name: "TigerCard Swipe",
        power: 45,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        description: "A quick swipe that boosts speed. Raises SPD.",
        selfEffect: { type: "spdUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Golden Cookie",
        power: 125,
        type: "Game",
        accuracy: 0.8,
        pp: 8,
        critChance: 0.35,
        description: "A rare and powerful alpha cookie.",
      },
      {
        name: "Late Meal",
        power: 0,
        type: "Game",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.05,
        effect: { type: "poison", chance: 0.5 },
        description: "A questionable meal that has a high chance to poison.",
      },
    ],
  },
  {
    id: 20,
    name: "HackPrinceton '25S",
    url: "https://hack-princeton-spring-2025-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/HackPrinceton-Demo-Spring-2025",
    description:
      "Landing page for HackPrinceton Spring 2025. Features responsive design, animated sections, a component library for hackathon branding, and integration with the application portal. Built with Next.js, Tailwind, and Framer Motion.",
    image: "/images/hackprinceton25s.png",
    sprite: <Code />,
    type1: "Web",
    type2: "Design",
    hp: 275,
    stats: { hp: 275, atk: 120, def: 80, spd: 115 },
    moves: [
      {
        name: "Responsive Grid",
        power: 45,
        type: "Design",
        accuracy: 1.0,
        pp: 20,
        description: "Adapts to the opponent, boosting SPD in the process.",
        selfEffect: { type: "spdUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Component Library",
        power: 85,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "A well-structured attack that's hard to break.",
      },
      {
        name: "Spam Applications",
        power: 60,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.2 },
        description: "Floods the foe with applications, may cause a stun.",
      },
      {
        name: "Hot Reload",
        power: 70,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        effect: { type: "burn", chance: 0.2 },
        description: "A rapid update that can burn the opponent's system.",
      },
    ],
  },
  {
    id: 21,
    name: "HackPrinceton '24F",
    url: "https://hack-princeton-fall-2024-demo.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/HackPrinceton-Demo-Fall-2024",
    description:
      "The first HackPrinceton site I built as lead developer. Inaugural design with sponsor showcases, a live event schedule, FAQ sections, and a 48-hour countdown timer. Established the design template used for future seasons.",
    image: "/images/hackprinceton24f.png",
    sprite: <Code />,
    type1: "Web",
    type2: "Design",
    hp: 280,
    stats: { hp: 280, atk: 125, def: 85, spd: 105 },
    moves: [
      {
        name: "Legacy Code",
        power: 95,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.15,
        description:
          "A powerful but slightly unpredictable blast from the past.",
      },
      {
        name: "Sponsor Carousel",
        power: 70,
        type: "Design",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "A spinning attack that hits multiple times.",
      },
      {
        name: "48 Hour Jam",
        power: 105,
        type: "Game",
        accuracy: 0.85,
        pp: 5,
        critChance: 0.2,
        description: "A frantic burst of energy that hits hard.",
      },
      {
        name: "Code Freeze",
        power: 0,
        type: "Web",
        accuracy: 0.8,
        pp: 10,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.6 },
        description: "A sudden halt to development that may stun the foe.",
      },
    ],
  },
  {
    id: 22,
    name: "SnellTech",
    url: "https://snelltech.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/SnellTech-Solutions",
    description:
      "Low-cost digital visual acuity testing app that replicates the Snellen Eye Chart exam on any screen. Calibrates to display size, guides users through the test protocol, and generates a shareable vision score — no clinic visit required.",
    image: "/images/snelltech.png",
    sprite: <Eye />,
    type1: "Health",
    type2: "Web",
    hp: 300,
    stats: { hp: 300, atk: 100, def: 100, spd: 85 },
    moves: [
      {
        name: "Eye Exam",
        power: 0,
        type: "Health",
        accuracy: 1.0,
        pp: 8,
        description: "A thorough checkup that restores 80 HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 80 },
      },
      {
        name: "Glare",
        power: 55,
        type: "Design",
        accuracy: 0.95,
        pp: 15,
        effect: { type: "stun", chance: 0.3 },
        description: "A harsh light that may stun the opponent.",
      },
      {
        name: "Optical Illusion",
        power: 0,
        type: "Design",
        accuracy: 0.9,
        pp: 10,
        effect: { type: "sleep", chance: 0.5 },
        description: "A confusing pattern that might lull the foe to sleep.",
      },
      {
        name: "20/20 Vision",
        power: 95,
        type: "Health",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.25,
        description: "A perfectly aimed strike with a high crit chance.",
      },
    ],
  },
  {
    id: 23,
    name: "LetMeCook",
    url: "https://letmecook.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/LetMeCook",
    description:
      "AI recipe generator that uses computer vision to scan your fridge contents, then calls ChatGPT to generate step-by-step recipes from available ingredients. Supports dietary filters, cuisine preferences, and meal type selection.",
    image: "/images/letmecook.png",
    sprite: <Lightbulb />,
    type1: "AI",
    type2: "Mobile",
    hp: 280,
    stats: { hp: 280, atk: 130, def: 70, spd: 100 },
    moves: [
      {
        name: "Flash Fry",
        power: 80,
        type: "AI",
        accuracy: 0.95,
        pp: 15,
        effect: { type: "burn", chance: 0.3 },
        description: "A blast of heat with a chance to burn.",
      },
      {
        name: "GPT Generate",
        power: 95,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "A powerful, creative burst of AI energy.",
      },
      {
        name: "Spoiled Food",
        power: 40,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.05,
        effect: { type: "poison", chance: 0.5 },
        description: "A nasty attack with a high chance of poisoning.",
      },
      {
        name: "Gourmet Meal",
        power: 0,
        type: "AI",
        accuracy: 1.0,
        pp: 8,
        description:
          "A perfectly crafted dish that restores 70 HP and raises ATK.",
        selfEffect: { type: "heal", chance: 1.0, amount: 70 },
      },
    ],
  },
  {
    id: 24,
    name: "Balladeer",
    url: "https://balladeer.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Balladeer",
    description:
      "AI-powered study guide generator for literary works. Input any book or text and get chapter summaries, character analyses, theme breakdowns, key quotes with context, and essay prompts, all generated via GPT with structured formatting.",
    image: "/images/balladeer.png",
    sprite: <Library />,
    type1: "AI",
    type2: "Data",
    hp: 260,
    stats: { hp: 260, atk: 135, def: 70, spd: 115 },
    moves: [
      {
        name: "Textual Evidence",
        power: 85,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.15,
        description: "A well-supported attack that always finds its mark.",
      },
      {
        name: "Literary Analysis",
        power: 100,
        type: "AI",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.1,
        description: "A deep, insightful attack that cuts through defenses.",
      },
      {
        name: "Writer's Block",
        power: 0,
        type: "AI",
        accuracy: 0.9,
        pp: 10,
        effect: { type: "stun", chance: 0.6 },
        description: "A frustrating move that has a high chance to stun.",
      },
      {
        name: "Plot Twist",
        power: 55,
        type: "Game",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.15,
        priority: 1,
        description: "An unexpected turn of events that raises ATK.",
        selfEffect: { type: "atkUp", chance: 1.0, amount: 1 },
      },
    ],
  },
  {
    id: 25,
    name: "CompassUSA",
    url: "https://compass-usa.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/CompassUSA",
    description:
      "Resource hub for immigrants navigating the U.S. system. Aggregates legal aid organizations, ESL programs, healthcare access, and government services by location, with multilingual support and step-by-step guides for common processes.",
    image: "/images/compassusa.png",
    sprite: <User />,
    type1: "Web",
    type2: "Data",
    hp: 320,
    stats: { hp: 320, atk: 90, def: 110, spd: 80 },
    moves: [
      {
        name: "Resource Finder",
        power: 75,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description: "Finds the right resource to strike the enemy.",
      },
      {
        name: "Bureaucracy",
        power: 0,
        type: "Data",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "sleep", chance: 0.4 },
        description: "Buries the opponent in paperwork, may cause sleep.",
      },
      {
        name: "Community Aid",
        power: 50,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        description: "A helping hand that raises DEF while dealing damage.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Green Card",
        power: 90,
        type: "Data",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.3 },
        description: "A powerful move that may leave the foe stunned.",
      },
    ],
  },
  {
    id: 26,
    name: "ApneaAlert",
    url: "https://apnea-alert-git-main-kevin-liu-01.vercel.app/",
    github: HIDDEN_PROJECT_GITHUB,
    description:
      "Affordable wearable sleep apnea detection system using Arduino sensors and real-time data streaming. Monitors blood oxygen and breathing patterns overnight, flags apnea events, and visualizes sleep data on a companion web dashboard.",
    image: "/images/apnea-alert.png",
    sprite: <Cpu />,
    type1: "Health",
    type2: "Hardware",
    hp: 320,
    stats: { hp: 320, atk: 90, def: 115, spd: 75 },
    moves: [
      {
        name: "Vital Check",
        power: 0,
        type: "Health",
        accuracy: 1.0,
        pp: 8,
        description: "Monitors vitals to restore 90 HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 90 },
      },
      {
        name: "Health Alert",
        power: 95,
        type: "Health",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.2,
        description: "A piercing alarm with a high critical-hit ratio.",
      },
      {
        name: "Sleep Study",
        power: 0,
        type: "Health",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.05,
        effect: { type: "sleep", chance: 0.8 },
        description:
          "A non-damaging move that has a very high chance to cause sleep.",
      },
      {
        name: "Short Circuit",
        power: 75,
        type: "Hardware",
        accuracy: 0.95,
        pp: 15,
        effect: { type: "burn", chance: 0.25 },
        description: "A hardware malfunction that can burn the opponent.",
      },
    ],
  },
  {
    id: 27,
    name: "Iron Triangle",
    url: "https://iron-triangle.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Iron-Triangle",
    description:
      "Interactive data visualization exploring the U.S. Military Industrial Complex for a History II final project. Charts defense spending, lobbying flows, and contractor relationships with animated D3-style graphs and scrollytelling narrative.",
    image: "/images/irontriangle.png",
    sprite: <Scale />,
    type1: "Data",
    type2: "Design",
    hp: 300,
    stats: { hp: 300, atk: 110, def: 105, spd: 70 },
    moves: [
      {
        name: "MIC Analysis",
        power: 85,
        type: "Data",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "A critical analysis of the foe's structure.",
      },
      {
        name: "Historical Rebuke",
        power: 90,
        type: "Data",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.1,
        description: "A powerful argument backed by historical precedent.",
      },
      {
        name: "Policy Paper",
        power: 0,
        type: "Data",
        accuracy: 0.85,
        pp: 15,
        critChance: 0.05,
        effect: { type: "sleep", chance: 0.5 },
        description: "A long, dense paper that bores the foe to sleep.",
      },
      {
        name: "Lobbyist",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        description: "A persuasive move that drains the opponent's resources.",
        selfEffect: { type: "drain", chance: 1.0, amount: 0.5 },
      },
    ],
  },
  {
    id: 28,
    name: "AdventureGPT",
    url: "https://adventuregpt.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/AdventureGPT",
    description:
      "AI-powered interactive fiction engine where users provide a premise and GPT generates branching storylines in real time. Choose-your-own-adventure mechanics with persistent narrative state, genre selection, and exportable story logs.",
    image: "/images/adventuregpt.png",
    sprite: <Sparkles />,
    type1: "AI",
    type2: "Game",
    hp: 260,
    stats: { hp: 260, atk: 140, def: 60, spd: 130 },
    moves: [
      {
        name: "Story Weave",
        power: 80,
        type: "AI",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Weaves a complex narrative to attack the foe.",
      },
      {
        name: "Prompt Burst",
        power: 105,
        type: "AI",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.2,
        description: "A sudden, powerful burst of creative energy.",
      },
      {
        name: "Narrative Hook",
        power: 70,
        type: "Game",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.3 },
        description: "An engaging hook that may leave the opponent captivated.",
      },
      {
        name: "Deus Ex Machina",
        power: 130,
        type: "Game",
        accuracy: 0.75,
        pp: 5,
        critChance: 0.1,
        description: "An unlikely event that deals massive damage but recoils.",
        selfEffect: { type: "recoil", chance: 1.0, amount: 0.33 },
      },
    ],
  },
  {
    id: 29,
    name: "EditorGPT",
    url: "https://editorgpt.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/EditorGPT",
    description:
      "In-browser code editor with integrated ChatGPT-powered code review. Paste or write code, get AI feedback on bugs, style, performance, and best practices, with syntax highlighting, diff views, and one-click refactoring suggestions.",
    image: "/images/editorgpt.png",
    sprite: <FileSearch />,
    type1: "AI",
    type2: "Web",
    hp: 280,
    stats: { hp: 280, atk: 130, def: 80, spd: 105 },
    moves: [
      {
        name: "Code Review",
        power: 90,
        type: "AI",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.15,
        description: "Finds and exploits a flaw in the opponent's defense.",
      },
      {
        name: "Bug Squish",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description: "A satisfyingly effective and reliable attack.",
      },
      {
        name: "Refactor",
        power: 50,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        description: "Clean up the codebase, boosting DEF.",
        selfEffect: { type: "defUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Syntax Error",
        power: 60,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "burn", chance: 0.3 },
        description: "A glaring error that burns the opponent's focus.",
      },
    ],
  },
  {
    id: 30,
    name: "OMMC Portal",
    url: "https://ommc-test-portal.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/OMMC-Math-Comp",
    description:
      "Official competition portal for the Online Monmouth Math Competition. Handles timed test delivery, answer submission, anti-cheat proctoring, real-time score calculation, and leaderboard generation for hundreds of concurrent participants.",
    image: "/images/ommcportal.png",
    sprite: <Calculator />,
    type1: "Web",
    type2: "Data",
    hp: 290,
    stats: { hp: 290, atk: 110, def: 95, spd: 100 },
    moves: [
      {
        name: "Test Submission",
        power: 90,
        type: "Data",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.1,
        description: "A final, powerful submission of data.",
      },
      {
        name: "Proctor Mode",
        power: 70,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.4 },
        description: "An intimidating gaze that may paralyze the opponent.",
      },
      {
        name: "Score Calculation",
        power: 95,
        type: "Data",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.2,
        executeThreshold: 0.3,
        description:
          "A high-crit calculation that finishes builds below 30% integrity.",
      },
      {
        name: "Server Crash",
        power: 110,
        type: "Web",
        accuracy: 0.8,
        pp: 5,
        description: "A devastating crash with punishing recoil.",
        selfEffect: { type: "recoil", chance: 1.0, amount: 0.25 },
      },
    ],
  },
  {
    id: 31,
    name: "OMMC Sample Portal",
    url: "https://ommc-sample-portal.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/OMMC-Sample-Portal",
    description:
      "Practice environment for the OMMC math competition. Provides past problems with timed conditions, instant scoring, solution walkthroughs, and performance analytics so students can prepare under realistic competition settings.",
    image: "/images/ommcsampleportal.png",
    sprite: <Calculator />,
    type1: "Web",
    type2: "Data",
    hp: 270,
    stats: { hp: 270, atk: 105, def: 75, spd: 120 },
    moves: [
      {
        name: "Practice Round",
        power: 45,
        type: "Data",
        accuracy: 1.0,
        pp: 20,
        description: "A warm-up that also raises ATK.",
        selfEffect: { type: "atkUp", chance: 1.0, amount: 1 },
      },
      {
        name: "Sample Questions",
        power: 80,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description: "Presents tricky questions to damage the opponent.",
      },
      {
        name: "Mock Test",
        power: 90,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.15,
        description: "A simulated attack that packs a real punch.",
      },
      {
        name: "Toxic Comment",
        power: 0,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        effect: { type: "poison", chance: 0.5 },
        description: "Leaves a nasty comment that may poison the foe.",
      },
    ],
  },
  {
    id: 32,
    name: "Enkrateia",
    url: "https://enkrateia.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Enkrateia",
    description:
      "Clean, fast interface for GPT-3.5 and GPT-4 with conversation history, model switching, system prompt customization, and token usage tracking. Built as one of my earliest OpenAI API integrations with a focus on minimal, responsive design.",
    image: "/images/enkrateia.png",
    sprite: <Terminal />,
    type1: "AI",
    type2: "Web",
    hp: 250,
    stats: { hp: 250, atk: 150, def: 55, spd: 135 },
    moves: [
      {
        name: "GPT-4 Query",
        power: 110,
        type: "AI",
        accuracy: 0.9,
        pp: 5,
        critChance: 0.15,
        description: "A costly but devastatingly powerful API call.",
      },
      {
        name: "API Overload",
        power: 80,
        type: "Web",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.1,
        effect: { type: "burn", chance: 0.3 },
        description: "Floods the API, causing damage and a potential burn.",
      },
      {
        name: "Model Fine-Tune",
        power: 95,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.2,
        description: "A highly-tuned query that hits for critical damage.",
      },
      {
        name: "Token Stream",
        power: 70,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        description: "A rapid stream of data that drains the foe's tokens.",
        selfEffect: { type: "drain", chance: 1.0, amount: 0.5 },
      },
    ],
  },
  {
    id: 33,
    name: "HD Transcribe",
    url: "https://hd-transcribe.vercel.app",
    github: HIDDEN_PROJECT_GITHUB,
    description:
      "Speech transcription tool trained on the unique vocal patterns of Huntington's Disease patients. Custom acoustic model improves recognition accuracy for dysarthric speech — bridging a critical accessibility gap in existing STT systems.",
    image: "/images/hd-transcribe.png",
    sprite: <Mic />,
    type1: "AI",
    type2: "Health",
    hp: 325,
    stats: { hp: 325, atk: 95, def: 100, spd: 75 },
    moves: [
      {
        name: "Speech Recognition",
        power: 85,
        type: "AI",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Perfectly understands and counters the foe's pattern.",
      },
      {
        name: "Acoustic Model",
        power: 90,
        type: "Hardware",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "A sound-based attack that resonates for high damage.",
      },
      {
        name: "Data Breach",
        power: 60,
        type: "Data",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        effect: { type: "poison", chance: 0.3 },
        description: "Uses sensitive data to inflict a lasting ailment.",
      },
      {
        name: "Recovery Scan",
        power: 0,
        type: "Health",
        accuracy: 1.0,
        pp: 8,
        description: "A deep diagnostic scan that restores 85 HP.",
        selfEffect: { type: "heal", chance: 1.0, amount: 85 },
      },
    ],
  },
  {
    id: 34,
    name: "OMMC",
    url: "https://www.ommcofficial.org",
    github: "https://github.com/Kevin-Liu-01/OMMC-Website",
    favorite: true,
    description:
      "Official website for the Online Monmouth Math Competition, a math olympiad I co-founded serving students worldwide. Registration, problem archives, sponsor pages, and community hub — built and maintained across multiple competition seasons.",
    image: "/images/ommc.png",
    sprite: <Variable />,
    type1: "Web",
    type2: "Design",
    hp: 300,
    stats: { hp: 300, atk: 105, def: 105, spd: 90 },
    moves: [
      {
        name: "Community Hub",
        power: 75,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "A welcoming attack that rallies support.",
      },
      {
        name: "Competition Day",
        power: 95,
        type: "Game",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.2,
        description: "A high-stakes attack with critical potential.",
      },
      {
        name: "Sponsor Plea",
        power: 65,
        type: "Design",
        accuracy: 0.95,
        pp: 20,
        critChance: 0.05,
        effect: { type: "stun", chance: 0.25 },
        description: "A persuasive visual appeal that may daze the opponent.",
      },
      {
        name: "Problem Writing",
        power: 85,
        type: "Data",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.1,
        description: "Constructs a difficult problem to attack the foe.",
      },
    ],
  },
  {
    id: 35,
    name: "OMMC Atlas",
    url: "https://ommc-atlas.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/OMMC-Atlas",
    description:
      "Full-stack searchable database of every OMMC competition problem. Filter by year, round, difficulty, and topic with LaTeX rendering, solution discussions, and an admin panel for problem management. React frontend with a Node.js/MongoDB backend.",
    image: "/images/ommc-atlas.png",
    sprite: <Server />,
    type1: "Data",
    type2: "Web",
    hp: 290,
    stats: { hp: 290, atk: 110, def: 100, spd: 100 },
    moves: [
      {
        name: "Database Query",
        power: 90,
        type: "Data",
        accuracy: 1.0,
        pp: 10,
        critChance: 0.1,
        description: "A powerful and precise data-driven strike.",
      },
      {
        name: "Full-Stack Build",
        power: 85,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "A comprehensive attack hitting front and back.",
      },
      {
        name: "Data Corruption",
        power: 70,
        type: "Data",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "poison", chance: 0.3 },
        description: "Floods the target with bad data, potentially poisoning.",
      },
      {
        name: "Admin Panel",
        power: 70,
        type: "Web",
        accuracy: 1.0,
        pp: 20,
        critChance: 0.1,
        description: "Asserts control, dealing moderate damage.",
      },
    ],
  },
  {
    id: 36,
    name: "RecyclAIble",
    url: "https://recyclaible.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/RecyclAIble",
    description:
      "Smart recycling system that won 1st Place in Hardware at PennApps XXIII. Uses OpenCV object detection on a Raspberry Pi to identify waste items in real time, then activates servo-controlled bins to sort recyclables, compost, and trash automatically.",
    image: "/images/recyclaible.png",
    sprite: <Trash2 />,
    type1: "AI",
    type2: "Hardware",
    hp: 290,
    stats: { hp: 290, atk: 135, def: 90, spd: 80 },
    moves: [
      {
        name: "Object Detection",
        power: 95,
        type: "AI",
        accuracy: 0.95,
        pp: 10,
        critChance: 0.15,
        description: "An advanced AI attack that rarely misses.",
      },
      {
        name: "Overheat",
        power: 80,
        type: "Hardware",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.1,
        effect: { type: "burn", chance: 0.4 },
        description: "A risky move with a high chance to burn the opponent.",
      },
      {
        name: "OpenCV",
        power: 80,
        type: "AI",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Uses computer vision to find and strike weak points.",
      },
      {
        name: "Shred",
        power: 70,
        type: "Hardware",
        accuracy: 0.95,
        pp: 15,
        description: "Shreds the opponent's defenses.",
      },
    ],
  },
  {
    id: 37,
    name: "PlantSTEM",
    url: "https://plant-stem.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/PlantSTEM",
    description:
      "Interactive STEM education platform with visual lessons for math and physics concepts. Features animated diagrams, practice problems with step-by-step solutions, progress tracking, and topic-based curriculum navigation.",
    image: "/images/plantstem.png",
    sprite: <Bookmark />,
    type1: "Web",
    type2: "Data",
    hp: 280,
    stats: { hp: 280, atk: 110, def: 90, spd: 110 },
    moves: [
      {
        name: "Physics Lesson",
        power: 80,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Uses the laws of physics to deal damage.",
      },
      {
        name: "Chess Strategy",
        power: 70,
        type: "Game",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.3 },
        description: "A complex maneuver that outsmarts and stuns the foe.",
      },
      {
        name: "Study Session",
        power: 95,
        type: "Data",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.15,
        description: "An intense session that overloads the opponent.",
      },
      {
        name: "Pop Quiz",
        power: 75,
        type: "Data",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.25,
        description: "A surprise attack with a high critical-hit ratio.",
      },
    ],
  },
  {
    id: 38,
    name: "Tutorial",
    url: "https://tutorial-nu.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/Tutorial",
    description:
      "Tutoring marketplace connecting students with tutors by subject, availability, and location. Tutor profiles with ratings, session booking, subject filtering, and a messaging system, built with React, Firebase Auth, and Firestore.",
    image: "/images/tutorial.png",
    sprite: <Paperclip />,
    type1: "Web",
    type2: "Data",
    hp: 290,
    stats: { hp: 290, atk: 110, def: 95, spd: 105 },
    moves: [
      {
        name: "Tutor Connect",
        power: 80,
        type: "Web",
        accuracy: 1.0,
        pp: 15,
        critChance: 0.1,
        description: "Forms a connection to deal reliable damage.",
      },
      {
        name: "Pupil Search",
        power: 75,
        type: "Data",
        accuracy: 0.95,
        pp: 20,
        critChance: 0.1,
        description: "Searches for a weakness and strikes.",
      },
      {
        name: "Ad Spam",
        power: 65,
        type: "Web",
        accuracy: 0.9,
        pp: 15,
        effect: { type: "poison", chance: 0.3 },
        description: "Spams the opponent with ads, may inflict poison.",
      },
      {
        name: "Homework",
        power: 60,
        type: "Data",
        accuracy: 0.9,
        pp: 15,
        critChance: 0.05,
        effect: { type: "poison", chance: 0.25 },
        description: "Assigns tedious work that drains the foe over time.",
      },
    ],
  },
  {
    id: 39,
    name: "Satellite Crafter",
    url: "https://satellite-crafter.vercel.app/",
    github: "https://github.com/Kevin-Liu-01/SatelliteCrafter",
    description:
      "My first-ever web app: a satellite assembly game where players pick components (solar panels, thrusters, antennas) to build and launch custom satellites. The project that got me hooked on building software.",
    image: "/images/satellitecrafter.png",
    sprite: <Puzzle />,
    type1: "Game",
    type2: "Hardware",
    hp: 260,
    stats: { hp: 260, atk: 125, def: 65, spd: 115 },
    moves: [
      {
        name: "First Commit",
        power: 65,
        type: "Web",
        accuracy: 1.0,
        pp: 25,
        critChance: 0.2,
        description: "A foundational attack that often crits.",
      },
      {
        name: "Component Assembly",
        power: 80,
        type: "Hardware",
        accuracy: 0.95,
        pp: 15,
        critChance: 0.1,
        description:
          "Builds up parts for a solid strike and a temporary barrier.",
        selfEffect: { type: "barrier", chance: 1.0, amount: 0.35 },
      },
      {
        name: "Orbital Launch",
        power: 115,
        type: "Hardware",
        accuracy: 0.8,
        pp: 5,
        critChance: 0.1,
        description: "A powerful, all-or-nothing launch attack.",
      },
      {
        name: "Spaghetti Code",
        power: 70,
        type: "Game",
        accuracy: 0.9,
        pp: 10,
        critChance: 0.1,
        effect: { type: "stun", chance: 0.3 },
        description: "A messy but effective attack that may confuse and stun.",
      },
    ],
  },
];

// --- GAME LOGIC & UTILITIES ---

export const typeChart: { [attacker: string]: { [defender: string]: number } } =
  {
    AI: {
      Data: 2,
      Web: 0.5,
      Hardware: 0.5,
      Game: 2,
      Health: 1,
      Design: 1,
      Mobile: 1,
      Infra: 1,
    },
    Data: {
      AI: 0.5,
      Design: 2,
      Health: 2,
      Game: 0.5,
      Web: 1,
      Hardware: 1,
      Mobile: 1,
      Infra: 2,
    },
    Web: {
      Mobile: 2,
      AI: 2,
      Design: 0.5,
      Data: 0.5,
      Hardware: 1,
      Game: 1,
      Health: 1,
      Infra: 0.5,
    },
    Design: {
      Web: 2,
      Game: 2,
      Data: 0.5,
      AI: 1,
      Hardware: 1,
      Health: 1,
      Mobile: 1,
      Infra: 0.5,
    },
    Hardware: {
      AI: 2,
      Health: 0.5,
      Mobile: 2,
      Web: 0.5,
      Game: 1,
      Data: 1,
      Design: 1,
      Infra: 2,
    },
    Health: {
      Hardware: 2,
      Game: 0.5,
      Data: 0.5,
      AI: 1,
      Web: 1,
      Design: 1,
      Mobile: 1,
      Infra: 1,
    },
    Mobile: {
      Web: 0.5,
      Hardware: 0.5,
      Game: 2,
      Design: 2,
      AI: 1,
      Data: 1,
      Health: 1,
      Infra: 1,
    },
    Game: {
      AI: 0.5,
      Design: 0.5,
      Health: 2,
      Data: 2,
      Mobile: 0.5,
      Web: 1,
      Hardware: 1,
      Infra: 0.5,
    },
    Infra: {
      AI: 2,
      Data: 0.5,
      Web: 2,
      Design: 1,
      Hardware: 0.5,
      Health: 1,
      Mobile: 1,
      Game: 1,
      Infra: 0.5,
    },
  };

export const getTypeEffectiveness = (
  moveType: string,
  defender: PortfolioMon,
): { multiplier: number; message: string } => {
  if (!typeChart[moveType]) return { multiplier: 1, message: "" };

  let multiplier = 1;
  const effectiveness1 = typeChart[moveType][defender.type1] ?? 1;
  multiplier *= effectiveness1;

  if (defender.type2) {
    const effectiveness2 = typeChart[moveType][defender.type2] ?? 1;
    multiplier *= effectiveness2;
  }

  let message = "";
  if (multiplier > 1) message = "It's super effective!";
  if (multiplier < 1 && multiplier > 0) message = "It's not very effective...";
  if (multiplier === 0) message = "It had no effect...";

  return { multiplier, message };
};
