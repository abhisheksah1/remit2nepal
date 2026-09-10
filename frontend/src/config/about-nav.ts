export const ABOUT_NAV = [
  { label: "About Us", path: "/about" },
  { label: "Board of Directors", path: "/about/board" },
  { label: "Our Team", path: "/about/team" },
  { label: "Compliance", path: "/about/compliance" }
] as const;

export const ABOUT_DROPDOWN = ABOUT_NAV.filter((link) => link.path !== "/about/compliance");

export function isAboutPath(path: string): boolean {
  return path === "/about" || path.startsWith("/about/");
}

export function isAboutNavItem(item: { path: string; label: string }): boolean {
  return item.path === "/about" || /about us/i.test(item.label);
}
