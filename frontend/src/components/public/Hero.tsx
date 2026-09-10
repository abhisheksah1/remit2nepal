import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { AboutGlobe } from "./AboutGlobe";
import type { CmsSection, StatItem } from "@/types/content";
import { cn, mediaUrl } from "@/utils/cn";
import { heroChips, heroTitleParts } from "@/utils/hero";

const TRUST = ["Cash pickup", "Bank deposit", "Wallet credit", "Nationwide payout"];

function HeroCta({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  const href = to.trim() || "/";
  if (href.startsWith("#") || /^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={className}
        {...(/^https?:\/\//i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export function Hero({ section, stats = [] }: { section: CmsSection; stats?: StatItem[] }) {
  const stage = useRef<HTMLElement>(null);
  const badge = section.subheading?.trim();
  const titleParts = heroTitleParts(section.heading || "");
  const lede = section.description?.trim();
  const rawPrimary = section.buttonLabel?.trim();
  const primaryLabel = !rawPrimary || /send money/i.test(rawPrimary) ? "Track" : rawPrimary;
  const primaryUrl = /track/i.test(primaryLabel) ? "/track" : section.buttonUrl?.trim() || "/track";
  const secondaryLabel = section.secondaryButtonLabel?.trim();
  const secondaryUrl = section.secondaryButtonUrl?.trim() || "#how-it-works";
  const chips = heroChips(section.items);
  const trust = chips.length ? chips : TRUST;
  const photo = section.backgroundUrl?.trim();

  useEffect(() => {
    const node = stage.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    function onScroll() {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const leave = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.45, 1)));
      node.style.setProperty("--hero-leave", String(leave));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={stage}
      className={cn("hero-stage", photo && "has-photo")}
      aria-labelledby="hero-title"
    >
      <div className="hero-atm" aria-hidden>
        <span className="hero-atm-glow is-blue" />
        <span className="hero-atm-glow is-red" />
        <span className="hero-atm-grid" />
        {photo ? (
          <div
            className={cn("hero-photo", section.overlay === false && "is-clear")}
            style={{ backgroundImage: `url(${mediaUrl(photo)})` }}
          />
        ) : (
          <div className="hero-mountains" />
        )}
      </div>

      <div className="hero-inner">
        <div className="hero-copy-block">
          {badge ? (
            <p className="hero-badge">
              <span className="hero-badge-dot" />
              {badge}
            </p>
          ) : null}
          <h1 id="hero-title" className="hero-title">
            {titleParts.map((part, index) => (
              <span key={`${part.tone}-${index}`} className={part.tone}>
                {part.text}
              </span>
            ))}
          </h1>
          {lede ? <p className="hero-lede">{lede}</p> : null}
          {primaryLabel || secondaryLabel ? (
            <div className="hero-actions">
              {primaryLabel ? (
                <HeroCta to={primaryUrl} className="hero-cta is-primary">
                  {primaryLabel} <ArrowRight />
                </HeroCta>
              ) : null}
              {secondaryLabel ? (
                <HeroCta to={secondaryUrl} className="hero-cta is-ghost">
                  {secondaryLabel} <ArrowRight />
                </HeroCta>
              ) : null}
            </div>
          ) : null}
          {trust.length ? (
            <ul className="hero-trust">
              {trust.map((item) => (
                <li key={item}>
                  <Check aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hero-visual">
          <AboutGlobe stats={stats} />
        </div>
      </div>
    </section>
  );
}
