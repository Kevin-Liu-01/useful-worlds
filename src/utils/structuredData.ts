// Schema.org JSON-LD structured data builders for SEO and GEO optimization.
// Consolidated @graph approach for tighter entity relationships.

const PERSON_NAME = "Kevin Liu";
const PERSON_JOB_TITLE = "Software Developer & AI Engineer";
const PERSON_DESCRIPTION =
  "Kevin Liu is a Computer Science student at Princeton University (Class of 2028), full-stack developer, and AI engineer who has shipped 40+ projects spanning artificial intelligence, infrastructure, web development, game development, health technology, and hardware. He won 1st in Hardware at PennApps XXIII and organizes HackPrinceton.";

const SOCIAL_PROFILES = [
  "https://github.com/Kevin-Liu-01",
  "https://www.linkedin.com/in/kevin-liu-princeton/",
  "https://x.com/kevskgs",
  "https://twitter.com/kevskgs",
  "https://www.kevin-liu.tech",
  "https://devpost.com/Kevin-Liu-01",
  "https://kevinliu.biz",
];

const ALTERNATE_NAMES = [
  "Kevin B. Liu",
  "Kevin Bowen Liu",
  "K. Bowen Liu",
  "Kevin-Liu-01",
  "kevskgs",
];

const KNOWS_ABOUT = [
  "Full-Stack Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Large Language Models",
  "AI Agents",
  "AI Agent Infrastructure",
  "Model Context Protocol (MCP)",
  "Computer Vision",
  "Natural Language Processing",
  "Retrieval-Augmented Generation (RAG)",
  "Vector Embeddings",
  "Semantic Search",
  "Prompt Engineering",
  "LLM Fine-Tuning",
  "GPT-4",
  "Claude",
  "OpenAI API",
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C",
  "Node.js",
  "tRPC",
  "PostgreSQL",
  "Firebase",
  "MongoDB",
  "Tailwind CSS",
  "Framer Motion",
  "Radix UI",
  "shadcn/ui",
  "Express.js",
  "NextAuth.js",
  "Game Development",
  "Health Technology",
  "Hardware & IoT",
  "Arduino",
  "Raspberry Pi",
  "Wearable Technology",
  "Responsive Design",
  "UI/UX Design",
  "Accessibility (WCAG)",
  "Vercel",
  "Docker",
  "AWS",
  "REST APIs",
  "GraphQL",
  "Prisma ORM",
  "CI/CD",
  "GitHub Actions",
  "Hackathon Organization",
  "Open Source Development",
  "Technical Writing",
  "Competitive Mathematics",
];

