import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  Shield,
  RotateCcw,
  Flag,
  Swords,
  CheckSquare,
  Bot,
  ImageIcon,
  Type,
  UserIcon,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../providers/gameProvider";
import LogoIcon from "./logoIcon";
import { CLIP } from "../constants/clipPaths";
import { SOCIAL_LINKS } from "../constants/site";

const XLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// --- Reusable Primitives ---

const ClippedGroupContainer = ({
  children,
  className,
  label,
  borderColor = "bg-slate-400/60 dark:bg-cyan-400/50",
  clipPath = CLIP.navGroup,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  borderColor?: string;
  clipPath?: string;
}) => (
  <motion.div
    className={`relative p-px px-0.5 transition-all hover:py-0.5 ${borderColor} ${className ?? ""}`}
    style={{ clipPath }}
    initial="rest"
    whileHover="hover"
    animate="rest"
  >
    <motion.div
      className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-black/10 blur-md dark:bg-white/25"
      variants={{
        rest: { x: "-150%", skewX: -20 },
        hover: {
          x: "350%",
          skewX: -20,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    />
    <div
      className="relative flex h-full w-full items-center gap-0.5 bg-white/90 px-1 py-1 dark:bg-slate-900/80"
      style={{ clipPath }}
    >
      {label && (
        <span className="pointer-events-none select-none pl-1.5 pr-1 font-pangram text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </span>
      )}
      {children}
    </div>
  </motion.div>
);

const ClippedButton = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={`relative p-2 text-slate-500 transition-colors duration-200 hover:bg-cyan-500/10 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500 dark:text-slate-300 dark:hover:bg-cyan-400/20 dark:hover:text-cyan-300 dark:disabled:hover:text-slate-300 ${className ?? ""}`}
    style={{ clipPath: CLIP.navButton }}
  />
);

const ClippedLink = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    {...props}
    className={`relative block p-2 text-slate-500 transition-colors duration-200 hover:bg-cyan-500/10 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-400/20 dark:hover:text-cyan-300 ${className ?? ""}`}
    style={{ clipPath: CLIP.navButton }}
    target="_blank"
    rel="noopener noreferrer"
  />
);

// --- Social Links Group ---

const SocialLinksGroup = () => (
  <ClippedGroupContainer
    borderColor="bg-slate-400/40 dark:bg-slate-500/50"
  >
    <ClippedLink href={SOCIAL_LINKS.x} title="X (@kevskgs)">
      <XLogo className="h-[18px] w-[18px]" />
    </ClippedLink>
    <ClippedLink href={SOCIAL_LINKS.github} title="GitHub">
      <Github className="h-[18px] w-[18px]" />
    </ClippedLink>
    <ClippedLink href={SOCIAL_LINKS.linkedin} title="LinkedIn">
      <Linkedin className="h-[18px] w-[18px]" />
    </ClippedLink>
    <ClippedLink href={`mailto:${SOCIAL_LINKS.email}`} title="Email">
      <Mail className="h-[18px] w-[18px]" />
    </ClippedLink>
  </ClippedGroupContainer>
);

// --- Current Role Badge ---


// --- Auto-Battle Button ---

const AutoBattleButton = () => {
  const { isAutoBattleActive, toggleAutoBattle } = useGame();

  const reticleVariants = {
    active: {
      opacity: [0, 1, 1, 0],
      pathLength: [0, 1, 1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1],
      },
    },
    inactive: { opacity: 0 },
  };

  return (
    <ClippedButton
      onClick={toggleAutoBattle}
      title="Toggle Auto-Battle"
      className="!flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence>
        {isAutoBattleActive && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-1.5 rounded-full bg-cyan-400"
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ filter: "blur(4px)" }}
            />
            <motion.svg
              viewBox="0 0 24 24"
              className="absolute inset-0 text-cyan-600 dark:text-cyan-300"
              style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                fill="none"
                variants={reticleVariants}
                animate="active"
              />
            </motion.svg>
            <motion.svg
              viewBox="0 0 24 24"
              className="absolute inset-0 text-cyan-600 dark:text-cyan-300"
              style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            >
              <motion.path
                d="M4 12 L8 12 M16 12 L20 12 M12 4 L12 8 M12 16 L12 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={reticleVariants}
                animate="active"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
      <Bot
        className={`relative h-[18px] w-[18px] transition-colors ${isAutoBattleActive
          ? "text-cyan-700 dark:text-white"
          : "text-slate-500 dark:text-slate-300"
          }`}
      />
    </ClippedButton>
  );
};

