export const PUBLIC_NAV = {
  becomeAgent: { label: "Become a Agent", path: "/partners" },
  ourAgent: { label: "Our Agent", path: "/branches" }
} as const;

export function publicNavLabel(path: string, fallback: string) {
  if (path === "/branches" || path.startsWith("/branches/")) return PUBLIC_NAV.ourAgent.label;
  if (path === "/partners" || path.startsWith("/partners")) return PUBLIC_NAV.becomeAgent.label;
  return fallback;
}

export function publicCtaLabel(url: string | undefined, label: string | undefined) {
  if (url === "/branches") return PUBLIC_NAV.ourAgent.label;
  if (url === "/partners") return PUBLIC_NAV.becomeAgent.label;
  return label;
}
