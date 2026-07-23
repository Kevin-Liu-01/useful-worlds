export type PortfolioPhoto = {
  readonly src: string;
  readonly alt: string;
  readonly category: "Graduation" | "Portrait" | "Editorial" | "VIS 210";
  readonly orientation: "landscape" | "portrait";
};

export const PORTFOLIO_PHOTOS = [
  {
    src: "/images/photography/grads-gothic-windows.jpg",
    alt: "Four graduates framed in gothic tracery windows",
    category: "Graduation",
    orientation: "landscape",
  },
  {
    src: "/images/photography/arms-wide-ivy.jpg",
    alt: "Arms wide before an ivy-covered arch",
    category: "Graduation",
    orientation: "landscape",
  },
  {
    src: "/images/photography/caps-up-couple.jpg",
    alt: "Two graduates raising caps in a cloister",
    category: "Graduation",
    orientation: "landscape",
  },
  {
    src: "/images/photography/tiger-base-cap.jpg",
    alt: "Seated on a bronze tiger base with cap raised",
    category: "Graduation",
    orientation: "portrait",
  },
  {
    src: "/images/photography/nassau-framed.jpg",
    alt: "Framed by dark trees before a historic hall",
    category: "Portrait",
    orientation: "portrait",
  },
  {
    src: "/images/photography/barbell-gown.jpg",
    alt: "A graduate at a loaded barbell in cap and gown",
    category: "Editorial",
    orientation: "landscape",
  },
  {
    src: "/images/photography/portrait-cloister.jpg",
    alt: "Portrait in soft cloister light",
    category: "Portrait",
    orientation: "landscape",
  },
  {
    src: "/images/photography/between-columns.jpg",
    alt: "Graduate braced between stone columns",
    category: "Portrait",
    orientation: "portrait",
  },
  {
    src: "/images/photography/painted-jackets-couple.jpg",
    alt: "A couple in hand-painted tiger jackets",
    category: "Editorial",
    orientation: "portrait",
  },
  {
    src: "/images/photography/reading-room.jpg",
    alt: "Reading among the library stacks",
    category: "Editorial",
    orientation: "landscape",
  },
  {
    src: "/images/photography/synchronized-friends.jpg",
    alt: "Friends in synchronized poses on the plaza",
    category: "Editorial",
    orientation: "landscape",
  },
  {
    src: "/images/photography/vis-mask-bench.jpg",
    alt: "Masked figure at a bench press, a conceptual self-portrait",
    category: "VIS 210",
    orientation: "landscape",
  },
] as const satisfies readonly PortfolioPhoto[];

export type FavoritePerson = {
  readonly name: string;
  readonly context: string;
  readonly group: "Princeton" | "Dedalus" | "HTHS" | "SF";
  readonly wikiSlug: string;
};

export const FAVORITE_PEOPLE = [
  {
    name: "Advika Vuppala",
    context: "HTHS → San Francisco",
    group: "SF",
    wikiSlug: "advika-vuppala",
  },
  {
    name: "Sunil Vittal",
    context: "Princeton · powerlifting",
    group: "Princeton",
    wikiSlug: "sunil-vittal",
  },
  {
    name: "Tsion Kergo",
    context: "Dedalus · teammate",
    group: "Dedalus",
    wikiSlug: "tsion-kergo",
  },
  {
    name: "David Li",
    context: "Dedalus · design",
    group: "Dedalus",
    wikiSlug: "david-li",
  },
  {
    name: "Nicky He",
    context: "Dedalus · Princeton · day one",
    group: "Dedalus",
    wikiSlug: "nicky-he",
  },
  {
    name: "Andrew Dai",
    context: "Princeton · climbing · Sympoh",
    group: "Princeton",
    wikiSlug: "andrew-dai",
  },
  {
    name: "Cathy Di",
    context: "Princeton · Hoagie",
    group: "Princeton",
    wikiSlug: "cathy-di",
  },
  {
    name: "Mark Rubin",
    context: "Princeton · HackPrinceton",
    group: "Princeton",
    wikiSlug: "mark-rubin",
  },
  {
    name: "Emily Luo",
    context: "HTHS · Princeton",
    group: "HTHS",
    wikiSlug: "emily-luo",
  },
  {
    name: "Palash Awasthi",
    context: "Dedalus · founder",
    group: "Dedalus",
    wikiSlug: "palash-awasthi",
  },
  {
    name: "Simon Kupchik",
    context: "Princeton · training",
    group: "Princeton",
    wikiSlug: "simon-kupchik",
  },
  {
    name: "Riya Pawar",
    context: "Princeton · HackPrinceton",
    group: "Princeton",
    wikiSlug: "riya-pawar",
  },
] as const satisfies readonly FavoritePerson[];

export type KevBookEntry = {
  readonly name: string;
  readonly category:
    | "Builders"
    | "Engineering"
    | "Research"
    | "Medicine"
    | "Creative"
    | "Athletics"
    | "Games";
  readonly role: string;
  readonly location: string;
  readonly summary: string;
  readonly url: string;
};