// --- Background Preview Tooltip ---

const BackgroundPreview = ({ nextBgIndex }: { nextBgIndex: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="absolute top-[calc(100%+0.5rem)] right-0 z-[100] mb-3 w-48 rounded-md border border-slate-300 bg-white/80 p-1 shadow-2xl backdrop-blur-md dark:border-cyan-400/50 dark:bg-slate-900/80"
  >
    <div className="relative aspect-video w-full overflow-hidden rounded">
      <Image
        src={`/images/backgrounds/background-${nextBgIndex}.jpg`}
        alt={`Preview of background ${nextBgIndex}`}
        fill
        className="object-cover"
      />
    </div>
    <p className="mt-1 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
      Next Arena
    </p>
  </motion.div>
);

// --- Game Controls (contextual) ---

const GameControlsGroup = () => {
  const {
    gameState,
    playerTeam,
    handleReset,
    handleRun,
    handleConfirmTeam,
    startBattle,
  } = useGame();

  const showControls =
    gameState === "fight" ||
    gameState === "gameOver" ||
    gameState === "forcedSwitch" ||
    gameState === "teamSelect" ||
    gameState === "teamPreview";

  if (!showControls) return null;

  return (
    <ClippedGroupContainer
      label="Game"
      borderColor="bg-amber-400/50 dark:bg-amber-400/40"
    >
      {(gameState === "fight" ||
        gameState === "gameOver" ||
        gameState === "forcedSwitch") && (
          <>
            <ClippedButton onClick={handleReset} title="Reset Game">
              <RotateCcw className="h-[18px] w-[18px]" />
            </ClippedButton>
            <ClippedButton onClick={handleRun} title="Forfeit Match">
              <Flag className="h-[18px] w-[18px]" />
            </ClippedButton>
            <AutoBattleButton />
          </>
        )}
      {gameState === "teamSelect" && (
        <ClippedButton
          onClick={handleConfirmTeam}
          title="Confirm Team"
          disabled={playerTeam.length !== 3}
        >
          <CheckSquare className="h-[18px] w-[18px]" />
        </ClippedButton>
      )}
      {gameState === "teamPreview" && (
        <ClippedButton onClick={startBattle} title="Start Battle">
          <Swords className="h-[18px] w-[18px]" />
        </ClippedButton>
      )}
    </ClippedGroupContainer>
  );
};

// --- Visual/Settings Controls ---

const SettingsGroup = ({
  mounted,
  theme,
  systemTheme,
  setTheme,
  fontInitializer,
}: {
  mounted: boolean;
  theme: string | undefined;
  systemTheme: string | undefined;
  setTheme: (theme: string) => void;
  fontInitializer: () => void;
}) => {
  const { cycleBackground, background } = useGame();
  const [showBgPreview, setShowBgPreview] = useState(false);
  const nextBgIndex = (background % 6) + 1;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="relative">
      <ClippedGroupContainer
        borderColor="bg-cyan-400/40 dark:bg-cyan-400/50"
      >
        <div
          onMouseEnter={() => setShowBgPreview(true)}
          onMouseLeave={() => setShowBgPreview(false)}
        >
          <ClippedButton onClick={cycleBackground} title="Change Arena">
            <ImageIcon className="h-[18px] w-[18px]" />
          </ClippedButton>
        </div>
        <ClippedButton
          onClick={fontInitializer}
          title="Change Font"
        >
          <Type className="h-[18px] w-[18px]" />
        </ClippedButton>
        {mounted && (
          <ClippedButton
            onClick={() =>
              setTheme(currentTheme === "dark" ? "light" : "dark")
            }
            title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
          >
            {currentTheme === "dark" ? (
              <Moon className="h-[18px] w-[18px]" />
            ) : (
              <Sun className="h-[18px] w-[18px]" />
            )}
          </ClippedButton>
        )}
      </ClippedGroupContainer>
      <AnimatePresence>
        {showBgPreview && <BackgroundPreview nextBgIndex={nextBgIndex} />}
      </AnimatePresence>
    </div>
  );
};

// --- User/Auth Controls ---

