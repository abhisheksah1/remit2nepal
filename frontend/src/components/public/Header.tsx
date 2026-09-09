import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CompanySettings, NavItem } from "@/types/content";
import { ABOUT_NAV, isAboutPath } from "@/config/about-nav";
import { PUBLIC_NAV, publicNavLabel } from "@/config/public-labels";
import { BRAND } from "@/constants/brand";
import { RateTicker } from "./RateTicker";
import { cn } from "@/utils/cn";

const PINNED_NAV = [
  { label: "About", path: "/about" },
  { label: PUBLIC_NAV.becomeAgent.label, path: PUBLIC_NAV.becomeAgent.path },
  { label: "Contact", path: "/contact" }
] as const;

const PINNED_PATHS = new Set<string>(PINNED_NAV.map((item) => item.path));

export function Header({
  settings,
  items
}: {
  settings: CompanySettings | null;
  items: NavItem[];
}) {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = items.filter((item) => item.location === "HEADER" && item.enabled && item.path !== "/");
  const drawerNav = nav.filter((item) => !PINNED_PATHS.has(item.path));
  const company = settings?.companyName || BRAND.name;
  const logoSrc = settings?.logoUrl || BRAND.logo;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const apply = () => {
      document.documentElement.style.setProperty("--site-header-height", `${Math.round(node.getBoundingClientRect().height)}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <>
    <header ref={headerRef} className={cn("site-header", scrolled && "is-stuck")}>
      <div className="vault-rail">
        <div className="mx-auto flex max-w-site items-center gap-3 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cream/80 sm:gap-4 sm:tracking-[0.2em] lg:px-8 sm:text-xs">
          <span className="hidden items-center gap-1.5 text-gold md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Licensed desk
          </span>
          <div className="min-w-0 flex-1">
            <RateTicker />
          </div>
          {settings?.phone ? (
            <a href={`tel:${settings.phone}`} className="hidden shrink-0 items-center gap-1.5 hover:text-gold sm:inline-flex">
              <Phone className="h-3.5 w-3.5" />
              {settings.phone}
            </a>
          ) : null}
        </div>
      </div>

      <div className="nav-bar px-3 sm:px-4 lg:px-8">
        <div
          className={cn(
            "nav-shell mx-auto grid w-full grid-cols-[1fr_auto] items-center gap-2 px-2 transition-all duration-500 sm:px-3",
            scrolled ? "nav-shell-compact" : "py-2"
          )}
        >
          <Link to="/" className="shrink-0 justify-self-start" aria-label={`${company} home`}>
            <img src={logoSrc} alt={company} className="site-logo" />
          </Link>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-1 justify-self-end sm:gap-2">
            <nav className="flex min-w-0 items-center" aria-label="Primary">
              {PINNED_NAV.map((item) =>
                item.path === "/about" ? (
                  <div key={item.path} className="nav-flyout nav-flyout-end">
                    <NavLink
                      to="/about"
                      className={() => cn("nav-link nav-link-pin", isAboutPath(location.pathname) && "is-active")}
                    >
                      {item.label}
                      <ChevronDown className="nav-flyout-caret hidden sm:block" aria-hidden />
                    </NavLink>
                    <div className="nav-flyout-menu" role="menu">
                      {ABOUT_NAV.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          role="menuitem"
                          end={link.path === "/about"}
                          className={({ isActive }) => cn("nav-flyout-link", isActive && "is-active")}
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn("nav-link nav-link-pin", isActive && "is-active")}
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>
            <button
              type="button"
              className={cn("menu-toggle", open && "is-open")}
              aria-expanded={open}
              aria-controls="site-navigation"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    <div
      id="site-navigation"
      className={cn("nav-drawer", open && "is-open")}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="Site menu"
    >
      <button type="button" className="nav-drawer-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
      <nav className="nav-drawer-panel" aria-label="More pages">
        <p className="nav-drawer-head">Menu</p>
        <div className="nav-drawer-links">
          {drawerNav.map((item, index) => (
            <NavLink
              key={item._id}
              to={item.path}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${80 + index * 45}ms` }}
              className={({ isActive }) => cn("mobile-link", isActive && "is-active")}
            >
              {publicNavLabel(item.path, item.label)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
    <div className="site-header-spacer" aria-hidden />
    </>
  );
}
