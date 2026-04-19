/** One static page: URL path (no leading slash) → output file under dist-site. */
export type PageDef = {
  /** URL path segments, e.g. [] → `/`, `['modules','cli']` → `/modules/cli/` */
  segments: string[];
  title: string;
  description: string;
  /** Body fragment filename under `src/pages/` (omit when using \`cliReferenceIntroFile\`). */
  bodyFile?: string;
  /**
   * Intro HTML only; main body is generated from \`waterfall help -o json\` at build time
   * (requires sibling \`waterfall-cli\` or \`WATERFALL_CLI_ROOT\`).
   */
  cliReferenceIntroFile?: string;
};

export const SITE_NAME = "Waterfall";

const envGithubUrl =
  typeof process !== "undefined" ? process.env.WATERFALL_GITHUB_URL?.trim() ?? "" : "";

/**
 * Public repository URL for the header contribute badge.
 * Set `WATERFALL_GITHUB_URL` when running `npm run build`, or change the fallback below.
 */
export const GITHUB_REPO_URL = envGithubUrl || "https://github.com/waterfall-spec/waterfall";

export const PAGES: PageDef[] = [
  {
    segments: [],
    title: "Waterfall — agentic requirements engineering",
    description:
      "Shape change requests into requirements, use cases, and stories—with AI assistance and a spec your whole team can trust.",
    bodyFile: "home.html",
  },
  {
    segments: ["items", "repository-structure"],
    title: "Concept: Repository structure — Waterfall",
    description:
      "Typical waterfall-spec directory layout: changerequests, requirements, technical, tests, and supporting files.",
    bodyFile: "items-repository-structure.html",
  },
  {
    segments: ["items", "branching"],
    title: "Concept: Branching & change-request flow — Waterfall",
    description:
      "develop vs feature/CR-* branches, CR lifecycle phases, waterfall CLI commands per phase, and manual artifact edits.",
    bodyFile: "items-branching.html",
  },
  {
    segments: ["items", "cr"],
    title: "Concept: Change request (CR) — Waterfall",
    description: "Change requests in a waterfall-spec tree: ids, changerequests/ layout, and CLI entry points.",
    bodyFile: "items-cr.html",
  },
  {
    segments: ["items", "rq"],
    title: "Concept: Requirement theme (RQ) — Waterfall",
    description: "Requirement themes: RQ ids, requirements/ layout, and how they hold use cases.",
    bodyFile: "items-rq.html",
  },
  {
    segments: ["items", "uc"],
    title: "Concept: Use case (UC) — Waterfall",
    description: "Use cases under RQ themes: behavior, traceability to stories and tests.",
    bodyFile: "items-uc.html",
  },
  {
    segments: ["items", "sys"],
    title: "Concept: Technical subsystem (SYS) — Waterfall",
    description: "Technical subsystems: SYS ids, technical/ layout, home for stories and bugs.",
    bodyFile: "items-sys.html",
  },
  {
    segments: ["items", "story"],
    title: "Concept: Story (STORY) — Waterfall",
    description: "Stories as implementable slices with UC traceability and horizontal alignment.",
    bodyFile: "items-story.html",
  },
  {
    segments: ["items", "bug"],
    title: "Concept: Bug (BUG) — Waterfall",
    description: "Bug artifacts alongside stories under technical subsystems.",
    bodyFile: "items-bug.html",
  },
  {
    segments: ["items", "tst"],
    title: "Concept: Acceptance test (TST) — Waterfall",
    description: "Test specifications in tests/: ids, role, and CLI edges to UC and story.",
    bodyFile: "items-tst.html",
  },
  {
    segments: ["items", "hor"],
    title: "Concept: Horizontal (HOR) — Waterfall",
    description: "Horizontals: cross-cutting data, API, and stack models under horizontals/.",
    bodyFile: "items-hor.html",
  },
  {
    segments: ["modules", "cli"],
    title: "Module: CLI — Waterfall",
    description: "Command-line workflows for waterfall-spec: lifecycle, horizontals, and agent-backed prompts.",
    bodyFile: "modules-cli.html",
  },
  {
    segments: ["modules", "explorer"],
    title: "Module: Explorer — Waterfall",
    description: "Browse and navigate your specification repository from the product UI.",
    bodyFile: "modules-explorer.html",
  },
  {
    segments: ["modules", "extensions"],
    title: "Module: Extensions — Waterfall",
    description: "Pluggable identity, Git remotes, and future integrations.",
    bodyFile: "modules-extensions.html",
  },
  {
    segments: ["reference", "cli"],
    title: "CLI reference — Waterfall",
    description:
      "Prerelease: commands, global options, environment variables, .waterfall keys, and spec resolution generated from waterfall help -o json at site build time.",
    cliReferenceIntroFile: "reference-cli-intro.html",
  },
  {
    segments: ["contribute"],
    title: "Contribute — Waterfall",
    description: "How to help improve Waterfall tooling and documentation.",
    bodyFile: "contribute.html",
  },
];

/** For header nav: href and label */
export type NavItem = { href: string; label: string; children?: NavItem[] };

export function navTree(): NavItem[] {
  return [
    { href: "/", label: "Home" },
    {
      href: "/items/repository-structure/",
      label: "Concepts",
      children: [
        { href: "/items/repository-structure/", label: "Repository structure" },
        { href: "/items/branching/", label: "Branching & CR flow" },
        { href: "/items/cr/", label: "Change request (CR)" },
        { href: "/items/rq/", label: "Requirement (RQ)" },
        { href: "/items/uc/", label: "Use case (UC)" },
        { href: "/items/sys/", label: "Subsystem (SYS)" },
        { href: "/items/story/", label: "Story (STORY)" },
        { href: "/items/bug/", label: "Bug (BUG)" },
        { href: "/items/tst/", label: "Test (TST)" },
        { href: "/items/hor/", label: "Horizontal (HOR)" },
      ],
    },
    {
      href: "/modules/cli/",
      label: "Modules",
      children: [
        { href: "/modules/cli/", label: "CLI" },
        { href: "/modules/explorer/", label: "Explorer" },
        { href: "/modules/extensions/", label: "Extensions" },
      ],
    },
    {
      href: "/reference/cli/",
      label: "Reference",
      children: [{ href: "/reference/cli/", label: "CLI" }],
    },
    { href: "/contribute/", label: "Contribute" },
  ];
}
