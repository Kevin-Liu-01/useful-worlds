import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type ReactNode } from "react";

const CornerGlyph = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`flex h-7 w-7 items-center justify-center bg-[#f4f3ec] text-black sm:h-9 sm:w-9 ${className}`}
  >
    <svg viewBox="0 0 36 36" fill="none" className="h-full w-full">
      <path
        d="M14 4H9a5 5 0 0 0-5 5v5M22 4h5a5 5 0 0 1 5 5v5M32 22v5a5 5 0 0 1-5 5h-5M14 32H9a5 5 0 0 1-5-5v-5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M18 12v12M12 18h12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  </span>
);

const PageMarginTracks = ({
  surface = "paper",
  index = "00",
}: {
  surface?: "paper" | "ink" | "acid";
  index?: string;
}) => {
  const trace =
    surface === "ink"
      ? "text-white/30"
      : surface === "acid"
      ? "text-black/35"
      : "text-black/28 dark:text-white/30";
  const signal = surface === "acid" ? "#0b0b0b" : "#d8ff36";
  const seed = Array.from(index).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
  const variants = [
    [18, 42, 22],
    [36, 16, 46],
    [14, 44, 26],
  ] as const;
  const pattern = variants[seed % variants.length] ?? variants[0];
  const stops = [230, 510, 790] as const;
  const pathFor = (side: "left" | "right") => {
    const mapX = (value: number) => (side === "left" ? value : 1000 - value);
    return [
      `M ${mapX(11)} 0`,
      ...stops.flatMap((stop, stopIndex) => [
        `V ${stop - 24}`,
        `L ${mapX(pattern[stopIndex] ?? 20)} ${stop + 24}`,
      ]),
      `V 946 L ${mapX(11)} 980 V 1000`,
    ].join(" ");
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 hidden opacity-55 transition-opacity duration-300 group-hover/section:opacity-100 ${trace}`}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {(["left", "right"] as const).map((side) => (
          <g key={side}>
            <path
              d={pathFor(side)}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={pathFor(side)}
              fill="none"
              stroke={signal}
              strokeWidth="1.2"
              strokeDasharray="3 18"
              vectorEffect="non-scaling-stroke"
              className="opacity-70"
            />
            {stops.map((stop, stopIndex) => {
              const x = pattern[stopIndex] ?? 20;
              const mappedX = side === "left" ? x : 1000 - x;
              return (
                <rect
                  key={stop}
                  x={mappedX - 2}
                  y={stop + 22}
                  width="4"
                  height="4"
                  fill={stopIndex === 1 ? signal : "currentColor"}
                />
              );
            })}
          </g>
        ))}
        <path
          d="M 0 500 L 56 524 M 1000 500 L 944 524"
          fill="none"
          stroke={signal}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          className="opacity-65"
        />
      </svg>
    </div>
  );
};

export const PortfolioPageHeader = ({
  index,
  eyebrow,
  title,
  deck,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: string;
  deck: string;
  aside?: ReactNode;
}) => (
  <header
    data-circuit-section={`${index} / ${eyebrow}`}
    className="portfolio-circuit-chassis group/section relative border border-black/25 bg-[#f4f3ec] px-5 py-12 sm:px-9 sm:py-16 lg:px-12 lg:py-20"
  >
    <PageMarginTracks index={index} />
    <CornerGlyph className="absolute left-1 top-1" />
    <CornerGlyph className="absolute right-1 top-1 rotate-90" />
    <CornerGlyph className="absolute bottom-1 left-1 -rotate-90" />
    <CornerGlyph className="absolute bottom-1 right-1 rotate-180" />
    <div className="absolute inset-x-12 top-0 h-px bg-black/20" />
    <span className="absolute left-1/2 top-2 -translate-x-1/2 border border-black/20 bg-[#f4f3ec] px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] text-black/45">
      {index} / {eyebrow}
    </span>

    <div className="grid items-end gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <p className="text-black/42 text-[10px] uppercase tracking-[0.14em]">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-5xl font-telegraf text-[clamp(3.6rem,8vw,8.7rem)] font-black leading-[0.86] tracking-[-0.045em]">
          {title}
        </h1>
      </div>
      <div className="lg:col-span-4">
        <p className="text-black/62 max-w-[42ch] border-t border-black/40 pt-5 text-[17px] leading-[1.65]">
          {deck}
        </p>
        {aside && <div className="mt-6">{aside}</div>}
      </div>
    </div>
  </header>
);

export const PortfolioSection = ({
  index,
  label,
  title,
  children,
  dark = false,
}: {
  index: string;
  label: string;
  title?: string;
  children: ReactNode;
  dark?: boolean;
}) => (
  <section
    data-circuit-section={`${index} / ${label}`}
    className={`portfolio-circuit-chassis group/section relative border border-t-0 px-5 py-12 sm:px-9 sm:py-16 lg:px-12 ${
      dark ? "border-black bg-black text-white" : "border-black/25 bg-[#f4f3ec]"
    }`}
  >
    <PageMarginTracks surface={dark ? "ink" : "paper"} index={index} />
    <div className="mb-9 flex items-center gap-4 text-[8px] uppercase tracking-[0.15em] opacity-45">
      <span>{index}</span>
      <span className={`h-px flex-1 ${dark ? "bg-white/30" : "bg-black/25"}`} />
      <span>{label}</span>
    </div>
    {title && (
      <h2 className="mb-10 max-w-4xl font-telegraf text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl">
        {title}
      </h2>
    )}
    {children}
  </section>
);

export const PortfolioPageFooter = () => (
  <footer
    data-circuit-section="END / KEEP EXPLORING"
    className="portfolio-circuit-chassis group/section relative flex flex-col justify-between gap-5 border border-t-0 border-black/25 bg-[#d8ff36] px-5 py-8 text-sm sm:flex-row sm:items-end sm:px-9 lg:px-12"
  >
    <PageMarginTracks surface="acid" index="END" />
    <div>
      <p className="text-[9px] uppercase tracking-[0.15em] text-black/45">
        End of field note
      </p>
      <strong className="mt-2 block font-telegraf text-3xl font-black">
        Keep exploring.
      </strong>
    </div>
    <div className="flex flex-wrap gap-2">
      {[
        ["Work", "/#work"],
        ["People", "/people"],
        ["Photography", "/photography"],
        ["Wiki", "https://wiki.kevinliu.biz/"],
      ].map(([label, href]) => (
        <Link
          key={label}
          href={href ?? "/"}
          className="flex items-center gap-2 border border-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.1em] hover:bg-black hover:text-white"
        >
          {label} <ArrowUpRight className="h-3 w-3" />
        </Link>
      ))}
    </div>
  </footer>
);

const PortfolioPage = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen overflow-x-hidden bg-black px-3 py-8 font-mori text-[#24211d] selection:bg-[#d8ff36] sm:px-6 sm:py-12 lg:px-10">
    <div className="mx-auto max-w-[1460px]">{children}</div>
  </main>
);

export default PortfolioPage;
