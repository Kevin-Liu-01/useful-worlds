import Head from "next/head";
import { Blocks, Sparkles } from "lucide-react";
import ComponentVault from "../components/portfolio/componentVault";
import PortfolioPage, {
  PortfolioPageFooter,
  PortfolioPageHeader,
  PortfolioSection,
} from "../components/portfolio/portfolioPage";
import PortfolioShell from "../components/portfolio/portfolioShell";

const VaultPage = () => (
  <PortfolioShell>
    <Head>
      <title>Component Vault — Kevin Liu</title>
      <meta
        name="description"
        content="Kevin Liu's interactive component vault: portfolio frames, GitHub contribution fields, dither transitions, a LEGO builder, and the PortfolioMon Poké Ball transition."
      />
    </Head>

    <PortfolioPage>
      <PortfolioPageHeader
        index="07"
        eyebrow="Component vault"
        title="The parts worth keeping."
        deck="My favorite pieces of the portfolio, preserved as live specimens. Nothing here is a screenshot: trace it, rebuild it, switch it, or make it take over the frame."
        aside={
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-black/45">
            <Blocks className="h-4 w-4" /> 05 interactive components
            <Sparkles className="ml-auto h-4 w-4 text-black" />
          </div>
        }
      />

      <PortfolioSection
        index="01"
        label="Live specimens"
        title="Built to be touched."
      >
        <ComponentVault />
      </PortfolioSection>

      <PortfolioPageFooter />
    </PortfolioPage>
  </PortfolioShell>
);

export default VaultPage;
