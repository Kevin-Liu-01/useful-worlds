const DAY_MS = 86_400_000;
const CONTRIBUTION_START = Date.UTC(2025, 11, 28);
export const CONTRIBUTION_END = "2026-07-21";

export const COMMIT_ACTIVITY: Readonly<Record<string, number>> = {
  "2026-01-09": 1,
  "2026-01-11": 1,
  "2026-01-15": 1,
  "2026-01-20": 1,
  "2026-01-28": 1,
  "2026-01-30": 2,
  "2026-02-02": 1,
  "2026-02-11": 4,
  "2026-02-12": 3,
  "2026-02-18": 1,
  "2026-02-20": 2,
  "2026-02-22": 1,
  "2026-03-09": 1,
  "2026-03-10": 3,
  "2026-03-19": 1,
  "2026-04-28": 2,
  "2026-04-29": 1,
  "2026-05-07": 2,
  "2026-05-08": 1,
  "2026-05-18": 3,
  "2026-05-27": 1,
  "2026-06-15": 1,
  "2026-07-21": 3,
};

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
  label: "Jul 21, 2026",
};

export const RECENT_COMMITS = [
  {
    hash: "12843ed",
    date: "Jul 21",
    subject: "Polish portfolio previews and fix pnpm deploy",
  },
  {
    hash: "d50153a",
    date: "Jul 21",
    subject: "Refactor portfolio landing and battle visuals",
  },
  {
    hash: "02ecff6",
    date: "Jul 21",
    subject: "Update project registry",
  },
] as const;
