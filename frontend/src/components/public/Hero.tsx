import { Link } from "react-router-dom";
import { ArrowRight, Landmark, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { publicCtaLabel } from "@/config/public-labels";
import { HeroNetwork } from "./HeroNetwork";
import type { CmsSection, StatItem } from "@/types/content";

export function Hero({ section, stats = [] }: { section: CmsSection; stats?: StatItem[] }) {
  return (
    <section className="hero-stage">
      <div className="hero-inner">
        <div className="hero-copy-block">
          <p className="hero-kicker inline-flex max-w-full flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.14em] text-gold sm:text-xs sm:tracking-[0.28em]">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {section.subheading || "Licensed. Secure. Nationwide."}
          </p>
          <h1 className="hero-title mt-4 max-w-xl font-display text-[clamp(1.75rem,4.2vw+0.85rem,3.6rem)] leading-[1.1] text-navy">
            {section.heading}
          </h1>
          <p className="hero-copy mt-4 max-w-lg text-sm leading-relaxed text-ink-muted sm:mt-5 sm:text-base lg:text-lg">{section.description}</p>
          <div className="hero-actions hero-copy mt-6 sm:mt-8">
            {section.buttonLabel && section.buttonUrl ? (
              <Link to={section.buttonUrl}>
                <Button variant="gold" size="lg" className="btn-shimmer">
                  {publicCtaLabel(section.buttonUrl, section.buttonLabel)}
                </Button>
              </Link>
            ) : null}
            {section.secondaryButtonLabel && section.secondaryButtonUrl ? (
              <Link to={section.secondaryButtonUrl}>
                <Button variant="secondary" size="lg">
                  {publicCtaLabel(section.secondaryButtonUrl, section.secondaryButtonLabel)} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
          </div>
          <ul className="hero-trust">
            <li>
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Licensed operator
            </li>
            <li>
              <Landmark className="h-4 w-4" aria-hidden />
              NRB-referenced rates
            </li>
            <li>
              <MapPin className="h-4 w-4" aria-hidden />
              Nationwide payout
            </li>
          </ul>
        </div>
        <div className="hero-visual">
          <HeroNetwork />
        </div>
      </div>
      {stats.length > 0 ? (
        <div className="hero-metrics">
          <div className="hero-metrics-inner">
            {stats.map((item) => (
              <div key={item.label} className="hero-metrics-item">
                <p>{item.value}</p>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
