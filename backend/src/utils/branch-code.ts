import { toSlug } from "./slug.js";

export function makeAgentCode(name: string, district: string, attempt = 0): string {
  const base = toSlug(`${district}-${name}`).replace(/-/g, "").toUpperCase().slice(0, 12) || "AGENT";
  const suffix = attempt > 0 ? String(attempt) : "";
  return `AGT-${base}${suffix}`.slice(0, 24);
}
