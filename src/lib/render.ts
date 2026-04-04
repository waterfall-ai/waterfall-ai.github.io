/**
 * Minimal `{{key}}` template replacement. Values are HTML fragments (trusted, from our repo only).
 */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    const token = `{{${key}}}`;
    if (!out.includes(token)) continue;
    out = out.split(token).join(value);
  }
  return out;
}