const UserGroup = () => {
  const { data: session } = useSession();

  return (
    <ClippedGroupContainer
      borderColor="bg-emerald-400/40 dark:bg-emerald-400/40"
    >
      <div
        className="relative h-8 w-8 flex-shrink-0 bg-slate-300 p-px dark:bg-emerald-400/50"
        style={{ clipPath: CLIP.octagon }}
      >
        <div
          className="relative h-full w-full bg-slate-50 dark:bg-cyan-900"
          style={{ clipPath: CLIP.octagon }}
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon className="h-full w-full p-1 text-slate-400 dark:text-cyan-500" />
          )}
        </div>
      </div>
      <ClippedButton
        onClick={session ? () => void signOut() : () => void signIn()}
        title={session ? "Sign Out" : "Sign In"}
      >
        {session ? (
          <LogOut className="h-[18px] w-[18px]" />
        ) : (
          <LogIn className="h-[18px] w-[18px]" />
        )}
      </ClippedButton>
    </ClippedGroupContainer>
  );
};

// --- Logo Components ---

const AuthorBadge = () => (
  <div
    className="absolute bottom-2 right-[-0.15rem] z-20 p-px shadow-lg shadow-black/10 dark:shadow-black/30"
    style={{
      clipPath:
        "polygon(5px 0, 100% 0, calc(100% - 10px) 100%, 5px 100%, 0 50%)",
      background: "linear-gradient(to bottom right, #a0aec0, #2d3748)",
    }}
  >
    <div
      className="relative flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-400 to-slate-200 py-0.5 pl-2 pr-3"
      style={{
        clipPath:
          "polygon(5px 0, 100% 0, calc(100% - 10px) 100%, 5px 100%, 0 50%)",
      }}
    >
      <div
        className="absolute left-0 top-0.5 h-[1px] w-full opacity-50"
        style={{
          background:
            "linear-gradient(to right, transparent, white, transparent)",
        }}
      />
      <span
        className="font-pangram text-[7px] font-bold uppercase tracking-wider text-slate-800"
        style={{
          textShadow: "0 1px 0px rgba(255, 255, 255, 0.4)",
        }}
      >
        Kevin Liu &apos;28
      </span>
    </div>
  </div>
);

const PortfolioMonLogo = () => {
  const glitchLayer1Variants = {
    rest: { x: -1, y: 1 },
    hover: { x: -2.5, y: 1.5 },
  };
  const glitchLayer2Variants = {
    rest: { x: 1, y: -1 },
    hover: { x: 2.5, y: -1.5 },
  };
  const showdownPlateVariants = {
    rest: { x: 2, y: 2 },
    hover: { x: 1, y: 1 },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative flex cursor-pointer items-center gap-3"
    >
      <div className="relative z-10 flex items-center gap-3">
        <LogoIcon className="h-14 w-14 flex-shrink-0" />
        <div className="relative">
          <div className="relative">
            <motion.div
              variants={glitchLayer1Variants}
              className="absolute top-0 left-0 select-none font-orbiter text-2xl font-black uppercase tracking-wide text-cyan-500/50 dark:text-cyan-400/60"
              aria-hidden="true"
            >
              PortfolioMon
            </motion.div>
            <motion.div
              variants={glitchLayer2Variants}
              className="absolute top-0 left-0 select-none font-orbiter text-2xl font-black uppercase tracking-wide text-red-400/50 dark:text-red-500/60"
              aria-hidden="true"
            >
              PortfolioMon
            </motion.div>
            <div
              className="relative font-orbiter text-2xl font-black uppercase tracking-wide text-slate-800 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.08)] dark:text-slate-100 dark:drop-shadow-[1px_1px_4px_rgba(0,0,0,0.5)]"
            >
              PortfolioMon
            </div>
          </div>
          <div className="relative -mt-0.5 w-[150px]">
            <motion.div
              variants={showdownPlateVariants}
              className="absolute top-0 left-0 h-full w-full bg-slate-300 dark:bg-slate-500"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
              }}
            />
            <div
              className="relative bg-red-600"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
              }}
            >
              <div className="justify-left flex items-center gap-1.5 truncate px-2 py-0.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900">
                  <Shield className="h-3 w-3 text-red-400" />
                </div>
                <div className="font-orbiter mb-0.5 text-xs font-bold tracking-[0.1em] text-white">
                  SHOWDOWN
                </div>
              </div>
              <div
                className="absolute top-0 -right-[0.15rem] h-full w-8 bg-red-700"
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                }}
              />
              <div
                className="absolute top-0 -right-[0.75rem] h-full w-8 bg-red-800"
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                }}
              />

            </div>
          </div>
        </div>
      </div>
      <AuthorBadge />
    </motion.div>
  );
};

