import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Resolve directory that contains \`bin/waterfall.mjs\`.
 * \`WATERFALL_CLI_ROOT\` overrides; default is sibling \`../waterfall-cli\` from the website root.
 */
export function resolveWaterfallCliRoot(websiteRoot: string): string {
  const env = process.env.WATERFALL_CLI_ROOT?.trim();
  if (env) {
    return path.isAbsolute(env) ? env : path.resolve(websiteRoot, env);
  }
  return path.resolve(websiteRoot, "..", "waterfall-cli");
}

/** Run \`node bin/waterfall.mjs help -o json\` and return stdout. */
export function runWaterfallCliHelpJson(websiteRoot: string): string {
  const cliRoot = resolveWaterfallCliRoot(websiteRoot);
  const bin = path.join(cliRoot, "bin", "waterfall.mjs");
  if (!fs.existsSync(bin)) {
    throw new Error(
      `waterfall CLI not found at ${bin}. Clone sibling waterfall-cli or set WATERFALL_CLI_ROOT to its directory.`,
    );
  }
  /** CWD must be the CLI package so \`node --import tsx\` resolves \`tsx\` from \`waterfall-cli/node_modules\`. */
  const r = spawnSync(process.execPath, [bin, "help", "-o", "json"], {
    encoding: "utf8",
    cwd: cliRoot,
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (r.error) {
    throw r.error;
  }
  if (r.status !== 0) {
    throw new Error(
      `waterfall help -o json exited ${r.status}: ${(r.stderr || "").trim() || r.stdout}`,
    );
  }
  const out = (r.stdout ?? "").trim();
  if (!out.startsWith("{")) {
    throw new Error("waterfall help -o json did not return JSON object");
  }
  return `${out}\n`;
}