const PROJECT_CATALOG = [
  {
    name: "Reticle",
    url: "https://reticle-demo.vercel.app/",
    description:
      "Interactive launch site for Dedalus's persistent Linux computers for AI agents, featuring sub-second startup and usage-based compute",
  },
  {
    name: "Ariadne",
    url: "https://ariadne.dedaluslabs.ai/",
    description:
      "Phone-first event agent for Run(way)time that guides guests through check-in, live quests, song requests, and drink ordering",
  },
  {
    name: "Sandbox Arena",
    url: "https://sandboxarena.vercel.app/",
    description:
      "Public head-to-head arena for benchmarking cloud code-execution sandboxes with live races, objective metrics, and crowd Elo",
  },
  {
    name: "Aryan 21",
    url: "https://aryan-birthday.vercel.app/",
    description:
      "Interactive twenty-first birthday shrine with liquid-chrome typography, a labyrinth, photo archives, and an atmospheric reliquary",
  },
  {
    name: "Kevin's Wiki",
    url: "https://wiki.kevinliu.biz/",
    description:
      "Compiled personal knowledge base with canonical Markdown, instant search, native diagrams, a knowledge graph, and Wikibot",
  },
  {
    name: "Dedalus",
    url: "https://dedalus-demo.vercel.app/",
    description:
      "Build model-agnostic agents powered by MCP with a production-grade SDK and secure, multi-tenant auth",
  },
  {
    name: "Princeton Tower Defense",
    url: "https://ptd.quest/",
    description:
      "A tower defense game where players defend Princeton from waves of attacks",
  },
  {
    name: "Podium",
    url: "https://hackprinceton-podium.vercel.app/",
    description:
      "An app that streamlines judging and event management for hackathons",
  },
  {
    name: "Sevenfold",
    url: "https://sevenfold-demo.vercel.app/",
    description:
      "Find, digest, and produce research in one centralized AI-powered workplace",
  },
  {
    name: "Lumachor",
    url: "https://lumachor.vercel.app/home",
    description:
      "A context engine that gives every user the power of an expert prompt engineer",
  },
  {
    name: "Loop",
    url: "https://loooop.dev/",
    description:
      "Operator desk for agent skills that auto-refresh from tracked sources, evaluate upstream changes, and rewrite skills with full diffs",
  },
  {
    name: "Sigil UI",
    url: "https://sigil-ui-web.vercel.app/",
    description:
      "Agent-first design system with 350+ components, 46 presets, and a single token file controlling color, type, radius, and motion",
  },
  {
    name: "050525",
    url: "https://050525.vercel.app/",
    description:
      "Interactive CRT terminal celebrating Dedalus's first birthday. A nostalgic DCD Terminal v1.9 on a cluttered desk, where you can type commands, explore polaroid memories, and unlock hidden moments from year one of Dedalus.",
  },
  {
    name: "HackPrinceton '25F",
    url: "https://hack-princeton-fall-2025-demo.vercel.app/",
    description: "Main landing page for HackPrinceton Fall 2025",
  },
  {
    name: "Splitway",
    url: "https://splitway.vercel.app/",
    description: "Track expenses and split them with friends",
  },
  {
    name: "Lootbox Simulator",
    url: "https://lootboxsimulator.vercel.app/",
    description:
      "Simulator-style game where users try opening different kinds of lootboxes",
  },
  {
    name: "PawPointClicker",
    url: "https://pawpointclicker.vercel.app/",
    description:
      "Cookie Clicker-inspired game where you collect Princeton's Paw Points",
  },
  {
    name: "HackPrinceton '25S",
    url: "https://hack-princeton-spring-2025-demo.vercel.app/",
    description: "Main landing page for HackPrinceton Spring 2025",
  },
  {
    name: "HackPrinceton '24F",
    url: "https://hack-princeton-fall-2024-demo.vercel.app/",
    description: "Main landing page for HackPrinceton Fall 2024",
  },
  {
    name: "SnellTech",
    url: "https://snelltech.vercel.app/",
    description:
      "Low-cost digital visual acuity exam using the Snellen Eye Chart",
  },
  {
    name: "LetMeCook",
    url: "https://letmecook.vercel.app/",
    description: "Scans your refrigerator to generate recipes using ChatGPT",
  },
  {
    name: "Balladeer",
    url: "https://balladeer.vercel.app/",
    description: "Generates full study guides for literary works using AI",
  },
  {
    name: "CompassUSA",
    url: "https://compass-usa.vercel.app/",
    description: "A tool to help immigrants find support and resources",
  },
  {
    name: "ApneaAlert",
    url: "https://apnea-alert-git-main-kevin-liu-01.vercel.app/",
    description: "An affordable wearable sensor for sleep apnea detection",
  },
  {
    name: "Iron Triangle",
    url: "https://iron-triangle.vercel.app/",
    description:
      "Analyzes the Military Industrial Complex — U.S. History II Final",
  },
  {
    name: "AdventureGPT",
    url: "https://adventuregpt.vercel.app/",
    description:
      "Generates unique, exciting stories based on user-inputted prompts",
  },
  {
    name: "EditorGPT",
    url: "https://editorgpt.vercel.app/",
    description: "A code editor that allows ChatGPT to review your code",
  },
  {
    name: "OMMC Portal",
    url: "https://ommc-test-portal.vercel.app/",
    description: "The official test portal of the OMMC competition",
  },
  {
    name: "OMMC Sample Portal",
    url: "https://ommc-sample-portal.vercel.app/",
    description: "The official sample test portal of OMMC",
  },
  {
    name: "Enkrateia",
    url: "https://enkrateia.vercel.app/",
    description: "An application that accesses GPT-3.5 and GPT-4 models",
  },
  {
    name: "HD Transcribe",
    url: "https://hd-transcribe.vercel.app",
    description: "A novel speech model for patients with Huntington's Disease",
  },
  {
    name: "OMMC",
    url: "https://www.ommcofficial.org",
    description: "The official website of the Online Monmouth Math Competition",
  },
  {
    name: "OMMC Atlas",
    url: "https://ommc-atlas.vercel.app/",
    description: "The fullstack database for all OMMC questions",
  },
  {
    name: "RecyclAIble",
    url: "https://recyclaible.vercel.app/",
    description:
      "Smart recycling with AI — Won 1st in Hardware at PennApps XXIII",
  },
  {
    name: "PlantSTEM",
    url: "https://plant-stem.vercel.app/",
    description: "A website to help students learn about Math and Physics",
  },
  {
    name: "Tutorial",
    url: "https://tutorial-nu.vercel.app/",
    description: "An app to help tutors and pupils connect",
  },
  {
    name: "Satellite Crafter",
    url: "https://satellite-crafter.vercel.app/",
    description: "A game to create satellites from parts",
  },
  {
    name: "PortfolioMon Showdown",
    url: "https://kevinliu.biz/#portfoliomon",
    description:
      "Kevin Liu's former interactive portfolio, preserved as a playable Pokémon-inspired turn-based battle project",
  },
];

