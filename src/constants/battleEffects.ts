/** RGB color strings for type-specific attack/hit effects */
export const TYPE_COLORS: Record<string, { primary: string; glow: string }> = {
  AI: { primary: "138, 43, 226", glow: "180, 100, 255" },
  Data: { primary: "59, 130, 246", glow: "96, 165, 250" },
  Web: { primary: "34, 197, 94", glow: "74, 222, 128" },
  Design: { primary: "236, 72, 153", glow: "244, 114, 182" },
  Hardware: { primary: "107, 114, 128", glow: "156, 163, 175" },
  Health: { primary: "239, 68, 68", glow: "248, 113, 113" },
  Mobile: { primary: "234, 179, 8", glow: "250, 204, 21" },
  Game: { primary: "249, 115, 22", glow: "251, 146, 60" },
};

const DEFAULT_COLOR = { primary: "0, 220, 255", glow: "100, 240, 255" };

export function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? DEFAULT_COLOR;
}

/** Particle counts for attack burst effects */
export const PARTICLE_COUNT = 12;

/** Number of slash lines for melee-style attacks */
export const SLASH_COUNT = 3;