export const KEVBOOK_ENTRIES = [
  {
    name: "Kevin Liu",
    category: "Builders",
    role: "Agent systems builder",
    location: "Princeton, New Jersey",
    summary: "Agents, games, design systems, and a wiki with opinions.",
    url: "https://kevinliu.biz/",
  },
  {
    name: "Kevin Liu",
    category: "Builders",
    role: "Builder / investor",
    location: "San Francisco, California",
    summary: "Data scientist, founder, investor, and startup operator.",
    url: "https://kevinliu.co/",
  },
  {
    name: "Kevin K. Liu",
    category: "Engineering",
    role: "Software engineer",
    location: "Los Angeles, California",
    summary: "Product engineering work collected in a clean personal site.",
    url: "https://kevinkliu.com/",
  },
  {
    name: "Jia (Kevin) Liu",
    category: "Research",
    role: "Professor / Amazon Scholar",
    location: "Columbus, Ohio",
    summary:
      "Networking, machine learning, edge systems, and cyber-physical systems.",
    url: "https://kevinliu-osu.github.io/",
  },
  {
    name: "Kevin J. Liu",
    category: "Research",
    role: "Associate professor",
    location: "East Lansing, Michigan",
    summary: "Computer science, plant phenomics, and computational biology.",
    url: "https://engineering.msu.edu/directory/faculty/kjl",
  },
  {
    name: "Xiaowen (Kevin) Liu",
    category: "Research",
    role: "Computational proteomics professor",
    location: "New Orleans, Louisiana",
    summary: "Proteomics and mass-spectrometry search methods at Tulane.",
    url: "https://liulab.tulane.edu/",
  },
  {
    name: "Hanwen Kevin Liu",
    category: "Games",
    role: "Game designer",
    location: "Winchester, England",
    summary: "Game design and art from the Winchester School of Art.",
    url: "https://sites.wsagames.com/hl1d23/",
  },
  {
    name: "Kevin Liu",
    category: "Research",
    role: "AI evals researcher",
    location: "San Francisco, California",
    summary:
      "Frontier evaluations, preparedness, and writing about AI systems.",
    url: "https://kliu.io/",
  },
  {
    name: "Kevin Xinye Liu",
    category: "Medicine",
    role: "Radiation oncology professor",
    location: "Boston, Massachusetts",
    summary: "Radiation oncology at Dana-Farber and Harvard.",
    url: "https://connects.catalyst.harvard.edu/Profiles/profile/125571203",
  },
  {
    name: "Kevin Liu",
    category: "Creative",
    role: "Architect / curator",
    location: "Sydney, Australia",
    summary: "Architect, urban designer, and Harvard GSD graduate.",
    url: "https://www.gsd.harvard.edu/2021/05/meet-the-gsd-class-of-2021-commencement-marshals/",
  },
  {
    name: "Kevin Liu",
    category: "Athletics",
    role: "Track sprinter",
    location: "Seattle, Washington",
    summary: "University of Washington track athlete competing in sprints.",
    url: "https://gohuskies.com/sports/track-and-field/roster/kevin-liu/7117",
  },
  {
    name: "Kevin Liu Hermstein",
    category: "Research",
    role: "Wireless networking PhD student",
    location: "New York, New York",
    summary:
      "Columbia researcher and NDSEG Fellow working in mobile networking.",
    url: "https://wimnet.ee.columbia.edu/people/current-members/kevin-liu-hermstein/",
  },
] as const satisfies readonly KevBookEntry[];

export type ExperienceEntry = {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly status?: "incoming";
};

export const EXPERIENCE = [
  {
    company: "General Translation",
    role: "Role title pending",
    period: "Starts Jul 20, 2026",
    location: "San Francisco, CA",
    summary:
      "Incoming. Scope is still being written down, so the portfolio does not invent it.",
    tags: ["incoming", "localization", "systems"],
    status: "incoming",
  },
  {
    company: "Dedalus Labs",
    role: "Founding Engineer",
    period: "Jan 2026 – Jul 2026",
    location: "Princeton, NJ",
    summary:
      "Agent containers, virtual machines, sandboxed execution, MCP infrastructure, and multi-tenant product systems at a YC S25 startup.",
    tags: ["MCP", "infrastructure", "SDK", "agents"],
  },
  {
    company: "Sevenfold AI",
    role: "Founding Engineer",
    period: "Jun – Nov 2025",
    location: "Princeton, NJ",
    summary:
      "Built an agent-powered research MVP, vector search, context extraction, product direction, branding, and go-to-market systems.",
    tags: ["RAG", "vector search", "product", "GTM"],
  },
  {
    company: "Amazon Web Services",
    role: "SDE Intern",
    period: "Summer 2025",
    location: "Bellevue, WA",
    summary:
      "Built internal inventory APIs, reconciliation workflows, and an Amazon Q-assisted dashboard for product collaboration.",
    tags: ["APIs", "AWS", "dashboards"],
  },
  {
    company: "AT&T Labs Research",
    role: "AI Research Intern",
    period: "Fall 2023",
    location: "Middletown, NJ",
    summary:
      "Built tool-using autonomous agents and Mixture-of-Experts workflows for enterprise document analysis with Gentopia.",
    tags: ["MoE", "agents", "research"],
  },
  {
    company: "Bloomberg L.P.",
    role: "Software Engineering Intern × 2",
    period: "2023 & 2024",
    location: "Princeton, NJ",
    summary:
      "Worked on corporate-filings classification and a real-time treasury-bond market interface across two internships.",
    tags: ["machine learning", "Next.js", "markets"],
  },
] as const satisfies readonly ExperienceEntry[];
