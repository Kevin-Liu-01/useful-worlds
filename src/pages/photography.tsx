import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Expand, X } from "lucide-react";
import PortfolioShell from "../components/portfolio/portfolioShell";
import PortfolioPage, {
  PortfolioPageFooter,
  PortfolioPageHeader,
  PortfolioSection,
} from "../components/portfolio/portfolioPage";
import { PORTFOLIO_PHOTOS } from "../data/portfolioPages";

const PhotographyPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected =
    selectedIndex === null ? null : PORTFOLIO_PHOTOS[selectedIndex];

  return (
    <PortfolioShell>
      <Head>
        <title>Photography — Kevin Liu</title>
        <meta
          name="description"
          content="Graduation portraits, editorial photographs, and VIS 210 work photographed by Kevin Liu."
        />
      </Head>
      <PortfolioPage>
        <PortfolioPageHeader
          index="06"
          eyebrow="Photography"
          title="Through the viewfinder."
          deck="Graduation portraits I shot for friends, editorial experiments, and VIS 210 work. The photographs stay monochrome until you ask for the color."
          aside={
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-black/45">
              <Camera className="h-4 w-4" /> 12 selected frames / Princeton
            </div>
          }
        />

        <PortfolioSection
          index="01"
          label="Contact sheet"
          title="People, place, and a little theater."
        >
          <div className="grid grid-flow-dense gap-3 sm:gap-4 md:grid-cols-12">
            {PORTFOLIO_PHOTOS.map((photo, index) => (
              <motion.button
                key={photo.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`group relative overflow-hidden border border-black/30 bg-black text-left ${
                  photo.orientation === "portrait"
                    ? "aspect-[2/3] md:col-span-4"
                    : index % 5 === 0
                    ? "aspect-[16/10] md:col-span-8"
                    : "aspect-[3/2] md:col-span-6"
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ delay: (index % 4) * 0.06 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.015] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 bg-[#f4f3ec] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-black">
                  {String(index + 1).padStart(2, "0")} / {photo.category}
                </span>
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 text-white">
                  <span className="max-w-[34ch] text-sm font-medium leading-snug">
                    {photo.alt}
                  </span>
                  <Expand className="h-4 w-4 shrink-0 transition-transform group-hover:scale-125" />
                </div>
              </motion.button>
            ))}
          </div>
        </PortfolioSection>

        <PortfolioSection
          index="02"
          label="Process"
          title="The frame should do the explaining."
          dark
        >
          <div className="grid gap-px bg-white/20 sm:grid-cols-3">
            {[
              [
                "01",
                "Find the architecture",
                "Use windows, columns, trees, and equipment as a second subject.",
              ],
              [
                "02",
                "Leave room for play",
                "The best graduation photograph rarely looks like the official one.",
              ],
              [
                "03",
                "Color is earned",
                "The contact sheet begins in black and white; hover reveals the full frame.",
              ],
            ].map(([number, title, copy]) => (
              <article key={number} className="bg-black p-6 sm:p-8">
                <span className="text-[9px] tracking-[0.15em] text-[#d8ff36]">
                  {number}
                </span>
                <h3 className="mt-8 font-telegraf text-2xl font-black">
                  {title}
                </h3>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.7] text-white/60">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </PortfolioSection>
        <PortfolioPageFooter />
      </PortfolioPage>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.alt}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-white text-black sm:right-8 sm:top-8"
              aria-label="Close photograph"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              className="relative h-full w-full"
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
            >
              <Image
                src={selected.src}
                alt={selected.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              <div className="absolute bottom-0 left-0 bg-black/80 px-4 py-3 text-white backdrop-blur-sm">
                <span className="text-[8px] uppercase tracking-[0.14em] text-white/50">
                  {selected.category}
                </span>
                <p className="mt-1 text-sm">{selected.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortfolioShell>
  );
};

export default PhotographyPage;
