import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

import "~/styles/globals.css";
import { GameProvider } from "../providers/gameProvider";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      enableSystem={false}
      attribute="class"
      defaultTheme="light"
      storageKey="portfolio-theme"
    >
      <GameProvider>
        <Component {...pageProps} />
        <Analytics />
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
