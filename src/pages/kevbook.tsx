import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import PortfolioShell from "../components/portfolio/portfolioShell";
import KevBookGlobe from "../components/portfolio/kevbookGlobe";
import PortfolioPage, {
  PortfolioPageFooter,
  PortfolioPageHeader,
  PortfolioSection,
} from "../components/portfolio/portfolioPage";
import { KEVBOOK_ENTRIES } from "../data/portfolioPages";

const KevBookPage = () => {
  const categories = [
    "All",
    ...Array.from(new Set(KEVBOOK_ENTRIES.map((entry) => entry.category))),
  ] as const;
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filtered = useMemo(
    () =>
      KEVBOOK_ENTRIES.filter(
        (entry) => category === "All" || entry.category === category
      ),
    [category]
  );
  const selected = KEVBOOK_ENTRIES[selectedIndex] ?? KEVBOOK_ENTRIES[0];
  const selectRelative = (direction: -1 | 1) =>
    setSelectedIndex(
      (current) =>
        (current + direction + KEVBOOK_ENTRIES.length) % KEVBOOK_ENTRIES.length
    );

  return (
    <PortfolioShell>
      <Head>
        <title>KevBook — Kevin Liu</title>
        <meta
          name="description"
          content="A living map of public Kevin Lius doing specific, impressive work across research, startups, medicine, engineering, design, athletics, and games."
        />
      </Head>
      <PortfolioPage>
        <PortfolioPageHeader
          index="05"
          eyebrow="Public Kevin graph"
          title="The Kevin Liu map."
          deck="A globe of public Kevin Lius doing oddly specific, impressive work across research, startups, medicine, games, engineering, and design."
          aside={
            <Link
              href="https://wiki.kevinliu.biz/me/kevbook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black/30 px-4 py-3 text-[10px] uppercase tracking-[0.1em] hover:bg-black hover:text-white"
            >
              Open live KevBook <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <PortfolioSection index="01" label="Globe" dark>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="overflow-hidden border border-white/25 bg-[#050505] lg:col-span-8">
              <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 text-[7px] uppercase tracking-[0.16em] text-white/40 sm:px-5">
                <span>KevBook / geographic signal field</span>
                <span className="text-[#d8ff36]">12 mapped / 25 indexed</span>
              </div>

              <KevBookGlobe
                selectedIndex={selectedIndex}
                selectedLabel={selected.location}
              />

              <div className="grid grid-cols-3 border-t border-white/15 sm:grid-cols-4">
                {KEVBOOK_ENTRIES.map((entry, index) => (
                  <button
                    key={`${entry.name}-${entry.role}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={selectedIndex === index}
                    className={`min-w-0 border-b border-r px-3 py-3 text-left transition last:border-r-0 sm:py-4 ${
                      selectedIndex === index
                        ? "border-[#d8ff36]/50 bg-[#d8ff36] text-black"
                        : "border-white/15 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    <span className="block text-[7px] tracking-[0.12em] opacity-45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block truncate text-[8px] uppercase tracking-[0.08em]">
                      {entry.location.split(",")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="flex min-h-[520px] flex-col border border-white/25 bg-[#090909] p-5 lg:col-span-4 lg:p-7">
              <div className="flex items-center justify-between border-b border-white/20 pb-5 text-[8px] uppercase tracking-[0.14em] text-white/35">
                <span>Current signal</span>
                <span>
                  {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                  {KEVBOOK_ENTRIES.length}
                </span>
              </div>

              <div className="mt-7 inline-flex w-fit border border-[#d8ff36]/40 px-2 py-1 text-[8px] uppercase tracking-[0.13em] text-[#d8ff36]">
                {selected.category}
              </div>
              <h2 className="mt-8 font-telegraf text-4xl font-black leading-[0.9] tracking-[-0.035em] sm:text-5xl">
                {selected.name}
              </h2>
              <p className="mt-4 text-lg leading-tight text-[#d8ff36]">
                {selected.role}
              </p>
              <p className="mt-7 max-w-[34ch] text-[15px] leading-[1.75] text-white/60">
                {selected.summary}
              </p>

              <div className="mt-auto pt-10">
                <span className="flex items-center gap-2 border-t border-white/20 pt-5 text-[10px] text-white/45">
                  <MapPin className="h-4 w-4" /> {selected.location}
                </span>
                <Link
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-between bg-[#d8ff36] px-4 py-4 text-[9px] uppercase tracking-[0.12em] text-black transition hover:bg-white"
                >
                  Open public profile <ArrowUpRight className="h-4 w-4" />
                </Link>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => selectRelative(-1)}
                    className="flex items-center justify-between border border-white/25 px-3 py-3 text-[8px] uppercase tracking-[0.12em] text-white/55 transition hover:border-white hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRelative(1)}
                    className="flex items-center justify-between border border-white/25 px-3 py-3 text-[8px] uppercase tracking-[0.12em] text-white/55 transition hover:border-white hover:text-white"
                  >
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </PortfolioSection>

        <PortfolioSection
          index="02"
          label="Catalog"
          title="Twelve signals from the live graph."
        >
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`border px-3 py-2 text-[9px] uppercase tracking-[0.1em] transition ${
                  category === item
                    ? "border-black bg-black text-white"
                    : "border-black/25 hover:border-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-px border border-black/25 bg-black/25 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((entry, index) => (
              <Link
                key={`${entry.name}-${entry.role}`}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-h-[250px] bg-[#f4f3ec] p-6 transition hover:bg-[#d8ff36]"
              >
                <div className="flex justify-between text-[8px] uppercase tracking-[0.14em] text-black/40">
                  <span>{entry.category}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-10 font-telegraf text-2xl font-black tracking-[-0.025em]">
                  {entry.name}
                </h3>
                <p className="mt-2 text-sm font-semibold">{entry.role}</p>
                <p className="mt-4 text-[14px] leading-[1.6] text-black/55">
                  {entry.summary}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-black/20 pt-4 text-[9px] text-black/45">
                  <span>{entry.location}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </div>
              </Link>
            ))}
          </div>
        </PortfolioSection>
        <PortfolioPageFooter />
      </PortfolioPage>
    </PortfolioShell>
  );
};

export default KevBookPage;
