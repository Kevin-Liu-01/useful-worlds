import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, Asterisk, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import {
  PHILOSOPHIES,
  getPhilosophy,
  type Philosophy,
} from "../../data/philosophies";
import PortfolioShell from "../../components/portfolio/portfolioShell";

const CHOPPED =
  "polygon(0 18px, 18px 0, calc(100% - 42px) 0, calc(100% - 30px) 12px, 100% 12px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 30px 100%, 18px calc(100% - 12px), 0 calc(100% - 12px))";

const PhilosophySignal = ({ kind }: { kind: Philosophy["id"] }) => {
  if (kind === "taste") {
    return (
      <div className="relative h-full min-h-[430px] overflow-hidden bg-[#d8ff36] text-black">
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[30px] border-black"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute left-7 top-7 font-kode text-[8px] uppercase tracking-[0.2em]">
          Interface calibration / live
        </span>
        <span className="absolute left-7 top-20 font-telegraf text-[10rem] font-black leading-none tracking-[-0.06em] sm:text-[14rem]">
          Aa
        </span>
        <div className="absolute inset-x-6 bottom-6 border border-black bg-[#f4f3ec] p-5 sm:inset-x-10 sm:bottom-10 sm:p-7">
          {(
            [
              ["Hierarchy", 78],
              ["Spacing", 64],
              ["Motion", 86],
            ] as const
          ).map(([label, value], index) => (
            <div
              key={label}
              className="mb-5 grid grid-cols-[82px_1fr_24px] items-center gap-3 last:mb-0"
            >
              <span className="font-kode text-[8px] uppercase tracking-[0.12em]">
                {label}
              </span>
              <div className="h-2 bg-black/15">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 0.25 + index * 0.14, duration: 0.9 }}
                />
              </div>
              <span className="font-kode text-[8px]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "play") {
    const nodes = [
      [18, 22, "RACE"],
      [80, 20, "AGENT"],
      [20, 78, "BATTLE"],
      [82, 74, "SYSTEM"],
    ] as const;
    return (
      <div className="relative h-full min-h-[430px] overflow-hidden bg-black text-white">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 560">
          <path
            d="M126 123 L350 280 L560 112 M140 425 L350 280 L574 414"
            stroke="rgba(255,255,255,.35)"
            fill="none"
          />
          <motion.circle
            r="8"
            fill="#d8ff36"
            animate={{
              cx: [126, 350, 560, 350, 574, 350, 140, 350, 126],
              cy: [123, 280, 112, 280, 414, 280, 425, 280, 123],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        {nodes.map(([left, top, label], index) => (
          <motion.div
            key={label}
            className="absolute flex h-20 w-28 items-center justify-center border border-white/40 bg-black font-kode text-[8px] tracking-[0.16em] sm:h-24 sm:w-36"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              x: "-50%",
              y: "-50%",
              clipPath: CHOPPED,
            }}
            animate={{
              borderColor: [
                "rgba(255,255,255,.35)",
                "#d8ff36",
                "rgba(255,255,255,.35)",
              ],
            }}
            transition={{ duration: 2.7, repeat: Infinity, delay: index * 0.4 }}
          >
            {label}
          </motion.div>
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#d8ff36] bg-black text-center shadow-[0_0_70px_rgba(216,255,54,.2)] sm:h-44 sm:w-44"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="font-kode text-[8px] uppercase tracking-[0.18em] text-[#d8ff36]">
            Input
            <br />↓<br />
            Consequence
          </span>
        </motion.div>
      </div>
    );
  }

  if (kind === "systems" || kind === "proof" || kind === "open") {
    const config = {
      systems: {
        code: "SYS / 04",
        title: "THE SECOND RUN",
        labels: ["STATE", "VISIBILITY", "RECOVERY", "TRUST"],
        acid: false,
      },
      proof: {
        code: "PRF / 05",
        title: "SHOW THE PULSE",
        labels: ["CLAIM", "INPUT", "EVIDENCE", "CONVICTION"],
        acid: true,
      },
      open: {
        code: "OPN / 06",
        title: "LEAVE THE SOURCE",
        labels: ["ARTIFACT", "SOURCE", "FORK", "COMPOUND"],
        acid: false,
      },
    }[kind];

    return (
      <div
        className={`relative h-full min-h-[430px] overflow-hidden ${
          config.acid ? "bg-[#d8ff36] text-black" : "bg-black text-white"
        }`}
      >
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(currentColor_1px,transparent_1px)] [background-size:100%_42px]" />
        <div className="border-current/30 absolute inset-6 border sm:inset-10" />
        <span className="absolute left-10 top-10 font-kode text-[8px] uppercase tracking-[0.2em] opacity-55 sm:left-14 sm:top-14">
          {config.code} / LIVE MODEL
        </span>
        <strong className="absolute left-10 top-24 max-w-[80%] font-telegraf text-[clamp(3rem,7vw,6rem)] font-black leading-[0.84] tracking-[-0.05em] sm:left-14 sm:top-28">
          {config.title}
        </strong>
        <div className="absolute inset-x-10 bottom-10 grid grid-cols-2 gap-2 sm:inset-x-14 sm:bottom-14 sm:grid-cols-4">
          {config.labels.map((label, index) => (
            <motion.div
              key={label}
              className={`border px-3 py-4 font-kode text-[7px] uppercase tracking-[0.15em] sm:py-6 ${
                config.acid
                  ? "border-black/35 bg-[#d8ff36]"
                  : "border-white/35 bg-black"
              }`}
              animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
              transition={{
                duration: 3.2 + index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="mb-5 block opacity-45">0{index + 1}</span>
              {label}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[430px] overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:7px_7px]" />
      <motion.div
        className="absolute inset-[12%] rounded-full border border-dashed border-white/35"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      {(
        [
          ["NO BRIEF", 8, 13, -5],
          ["NO RUBRIC", 44, 38, 5],
          ["NO PERMISSION", 20, 66, -2],
        ] as const
      ).map(([label, left, top, rotate], index) => (
        <motion.div
          key={label}
          className="absolute w-[48%] border border-white/50 bg-black/85 p-4 sm:p-6"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            rotate,
            clipPath: CHOPPED,
          }}
          animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
          transition={{ duration: 3.5 + index * 0.5, repeat: Infinity }}
        >
          <span className="font-kode text-[7px] uppercase tracking-[0.18em] text-white/45">
            Constraint / 0{index + 1}
          </span>
          <p className="mt-6 font-telegraf text-2xl font-black line-through sm:text-4xl">
            {label}
          </p>
        </motion.div>
      ))}
      <div
        className="absolute bottom-[7%] right-[5%] bg-[#d8ff36] px-5 py-4 text-black"
        style={{ clipPath: CHOPPED }}
      >
        <span className="font-kode text-[7px] uppercase tracking-[0.18em]">
          Status / self-assigned
        </span>
        <strong className="block font-telegraf text-3xl sm:text-5xl">
          MAKE IT.
        </strong>
      </div>
    </div>
  );
};

const PhilosophyPage = ({ philosophy }: { philosophy: Philosophy }) => {
  const router = useRouter();
  if (router.isFallback) return null;
  const index = PHILOSOPHIES.findIndex((item) => item.id === philosophy.id);
  const next = PHILOSOPHIES[(index + 1) % PHILOSOPHIES.length] ?? philosophy;

  return (
    <PortfolioShell hideMobileNavigation>
      <main className="portfolio-ui min-h-screen overflow-x-hidden bg-[#f4f3ec] text-black selection:bg-[#d8ff36]">
        <Head>
          <title>{philosophy.title} — Kevin Liu</title>
          <meta name="description" content={philosophy.deck} />
        </Head>

        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-black bg-[#f4f3ec]/90 px-5 backdrop-blur-xl sm:px-8">
          <Link
            href="/#philosophy"
            className="group flex items-center gap-2 font-kode text-[8px] uppercase tracking-[0.18em]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Field manual
          </Link>
          <Link
            href="/"
            className="font-telegraf text-lg font-black tracking-[-0.03em]"
          >
            KBL<span className="text-black/30"> / {philosophy.number}</span>
          </Link>
          <span className="font-kode text-[8px] uppercase tracking-[0.18em] text-black/45">
            {philosophy.eyebrow}
          </span>
        </header>

        <section className="border-b border-black">
          <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12">
            <div className="flex min-w-0 flex-col justify-between px-5 py-12 sm:px-8 sm:py-16 lg:col-span-6 lg:px-12 lg:py-14">
              <div className="text-black/48 flex items-center gap-3 font-kode text-[8px] uppercase tracking-[0.2em]">
                <CircleDot className="h-4 w-4" /> Principle /{" "}
                {philosophy.number}
              </div>
              <div className="my-16">
                <motion.h1
                  initial={{ y: 45, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-4xl break-normal font-telegraf text-[clamp(2.7rem,5.4vw,5.5rem)] font-black leading-[0.9] tracking-[-0.045em] [overflow-wrap:normal]"
                >
                  {philosophy.title}
                </motion.h1>
                <p className="text-black/62 mt-8 max-w-xl border-l border-black pl-5 font-nacelle text-xl leading-relaxed sm:text-2xl">
                  {philosophy.deck}
                </p>
              </div>
              <p className="text-black/48 border-t border-black pt-4 font-kode text-[8px] uppercase tracking-[0.18em]">
                {philosophy.annotation}
              </p>
            </div>
            <div className="min-w-0 border-t border-black p-3 sm:p-5 lg:col-span-6 lg:border-l lg:border-t-0">
              <div
                className="h-full overflow-hidden"
                style={{ clipPath: CHOPPED }}
              >
                <PhilosophySignal kind={philosophy.id} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-[1250px] gap-12 px-5 sm:px-8 lg:grid-cols-12">
            <Asterisk className="h-10 w-10 text-[#d8ff36] lg:col-span-2" />
            <blockquote className="font-telegraf text-[clamp(2.7rem,5vw,5.4rem)] font-black leading-[0.98] tracking-[-0.03em] lg:col-span-10">
              “{philosophy.pullQuote}”
            </blockquote>
          </div>
        </section>

        <article className="mx-auto max-w-[1250px] px-5 py-20 sm:px-8 sm:py-28">
          {philosophy.sections.map((section, sectionIndex) => (
            <motion.section
              key={section.heading}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-8 border-t border-black py-14 lg:grid-cols-12 lg:py-20"
            >
              <div className="lg:col-span-5">
                <span className="font-kode text-[8px] uppercase tracking-[0.18em] text-black/40">
                  {philosophy.number}.{sectionIndex + 1}
                </span>
                <h2 className="mt-3 max-w-xl font-telegraf text-4xl font-black leading-[0.98] tracking-[-0.03em] sm:text-6xl">
                  {section.heading}
                </h2>
              </div>
              <div className="text-black/66 space-y-6 font-nacelle text-lg leading-[1.75] sm:text-xl lg:col-span-7 lg:pt-7">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.section>
          ))}

          <div className="grid gap-3 border-t border-black pt-8 sm:grid-cols-3">
            {philosophy.fieldNotes.map((note, index) => (
              <div
                key={note}
                className="border border-black p-5"
                style={{ clipPath: CHOPPED }}
              >
                <span className="font-kode text-[8px] text-black/40">
                  0{index + 1}
                </span>
                <p className="mt-8 font-telegraf text-xl font-black">{note}</p>
              </div>
            ))}
          </div>
        </article>

        <Link
          href={`/en/philosophy/${next.id}`}
          className="group block border-t border-black bg-[#d8ff36] px-5 py-14 sm:px-8 sm:py-20"
        >
          <div className="mx-auto flex max-w-[1250px] items-end justify-between gap-6">
            <div>
              <span className="font-kode text-[8px] uppercase tracking-[0.2em] text-black/50">
                Next principle / {next.number}
              </span>
              <p className="mt-3 max-w-4xl font-telegraf text-[clamp(3rem,7vw,7rem)] font-black leading-[0.9] tracking-[-0.04em] group-hover:italic">
                {next.title}
              </p>
            </div>
            <ArrowRight className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-3 sm:h-16 sm:w-16" />
          </div>
        </Link>
      </main>
    </PortfolioShell>
  );
};

export const getStaticPaths = () => ({
  paths: PHILOSOPHIES.map((philosophy) => ({
    params: { slug: philosophy.id },
  })),
  fallback: false,
});

export const getStaticProps = ({ params }: { params?: { slug?: string } }) => {
  const philosophy = getPhilosophy(params?.slug ?? "");
  if (!philosophy) return { notFound: true };
  return { props: { philosophy } };
};

export default PhilosophyPage;
