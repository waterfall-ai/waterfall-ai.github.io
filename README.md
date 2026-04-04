# waterfall-website

Static marketing / product site for Waterfall, built from HTML templates via TypeScript and served locally with nginx in Docker.

## Structure

| URL | Source body |
|-----|-------------|
| `/` | `src/pages/home.html` |
| `/modules/cli/` | `src/pages/modules-cli.html` |
| `/modules/explorer/` | `src/pages/modules-explorer.html` |
| `/modules/extensions/` | `src/pages/modules-extensions.html` |
| `/reference/cli/` | `src/pages/reference-cli.html` |
| `/contribute/` | `src/pages/contribute.html` |

- **Layout:** `src/templates/layout.html` — placeholders `{{TITLE}}`, `{{DESCRIPTION}}`, `{{HEADER}}`, `{{MAIN}}`, `{{FOOTER}}`.
- **Partials:** `src/templates/partials/footer.html` (`{{YEAR}}`).
- **Header + nav:** generated in TypeScript (`src/lib/nav-html.ts`, `src/lib/header-html.ts`).
- **Site map & copy metadata:** `src/lib/site.ts` (`PAGES`, `navTree`).

## Build

```bash
npm install
npm run build
```

Output: `dist-site/` (HTML + `assets/style.css`). Compiled build script: `dist/build.js`.

## Docker (nginx)

Requires a fresh build so `dist-site` exists:

```bash
npm run build
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

Or: `npm run docker:build` then `docker run --rm -p 8080:8080 waterfall-website:local`.

## Development

Edit templates under `src/`, re-run `npm run build`, refresh the container or open files from `dist-site/` directly in a browser (relative links like `/assets/style.css` expect a server root).
