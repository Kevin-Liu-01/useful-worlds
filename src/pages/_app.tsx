import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { api } from "../utils/api";

import "~/styles/globals.css";
import { GameProvider } from "../providers/gameProvider";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider
      enableSystem={false}
      attribute="class"
      defaultTheme="light"
      storageKey="portfolio-theme"
    >
      <SessionProvider session={session}>
        <GameProvider>
          <Component {...pageProps} />
          <Analytics />
        </GameProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(App);
// export default MyApp;
