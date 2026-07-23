import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  BriefcaseBusiness,
  Camera,
  ContactRound,
  FileText,
  Gamepad2,
  Moon,
  Sun,
  UsersRound,
} from "lucide-react";

const DOCK_ITEMS = [
  { label: "Work", href: "/#work", icon: BriefcaseBusiness },
  { label: "Experience", href: "/experience", icon: FileText },
  { label: "People", href: "/people", icon: ContactRound },
  { label: "KevBook", href: "/kevbook", icon: UsersRound },
  { label: "Photos", href: "/photography", icon: Camera },
] as const;

const ThemeToggle = () => {
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
      className="circuit-control-reverse group mx-px flex h-11 shrink-0 items-center justify-center gap-2 px-3 text-white/70 transition hover:bg-white hover:text-black"
    >
      {dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.7} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.7} />
      )}
      <span className="hidden text-[9px] uppercase tracking-[0.12em] md:block">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
};

const PortfolioDock = ({ onPlay }: { onPlay?: () => void }) => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const frameProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.25,
  });

  return (
    <nav
      aria-label="Portfolio shortcuts"
      className="fixed bottom-0 left-1/2 z-[90] flex max-w-[1520px] -translate-x-1/2 items-center justify-start overflow-x-auto border-x border-t border-white/20 bg-black/95 p-1 font-mori text-white shadow-[0_-18px_55px_rgba(0,0,0,0.2)] backdrop-blur-xl md:justify-center"
      style={{
        width: "calc(100vw - clamp(20px, 6.25vw, 80px))",
        clipPath:
          "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%, 0 10px)",
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
        className="circuit-action group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden bg-black"
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={44}
          height={44}
          loading="eager"
          className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
        />
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
            } group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 px-3 transition md:px-3.5 ${
              active
                ? "bg-white text-[#11110f]"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.65} />
            <span className="hidden text-[9px] uppercase tracking-[0.12em] md:block">
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

      {onPlay ? (
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play PortfolioMon"
          title="Play PortfolioMon"
          className="circuit-action group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 bg-[#d8ff36] px-4 text-[#11110f] transition hover:bg-black hover:text-white"
        >
          <span className="absolute left-1.5 top-1.5 h-1 w-1 rotate-45 bg-black/35 group-hover:bg-white/40" />
          <Gamepad2 className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden text-[9px] uppercase tracking-[0.12em] lg:block">
            Play
          </span>
        </button>
      ) : (
        <Link
          href="/?play=1"
          aria-label="Play PortfolioMon"
          title="Play PortfolioMon"
          className="circuit-action group relative mx-px flex h-11 shrink-0 items-center justify-center gap-2 bg-[#d8ff36] px-4 text-[#11110f] transition hover:bg-black hover:text-white"
        >
          <span className="absolute left-1.5 top-1.5 h-1 w-1 rotate-45 bg-black/35 group-hover:bg-white/40" />
          <Gamepad2 className="h-4 w-4" strokeWidth={1.7} />
          <span className="hidden text-[9px] uppercase tracking-[0.12em] lg:block">
            Play
          </span>
        </Link>
      )}

      <ThemeToggle />
    </nav>
  );
};

const PortfolioShell = ({
  children,
  onPlay,
}: {
  children: ReactNode;
  onPlay?: () => void;
  hideMobileNavigation?: boolean;
}) => (
  <div className="portfolio-ui min-h-screen bg-black font-mori text-[#24211d]">
    <div className="min-w-0 pb-20 sm:pb-24">{children}</div>
    <PortfolioDock onPlay={onPlay} />
  </div>
);

export default PortfolioShell;