const LogoContainer = ({ children }: { children: React.ReactNode }) => {
  const lineContainerVariants = {
    rest: {},
    hover: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const lineFromLeft = {
    rest: { opacity: 0.1, x: -30 },
    hover: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const lineStatic = {
    rest: { opacity: 0.7, x: 0 },
    hover: { opacity: 0.7, x: 0 },
  };

  return (
    <motion.div
      className="relative flex w-full min-w-fit items-center overflow-hidden bg-white/80 pb-3 pt-1.5 pl-4 pr-12 backdrop-blur-sm sm:pl-6 dark:bg-slate-800/90"
      style={{
        clipPath: "polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)",
      }}
    >
      <motion.div
        variants={lineContainerVariants}
        className="absolute inset-0 z-0"
      >
        <motion.div
          variants={lineFromLeft}
          className="absolute inset-0 bg-cyan-500/15 dark:bg-cyan-400/30"
          style={{
            clipPath: "polygon(0 100%, 15% 100%, 85% 0, 70% 0)",
          }}
        />
        <motion.div
          variants={lineFromLeft}
          className="absolute inset-0 bg-cyan-400/10 dark:bg-cyan-300/20"
          style={{
            clipPath: "polygon(10% 100%, 20% 100%, 90% 0, 80% 0)",
          }}
        />
        <motion.div
          variants={lineFromLeft}
          className="absolute inset-0 bg-amber-400/15 dark:bg-yellow-300/30"
          style={{
            clipPath: "polygon(0% 0%, 3% 0%, 100% 100%, 97% 100%)",
          }}
        />
        <motion.div
          variants={lineStatic}
          className="absolute inset-0 bg-cyan-400/40 dark:bg-cyan-300/70"
          style={{
            clipPath:
              "polygon(100% 0, calc(100% - 3px) 0, calc(100% - 43px) 100%, calc(100% - 40px) 100%)",
          }}
        />
        <motion.div
          variants={lineStatic}
          className="absolute inset-0 bg-cyan-400/20 dark:bg-cyan-300/40"
          style={{
            clipPath:
              "polygon(calc(100% - 8px) 0, calc(100% - 11px) 0, calc(100% - 51px) 100%, calc(100% - 48px) 100%)",
          }}
        />
        <motion.div
          variants={lineStatic}
          className="absolute inset-0 bg-amber-400/15 dark:bg-yellow-300/25"
          style={{
            clipPath:
              "polygon(calc(100% - 18px) 0, calc(100% - 20px) 0, calc(100% - 60px) 100%, calc(100% - 58px) 100%)",
          }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const AngledLines = () => {
  const slantAngle = -29;

  const lines = [
    { width: 5, opacity: 1, color: "cyan", delay: 0 },
    { width: 3, opacity: 0.9, color: "cyan", delay: 0.02 },
    { width: 2, opacity: 0.85, color: "amber", delay: 0.04 },
    { width: 3, opacity: 0.75, color: "cyan", delay: 0.06 },
    { width: 2, opacity: 0.65, color: "cyan", delay: 0.08 },
    { width: 1, opacity: 0.6, color: "amber", delay: 0.10 },
    { width: 2, opacity: 0.5, color: "cyan", delay: 0.12 },
    { width: 1, opacity: 0.45, color: "cyan", delay: 0.14 },
    { width: 1, opacity: 0.35, color: "cyan", delay: 0.16 },
    { width: 1, opacity: 0.3, color: "amber", delay: 0.18 },
    { width: 1, opacity: 0.25, color: "cyan", delay: 0.20 },
    { width: 1, opacity: 0.2, color: "cyan", delay: 0.22 },
    { width: 1, opacity: 0.15, color: "cyan", delay: 0.24 },
    { width: 1, opacity: 0.1, color: "cyan", delay: 0.26 },
    { width: 1, opacity: 0.07, color: "cyan", delay: 0.28 },
  ];

  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-400 dark:bg-cyan-300",
    amber: "bg-amber-400 dark:bg-yellow-300",
  };

  return (
    <div
      className="pointer-events-none absolute left-full top-0 h-full w-52"
      aria-hidden="true"
      style={{ transform: `skewX(${slantAngle}deg)`, transformOrigin: "top left" }}
    >
      <div className="flex h-full items-center gap-[5px] pl-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className={`h-full ${colorMap[line.color]}`}
            style={{ width: `${line.width}px` }}
            variants={{
              rest: { opacity: line.opacity * 0.3 },
              hover: {
                opacity: line.opacity,
                transition: {
                  duration: 0.35,
                  delay: line.delay,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- Mobile Menu ---

const MobileMenu = ({
  isOpen,
  mounted,
  theme,
  systemTheme,
  setTheme,
  fontInitializer,
}: {
  isOpen: boolean;
  mounted: boolean;
  theme: string | undefined;
  systemTheme: string | undefined;
  setTheme: (theme: string) => void;
  fontInitializer: () => void;
}) => {
  const { data: session } = useSession();
  const {
    gameState,
    playerTeam,
    handleReset,
    handleRun,
    handleConfirmTeam,
    startBattle,
    cycleBackground,
  } = useGame();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-20 overflow-hidden border-t border-slate-300 bg-white/95 dark:border-cyan-400/20 dark:bg-slate-900/95 sm:hidden"
        >
          <div className="space-y-3 p-4">
            {/* User */}
            <ClippedGroupContainer className="w-full">
              <div className="flex w-full items-center justify-between pl-1 pr-2">
                <div className="flex items-center gap-2">
                  <div
                    className="relative h-7 w-7 bg-slate-300 p-px dark:bg-cyan-400/50"
                    style={{ clipPath: CLIP.octagon }}
                  >
                    <div
                      className="relative h-full w-full bg-slate-50 dark:bg-cyan-900"
                      style={{ clipPath: CLIP.octagon }}
                    >
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserIcon className="h-full w-full p-1 text-slate-400 dark:text-cyan-500" />
                      )}
                    </div>
                  </div>
                  <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {session?.user?.name ?? "Guest"}
                  </span>
                </div>
                <ClippedButton
                  onClick={
                    session ? () => void signOut() : () => void signIn()
                  }
                >
                  {session ? (
                    <LogOut className="h-[18px] w-[18px]" />
                  ) : (
                    <LogIn className="h-[18px] w-[18px]" />
                  )}
                </ClippedButton>
              </div>
            </ClippedGroupContainer>

            {/* Social Links */}
            <ClippedGroupContainer className="w-full" label="Links">
              <div className="flex w-full items-center justify-around">
                <ClippedLink href={SOCIAL_LINKS.x} title="X (@kevskgs)">
                  <XLogo className="h-[18px] w-[18px]" />
                </ClippedLink>
                <ClippedLink href={SOCIAL_LINKS.github} title="GitHub">
                  <Github className="h-[18px] w-[18px]" />
                </ClippedLink>
                <ClippedLink href={SOCIAL_LINKS.linkedin} title="LinkedIn">
                  <Linkedin className="h-[18px] w-[18px]" />
                </ClippedLink>
                <ClippedLink
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  title="Email"
                >
                  <Mail className="h-[18px] w-[18px]" />
                </ClippedLink>
              </div>
            </ClippedGroupContainer>

            {/* Game + Settings */}
            <ClippedGroupContainer className="w-full">
              <div className="flex w-full items-center justify-around">
                {(gameState === "fight" ||
                  gameState === "gameOver" ||
                  gameState === "forcedSwitch") && (
                    <>
                      <ClippedButton onClick={handleReset} title="Reset Game">
                        <RotateCcw className="h-[18px] w-[18px]" />
                      </ClippedButton>
                      <ClippedButton onClick={handleRun} title="Forfeit Match">
                        <Flag className="h-[18px] w-[18px]" />
                      </ClippedButton>
                      <AutoBattleButton />
                    </>
                  )}
                {gameState === "teamSelect" && (
                  <ClippedButton
                    onClick={handleConfirmTeam}
                    title="Confirm Team"
                    disabled={playerTeam.length !== 3}
                  >
                    <CheckSquare className="h-[18px] w-[18px]" />
                  </ClippedButton>
                )}
                {gameState === "teamPreview" && (
                  <ClippedButton onClick={startBattle} title="Start Battle">
                    <Swords className="h-[18px] w-[18px]" />
                  </ClippedButton>
                )}
                <ClippedButton
                  onClick={cycleBackground}
                  title="Change Arena"
                >
                  <ImageIcon className="h-[18px] w-[18px]" />
                </ClippedButton>
                <ClippedButton onClick={fontInitializer} title="Change Font">
                  <Type className="h-[18px] w-[18px]" />
                </ClippedButton>
                {mounted && (
                  <ClippedButton
                    onClick={() =>
                      setTheme(currentTheme === "dark" ? "light" : "dark")
                    }
                    title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
                  >
                    {currentTheme === "dark" ? (
                      <Moon className="h-[18px] w-[18px]" />
                    ) : (
                      <Sun className="h-[18px] w-[18px]" />
                    )}
                  </ClippedButton>
                )}
              </div>
            </ClippedGroupContainer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Navbar ---

const Navbar = (props: {
  menuHandler: () => void;
  fontInitializer: () => void;
}) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const { handleReset, background } = useGame();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <motion.nav
      className="relative top-0 z-50 border-b border-slate-300 bg-slate-50 backdrop-blur-md dark:border-cyan-400/20 dark:bg-slate-900"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Background image */}
      <div className="absolute inset-0 aspect-video h-full w-full overflow-hidden rounded opacity-30 dark:opacity-30">
        <Image
          src={`/images/backgrounds/background-${background}.jpg`}
          alt={`Background ${background}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Decorative overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-white/70 to-slate-50/80 dark:from-slate-800/50 dark:to-slate-900/50"
          variants={{ rest: { opacity: 0.8 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        />
        {/* Grid overlay — light */}
        <div className="dark:hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundSize: "20px 20px",
              backgroundImage:
                "linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)",
            }}
            variants={{
              rest: { opacity: 0, x: -20 },
              hover: { opacity: 0.3, x: 0 },
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* Grid overlay — dark */}
        <div className="hidden dark:block">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundSize: "20px 20px",
              backgroundImage:
                "linear-gradient(to right, #083344 1px, transparent 1px), linear-gradient(to bottom, #083344 1px, transparent 1px)",
            }}
            variants={{
              rest: { opacity: 0, x: -20 },
              hover: { opacity: 0.4, x: 0 },
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Horizontal accent lines */}
        <div
          className="absolute inset-0 bg-cyan-400/30 dark:bg-cyan-300/40"
          style={{ clipPath: "polygon(0% 38%, 100% 38%, 100% 40%, 0% 40%)" }}
        />
        <div
          className="absolute inset-0 bg-amber-400/20 dark:bg-yellow-300/30"
          style={{ clipPath: "polygon(0% 68%, 100% 68%, 100% 70%, 0% 70%)" }}
        />

        {/* Decorative diagonal lines */}
        <div className="relative h-full w-full opacity-40">
          <div
            className="absolute inset-0 ml-72 bg-cyan-500/50 dark:bg-cyan-400/50"
            style={{
              clipPath: "polygon(15% 0, 16% 0, 10% 100%, 9% 100%)",
            }}
          />
          <motion.div
            variants={{
              rest: { opacity: 0.2 },
              hover: {
                opacity: 0.5,
                x: -5,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
            className="absolute inset-0 bg-cyan-300/50 dark:bg-cyan-200/50"
            style={{
              clipPath: "polygon(50% 0, 51% 0, 65% 100%, 64% 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-cyan-500 dark:bg-cyan-400"
            style={{
              clipPath: "polygon(80% 0, 81% 0, 81% 100%, 80% 100%)",
            }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-cyan-400/70 shadow-[0_0_10px_theme(colors.cyan.400)] dark:bg-cyan-300/70 dark:shadow-[0_0_10px_theme(colors.cyan.300)]"
          initial={{ y: "0%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-full w-full items-stretch justify-start">
        {/* Logo */}
        <button
          onClick={handleReset}
          aria-label="Home"
          className="relative w-1/3"
        >
          <LogoContainer>
            <PortfolioMonLogo />
          </LogoContainer>
          <AngledLines />
        </button>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2.5 pr-4 sm:pr-6 lg:pr-8">
          {/* Desktop controls */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <SocialLinksGroup />
            <GameControlsGroup />
            <SettingsGroup
              mounted={mounted}
              theme={theme}
              systemTheme={systemTheme}
              setTheme={setTheme}
              fontInitializer={props.fontInitializer}
            />
            <UserGroup />
          </div>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <ClippedButton onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="h-[18px] w-[18px]" />
              ) : (
                <Menu className="h-[18px] w-[18px]" />
              )}
            </ClippedButton>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={menuOpen}
        mounted={mounted}
        theme={theme}
        systemTheme={systemTheme}
        setTheme={setTheme}
        fontInitializer={props.fontInitializer}
      />
    </motion.nav>
  );
};

export default Navbar;
