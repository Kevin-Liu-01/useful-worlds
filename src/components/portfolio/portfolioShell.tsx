import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  BriefcaseBusiness,
  Camera,
  ContactRound,
  FileText,
  Gamepad2,
  Github,
  Linkedin,
  Moon,
  Sun,
  UsersRound,
} from "lucide-react";
import { SOCIAL_LINKS } from "../../constants/site";

const DOCK_ITEMS = [
  { label: "Work", href: "/#work", icon: BriefcaseBusiness },
  { label: "Experience", href: "/experience", icon: FileText },
  { label: "People", href: "/people", icon: ContactRound },
  { label: "KevBook", href: "/kevbook", icon: UsersRound },
  { label: "Photos", href: "/photography", icon: Camera },
] as const;

const TOP_NAV_ITEMS = [
  DOCK_ITEMS[0],
  { label: "Writing", href: "/#philosophy" },
  ...DOCK_ITEMS.slice(1),
] as const;

const PortfolioTopNavigation = () => {
  const router = useRouter();
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 84);
  });

  const current = router.pathname.startsWith("/philosophy/")
    ? "Writing"
    : (DOCK_ITEMS.find((item) =>
        item.href.startsWith("/#")
          ? router.pathname === "/"
          : router.pathname === item.href,
      )?.label ?? "Portfolio");

  return (
    <motion.header
      initial={false}
      animate={{
        top: condensed ? 10 : 0,
        width: condensed
          ? "min(840px, calc(100vw - 24px))"
          : "min(1180px, calc(100vw - 24px))",
        height: condensed ? 56 : 64,
        boxShadow: condensed
          ? "0 18px 60px rgba(0,0,0,.32)"
          : "0 10px 40px rgba(0,0,0,.14)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 29, mass: 0.8 }}
      className="fixed left-1/2 z-[92] flex -translate-x-1/2 items-center justify-between gap-2 overflow-hidden border border-white/20 bg-black/95 p-2 text-white backdrop-blur-xl"
      style={{
        clipPath:
          "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
      }}
    >
      <Link
        href="/"
        className="circuit-control group flex min-w-0 items-center gap-2 pr-3 hover:bg-white hover:text-black"
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-cover"
        />
        <span className="truncate font-telegraf text-sm font-black uppercase">
          Kevin Liu
        </span>
        <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#d8ff36]" />
      </Link>

      <nav
        aria-label="Page navigation"
        className="hidden items-center gap-1 border-x border-white/20 px-2 md:flex"
      >
        {TOP_NAV_ITEMS.map((item, index) => {
          const active = item.label === current;
          return (
            <motion.div
              key={item.href}
              whileHover={{ y: -2 }}
              className={index > 2 && condensed ? "hidden lg:block" : ""}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block px-3 py-2 text-[8px] uppercase tracking-[0.12em] transition ${
                  active
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-[8px] uppercase tracking-[0.14em] text-white/40 sm:block md:hidden xl:block">
          {current}
        </span>
        <Link
          href="/?play=1"
          className="circuit-action group flex h-10 items-center gap-2 bg-[#d8ff36] px-2 pl-4 text-[8px] uppercase tracking-[0.12em] text-black hover:bg-white"
        >
          <span className="hidden sm:inline">PortfolioMon</span>
          <Gamepad2 className="h-4 w-4 transition-transform duration-500 group-hover:rotate-[360deg]" />
        </Link>
      </div>

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 bg-[#d8ff36]"
        animate={{ width: condensed ? "38%" : "14%" }}
      />
    </motion.header>
  );
};

const ThemeToggle = ({ expanded }: { expanded: boolean }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? "Use light mode" : "Use dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="circuit-control-reverse group mx-px flex h-11 shrink-0 items-center justify-center gap-2 px-2 text-white/70 transition hover:bg-white hover:text-black sm:px-3"
    >
      {dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.7} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.7} />
      )}
      <span
        className={`hidden overflow-hidden whitespace-nowrap text-[9px] uppercase tracking-[0.12em] transition-all duration-300 md:block ${
          expanded ? "max-w-14 opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
};

const PortfolioDock = ({ onPlay }: { onPlay?: () => void }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const rawFrameProgress = useMotionValue(0);
  const frameProgress = useSpring(rawFrameProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.25,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (document.querySelector("[data-portfolio-scroll-root]")) return;
    setScrolled(latest > 84);
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    rawFrameProgress.set(latest / maxScroll);
  });

  useEffect(() => {
    const syncPortfolioScroll = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        scrollY?: number;
        progress?: number;
      };
      setScrolled((detail.scrollY ?? 0) > 84);
      rawFrameProgress.set(detail.progress ?? 0);
    };

    window.addEventListener("portfolio-scroll", syncPortfolioScroll);
    return () =>
      window.removeEventListener("portfolio-scroll", syncPortfolioScroll);
  }, [rawFrameProgress]);

  return (
    <motion.nav
      aria-label="Portfolio shortcuts"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setExpanded(false);
        }
      }}
      initial={false}
      animate={{
        bottom: scrolled ? 14 : 0,
        width: expanded
          ? "min(1060px, calc(100vw - 24px))"
          : scrolled
            ? "min(760px, calc(100vw - 24px))"
            : "min(860px, calc(100vw - 24px))",
        boxShadow: scrolled
          ? "0 20px 70px rgba(0,0,0,.34)"
          : "0 -12px 45px rgba(0,0,0,.18)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.75 }}
      className="fixed left-1/2 z-[90] flex -translate-x-1/2 items-center justify-start overflow-hidden border border-white/20 bg-black/95 p-1 font-mori text-white backdrop-blur-xl md:justify-center"
      style={{
        clipPath:
          "polygon(11px 0, calc(100% - 11px) 0, 100% 11px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 11px)",
      }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-[#d8ff36]"
        style={{ scaleX: frameProgress }}
      />
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#d8ff36]" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-white/40" />
      <Link
        href="/"
        aria-label="Kevin Liu home"
        title="Home"
        className="circuit-action group relative flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden bg-black px-1.5"
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={44}
          height={44}
          loading="eager"
          className="h-10 w-10 shrink-0 object-cover transition-opacity group-hover:opacity-75"
        />
        <span
          className={`hidden overflow-hidden whitespace-nowrap font-telegraf text-xs font-black uppercase transition-all duration-300 md:block ${
            expanded ? "max-w-20 pr-2 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Kevin
        </span>
        <span className="absolute inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 bg-[#d8ff36] transition-transform group-hover:scale-x-100" />
      </Link>

      <span className="mx-1 h-6 w-px shrink-0 bg-white/20" />

      {DOCK_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const active = item.href.startsWith("/#")
          ? router.pathname === "/"
          : router.pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
            title={item.label}
            className={`${
              index % 2 === 0 ? "circuit-control" : "circuit-control-reverse"
            } group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 px-2 transition md:px-3 ${
              active
                ? "bg-white text-[#11110f]"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.65} />
            <span
              className={`hidden overflow-hidden whitespace-nowrap text-[9px] uppercase tracking-[0.12em] transition-all duration-300 md:block ${
                expanded || active
                  ? "max-w-24 opacity-100"
                  : "max-w-0 opacity-0"
              }`}
            >
              {item.label}
            </span>
            {active && (
              <span className="absolute inset-x-2 bottom-0 flex items-center">
                <span className="h-0.5 flex-1 bg-[#d8ff36]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[#d8ff36]" />
              </span>
            )}
          </Link>
        );
      })}

      <span className="mx-1 h-6 w-px shrink-0 bg-white/20" />

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="dock-socials"
            className="hidden shrink-0 items-center xl:flex"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={SOCIAL_LINKS.github}
              target="_blank"
              aria-label="GitHub"
              className="circuit-control flex h-10 w-10 items-center justify-center text-white/60 hover:bg-white hover:text-black"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              aria-label="LinkedIn"
              className="circuit-control-reverse flex h-10 w-10 items-center justify-center text-white/60 hover:bg-white hover:text-black"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.x}
              target="_blank"
              aria-label="X"
              className="circuit-control flex h-10 w-10 items-center justify-center font-telegraf text-[11px] font-black text-white/60 hover:bg-white hover:text-black"
            >
              X
            </Link>
            <span className="mx-1 h-6 w-px bg-white/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {onPlay ? (
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play PortfolioMon"
          title="Play PortfolioMon"
          className="circuit-action group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 bg-[#d8ff36] px-3 text-[#11110f] transition hover:bg-black hover:text-white lg:px-4"
        >
          <span className="absolute left-1.5 top-1.5 h-1 w-1 rotate-45 bg-black/35 group-hover:bg-white/40" />
          <Gamepad2 className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden text-[9px] uppercase tracking-[0.12em] lg:block">
            PortfolioMon
          </span>
        </button>
      ) : (
        <Link
          href="/?play=1"
          aria-label="Play PortfolioMon"
          title="Play PortfolioMon"
          className="circuit-action group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 bg-[#d8ff36] px-3 text-[#11110f] transition hover:bg-black hover:text-white lg:px-4"
        >
          <span className="absolute left-1.5 top-1.5 h-1 w-1 rotate-45 bg-black/35 group-hover:bg-white/40" />
          <Gamepad2 className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden text-[9px] uppercase tracking-[0.12em] lg:block">
            PortfolioMon
          </span>
        </Link>
      )}

      <ThemeToggle expanded={expanded} />
    </motion.nav>
  );
};

const PortfolioShell = ({
  children,
  onPlay,
}: {
  children: ReactNode;
  onPlay?: () => void;
  hideMobileNavigation?: boolean;
}) => {
  const router = useRouter();
  const showPageNavigation = router.pathname !== "/";

  return (
    <div className="portfolio-ui min-h-screen bg-black font-mori text-[#24211d]">
      {showPageNavigation && <PortfolioTopNavigation />}
      <div
        className={`min-w-0 ${
          showPageNavigation ? "pb-20 pt-16 sm:pb-24 sm:pt-[72px]" : ""
        }`}
      >
        {children}
      </div>
      <PortfolioDock onPlay={onPlay} />
    </div>
  );
};

export default PortfolioShell;
