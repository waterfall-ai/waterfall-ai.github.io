import type { CliHelpJson } from "./cli-help-json.js";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape for double-quoted HTML attributes (e.g. \`data-copy\`). */
function escAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/\r?\n/g, " ");
}

function fullWaterfallCommand(cliForm: string): string {
  const t = cliForm.trim();
  return t ? `waterfall ${t}` : "waterfall";
}

function rowTd(cells: string[]): string {
  return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
}

function rowTh(cells: string[]): string {
  return `<tr>${cells.map((c) => `<th scope="col">${c}</th>`).join("")}</tr>`;
}

function renderGlobalOptions(j: CliHelpJson): string {
  const head = rowTh([
    "Option",
    "Type",
    "Description",
    "Default / env / config",
  ]);
  const body = j.globalOptions
    .map((o) => {
      const flags = [`<code>--${esc(o.long)}</code>`];
      if (o.short) flags.push(`<code>-${esc(o.short)}</code>`);
      if (o.metavar) flags[0] += ` ${esc(o.metavar)}`;
      let type = esc(o.type);
      if (o.enumValues?.length) {
        type += `: ${o.enumValues.map((e) => `<code>${esc(e)}</code>`).join(", ")}`;
      }
      const meta: string[] = [];
      if (o.default) meta.push(`default <code>${esc(o.default)}</code>`);
      if (o.env) meta.push(`env <code>${esc(o.env)}</code>`);
      if (o.dotWaterfallKey)
        meta.push(`.waterfall <code>${esc(o.dotWaterfallKey)}</code>`);
      return rowTd([flags.join(" "), type, esc(o.description), meta.join("<br/>") || "—"]);
    })
    .join("\n");
  return `<h2 id="global-options">Global options</h2>
<div class="cli-ref__table-wrap">
<table class="cli-ref__table">
<thead>${head}</thead>
<tbody>${body}</tbody>
</table>
</div>`;
}

function renderEnvironment(e: CliHelpJson["environment"]): string {
  const rows: string[] = [];
  const proseNotes: string[] = [];

  for (const cat of e.categories) {
    if (cat.variables.length === 0) {
      if (cat.description) {
        proseNotes.push(
          `<p class="cli-ref__env-cat-desc"><strong>${esc(cat.title)}.</strong> ${esc(cat.description)}</p>`,
        );
      }
      continue;
    }
    let first = true;
    for (const v of cat.variables) {
      const meta: string[] = [];
      if (v.cliFlag) meta.push(`<code>${esc(v.cliFlag)}</code>`);
      if (v.dotWaterfallKey)
        meta.push(`.waterfall <code>${esc(v.dotWaterfallKey)}</code>`);
      if (v.valueDescription) meta.push(esc(v.valueDescription));
      let desc = esc(v.description);
      if (first && cat.description) {
        desc = `${esc(cat.description)}<br/><br/>${desc}`;
        first = false;
      } else {
        first = false;
      }
      rows.push(
        rowTd([
          esc(cat.title),
          `<code>${esc(v.name)}</code>`,
          desc,
          meta.join("<br/>") || "—",
        ]),
      );
    }
  }

  const head = rowTh([
    "Group",
    "Variable",
    "Description",
    "Flag / .waterfall / values",
  ]);
  const table =
    rows.length > 0
      ? `<div class="cli-ref__table-wrap">
<table class="cli-ref__table">
<thead>${head}</thead>
<tbody>${rows.join("\n")}</tbody>
</table>
</div>`
      : "";

  return `<h2 id="environment-variables">Environment variables</h2>
<p>${esc(e.description)}</p>
<p><strong>Precedence:</strong> ${esc(e.precedenceNote)}</p>
${table}
${proseNotes.join("\n")}`;
}

function renderConfig(j: CliHelpJson): string {
  const notes = j.config.notes.map((n) => `<li>${esc(n)}</li>`).join("");
  return `<h2 id="config">Configuration files</h2>
<p><strong>Files:</strong> ${j.config.files.map((f) => `<code>${esc(f)}</code>`).join(", ")}</p>
<p><strong>Precedence:</strong> ${esc(j.config.precedence)}</p>
<ul class="feature-list">${notes}</ul>`;
}

function renderDotWaterfall(d: CliHelpJson["dotWaterfall"]): string {
  const files = d.files
    .map((f) => `<li><code>${esc(f.path)}</code> — ${esc(f.role)}</li>`)
    .join("");
  const keyRows = d.knownKeys
    .map((k) => {
      const keyList = k.keys.map((x) => `<code>${esc(x)}</code>`).join(", ");
      let type = esc(k.valueType);
      if (k.enumValues?.length) {
        type += `: ${k.enumValues.map((e) => `<code>${esc(e)}</code>`).join(", ")}`;
      }
      const meta: string[] = [];
      if (k.cliFlag) meta.push(`<code>${esc(k.cliFlag)}</code>`);
      if (k.env) meta.push(`env <code>${esc(k.env)}</code>`);
      return rowTd([keyList, type, esc(k.description), meta.join("<br/>") || "—"]);
    })
    .join("\n");
  const bools = d.booleanValues.map((b) => `<code>${esc(b)}</code>`).join(", ");
  const ex = d.environmentPassthrough.examples
    .map((e) => `<li><code>${esc(e)}</code></li>`)
    .join("");
  return `<h3 class="cli-ref__subh" id="dot-waterfall-file"><code>.waterfall</code> file format</h3>
<p>${esc(d.description)}</p>
<p><strong>Syntax:</strong> ${esc(d.syntax.format)} ${esc(d.syntax.quotedValues)}</p>
<p><strong>Merge:</strong> ${esc(d.merge)}</p>
<h4 class="cli-ref__subh">Locations</h4>
<ul class="feature-list">${files}</ul>
<h4 class="cli-ref__subh">Known keys</h4>
<div class="cli-ref__table-wrap">
<table class="cli-ref__table">
<thead>${rowTh(["Keys", "Type", "Description", "Flag / env"])}</thead>
<tbody>${keyRows}</tbody>
</table>
</div>
<p><strong>Boolean values:</strong> ${bools}</p>
<p><strong>Key matching:</strong> ${esc(d.keyMatching)}</p>
<h4 class="cli-ref__subh">Environment passthrough</h4>
<p>${esc(d.environmentPassthrough.rule)}</p>
<p class="cli-ref__mini"><strong>Examples:</strong></p>
<ul class="cli-ref__mini">${ex}</ul>`;
}

function renderSpecResolution(j: CliHelpJson): string {
  const items = j.specResolution
    .map((s, i) => `<li><strong>${i + 1}.</strong> ${esc(s)}</li>`)
    .join("");
  return `<h2 id="spec-resolution">Spec root resolution</h2>
<ol class="cli-ref__olist">${items}</ol>`;
}

function renderCommand(c: CliHelpJson["commands"][0]): string {
  const id = esc(c.id);
  const argv = c.argvPrefix.map((t) => esc(t)).join(" ");
  let sub = "";

  if (c.commandOptions?.length) {
    sub += `<h4 class="cli-ref__subh">Command options</h4><ul class="cli-ref__mini">`;
    for (const o of c.commandOptions) {
      const sh = o.short ? ` / <code>-${esc(o.short)}</code>` : "";
      sub += `<li><code>--${esc(o.long)}</code>${sh} — ${esc(o.description)}</li>`;
    }
    sub += `</ul>`;
  }

  if (c.positionals?.length) {
    sub += `<h4 class="cli-ref__subh">Arguments</h4>
<div class="cli-ref__table-wrap"><table class="cli-ref__table cli-ref__table--compact">
<thead>${rowTh(["Name", "Required", "Description"])}</thead>
<tbody>`;
    for (const p of c.positionals) {
      sub += rowTd([
        `<code>${esc(p.name)}</code>`,
        p.required ? "yes" : "no",
        esc(p.description),
      ]);
    }
    sub += `</tbody></table></div>`;
  }

  if (c.promptFile) {
    sub += `<p class="cli-ref__prompt"><strong>Prompt:</strong> <code>${esc(c.promptFile)}</code></p>`;
  }

  if (c.orchestrationSteps?.length) {
    sub += `<p class="cli-ref__orch"><strong>Orchestration:</strong> ${c.orchestrationSteps.map((s) => `<code>${esc(s)}</code>`).join(" → ")}</p>`;
  }

  const fullCmd = fullWaterfallCommand(c.cliForm);
  const fullCmdAttr = escAttr(fullCmd);
  const example = esc(c.example);
  return `<details class="cli-ref__cmd" id="cmd-${id.replace(/\./g, "-")}">
<summary class="cli-ref__cmd-summary">
<span class="cli-ref__cmd-summary-start">
<code class="cli-ref__cmd-full">${esc(fullCmd)}</code>
<button type="button" class="cli-ref__copy-btn" data-copy="${fullCmdAttr}" data-label="Copy" aria-label="Copy full command to clipboard">Copy</button>
</span>
<span class="cli-ref__cmd-id">${id}</span>
</summary>
<p class="cli-ref__summary">${esc(c.summary)}</p>
<p class="cli-ref__example"><strong>Example:</strong> <code>${example}</code></p>
<p class="cli-ref__branch"><strong>Branch:</strong> ${esc(c.branchRequirement)}</p>
<p class="cli-ref__versions"><strong>Since</strong> <code>${esc(c.sinceVersion)}</code> · <strong>Help last changed</strong> <code>${esc(c.lastChangedVersion)}</code></p>
<p class="cli-ref__meta"><span class="cli-ref__kind">${esc(c.kind)}</span> · spec root: <strong>${c.requiresSpecRoot ? "required" : "not required"}</strong>${argv ? ` · argv prefix: <code>${argv}</code>` : ""}</p>
${sub}
</details>`;
}

function renderCommands(j: CliHelpJson): string {
  const byGroup = new Map<string, CliHelpJson["commands"]>();
  for (const g of j.commandGroups) {
    byGroup.set(g.id, []);
  }
  for (const c of j.commands) {
    const list = byGroup.get(c.group);
    if (list) list.push(c);
    else {
      const fallback: CliHelpJson["commands"] = byGroup.get("__ungrouped") ?? [];
      if (!byGroup.has("__ungrouped")) byGroup.set("__ungrouped", fallback);
      fallback.push(c);
    }
  }
  const sortById = (a: (typeof j.commands)[0], b: (typeof j.commands)[0]) =>
    a.id.localeCompare(b.id);
  const sections: string[] = [];
  for (const g of j.commandGroups) {
    const cmds = (byGroup.get(g.id) ?? []).slice().sort(sortById);
    if (cmds.length === 0) continue;
    const desc = g.description
      ? `<p class="cli-ref__group-desc">${esc(g.description)}</p>`
      : "";
    sections.push(`<section class="cli-ref__cmd-group" aria-labelledby="cmd-group-${esc(g.id)}">
<h3 class="cli-ref__group-title" id="cmd-group-${esc(g.id)}">${esc(g.title)}</h3>
${desc}
<div class="cli-ref__commands">${cmds.map(renderCommand).join("\n")}</div>
</section>`);
  }
  const ung = byGroup.get("__ungrouped");
  if (ung && ung.length > 0) {
    sections.push(`<section class="cli-ref__cmd-group">
<h3 class="cli-ref__group-title">Other</h3>
<div class="cli-ref__commands">${ung.slice().sort(sortById).map(renderCommand).join("\n")}</div>
</section>`);
  }
  return `<h2 id="commands">Commands</h2>
<p class="cli-ref__cmd-lead">${j.commands.length} commands in ${j.commandGroups.length} groups (expand each row).</p>
${sections.join("\n")}`;
}

/**
 * Full <article> main content: intro HTML fragment + generated reference from CLI JSON.
 */
export function buildCliReferenceArticle(introHtml: string, j: CliHelpJson): string {
  const title = esc(j.title);
  return `<article class="page cli-ref">
  <header class="page__header">
    <p class="eyebrow">Reference</p>
    <h1>CLI reference</h1>
    <p class="lead">${title}</p>
  </header>
  ${introHtml}
  <section class="section cli-ref__generated">
    ${renderCommands(j)}
  </section>
  <section class="section cli-ref__generated">
    ${renderGlobalOptions(j)}
    ${renderEnvironment(j.environment)}
  </section>
  <section class="section section--muted cli-ref__generated">
    ${renderConfig(j)}
    ${renderDotWaterfall(j.dotWaterfall)}
    ${renderSpecResolution(j)}
  </section>
  <script>
(function () {
  document.querySelector(".cli-ref")?.addEventListener("click", function (ev) {
    var btn = ev.target && ev.target.closest && ev.target.closest(".cli-ref__copy-btn");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    if (!text) return;
    ev.preventDefault();
    ev.stopPropagation();
    function done() {
      var o = btn.getAttribute("data-label") || "Copy";
      btn.textContent = "Copied";
      setTimeout(function () {
        btn.textContent = o;
      }, 1500);
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (e) {
        return false;
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        if (fallback()) done();
      });
    } else if (fallback()) {
      done();
    }
  });
})();
  </script>
</article>`;
}
