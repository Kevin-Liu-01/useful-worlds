export interface WorkExperienceEntry {
  role: string;
  company: string;
  date: string;
  description: string;
}

export const workExperience: WorkExperienceEntry[] = [
  {
    role: "Founding Engineer",
    company: "Dedalus Labs (YC S25)",
    date: "Spring 2026 – Present",
    description:
      "Building agent infrastructure: MCP-powered SDK, multi-tenant auth (DAuth), and sandboxed execution via microVM workspaces and container orchestration.",
  },
  {
    role: "Founding Engineer",
    company: "Sevenfold AI",
    date: "Jun 2025 – Nov 2025",
    description:
      "Built MVP for an agent-powered research workflow with vector search and contextual understanding. Designed context extraction framework boosting LLM relevance by 4.6x.",
  },
  {
    role: "SDE Intern – FBA Inventory",
    company: "Amazon Web Services",
    date: "Summer 2025",
    description:
      "Built internal APIs for inventory workflows, improving response time by 37%. Implemented dashboard with Amazon-Q LLM integration for PM collaboration.",
  },
  {
    role: "SWE Intern – Core Products (DT-CADEA)",
    company: "Bloomberg L.P.",
    date: "Summer 2024",
    description:
      "Developed Random Forest ML model to classify corporate 6K/8K filings, accelerating classification by 55% and boosting accuracy to 86%.",
  },
  {
    role: "AI Research Intern – NLP & Intelligent Agents",
    company: "AT&T Labs Research",
    date: "Fall 2023",
    description:
      "Designed autonomous agents with Mixture-of-Experts LLMs to parse enterprise documents, reducing analysis time by 85% with potential for 11x cost savings.",
  },
  {
    role: "SWE Intern – Financial Instruments (DT-FI)",
    company: "Bloomberg L.P.",
    date: "Summer 2023",
    description:
      "Built real-time market feed platform using Next.js and React to track treasury bonds, improving remediation speed by 4x.",
  },
  {
    role: "Full Stack Software Engineer",
    company: "Johns Hopkins University (uCredit.me)",
    date: "Fall 2022",
    description:
      "Built responsive full-stack course selection platform using React and AWS Lambda for 6k+ students.",
  },
];
