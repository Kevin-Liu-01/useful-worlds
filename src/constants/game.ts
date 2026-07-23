import { SOCIAL_LINKS } from "./site";

/** Maximum non-HP stat value for scaling stat bars (ATK/DEF/SPD range: 50–150) */
export const MAX_STAT_VALUE = 160;

/** Maximum HP value for scaling HP bars (HP range: 240–325) */
export const MAX_HP_VALUE = 350;

/** Number of PortfolioMons per team */
export const TEAM_SIZE = 3;

/** Number of available battle backgrounds */
export const TOTAL_BACKGROUNDS = 6;

/** Battle animation timings (ms) */
export const ANIM = {
  TURN_DELAY: 1500,
  STATUS_DELAY: 1000,
  FAINT_DELAY: 1200,
  SWITCH_DELAY: 500,
  NOTIFICATION_DURATION: 3000,
} as const;

/** Battle balance constants */
export const BATTLE = {
  BURN_DAMAGE_FRACTION: 1 / 16,
  POISON_DAMAGE_FRACTION: 1 / 8,
  STUN_SKIP_CHANCE: 0.25,
  CRIT_MULTIPLIER: 1.5,
  BASE_DAMAGE_SCALE: 50,
  RANDOM_VARIANCE_MIN: 0.85,
  RANDOM_VARIANCE_MAX: 1.15,
} as const;

/** SM breakpoint in pixels (Tailwind sm) */
export const SM_BREAKPOINT = 640;

/** Profile GitHub URL when a project's repo is private or should stay hidden. */
export const HIDDEN_PROJECT_GITHUB = SOCIAL_LINKS.github;
