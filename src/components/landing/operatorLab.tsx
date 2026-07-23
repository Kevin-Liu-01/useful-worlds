import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  FileText,
  Gauge,
  Keyboard,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

const DAY_MS = 86_400_000;
const CONTRIBUTION_START = Date.UTC(2025, 11, 28);
const CONTRIBUTION_END = "2026-07-21";

const COMMIT_ACTIVITY: Readonly<Record<string, number>> = {
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

const COMMIT_CELLS = Array.from({ length: 53 * 7 }, (_, index) => {
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

const DEFAULT_ACTIVE_DAY = COMMIT_CELLS.find(
  (cell) => cell.key === CONTRIBUTION_END,
) ?? {
  key: CONTRIBUTION_END,
  count: 0,
  inYear: true,
  future: false,
  label: "Jul 21, 2026",
};

const RECENT_COMMITS = [
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

const PERSONAL_SIGNALS = [
  {
    code: "01 / RETURN",
    title: "Hacker → sponsor",
    text: "After thirteen hackathon wins, I came back to HackPrinceton with Dedalus infrastructure, prizes, and a packed lecture hall.",
  },
  {
    code: "02 / PARALLEL",
    title: "Code and kilos",
    text: "Powerlifting and software share a calendar. Both reward boring consistency, visible numbers, and one more clean rep.",
  },
  {
    code: "03 / MEMORY",
    title: "Notes become systems",
    text: "My wiki is not a scrapbook. It is agent-readable memory that keeps projects, people, decisions, and contradictions connected.",
  },
  {
    code: "04 / PLAY",
    title: "The old site still fights",
    text: "I sunset the old portfolio without deleting its personality. It now survives as a complete turn-based game inside this one.",
  },
  {
    code: "05 / PROOF",
    title: "Receipts over adjectives",
    text: "If I say a system is fast, useful, or alive, I want a timer, an interaction, or a shipped artifact nearby to prove it.",
  },
] as const;

type EggId =
  | "cadence"
  | "resume"
  | "overclock"
  | "signals"
  | "trainer"
  | "name"
  | "identity"
  | "red-button";

const EGG_TOTAL = 8;
const TRAINER_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "k",
  "l",
] as const;

const contributionClass = (count: number) => {
  if (count >= 4) return "bg-black dark:bg-white";
  if (count === 3) return "bg-black/75 dark:bg-white/80";
  if (count === 2) return "bg-black/45 dark:bg-white/55";
  if (count === 1) return "bg-black/20 dark:bg-white/25";
  return "bg-black/[0.065] dark:bg-white/[0.08]";
};

const LabLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-kode text-[7px] uppercase tracking-[0.17em] opacity-45 sm:text-[8px]">
    {children}
  </span>
);

const OperatorLab = () => {
  const [activeDay, setActiveDay] = useState(DEFAULT_ACTIVE_DAY);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [overclock, setOverclock] = useState(false);
  const [signalIndex, setSignalIndex] = useState(0);
  const [redPresses, setRedPresses] = useState(0);
  const [eggs, setEggs] = useState<Set<EggId>>(() => new Set());
  const [secretMessage, setSecretMessage] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState("LISTENING");
  const trainerIndex = useRef(0);
  const typedBuffer = useRef("");

  const markEgg = useCallback((egg: EggId) => {
    setEggs((current) => {
      if (current.has(egg)) return current;
      const next = new Set(current);
      next.add(egg);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("portfolio-overclock", overclock);
    return () =>
      document.documentElement.classList.remove("portfolio-overclock");
  }, [overclock]);

  useEffect(() => {
    if (!pdfOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [pdfOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPdfOpen(false);
        setSecretMessage(null);
        return;
      }
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey)
        return;

      const normalized =
        event.key.length === 1 ? event.key.toLowerCase() : event.key;
      setLastKey(normalized.toUpperCase());

      const expected = TRAINER_CODE[trainerIndex.current];
      if (normalized === expected) {
        trainerIndex.current += 1;
        if (trainerIndex.current === TRAINER_CODE.length) {
          trainerIndex.current = 0;
          markEgg("trainer");
          setSecretMessage(
            "TRAINER CODE ACCEPTED / A patient sequence beats a loud shortcut.",
          );
        }
      } else {
        trainerIndex.current = normalized === TRAINER_CODE[0] ? 1 : 0;
      }

      if (event.key.length === 1) {
        typedBuffer.current = `${typedBuffer.current}${normalized}`.slice(-16);
        if (typedBuffer.current.endsWith("kevin")) {
          markEgg("name");
          setSecretMessage(
            "NAME SIGNAL FOUND / Kevin is centered because the work is not the whole person.",
          );
        }
        if (typedBuffer.current.endsWith("kl028")) {
          markEgg("identity");
          setSecretMessage(
            "TRAINER ID KL-028 / Princeton, Los Angeles, and everywhere a laptop opens.",
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [markEgg]);

  const activeSignal = PERSONAL_SIGNALS[signalIndex];
  const allUnlocked = eggs.size === EGG_TOTAL;

  const selectDay = (cell: (typeof COMMIT_CELLS)[number]) => {
    setActiveDay(cell);
    if (cell.key === CONTRIBUTION_END) markEgg("cadence");
  };

  const openResume = () => {
    markEgg("resume");
    setPdfOpen(true);
  };

  const toggleOverclock = () => {
    setOverclock((current) => !current);
    markEgg("overclock");
  };

  const nextSignal = () => {
    setSignalIndex((current) => {
      const next = (current + 1) % PERSONAL_SIGNALS.length;
      if (next === 0) markEgg("signals");
      return next;
    });
  };

  const pressRedButton = () => {
    setRedPresses((current) => {
      const next = current + 1;
      if (next >= 5) {
        markEgg("red-button");
        setOverclock(true);
        setSecretMessage(
          "YOU PRESSED IT FIVE TIMES / Restraint was never the experiment.",
        );
      }
      return next;
    });
  };

  return (
    <>
      <div className="px-5 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-20 lg:px-14 lg:pb-16">
        <div className="grid items-end gap-8 border-b border-black/30 pb-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <LabLabel>Copmonents / operator lab / 08 secrets</LabLabel>
            <h2 className="mt-4 max-w-[12ch] font-telegraf text-[clamp(3.5rem,7vw,7.8rem)] font-black leading-[0.88] tracking-[-0.04em]">
              The page can prove things, too.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[42ch] font-nacelle text-[16px] leading-[1.75] text-black/60 sm:text-lg">
              A rack of small interfaces about how I work: shipping cadence,
              source documents, private jokes, and settings that reward poking
              past the obvious.
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-black/30 pt-4 font-kode text-[8px] uppercase tracking-[0.16em]">
              <span>Easter eggs recovered</span>
              <strong className="text-base tracking-normal">
                {String(eggs.size).padStart(2, "0")} / {EGG_TOTAL}
              </strong>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <article className="border border-black/30 p-5 sm:p-7 lg:col-span-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <LabLabel>Proof cadence / this repository</LabLabel>
                <h3 className="mt-2 font-telegraf text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                  38 commits in 2026.
                </h3>
              </div>
              <Activity className="h-7 w-7" strokeWidth={1.25} />
            </div>

            <div className="mt-7 overflow-x-auto pb-2">
              <div className="mb-2 flex min-w-[760px] justify-between font-kode text-[6px] uppercase tracking-[0.13em] text-black/35">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
              <div
                className="grid min-w-[760px] gap-1"
                style={{
                  gridTemplateRows: "repeat(7, 10px)",
                  gridAutoFlow: "column",
                  gridAutoColumns: "10px",
                }}
                role="grid"
                aria-label="PortfolioMon commit activity for 2026"
              >
                {COMMIT_CELLS.map((cell) =>
                  !cell.inYear || cell.future ? (
                    <span
                      key={cell.key}
                      aria-hidden="true"
                      className="h-2.5 w-2.5 border border-black/[0.035] dark:border-white/[0.04]"
                    />
                  ) : (
                    <button
                      key={cell.key}
                      type="button"
                      role="gridcell"
                      aria-label={`${cell.label}: ${cell.count} commits`}
                      title={`${cell.label} · ${cell.count} commits`}
                      onMouseEnter={() => selectDay(cell)}
                      onFocus={() => selectDay(cell)}
                      onClick={() => selectDay(cell)}
                      className={`h-2.5 w-2.5 outline-none ring-[#d8ff36] transition-transform hover:scale-150 focus-visible:scale-150 focus-visible:ring-2 ${contributionClass(
                        cell.count,
                      )}`}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-5 border-t border-black/25 pt-5 sm:grid-cols-[180px_1fr]">
              <div>
                <LabLabel>Selected day</LabLabel>
                <p className="mt-2 font-telegraf text-xl font-black">
                  {activeDay.label}
                </p>
                <p className="mt-1 font-kode text-[7px] uppercase tracking-[0.15em] text-black/45">
                  {activeDay.count} commit{activeDay.count === 1 ? "" : "s"}
                </p>
              </div>
              <div className="space-y-2">
                {RECENT_COMMITS.map((commit) => (
                  <div
                    key={commit.hash}
                    className="grid grid-cols-[58px_48px_1fr] gap-2 border-b border-black/15 pb-2 font-kode text-[7px] uppercase tracking-[0.1em] last:border-0"
                  >
                    <span>{commit.hash}</span>
                    <span className="text-black/40">{commit.date}</span>
                    <span className="truncate text-black/60">
                      {commit.subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="flex min-h-[420px] flex-col justify-between bg-black p-6 text-white sm:p-8 lg:col-span-4">
            <div className="flex items-start justify-between">
              <LabLabel>Source document / résumé</LabLabel>
              <FileText className="h-7 w-7 text-[#d8ff36]" strokeWidth={1.25} />
            </div>
            <div>
              <span className="font-kode text-[7px] uppercase tracking-[0.16em] text-white/40">
                One page / six roles / one thread
              </span>
              <h3 className="mt-4 font-telegraf text-5xl font-black leading-[0.9] tracking-[-0.04em]">
                Open the receipt.
              </h3>
              <p className="mt-5 max-w-sm font-nacelle text-[15px] leading-[1.7] text-white/55">
                The work history, education, and technical through-line behind
                the louder interfaces.
              </p>
            </div>
            <button
              type="button"
              onClick={openResume}
              className="group mt-8 flex items-center justify-between bg-white px-4 py-4 text-left text-black transition hover:bg-[#d8ff36]"
            >
              <span className="font-kode text-[8px] uppercase tracking-[0.16em]">
                Launch PDF viewer
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </article>

          <article className="relative min-h-[390px] overflow-hidden bg-[#d8ff36] p-6 text-black sm:p-8 lg:col-span-4">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <LabLabel>Unstable preference / reversible</LabLabel>
                <Gauge className="h-7 w-7" strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-kode text-[7px] uppercase tracking-[0.16em] text-black/45">
                  Status / {overclock ? "unsafe-ish" : "nominal"}
                </p>
                <h3 className="mt-3 font-telegraf text-5xl font-black leading-[0.88] tracking-[-0.04em]">
                  Overclock the portfolio.
                </h3>
              </div>
              <button
                type="button"
                onClick={toggleOverclock}
                aria-pressed={overclock}
                className="group mt-8 flex items-center justify-between border border-black bg-black px-4 py-4 text-white transition hover:bg-white hover:text-black"
              >
                <span className="font-kode text-[8px] uppercase tracking-[0.16em]">
                  {overclock ? "Return to nominal" : "Break visual containment"}
                </span>
                {overclock ? (
                  <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-90" />
                ) : (
                  <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                )}
              </button>
            </div>
            <motion.span
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-black/30"
              animate={{ rotate: 360, scale: overclock ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
          </article>

          <button
            type="button"
            onClick={nextSignal}
            className="group flex min-h-[390px] flex-col justify-between border border-black/30 p-6 text-left sm:p-8 lg:col-span-4"
          >
            <div className="flex items-start justify-between">
              <LabLabel>Personal signal / click to tune</LabLabel>
              <span className="font-kode text-[8px] tabular-nums tracking-[0.12em]">
                {String(signalIndex + 1).padStart(2, "0")} / 05
              </span>
            </div>
            <motion.div
              key={activeSignal.code}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-kode text-[7px] uppercase tracking-[0.16em] text-black/40">
                {activeSignal.code}
              </p>
              <h3 className="mt-3 font-telegraf text-4xl font-black leading-[0.92] tracking-[-0.035em] sm:text-5xl">
                {activeSignal.title}
              </h3>
              <p className="mt-5 font-nacelle text-[15px] leading-[1.7] text-black/60">
                {activeSignal.text}
              </p>
            </motion.div>
            <div className="flex items-center justify-between border-t border-black/25 pt-4 font-kode text-[7px] uppercase tracking-[0.15em]">
              Tune next signal
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </div>
          </button>

          <article className="flex min-h-[390px] flex-col justify-between bg-black p-6 text-white sm:p-8 lg:col-span-4">
            <div className="flex items-start justify-between">
              <LabLabel>Keyboard decoder / always listening</LabLabel>
              <Keyboard className="h-7 w-7 text-[#d8ff36]" strokeWidth={1.25} />
            </div>
            <div>
              <div className="border border-white/25 bg-white/[0.04] p-4">
                <span className="font-kode text-[7px] uppercase tracking-[0.16em] text-white/35">
                  Last signal
                </span>
                <strong className="mt-2 block truncate font-telegraf text-3xl font-black text-[#d8ff36]">
                  {lastKey}
                </strong>
              </div>
              <div className="mt-4 space-y-2 font-kode text-[7px] uppercase tracking-[0.13em] text-white/45">
                <p>Hint 01 / The center knows your name.</p>
                <p>Hint 02 / Trainer code ends in K L.</p>
                <p>Hint 03 / An ID repeats across the site.</p>
                <p>Hint 04 / The B key is already occupied.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: EGG_TOTAL }, (_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 ${
                    index < eggs.size ? "bg-[#d8ff36]" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </article>

          <article className="flex min-h-[390px] flex-col justify-between border border-black/30 p-6 sm:p-8 lg:col-span-4">
            <div className="flex items-start justify-between">
              <LabLabel>Restraint test / definitely safe</LabLabel>
              <span className="font-kode text-[8px] uppercase tracking-[0.14em] text-black/40">
                Presses / {String(redPresses).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <motion.button
                type="button"
                onClick={pressRedButton}
                aria-label="Do not press the red button"
                className="relative flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-black bg-[#ff3b30] shadow-[0_13px_0_#111] outline-none focus-visible:ring-4 focus-visible:ring-[#d8ff36]"
                whileTap={{ y: 10, boxShadow: "0 3px 0 #111" }}
              >
                <span className="h-16 w-16 rounded-full border border-black/30 bg-white/20" />
              </motion.button>
              <strong className="mt-8 font-telegraf text-2xl font-black uppercase">
                Do not press.
              </strong>
              <p className="mt-2 font-kode text-[7px] uppercase tracking-[0.14em] text-black/40">
                Especially not five times
              </p>
            </div>
            <div className="h-px bg-black/25" />
          </article>
        </div>

        {allUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex flex-col justify-between gap-5 bg-[#d8ff36] p-6 text-black sm:flex-row sm:items-center sm:p-8"
          >
            <div>
              <LabLabel>Eight of eight / final encounter</LabLabel>
              <h3 className="mt-2 font-telegraf text-4xl font-black tracking-[-0.035em]">
                You read interfaces like source code.
              </h3>
            </div>
            <Sparkles className="h-12 w-12" strokeWidth={1.15} />
          </motion.div>
        )}
      </div>

      {overclock && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[105] overflow-hidden opacity-30 mix-blend-difference"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_5px,rgba(255,255,255,.18)_6px)]" />
          <motion.span
            className="absolute inset-x-0 h-px bg-white shadow-[0_0_24px_white]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          {Array.from({ length: 18 }, (_, index) => (
            <motion.span
              key={index}
              className="absolute h-1.5 w-1.5 bg-white"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 19) % 100}%`,
              }}
              animate={{ opacity: [0.1, 1, 0.1], scale: [1, 2.5, 1] }}
              transition={{
                duration: 1.2 + (index % 5) * 0.24,
                repeat: Infinity,
                delay: index * 0.05,
              }}
            />
          ))}
        </div>
      )}

      {pdfOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Kevin Liu résumé PDF viewer"
          className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close résumé viewer"
            onClick={() => setPdfOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            className="relative z-10 flex h-[92vh] w-full max-w-6xl flex-col border border-white/30 bg-black text-white shadow-2xl"
            initial={{ y: 28, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
          >
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/25 px-4 sm:px-5">
              <div>
                <span className="font-kode text-[7px] uppercase tracking-[0.16em] text-white/45">
                  Source document / live viewer
                </span>
                <strong className="ml-3 hidden font-telegraf text-sm sm:inline">
                  Kevin Liu — Résumé
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/kevin_liu_resume_25.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/30 px-3 py-2 font-kode text-[7px] uppercase tracking-[0.14em] hover:bg-white hover:text-black"
                >
                  Open source
                </a>
                <button
                  type="button"
                  onClick={() => setPdfOpen(false)}
                  aria-label="Close résumé viewer"
                  className="border border-white/30 p-2 hover:bg-white hover:text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>
            <iframe
              src="/kevin_liu_resume_25.pdf#view=FitH"
              title="Kevin Liu résumé"
              className="min-h-0 flex-1 bg-[#e8e8e8]"
            />
          </motion.div>
        </motion.div>
      )}

      {secretMessage && (
        <motion.div
          role="status"
          className="fixed left-1/2 top-24 z-[150] w-[min(92vw,620px)] -translate-x-1/2 border border-black bg-[#d8ff36] p-5 text-black shadow-[12px_12px_0_#000] sm:p-7"
          initial={{ opacity: 0, y: -24, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
        >
          <button
            type="button"
            onClick={() => setSecretMessage(null)}
            aria-label="Dismiss secret message"
            className="absolute right-3 top-3 border border-black p-1.5 hover:bg-black hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <LabLabel>Secret recovered / {eggs.size} of 8</LabLabel>
          <p className="mt-3 pr-8 font-telegraf text-2xl font-black leading-tight sm:text-3xl">
            {secretMessage}
          </p>
        </motion.div>
      )}
    </>
  );
};

export default OperatorLab;
