export type PhilosophySection = {
  heading: string;
  paragraphs: string[];
};

export type Philosophy = {
  id: "unassigned" | "taste" | "play" | "systems" | "proof" | "open";
  number: string;
  eyebrow: string;
  title: string;
  deck: string;
  paragraphs: readonly [string, string];
  annotation: string;
  pullQuote: string;
  sections: PhilosophySection[];
  fieldNotes: string[];
};

export const PHILOSOPHIES: Philosophy[] = [
  {
    id: "unassigned",
    number: "01",
    eyebrow: "On obsession",
    title: "Build what nobody assigned.",
    deck: "The most honest work usually begins before there is permission, a rubric, or even a convincing reason to continue.",
    paragraphs: [
      "My best work has always been the stuff nobody assigned: hackathons, games, open source, 3 a.m. rabbit holes. The absence of a rubric is the point. It forces me to decide what good means, then care enough to keep sanding the thing after it already works.",
      "When I want something badly enough, I don’t force myself to keep going. I force myself to stop. Obsession is not a productivity system, but it is the most honest signal I know that a project deserves to exist.",
    ],
    annotation: "Curiosity → voluntary difficulty → craft",
    pullQuote:
      "A self-assigned project is a vote for the person you want to become.",
    sections: [
      {
        heading: "Permission is a bad dependency.",
        paragraphs: [
          "A lot of ambitious work dies while waiting to become reasonable. It waits for a class, a role, a customer, or a manager to make the desire legitimate. By then the strange part—the part only you would have made—has usually been negotiated away.",
          "Starting without permission is not the same as ignoring reality. It means making the smallest undeniable version first. Once the object exists, the conversation changes from whether it should exist to what it could become.",
        ],
      },
      {
        heading: "Voluntary difficulty reveals taste.",
        paragraphs: [
          "With no rubric, every decision becomes evidence. What do you polish when nobody is grading it? Which shortcuts bother you? How far past functional do you go? Those choices reveal more than a résumé bullet because they show what your standards do in private.",
          "The useful constraint is not unlimited scope. It is choosing one unreasonable detail and taking it seriously: the transition that makes the model click, the tool that removes a recurring frustration, the interaction someone remembers tomorrow.",
        ],
      },
      {
        heading: "Ship the artifact, keep the obsession.",
        paragraphs: [
          "Obsession can create extraordinary work, but it can also hide the fear of release. Shipping is part of the craft. A project becomes real when another person can misunderstand it, stress it, and make it useful in a way you did not predict.",
          "I try to ship a complete thought, then let the response sharpen the next one. The obsession survives; the artifact gets to leave the room.",
        ],
      },
    ],
    fieldNotes: [
      "Begin before consensus",
      "Choose one unreasonable detail",
      "Ship a complete thought",
    ],
  },
  {
    id: "taste",
    number: "02",
    eyebrow: "On interfaces",
    title: "Taste is part of the system.",
    deck: "Interfaces are not a visual layer over the real product. They are where the product explains what it believes.",
    paragraphs: [
      "Design is not the coat of paint after the engineering is finished. A good interface teaches its mental model before anyone opens the documentation. Spacing, motion, language, and feedback are behavior—not decoration.",
      "I want software to feel inevitable on first use and specific enough that it could only have been made by this team. Clarity earns the right to personality. Personality makes the clarity memorable.",
    ],
    annotation: "Utility × legibility × a point of view",
    pullQuote: "The interface is the system explaining itself under pressure.",
    sections: [
      {
        heading: "Clarity is an engineering property.",
        paragraphs: [
          "A confusing interface often exposes a confused model underneath it. If the states cannot be named, the hierarchy cannot be drawn, or the next action cannot be predicted, another layer of polish will not rescue the product.",
          "This is why I like designing and engineering together. The interface pushes on the architecture, and the architecture disciplines the interface. The cleanest interaction is often evidence that the underlying system finally makes sense.",
        ],
      },
      {
        heading: "Personality should carry information.",
        paragraphs: [
          "Delight becomes disposable when it is detached from meaning. Motion should explain continuity. Color should reveal category or urgency. Copy should teach the product’s posture. Even a joke should make the system easier to trust.",
          "Restraint matters because contrast matters. If every surface is performing, nothing feels special. I want calm defaults with moments of unmistakable authorship exactly where attention is useful.",
        ],
      },
      {
        heading: "Inevitable, then specific.",
        paragraphs: [
          "The first goal is inevitability: the user should not have to admire the interface to understand it. The second is specificity: after understanding it, they should remember whose product it was.",
          "That sequence matters. Clarity earns personality. Once the mental model is solid, typography, motion, texture, and language can turn a usable tool into a place someone wants to return to.",
        ],
      },
    ],
    fieldNotes: [
      "Model the states first",
      "Make motion explain continuity",
      "Spend personality where attention pays",
    ],
  },
  {
    id: "play",
    number: "03",
    eyebrow: "On complexity",
    title: "Play is serious infrastructure.",
    deck: "When a system is hard to explain, give people meaningful things to do inside it and let consequence teach the rules.",
    paragraphs: [
      "I like turning opaque systems into things people can poke. A benchmark becomes a race. A portfolio becomes a battle. An agent substrate becomes a world with visible rules. Play makes complexity legible because it replaces explanation with consequence.",
      "Gameful does not mean noisy. The rules still need to be coherent, the feedback immediate, and the delight useful. If an interaction makes someone curious enough to understand the system underneath it, the play did real work.",
    ],
    annotation: "Rules → feedback → curiosity → understanding",
    pullQuote:
      "A good interaction can carry an explanation that prose never could.",
    sections: [
      {
        heading: "Consequence is compressed explanation.",
        paragraphs: [
          "A paragraph can describe a tradeoff. A system that lets you make the tradeoff can make it felt. The moment a choice changes speed, rank, health, cost, or possibility, the user begins constructing the model for themselves.",
          "That is the reason for the races, battles, sandboxes, and simulations in my work. They are not decoration around the information. They are interfaces for learning the information.",
        ],
      },
      {
        heading: "Gameful is not gamified.",
        paragraphs: [
          "Points and badges applied after the fact rarely create play. Play comes from a possibility space: understandable rules, meaningful choices, immediate feedback, and enough surprise to make another attempt interesting.",
          "The best playful systems respect the user’s intelligence. They do not bribe participation. They make participation intrinsically revealing.",
        ],
      },
      {
        heading: "Delight should leave a model behind.",
        paragraphs: [
          "A spectacular animation is worth little if the user is more confused after it finishes. I care about delight that deposits understanding: a transition that shows where an object went, a battle effect that communicates type, a race that makes performance differences obvious.",
          "When play works, the user leaves with both a memory and a model. The memory brings them back. The model lets them act.",
        ],
      },
    ],
    fieldNotes: [
      "Teach through consequence",
      "Design possibility, not prizes",
      "Make delight deposit understanding",
    ],
  },
  {
    id: "systems",
    number: "04",
    eyebrow: "On durability",
    title: "The system should survive the demo.",
    deck: "A beautiful first run is a promise. The real product begins when state, failure, and the second week enter the room.",
    paragraphs: [
      "I love a dramatic demo, but I trust the work that keeps its shape afterward. Durable software remembers what happened, exposes where it is stuck, and lets people recover without needing the original author in the room.",
      "That changes what I build for. Persistence, legible state, boring escape hatches, and small tools for operators are not secondary engineering. They are how a compelling prototype becomes somewhere real work can live.",
    ],
    annotation: "State → visibility → recovery → trust",
    pullQuote:
      "The second successful run matters more than the first perfect one.",
    sections: [
      {
        heading: "Persistence is a product behavior.",
        paragraphs: [
          "People experience persistence as confidence. Their work is still there, the machine still knows what happened, and a long task can outlive the tab that started it. The storage mechanism is infrastructure; continuity is the feature.",
          "When agents do meaningful work, this matters even more. A useful agent needs a place to accumulate files, decisions, tools, and unfinished threads without pretending every session begins from zero.",
        ],
      },
      {
        heading: "Operators deserve an interface too.",
        paragraphs: [
          "Logs alone are rarely an operating model. I want surfaces that make state visible: what is alive, what changed, what is waiting, what it costs, and what will happen if I intervene.",
          "The best control plane makes the risky action obvious, the reversible action easy, and the invisible background work inspectable. Operational clarity is user experience under pressure.",
        ],
      },
      {
        heading: "Recovery is part of the happy path.",
        paragraphs: [
          "Failures are not edge cases once software touches networks, models, people, and time. Designing only the successful route produces systems that look finished until the first honest day of use.",
          "Retries, checkpoints, cancellation, and clear ownership are not pessimism. They are an admission that real systems move through imperfect conditions and should still help people finish the job.",
        ],
      },
    ],
    fieldNotes: [
      "Design the second run",
      "Make state inspectable",
      "Treat recovery as a feature",
    ],
  },
  {
    id: "proof",
    number: "05",
    eyebrow: "On evidence",
    title: "Make the proof impossible to ignore.",
    deck: "When a claim matters, turn it into an artifact people can run, compare, stress, and remember.",
    paragraphs: [
      "Software is full of adjectives that collapse on contact: fast, intelligent, simple, reliable. I would rather build the comparison, expose the timer, or put the system in someone’s hands than ask a paragraph to carry the claim.",
      "A strong demo is not theater hiding the product. It is an argument with inputs. The visitor can challenge it, change the conditions, and watch the idea keep its footing.",
    ],
    annotation: "Claim → interaction → evidence → conviction",
    pullQuote:
      "Do not say the system is alive when you can let someone touch its pulse.",
    sections: [
      {
        heading: "Replace adjectives with instruments.",
        paragraphs: [
          "If speed matters, show elapsed time. If intelligence matters, reveal the decision and its sources. If reliability matters, expose the history. Instruments turn marketing language into something a skeptical person can inspect.",
          "The goal is not a dashboard for every idea. It is choosing the one measurement or interaction that makes the core promise falsifiable—and therefore worth believing.",
        ],
      },
      {
        heading: "A demo should accept resistance.",
        paragraphs: [
          "The weak demo requires the exact path rehearsed by its author. The useful demo invites the wrong input, the second attempt, the side-by-side comparison, and the impatient person who refuses to read the instructions.",
          "Resistance is valuable because it reveals where the idea is doing real work. A system that remains legible under pressure creates conviction without asking for trust first.",
        ],
      },
      {
        heading: "Evidence can still have theater.",
        paragraphs: [
          "Precision does not require a sterile presentation. Motion, sound, pacing, and visual contrast can focus attention on the evidence and make the result easier to remember.",
          "The line is simple: the spectacle should reveal the mechanism, not distract from its absence. The flourish earns its place when it makes the proof clearer.",
        ],
      },
    ],
    fieldNotes: [
      "Instrument the promise",
      "Invite the hostile click",
      "Use theater to reveal mechanism",
    ],
  },
  {
    id: "open",
    number: "06",
    eyebrow: "On leverage",
    title: "Share the machinery.",
    deck: "The highest-leverage artifact is often the tool, source, or field note that lets somebody else continue the thought.",
    paragraphs: [
      "A polished result is useful once. The machinery behind it can keep producing: a component, a command, a dataset, a writeup, or a repository that gives the next person a better starting point.",
      "Open work also sharpens my own thinking. Naming the decisions, exposing the seams, and making the project forkable forces the system to become more coherent than private intuition alone requires.",
    ],
    annotation: "Artifact → source → adaptation → compounding",
    pullQuote: "Leave behind more than the screenshot of what worked.",
    sections: [
      {
        heading: "Package the hard-won part.",
        paragraphs: [
          "Every project contains a piece that was much harder than it looks from the outside: a repaired sprite sheet, a resilient scraper, a motion primitive, a deployment trick, or a good default nobody should have to rediscover.",
          "That piece deserves an interface of its own. Packaging it turns one project’s scar tissue into another project’s acceleration.",
        ],
      },
      {
        heading: "Documentation is design for the next builder.",
        paragraphs: [
          "Good documentation does not narrate every file. It reveals the mental model, names the dangerous assumptions, and gives someone a first successful change quickly enough to build confidence.",
          "A field note can do the same for ideas. Writing down why a decision worked makes it available for disagreement, recombination, and improvement instead of leaving it trapped in memory.",
        ],
      },
      {
        heading: "Forkability is a measure of understanding.",
        paragraphs: [
          "If nobody can adapt the work without you, the system may still depend on knowledge that was never made explicit. Making something forkable exposes those hidden dependencies.",
          "The point is not to make every artifact universal. It is to make the useful seams visible so another person can take the idea somewhere you never would have taken it yourself.",
        ],
      },
    ],
    fieldNotes: [
      "Package the expensive lesson",
      "Document the mental model",
      "Expose the seams worth forking",
    ],
  },
];

export const getPhilosophy = (id: string) =>
  PHILOSOPHIES.find((philosophy) => philosophy.id === id);
