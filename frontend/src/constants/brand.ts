export const BRAND = {
  name: "Remit To Nepal Pvt. Ltd",
  tagline: "Remitting Happiness...",
  logo: "/images/brand-logo.png?v=4",
  red: "#E31E24",
  blue: "#2E3192"
} as const;

export function brandLogoSrc(uploaded?: string) {
  const src = (uploaded || "").trim();
  if (!src) return BRAND.logo;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `/${src}`;
}
