import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PortfolioMonArena from "../components/arena/portfolioMonArena";
import ProjectIndexLanding from "../components/landing/projectIndexLanding";
import PortfolioShell from "../components/portfolio/portfolioShell";

const Home: NextPage = () => {
  const router = useRouter();
  const [hasEntered, setHasEntered] = useState(false);

  const enterWorld = useCallback(() => setHasEntered(true), []);
  const exitWorld = useCallback(() => {
    setHasEntered(false);
    void router.replace("/", undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (router.isReady && router.query.play === "1") setHasEntered(true);
  }, [router.isReady, router.query.play]);

  return (
    <div>
      <Head>
        <title>
          Kevin Liu — Engineer, Designer &amp; Builder | Princeton CS &apos;28
        </title>
        <meta
          name="description"
          content="Kevin Liu is a founding engineer at Dedalus and a Princeton CS student building agent infrastructure, expressive interfaces, and browser games. Explore selected work and play PortfolioMon, his archived Pokémon-inspired portfolio battle game."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <PortfolioShell
            key="project-index-shell"
            onPlay={enterWorld}
            hideMobileNavigation
          >
            <ProjectIndexLanding onEnter={enterWorld} />
          </PortfolioShell>
        ) : (
          <motion.div
            key="arena-v3"
            initial={{
              opacity: 0,
              scale: 1.025,
              filter: "saturate(1.4) blur(8px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "saturate(1) blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <PortfolioMonArena onExit={exitWorld} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
