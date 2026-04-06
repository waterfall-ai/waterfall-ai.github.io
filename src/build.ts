import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { navTree, PAGES, type PageDef } from "./lib/site.js";
import { renderTemplate } from "./lib/render.js";
import { buildHeaderNav } from "./lib/nav-html.js";
import { buildSiteHeader } from "./lib/header-html.js";
import { parseCliHelpJson } from "./lib/cli-help-json.js";
import { buildCliReferenceArticle } from "./lib/cli-reference-html.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Project root (parent of `src/` when running from compiled `dist/build.js`). */
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "src");
const outDir = path.join(root, "dist-site");
const templatesDir = path.join(srcDir, "templates");

function readUtf8(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function writeUtf8(filePath: string, body: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body, "utf8");
}

/** Canonical URL path for nav active state, always with trailing slash except root. */
function pageUrlPath(segments: string[]): string {
  if (segments.length === 0) return "/";
  return `/${segments.join("/")}/`;
}

function readPageBody(page: PageDef, pagesDir: string): string {
  if (!page.bodyFile) {
    throw new Error(`Page ${page.segments.join("/")} needs bodyFile or cliReferenceIntroFile`);
  }
  return readUtf8(path.join(pagesDir, page.bodyFile));
}

function main(): void {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.copyFileSync(
    path.join(srcDir, "assets", "style.css"),
    path.join(outDir, "assets", "style.css"),
  );
  fs.copyFileSync(
    path.join(srcDir, "assets", "logo-waterfall.svg"),
    path.join(outDir, "assets", "logo-waterfall.svg"),
  );
  fs.copyFileSync(
    path.join(srcDir, "assets", "cli-help.json"),
    path.join(outDir, "assets", "cli-help.json"),
  );
  const integrationsSrc = path.join(srcDir, "assets", "integrations");
  if (fs.existsSync(integrationsSrc)) {
    fs.cpSync(integrationsSrc, path.join(outDir, "assets", "integrations"), {
      recursive: true,
    });
  }

  const mermaidDistSrc = path.join(root, "node_modules", "mermaid", "dist");
  const mermaidDistDest = path.join(outDir, "assets", "mermaid-dist");
  if (fs.existsSync(mermaidDistSrc)) {
    fs.cpSync(mermaidDistSrc, mermaidDistDest, { recursive: true });
  } else {
    process.stderr.write(
      "warning: mermaid not installed (npm install); diagrams will not load\n",
    );
  }

  const layout = readUtf8(path.join(templatesDir, "layout.html"));
  const footerTpl = readUtf8(path.join(templatesDir, "partials", "footer.html"));
  const styleVersion = String(
    Math.floor(fs.statSync(path.join(srcDir, "assets", "style.css")).mtimeMs),
  );
  const nav = navTree();
  const pagesDir = path.join(srcDir, "pages");

  const cliHelpJsonRaw = readUtf8(path.join(srcDir, "assets", "cli-help.json"));

  for (const page of PAGES) {
    const urlPath = pageUrlPath(page.segments);
    const navHtml = buildHeaderNav(nav, urlPath);
    const header = buildSiteHeader(navHtml);

    let mainHtml: string;
    let refMeta: { title: string; description: string } | null = null;
    if (page.cliReferenceIntroFile) {
      const data = parseCliHelpJson(cliHelpJsonRaw);
      const intro = readUtf8(path.join(pagesDir, page.cliReferenceIntroFile));
      mainHtml = buildCliReferenceArticle(intro, data);
      refMeta = {
        title: `CLI reference — ${data.name}`,
        description: page.description,
      };
    } else {
      mainHtml = readPageBody(page, pagesDir);
    }

    const pageTitle = refMeta?.title ?? page.title;
    const pageDesc = refMeta?.description ?? page.description;

    const footer = renderTemplate(footerTpl, {
      YEAR: String(new Date().getFullYear()),
    });

    const html = renderTemplate(layout, {
      TITLE: pageTitle,
      DESCRIPTION: pageDesc,
      HEADER: header,
      MAIN: mainHtml,
      FOOTER: footer,
      STYLE_VERSION: styleVersion,
    });

    const dest =
      page.segments.length === 0
        ? path.join(outDir, "index.html")
        : path.join(outDir, ...page.segments, "index.html");
    writeUtf8(dest, html);
  }

  process.stdout.write(`Built ${PAGES.length} pages → ${outDir}\n`);
}

main();