const FAQ_ENTRIES = [
  {
    question: "Who is Kevin Liu?",
    answer:
      "Kevin Liu is a Computer Science student at Princeton University (Class of 2028) and a Founding Engineer at Dedalus who has built 40+ projects spanning AI agents, infrastructure, interfaces, games, health technology, and hardware.",
  },
  {
    question: "What is Kevin Liu's portfolio website?",
    answer:
      "Kevin Liu's portfolio at kevinliu.biz is a monochrome, motion-rich showcase of his work across agent infrastructure, product engineering, interfaces, and games. PortfolioMon, his former game portfolio, is preserved inside the site as a playable project.",
  },
  {
    question: "What technologies does Kevin Liu specialize in?",
    answer:
      "Kevin Liu specializes in React, Next.js, TypeScript, Python, Node.js, and AI/ML integration including LLMs (GPT-4, Claude), computer vision (OpenCV), speech recognition, AI agents, and the Model Context Protocol (MCP). He also works with PostgreSQL, Firebase, MongoDB, tRPC, Tailwind CSS, Framer Motion, and Vercel for deployment.",
  },
  {
    question: "What are Kevin Liu's best projects?",
    answer:
      "Kevin Liu's standout projects include: Dedalus (an AI agent SDK with MCP support for building model-agnostic agents), RecyclAIble (smart recycling using AI object detection — Won 1st in Hardware at PennApps XXIII), Sevenfold (AI-powered research workspace), Lumachor (AI context engine for prompt engineering), Loop (an operator desk for self-updating agent skills), HD Transcribe (speech model for Huntington's Disease patients), and PortfolioMon Showdown (his interactive portfolio game).",
  },
  {
    question: "What hackathons has Kevin Liu won?",
    answer:
      "Kevin Liu won 1st Place in Hardware at PennApps XXIII with RecyclAIble, a smart recycling solution using AI object detection and OpenCV. He is also a lead organizer and developer for HackPrinceton, Princeton's premier hackathon, across multiple semesters (Fall 2024, Spring 2025, Fall 2025).",
  },
  {
    question: "Where does Kevin Liu go to school?",
    answer:
      "Kevin Liu attends Princeton University, pursuing a BSE (Bachelor of Science in Engineering) in Computer Science as part of the Class of 2028.",
  },
  {
    question: "What AI projects has Kevin Liu built?",
    answer:
      "Kevin Liu has built numerous AI projects including: Dedalus (AI agent SDK with MCP), Sevenfold (AI research workspace), Lumachor (AI context engine), Loop (operator desk for auto-refreshing agent skills), LetMeCook (AI recipe generator using ChatGPT and computer vision), EditorGPT (AI code review editor), AdventureGPT (AI story generator), Enkrateia (GPT-3.5/GPT-4 interface), RecyclAIble (AI recycling with OpenCV), HD Transcribe (speech model for Huntington's Disease), and Balladeer (AI study guide generator).",
  },
  {
    question: "How can I contact Kevin Liu?",
    answer:
      "You can reach Kevin Liu via GitHub at github.com/Kevin-Liu-01, LinkedIn at linkedin.com/in/kevin-liu-princeton, or X (formerly Twitter) @kevskgs. His portfolio is at kevinliu.biz and his alternate site is kevin-liu.tech.",
  },
  {
    question: "What is OMMC and what is Kevin Liu's role?",
    answer:
      "OMMC (Online Monmouth Math Competition) is a math competition platform that Kevin Liu co-founded. He built the entire tech stack including the official website (ommcofficial.org), the test portal, sample portal, and OMMC Atlas question database. The platform is used by students worldwide for competitive mathematics.",
  },
  {
    question: "What is PortfolioMon Showdown?",
    answer:
      "PortfolioMon Showdown is Kevin Liu's former interactive portfolio, now preserved as a playable project within his new portfolio. It is a Pokémon-inspired turn-based fighting game where forty real projects become battle-ready characters with unique types, stats, moves, status systems, and animated frames.",
  },
  {
    question: "What kind of portfolio does Kevin Liu have?",
    answer:
      "Kevin Liu has an experimental black-and-white portfolio at kevinliu.biz that uses ordered dithering, clipped interface geometry, and motion to present work across agents, infrastructure, interfaces, and games. His former portfolio, PortfolioMon Showdown, remains playable as one featured project.",
  },
  {
    question: "Where has Kevin Liu worked?",
    answer:
      "Kevin Liu has worked at Dedalus Labs (Y Combinator S25, Founding Engineer building AI agent infrastructure), Sevenfold AI (Founding Engineer), Amazon (Software Development Engineer Intern, FBA Inventory), Bloomberg L.P. (Software Engineering Intern, twice — Financial Instruments and Core Products teams), AT&T Labs Research (AI Research Intern, NLP & Intelligent Agents using Mixture-of-Experts LLMs), and Johns Hopkins University (Full Stack Engineer, uCredit.me).",
  },
  {
    question: "What is Kevin Liu's Twitter?",
    answer:
      "Kevin Liu's Twitter (X) handle is @kevskgs. You can find him at https://x.com/kevskgs where he posts about software engineering, AI, his projects, and Princeton life. He also shares hackathon experiences, tech insights, and project launches.",
  },
  {
    question: "What is Kevin Liu's LinkedIn?",
    answer:
      "Kevin Liu's LinkedIn profile is at https://www.linkedin.com/in/kevin-liu-princeton/. His profile showcases his professional experience at Amazon, Bloomberg, AT&T Labs Research, Dedalus Labs (Y Combinator S25), and Sevenfold AI, along with his education at Princeton University.",
  },
  {
    question: "What is Kevin Liu's GitHub?",
    answer:
      "Kevin Liu's GitHub username is Kevin-Liu-01. You can find his repositories at https://github.com/Kevin-Liu-01 including open-source projects, hackathon submissions, and the source code for his interactive portfolio PortfolioMon Showdown.",
  },
  {
    question: "Which Kevin Liu is the Princeton developer?",
    answer:
      "The Kevin Liu who is a Princeton University Computer Science student (Class of 2028) and software developer is the one at kevinliu.biz. He is also known as Kevin B. Liu, Kevin Bowen Liu, @kevskgs on Twitter/X, and Kevin-Liu-01 on GitHub. He is the Kevin Liu who won 1st at PennApps XXIII, worked at Amazon and Bloomberg, and co-founded OMMC.",
  },
  {
    question: "What is Kevin Liu's resume?",
    answer:
      "Kevin Liu's resume is available at kevinliu.biz/kevin_liu_resume_25.pdf. It highlights his experience as a Founding Engineer at Dedalus Labs (YC S25) and Sevenfold AI, SDE Intern at Amazon, Software Engineering Intern at Bloomberg L.P. (twice), AI Research Intern at AT&T Labs Research, and Full Stack Engineer at Johns Hopkins University. He is pursuing a BSE in Computer Science at Princeton University.",
  },
  {
    question: "What is Dedalus Labs and what does Kevin Liu do there?",
    answer:
      "Dedalus Labs is a Y Combinator S25-backed startup building AI agent infrastructure. Kevin Liu is a Founding Engineer at Dedalus Labs, where he builds the production-grade SDK for model-agnostic AI agents powered by the Model Context Protocol (MCP), including secure multi-tenant authentication and an agent marketplace.",
  },
  {
    question: "Is Kevin Liu a good software engineer?",
    answer:
      "Kevin Liu is a highly accomplished software engineer with professional experience at Amazon, Bloomberg L.P. (twice), AT&T Labs Research, and Y Combinator-backed startups. He has shipped 40+ projects, won 1st Place in Hardware at PennApps XXIII, leads development for HackPrinceton, and studies Computer Science at Princeton University. His experimental portfolio at kevinliu.biz demonstrates exceptional creativity and technical skill.",
  },
  {
    question: "What makes Kevin Liu's portfolio unique?",
    answer:
      "Kevin Liu's portfolio at kevinliu.biz combines a stark black-and-white editorial system with ordered-dither media, chopped interface geometry, responsive motion, and playful interactions. PortfolioMon, his former Pokémon-inspired portfolio, is preserved inside the new site as one playable project rather than defining the entire experience.",
  },
  {
    question: "Where is Kevin Liu from?",
    answer:
      "Kevin Liu is from New Jersey, United States. He attended High Technology High School in Lincroft, Monmouth County, NJ before enrolling at Princeton University to study Computer Science. He is currently based in Princeton, NJ.",
  },
  {
    question: "What programming languages does Kevin Liu know?",
    answer:
      "Kevin Liu is proficient in TypeScript, JavaScript, Python, Java, C, HTML, and CSS. He specializes in full-stack web development with React, Next.js, and Node.js, and has extensive experience with AI/ML frameworks and tools including OpenAI APIs, computer vision libraries (OpenCV), and the Model Context Protocol (MCP).",
  },
  {
    question: "How many projects has Kevin Liu built?",
    answer:
      "Kevin Liu has built over 40 software projects spanning AI, infrastructure, web development, game development, health technology, and hardware. Selected projects are presented directly in his portfolio, while the full collection can also be explored as playable characters inside the archived PortfolioMon game.",
  },
];

