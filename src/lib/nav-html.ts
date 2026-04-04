import type { NavItem } from "./site.js";

function normPath(p: string): string {
  const t = p.replace(/\/$/, "") || "/";
  return t;
}

function pathMatchesCurrent(currentPath: string, href: string): boolean {
  const c = normPath(currentPath);
  const h = normPath(href);
  return c === h || (h !== "/" && c.startsWith(`${h}/`));
}

function renderNavItems(items: NavItem[], currentPath: string): string {
  const parts: string[] = [];
  for (const item of items) {
    let active: boolean;
    if (item.children?.length) {
      active = item.children.some((ch) => pathMatchesCurrent(currentPath, ch.href));
    } else if (item.href === "/") {
      active = normPath(currentPath) === "/";
    } else {
      active = pathMatchesCurrent(currentPath, item.href);
    }
    const cls = active ? ' class="nav__link nav__link--active"' : ' class="nav__link"';
    if (item.children?.length) {
      parts.push(`<li class="nav__item nav__item--has-sub"><a href="${item.href}"${cls}>${item.label}</a>`);
      parts.push('<ul class="nav__sub">');
      for (const ch of item.children) {
        const subActive = pathMatchesCurrent(currentPath, ch.href);
        const subCls = subActive ? ' class="nav__link nav__link--active"' : ' class="nav__link"';
        parts.push(`<li><a href="${ch.href}"${subCls}>${ch.label}</a></li>`);
      }
      parts.push("</ul></li>");
    } else {
      parts.push(`<li class="nav__item"><a href="${item.href}"${cls}>${item.label}</a></li>`);
    }
  }
  return parts.join("\n");
}

/** `currentPath` like `/modules/cli/` or `/` */
export function buildHeaderNav(nav: NavItem[], currentPath: string): string {
  const items = renderNavItems(nav, currentPath);
  return `<nav class="nav" aria-label="Primary">
  <ul class="nav__list">
    ${items}
  </ul>
</nav>`;
}
