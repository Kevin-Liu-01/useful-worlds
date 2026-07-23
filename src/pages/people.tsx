import Head from "next/head";
import Link from "next/link";
import { ArrowUpRight, ContactRound, LockKeyhole } from "lucide-react";
import PortfolioShell from "../components/portfolio/portfolioShell";
import PortfolioPage, {
  PortfolioPageFooter,
  PortfolioPageHeader,
  PortfolioSection,
} from "../components/portfolio/portfolioPage";
import { FAVORITE_PEOPLE } from "../data/portfolioPages";

const PeoplePage = () => (
  <PortfolioShell>
    <Head>
      <title>People I Like — Kevin Liu</title>
      <meta
        name="description"
        content="Kevin Liu's contact book: friends, teammates, and people who make the work and life around it better."
      />
    </Head>
    <PortfolioPage>
      <PortfolioPageHeader
        index="04"
        eyebrow="Contact book"
        title="People I really like."
        deck="Friends, teammates, training partners, and the people who make ambitious work feel less solitary. This is an index of relationships, not a database of private contact details."
        aside={
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-black/45">
            <LockKeyhole className="h-4 w-4" /> Names + shared context only
          </div>
        }
      />

      <PortfolioSection
        index="01"
        label="People graph"
        title="The people around the projects."
      >
        <div className="grid gap-px border border-black/25 bg-black/25 sm:grid-cols-2 xl:grid-cols-3">
          {FAVORITE_PEOPLE.map((person, index) => {
            const initials = person.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2);
            return (
              <Link
                key={person.wikiSlug}
                href={`https://wiki.kevinliu.biz/wiki/people/${person.wikiSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-[230px] bg-[#f4f3ec] p-5 transition hover:bg-[#d8ff36] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/25 font-telegraf text-lg font-black">
                    {initials}
                  </span>
                  <span className="text-[9px] tracking-[0.14em] text-black/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-12">
                  <span className="text-[8px] uppercase tracking-[0.14em] text-black/40">
                    {person.group}
                  </span>
                  <h2 className="mt-2 font-telegraf text-2xl font-black tracking-[-0.025em]">
                    {person.name}
                  </h2>
                  <p className="mt-2 text-[14px] text-black/55">
                    {person.context}
                  </p>
                </div>
                <ArrowUpRight className="absolute bottom-5 right-5 h-4 w-4 transition-transform group-hover:rotate-45 sm:bottom-7 sm:right-7" />
              </Link>
            );
          })}
        </div>
      </PortfolioSection>

      <PortfolioSection
        index="02"
        label="Relationship interface"
        title="People, not CRM rows."
        dark
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactRound
              className="h-10 w-10 text-[#d8ff36]"
              strokeWidth={1.3}
            />
            <p className="mt-8 max-w-[34ch] text-xl leading-[1.55] text-white/75">
              The private Wiki remembers details. The public portfolio only
              needs to remember what kind of life we share.
            </p>
          </div>
          <div className="grid gap-px bg-white/20 sm:grid-cols-2 lg:col-span-7">
            {[
              [
                "Build together",
                "Projects are often how a friendship becomes a shared world.",
              ],
              [
                "Train together",
                "Powerlifting and climbing turn consistency into something social.",
              ],
              [
                "Keep the long thread",
                "Old school, new city, same friendship.",
              ],
              [
                "Show up",
                "The best people make hard seasons feel less individually heroic.",
              ],
            ].map(([title, copy], index) => (
              <article key={title} className="bg-black p-6">
                <span className="text-[8px] tracking-[0.14em] text-white/35">
                  R-{index + 1}
                </span>
                <h3 className="mt-7 font-telegraf text-xl font-black">
                  {title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-white/55">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </PortfolioSection>
      <PortfolioPageFooter />
    </PortfolioPage>
  </PortfolioShell>
);

export default PeoplePage;
