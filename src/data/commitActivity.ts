const DAY_MS = 86_400_000;
const CONTRIBUTION_START = Date.UTC(2025, 11, 28);
const ACTIVITY_START = Date.UTC(2026, 0, 1);

export const CONTRIBUTION_END = "2026-07-23";
export const TOTAL_CONTRIBUTIONS = 2_395;
export const ACTIVE_CONTRIBUTION_DAYS = 170;
export const CONTRIBUTION_SNAPSHOT = "Jul 23, 2026";

// Authenticated GitHub contribution calendar for Kevin-Liu-01, Jan 1–Jul 23, 2026.
// Stored as a deploy-safe snapshot so the public site never needs a GitHub token.
const CONTRIBUTION_COUNTS = [
  1, 1, 0, 0, 2, 2, 0, 1, 12, 1, 3, 5, 2, 10, 6, 3, 2, 0, 6, 14, 2, 0, 3, 1, 7,
  6, 5, 13, 10, 8, 0, 1, 6, 0, 2, 0, 0, 0, 0, 0, 0, 11, 7, 4, 1, 0, 0, 0, 4, 0,
  3, 0, 4, 4, 2, 1, 6, 15, 18, 12, 9, 2, 10, 8, 7, 9, 6, 18, 15, 12, 11, 15, 5,
  5, 16, 4, 13, 16, 15, 1, 7, 13, 3, 20, 18, 5, 26, 12, 40, 13, 58, 12, 12, 0,
  14, 25, 20, 3, 15, 6, 2, 11, 5, 1, 4, 5, 1, 24, 13, 20, 8, 34, 8, 7, 0, 1, 20,
  65, 23, 14, 10, 9, 1, 9, 29, 47, 53, 53, 14, 1, 16, 17, 17, 1, 0, 4, 9, 7, 19,
  14, 1, 11, 0, 0, 2, 0, 5, 4, 24, 7, 50, 23, 32, 3, 14, 42, 0, 37, 2, 5, 4, 1,
  4, 12, 8, 92, 18, 24, 9, 4, 0, 1, 33, 42, 30, 36, 11, 8, 1, 27, 56, 31, 29,
  56, 41, 0, 42, 2, 0, 0, 0, 0, 9, 2, 4, 4, 0, 0, 0, 3, 44, 9, 75, 19,
] as const;

export const COMMIT_ACTIVITY: Readonly<Record<string, number>> =
  Object.fromEntries(
    CONTRIBUTION_COUNTS.map((count, index) => [
      new Date(ACTIVITY_START + index * DAY_MS).toISOString().slice(0, 10),
      count,
    ]),
  );

export const COMMIT_CELLS = Array.from({ length: 53 * 7 }, (_, index) => {
  const date = new Date(CONTRIBUTION_START + index * DAY_MS);
  const key = date.toISOString().slice(0, 10);
  return {
    key,
    count: COMMIT_ACTIVITY[key] ?? 0,
    inYear: date.getUTCFullYear() === 2026,
    future: key > CONTRIBUTION_END,
    label: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  };
});

export const DEFAULT_ACTIVE_DAY = COMMIT_CELLS.find(
  (cell) => cell.key === CONTRIBUTION_END,
) ?? {
  key: CONTRIBUTION_END,
  count: 0,
  inYear: true,
  future: false,
  label: CONTRIBUTION_SNAPSHOT,
};

export const RECENT_COMMITS = [
  {
    hash: "b16eb81",
    date: "Jul 23",
    subject: "Refine portfolio motion system",
    repo: "useful-worlds",
  },
  {
    hash: "1430b32",
    date: "Jul 23",
    subject: "Restore natural document scrolling",
    repo: "useful-worlds",
  },
  {
    hash: "69a9564",
    date: "Jul 23",
    subject: "Stack hero media below introduction",
    repo: "useful-worlds",
  },
] as const;
