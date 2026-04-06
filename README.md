# waterfall-website

Static marketing / product site for Waterfall, built from HTML templates via TypeScript and served locally with nginx in Docker.

## Structure

| URL | Source |
|-----|--------|
| `/` | `src/pages/home.html` |
| `/modules/cli/` | `src/pages/modules-cli.html` |
| `/modules/explorer/` | `src/pages/modules-explorer.html` |
| `/modules/extensions/` | `src/pages/modules-extensions.html` |
| `/reference/cli/` | Intro: `src/pages/reference-cli-intro.html` + **generated** from `waterfall help -o json` |
| `/contribute/` | `src/pages/contribute.html` |

- **Layout:** `src/templates/layout.html` — placeholders `{{TITLE}}`, `{{DESCRIPTION}}`, `{{HEADER}}`, `{{MAIN}}`, `{{FOOTER}}`.
- **Partials:** `src/templates/partials/footer.html` (`{{YEAR}}`).
- **Header + nav:** `src/lib/nav-html.ts`, `src/lib/header-html.ts` (GitHub **Contribute** badge URL: `GITHUB_REPO_URL` in `src/lib/site.ts`, or override at build with env `WATERFALL_GITHUB_URL`).
- **Site map:** `src/lib/site.ts` (`PAGES`, `navTree`).
- **CLI reference HTML:** `src/lib/cli-reference-html.ts`, `src/lib/cli-help-json.ts`, `src/lib/run-cli-help.ts`.
- **Diagrams:** [Mermaid](https://mermaid.js.org/) — add `<pre class="mermaid">…</pre>` with diagram syntax in any `src/pages/*.html`. Build copies `node_modules/mermaid/dist` → `dist-site/assets/mermaid-dist/`; `layout.html` runs `mermaid.run()` after DOM ready. The home workflow diagram uses `mermaid--workflow-cr-edges` plus `data-cr1-edges` / `data-cr2-edges` so the first N / next M edges get blue/amber strokes (Mermaid’s dark theme CSS otherwise overrides `linkStyle`).

### CLI reference build

`npm run build` runs `node ../waterfall-cli/bin/waterfall.mjs help -o json` (with `cwd` set to the **waterfall-cli** package so `tsx` resolves). Outputs:

- `/reference/cli/` page content: global options, **environment variables** (`environment` in JSON), config summary, **`.waterfall` file format** (`dotWaterfall`), spec root resolution, and commands (each with CLI line + example).
- `dist-site/assets/cli-help.json` — same JSON for tooling (`environment`, `cliForm` / `example` per command, etc.).

**Requirements:** sibling checkout `waterfall-cli` with `npm install` done there, or set **`WATERFALL_CLI_ROOT`** to an absolute path to that package.

## Build

```bash
npm install
npm run build
```

Output: `dist-site/` (HTML, `assets/style.css`, `assets/cli-help.json`). Compiled script: `dist/build.js`.

## Preview (no Docker)

```bash
npm run preview
```

Serves `dist-site` at [http://localhost:4173](http://localhost:4173) (one-off `serve` via `npx`).

## Docker (nginx)

Requires a **successful** `npm run build` first (including CLI JSON step if you want the reference page):

```bash
npm run build
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

Or: `npm run docker:build` then `docker run --rm -p 8080:8080 waterfall-website:local`.

## Development

Edit templates under `src/`, re-run `npm run build`, refresh the container or open files from `dist-site/` directly in a browser (relative links like `/assets/style.css` expect a server root).
