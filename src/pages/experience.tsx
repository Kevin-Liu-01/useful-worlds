import Head from "next/head";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";
import PortfolioShell from "../components/portfolio/portfolioShell";
import PortfolioPage, {
  PortfolioPageFooter,
  PortfolioPageHeader,
  PortfolioSection,
} from "../components/portfolio/portfolioPage";
import { EXPERIENCE } from "../data/portfolioPages";

const ExperiencePage = () => (
  <PortfolioShell>
    <Head>
      <title>Experience & Résumé — Kevin Liu</title>
      <meta
        name="description"
        content="Kevin Liu's work experience across agent infrastructure, startups, research, AWS, Bloomberg, and product engineering."
      />
    </Head>
    <PortfolioPage>
      <PortfolioPageHeader
        index="03"
        eyebrow="Experience / résumé"
        title="Work experience."
        deck="The teams, systems, and products I have worked on across agent infrastructure, research, and software engineering."
        aside={
          <a
            href="/kevin_liu_resume_25.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black px-4 py-3 text-[10px] uppercase tracking-[0.1em] text-white hover:bg-[#d8ff36] hover:text-black"
          >
            <ArrowDownToLine className="h-4 w-4" /> Open résumé PDF
          </a>
        }
      />

      <PortfolioSection
        index="01"
        label="Work history"
        title="Roles, systems, and what shipped."
      >
        <div className="border-t border-black/30">
          {EXPERIENCE.map((entry, index) => (
            <article
              key={entry.company}
              className="grid gap-5 border-b border-black/30 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10"
            >
              <div className="flex items-start justify-between lg:col-span-2 lg:block">
                <span className="text-[9px] uppercase tracking-[0.14em] text-black/35">
                  R-{String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-right text-[11px] leading-relaxed text-black/45 lg:mt-8 lg:text-left">
                  {entry.period}
                  <br />
                  {entry.location}
                </p>
              </div>
              <div className="lg:col-span-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-telegraf text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                    {entry.company}
                  </h2>
                  {"status" in entry && entry.status === "incoming" && (
                    <span className="bg-[#d8ff36] px-2 py-1 text-[8px] uppercase tracking-[0.12em]">
                      Incoming
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-black/55">
                  {entry.role}
                </p>
              </div>
              <div className="lg:col-span-6">
                <p className="text-black/62 max-w-[58ch] text-[16px] leading-[1.75]">
                  {entry.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-black/20 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-black/45"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </PortfolioSection>

      <PortfolioSection index="02" label="Résumé receipt" dark>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FileText className="h-10 w-10 text-[#d8ff36]" strokeWidth={1.25} />
            <h2 className="mt-8 max-w-md font-telegraf text-5xl font-black leading-[0.92] tracking-[-0.04em]">
              One page. Six roles. One technical thread.
            </h2>
            <Link
              href="/kevin_liu_resume_25.pdf"
              target="_blank"
              className="mt-8 inline-flex items-center gap-2 border border-white/35 px-4 py-3 text-[10px] uppercase tracking-[0.1em] hover:border-[#d8ff36] hover:text-[#d8ff36]"
            >
              View source PDF <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="border border-white/25 bg-[#f4f3ec] p-5 text-black sm:p-8 lg:col-span-8">
            <div className="flex items-start justify-between border-b border-black/30 pb-5">
              <div>
                <strong className="font-telegraf text-3xl font-black">
                  Kevin Bowen Liu
                </strong>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/45">
                  Engineer / designer / systems builder
                </p>
              </div>
              <BriefcaseBusiness className="h-6 w-6" strokeWidth={1.3} />
            </div>
            <div className="grid gap-8 py-7 sm:grid-cols-2">
              <div>
                <span className="text-[8px] uppercase tracking-[0.14em] text-black/40">
                  Education
                </span>
                <h3 className="mt-3 font-telegraf text-xl font-black">
                  Princeton University
                </h3>
                <p className="mt-1 text-sm text-black/55">
                  B.S.E. Computer Science · Class of 2028
                </p>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-[0.14em] text-black/40">
                  Technical thread
                </span>
                <p className="mt-3 text-sm leading-[1.65] text-black/60">
                  Tool-using LLMs → research agents → production infrastructure
                  → personal agent operating systems.
                </p>
              </div>
            </div>
            <div className="grid gap-px bg-black/25 sm:grid-cols-3">
              {[
                ["06", "Roles"],
                ["03", "Founding seats"],
                ["∞", "Things shipped"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#f4f3ec] p-5 text-center">
                  <strong className="font-telegraf text-3xl font-black">
                    {value}
                  </strong>
                  <span className="mt-2 block text-[8px] uppercase tracking-[0.12em] text-black/40">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PortfolioSection>
      <PortfolioPageFooter />
    </PortfolioPage>
  </PortfolioShell>
);

export default ExperiencePage;
