/** One static page: URL path (no leading slash) → output file under dist-site. */
export type PageDef = {
  /** URL path segments, e.g. [] → `/`, `['modules','cli']` → `/modules/cli/` */
  segments: string[];
  title: string;
  description: string;
  /** Body fragment filename under `src/pages/` */
  bodyFile: string;
};

export const SITE_NAME = "Waterfall";

export const PAGES: PageDef[] = [
  {
    segments: [],
    title: "Waterfall — agentic requirements engineering",
    description:
      "Shape change requests into requirements, use cases, and stories—with AI assistance and a spec your whole team can trust.",
    bodyFile: "home.html",
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
    description: "Commands, configuration, and how the CLI resolves your spec root.",
    bodyFile: "reference-cli.html",
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