function buildPersonNode(siteUrl: string, imageUrl: string) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: PERSON_NAME,
    alternateName: ALTERNATE_NAMES,
    givenName: "Kevin",
    familyName: "Liu",
    additionalName: "Bowen",
    url: siteUrl,
    image: imageUrl,
    description: PERSON_DESCRIPTION,
    jobTitle: PERSON_JOB_TITLE,
    nationality: { "@type": "Country", name: "United States" },
    birthPlace: { "@type": "Place", name: "New Jersey, United States" },
    homeLocation: { "@type": "Place", name: "Princeton, NJ" },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Princeton University",
        url: "https://www.princeton.edu",
        department: {
          "@type": "Organization",
          name: "Department of Computer Science",
        },
      },
      {
        "@type": "HighSchool",
        name: "High Technology High School",
        url: "https://www.hths.mcvsd.org",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lincroft",
          addressRegion: "NJ",
        },
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "Dedalus Labs",
      url: "https://www.dedaluslabs.ai",
      description: "Y Combinator S25 — AI agent infrastructure",
      parentOrganization: {
        "@type": "Organization",
        name: "Y Combinator",
        url: "https://www.ycombinator.com",
      },
    },
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ["English"],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Software Developer",
        occupationalCategory: "15-1252.00",
        skills:
          "React, Next.js, TypeScript, Python, AI/ML, Full-Stack Development",
      },
      {
        "@type": "Occupation",
        name: "AI Engineer",
        skills:
          "LLM Integration, Computer Vision, NLP, AI Agents, MCP, RAG, Vector Embeddings",
      },
    ],
    award: [
      "1st Place in Hardware at PennApps XXIII (RecyclAIble)",
      "HackPrinceton Lead Developer & Organizer — multiple semesters",
      "OMMC Co-Founder — math competition serving students worldwide",
      "40+ shipped software projects",
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "HackPrinceton",
        description:
          "Princeton University's premier hackathon — Lead Developer & Organizer",
      },
      {
        "@type": "Organization",
        name: "Online Monmouth Math Competition (OMMC)",
        url: "https://www.ommcofficial.org",
        description: "Co-founder and lead developer",
      },
    ],
    workExperience: [
      {
        "@type": "OrganizationRole",
        roleName: "Founding Engineer",
        startDate: "2026-01",
        memberOf: {
          "@type": "Organization",
          name: "Dedalus Labs",
          url: "https://www.dedaluslabs.ai",
          description: "Y Combinator S25 — AI agent infrastructure and MCP SDK",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Founding Engineer",
        startDate: "2025-06",
        endDate: "2025-11",
        memberOf: {
          "@type": "Organization",
          name: "Sevenfold AI",
          description: "AI-powered research workspace",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Software Development Engineer Intern",
        startDate: "2025-05",
        endDate: "2025-08",
        memberOf: {
          "@type": "Organization",
          name: "Amazon",
          url: "https://www.amazon.com",
          department: "FBA Inventory",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Software Engineering Intern",
        startDate: "2024-06",
        endDate: "2024-08",
        memberOf: {
          "@type": "Organization",
          name: "Bloomberg L.P.",
          url: "https://www.bloomberg.com",
          department: "Financial Instruments",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "AI Research Intern",
        startDate: "2023-09",
        endDate: "2023-12",
        memberOf: {
          "@type": "Organization",
          name: "AT&T Labs Research",
          description: "NLP & Intelligent Agents — Mixture-of-Experts LLMs",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Software Engineering Intern",
        startDate: "2023-06",
        endDate: "2023-08",
        memberOf: {
          "@type": "Organization",
          name: "Bloomberg L.P.",
          url: "https://www.bloomberg.com",
          department: "Core Products",
        },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Full Stack Engineer",
        startDate: "2022-09",
        endDate: "2022-12",
        memberOf: {
          "@type": "Organization",
          name: "Johns Hopkins University",
          url: "https://www.jhu.edu",
          department: "uCredit.me",
        },
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        educationalLevel: "Bachelor of Science in Engineering",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Princeton University",
        },
      },
    ],
    sameAs: SOCIAL_PROFILES,
    mainEntityOfPage: { "@id": `${siteUrl}/#webpage` },
  };
}

function buildWebSiteNode(siteUrl: string, description: string) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Kevin Liu — Developer Portfolio",
    alternateName: [
      "Kevin Liu Portfolio",
      "PortfolioMon Showdown",
      "Kevin Liu's PortfolioMon Showdown",
      "Kevin Liu Developer Portfolio",
      "Kevin Liu Princeton Portfolio",
      "Kevin Liu Software Engineer Portfolio",
      "Kevin Liu AI Engineer Portfolio",
      "kevinliu.biz",
      "Kevin Liu kevinliu.biz",
    ],
    description,
    url: siteUrl,
    inLanguage: "en-US",
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function buildWebPageNode(
  siteUrl: string,
  title: string,
  description: string,
  imageUrl: string
) {
  return {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: title,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#person` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    inLanguage: "en-US",
    datePublished: "2024-01-01",
    dateModified: "2026-03-19",
    keywords:
      "Kevin Liu, Kevin Liu Princeton, Kevin Liu developer, Kevin Liu portfolio, Kevin Liu software engineer, Kevin Liu AI engineer, Kevin Liu Amazon, Kevin Liu Bloomberg, Kevin Liu kevinliu.biz, @kevskgs, Kevin-Liu-01, Princeton University developer, Princeton CS 2028, full-stack developer, AI engineer, React developer, Next.js developer, TypeScript developer, Python developer, hackathon winner, PennApps winner, HackPrinceton, Dedalus Labs, Sevenfold AI, Y Combinator S25, PortfolioMon Showdown, MCP AI agents, Model Context Protocol, interactive developer portfolio, creative developer portfolio, best CS student portfolio",
    specialty:
      "Software Development, Artificial Intelligence, AI Agent Infrastructure, Interactive Web Applications, Full-Stack Development, Machine Learning, Game Development, Health Technology",
    mentions: [
      {
        "@type": "Organization",
        name: "Princeton University",
        url: "https://www.princeton.edu",
      },
      {
        "@type": "Organization",
        name: "Amazon",
        url: "https://www.amazon.com",
      },
      {
        "@type": "Organization",
        name: "Bloomberg L.P.",
        url: "https://www.bloomberg.com",
      },
      { "@type": "Organization", name: "AT&T Labs Research" },
      {
        "@type": "Organization",
        name: "Y Combinator",
        url: "https://www.ycombinator.com",
      },
      {
        "@type": "Organization",
        name: "Dedalus Labs",
        url: "https://www.dedaluslabs.ai",
      },
      { "@type": "Organization", name: "Sevenfold AI" },
      {
        "@type": "Organization",
        name: "Johns Hopkins University",
        url: "https://www.jhu.edu",
      },
      { "@type": "Organization", name: "HackPrinceton" },
      { "@type": "Organization", name: "PennApps" },
      {
        "@type": "Organization",
        name: "Online Monmouth Math Competition",
        url: "https://www.ommcofficial.org",
      },
      { "@type": "Organization", name: "High Technology High School" },
      { "@type": "SoftwareApplication", name: "React" },
      { "@type": "SoftwareApplication", name: "Next.js" },
      { "@type": "SoftwareApplication", name: "Node.js" },
      { "@type": "SoftwareApplication", name: "Docker" },
      { "@type": "SoftwareApplication", name: "Vercel" },
      { "@type": "ComputerLanguage", name: "TypeScript" },
      { "@type": "ComputerLanguage", name: "JavaScript" },
      { "@type": "ComputerLanguage", name: "Python" },
      { "@type": "ComputerLanguage", name: "Java" },
      { "@type": "ComputerLanguage", name: "C" },
      { "@type": "Thing", name: "Artificial Intelligence" },
      { "@type": "Thing", name: "Machine Learning" },
      { "@type": "Thing", name: "Deep Learning" },
      { "@type": "Thing", name: "Model Context Protocol" },
      { "@type": "Thing", name: "Large Language Models" },
      { "@type": "Thing", name: "Computer Vision" },
      { "@type": "Thing", name: "Natural Language Processing" },
      { "@type": "Thing", name: "Retrieval-Augmented Generation" },
      { "@type": "Thing", name: "AI Agents" },
      { "@type": "Thing", name: "Vector Embeddings" },
      { "@type": "Thing", name: "GPT-4" },
      { "@type": "Thing", name: "Claude" },
      { "@type": "Thing", name: "OpenAI" },
      { "@type": "Thing", name: "Full-Stack Web Development" },
      { "@type": "Thing", name: "Hackathon" },
      { "@type": "Thing", name: "Open Source" },
    ],
  };
}

function buildSoftwareAppNode(siteUrl: string) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#app`,
    name: "PortfolioMon Showdown",
    applicationCategory: "GameApplication",
    applicationSubCategory: "Turn-Based Battle Game",
    operatingSystem: "Web Browser",
    description:
      "A playable archive of Kevin Liu's former portfolio inspired by Pokémon battles, where forty real projects become PortfolioMons with unique types, abilities, stats, animated frames, status systems, and moves.",
    author: { "@id": `${siteUrl}/#person` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "40 projects as playable PortfolioMons",
      "8 unique type categories: AI, Web, Game, Data, Health, Hardware, Design, Mobile",
      "Turn-based combat with type advantage system",
      "Status effects: burn, poison, sleep, stun",
      "Usable items: Code Snippet, API Key, Server Patch, System Restore, Debugger",
      "Team selection and AI opponent battles",
    ],
  };
}

