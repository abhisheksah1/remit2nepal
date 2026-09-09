export const PERMISSIONS = [
  "dashboard",
  "website_cms",
  "about",
  "services",
  "branches",
  "exchange_rates",
  "nrb_integration",
  "news",
  "faq",
  "gallery",
  "partners",
  "contact",
  "media",
  "seo",
  "settings",
  "audit_logs",
  "admins",
  "documents"
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  dashboard: "Dashboard",
  website_cms: "Website CMS",
  about: "About",
  services: "Services",
  branches: "Branches",
  exchange_rates: "Exchange Rates",
  nrb_integration: "NRB Integration",
  news: "News",
  faq: "FAQ",
  gallery: "Gallery",
  partners: "Partners",
  contact: "Contact",
  media: "Media",
  seo: "SEO",
  settings: "Settings",
  audit_logs: "Audit Logs",
  admins: "Administrators",
  documents: "Documents"
};
