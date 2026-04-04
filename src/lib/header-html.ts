import { SITE_NAME } from "./site.js";

export function buildSiteHeader(navHtml: string): string {
  return `<header class="site-header">
  <div class="site-header__inner">
    <a class="logo" href="/">${SITE_NAME}</a>
    ${navHtml}
  </div>
</header>`;
}