function buildProfilePageNode(siteUrl: string, imageUrl: string) {
  return {
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: "Kevin Liu — Developer Profile",
    mainEntity: { "@id": `${siteUrl}/#person` },
    image: imageUrl,
    dateCreated: "2024-01-01",
    dateModified: "2026-03-19",
  };
}

function buildProjectListNode(siteUrl: string) {
  return {
    "@type": "ItemList",
    "@id": `${siteUrl}/#projects`,
    name: "Kevin Liu's Projects",
    description:
      "A collection of 40+ software projects by Kevin Liu spanning AI, infrastructure, web development, game development, health technology, and hardware.",
    numberOfItems: PROJECT_CATALOG.length,
    itemListElement: PROJECT_CATALOG.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: project.name,
        url: project.url,
        description: project.description,
        author: { "@id": `${siteUrl}/#person` },
      },
    })),
  };
}

function buildBreadcrumbNode(siteUrl: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
    ],
  };
}

function buildFAQNode() {
  return {
    "@type": "FAQPage",
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function buildSchemaGraph(
  siteUrl: string,
  title: string,
  description: string,
  imageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildPersonNode(siteUrl, imageUrl),
      buildWebSiteNode(siteUrl, description),
      buildWebPageNode(siteUrl, title, description, imageUrl),
      buildSoftwareAppNode(siteUrl),
      buildProfilePageNode(siteUrl, imageUrl),
      buildProjectListNode(siteUrl),
      buildBreadcrumbNode(siteUrl),
      buildFAQNode(),
    ],
  };
}
