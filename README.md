# Useful Worlds

Kevin Liu's black-and-white interactive portfolio: shipped projects, field moments, writing, tools, photography, people, and the playable PortfolioMon archive.

> I build useful worlds.

## Highlights

- Full-screen personal and project galleries with first-party screenshots
- Twelve featured project case files with live and GitHub links
- Interactive writing, wiki, experience, people, KevBook, and photography pages
- Light and dark presentation modes
- PortfolioMon preserved as a complete playable project with selection and battle flows

## Development

```bash
npm install
npm run dev
```

The local portfolio runs at [http://localhost:3000](http://localhost:3000) by default. To use port 3001:

```bash
npm run dev -- -p 3001
```

The application requires the environment variables declared in `src/env.mjs`. Local builds can skip environment validation when only the static portfolio surface is being tested:

```bash
SKIP_ENV_VALIDATION=1 npm run build
```

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Next Themes, and Cobe.

## Repository split

This repository owns the current portfolio. The original game-first site remains in the separate `PortfolioMon-Showdown` repository.
