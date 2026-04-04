import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { navTree, PAGES } from "./lib/site.js";
import { renderTemplate } from "./lib/render.js";
import { buildHeaderNav } from "./lib/nav-html.js";
import { buildSiteHeader } from "./lib/header-html.js";

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

function main(): void {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.copyFileSync(
    path.join(srcDir, "assets", "style.css"),
    path.join(outDir, "assets", "style.css"),
  );

  const layout = readUtf8(path.join(templatesDir, "layout.html"));
  const footerTpl = readUtf8(path.join(templatesDir, "partials", "footer.html"));
  const nav = navTree();

  for (const page of PAGES) {
    const urlPath = pageUrlPath(page.segments);
    const navHtml = buildHeaderNav(nav, urlPath);
    const header = buildSiteHeader(navHtml);
    const mainHtml = readUtf8(path.join(srcDir, "pages", page.bodyFile));
    const footer = renderTemplate(footerTpl, {
      YEAR: String(new Date().getFullYear()),
    });

    const html = renderTemplate(layout, {
      TITLE: page.title,
      DESCRIPTION: page.description,
      HEADER: header,
      MAIN: mainHtml,
      FOOTER: footer,
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
