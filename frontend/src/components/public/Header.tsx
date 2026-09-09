import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CompanySettings, NavItem } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { RateTicker } from "./RateTicker";
import { cn } from "@/utils/cn";

export function Header({
  settings,
  items
}: {
  settings: CompanySettings | null;
  items: NavItem[];
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = items.filter((item) => item.location === "HEADER" && item.enabled);
  const cta = settings?.headerCta;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-500", scrolled ? "py-2" : "py-0")}>
      <div className="vault-rail">
        <div className="mx-auto flex max-w-site items-center gap-4 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-cream/80 sm:text-xs">
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

      <div className="px-3 sm:px-4">
        <div
          className={cn(
            "nav-shell mx-auto flex max-w-site items-center justify-between gap-4 px-3 transition-all duration-500 sm:px-5",
            scrolled ? "nav-shell-compact" : "py-3"
          )}
        >
          <Link to="/" className="group flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="" className="h-10 w-auto" />
            ) : (
              <span className="logo-seal" aria-hidden>
                <span>R2</span>
              </span>
            )}
            <span className="flex flex-col">
              <span className="font-display text-xl leading-none text-navy sm:text-2xl">
                {settings?.companyName || "Remit2Nepal"}
              </span>
              <span className="mt-1 hidden text-[10px] uppercase tracking-[0.28em] text-gold sm:block">
                {settings?.tagline || "Secure remittance"}
              </span>
            </span>
          </Link>

          <nav className="relative hidden items-center lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item._id}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => cn("nav-link", isActive && "is-active")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {cta?.enabled && cta.url ? (
              <Link to={cta.url} className="hidden sm:inline-flex">
                <Button size="sm" variant="gold" className="btn-shimmer">
                  {cta.label || "Send Enquiry"}
                </Button>
              </Link>
            ) : null}
            <button
              type="button"
              className="rounded-full border border-navy/15 p-2 lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn("mobile-drawer lg:hidden", open && "is-open")}>
        <nav className="mobile-drawer-panel" aria-label="Mobile">
          {nav.map((item, index) => (
            <NavLink
              key={item._id}
              to={item.path}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${80 + index * 50}ms` }}
              className="mobile-link"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
