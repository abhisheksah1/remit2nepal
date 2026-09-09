import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_VISUALS } from "@/constants/visuals";
import type { CmsSection, StatItem } from "@/types/content";

export function Hero({ section }: { section: CmsSection }) {
  const stats = Array.isArray(section.items) ? (section.items as StatItem[]) : [];

  return (
    <section className="hero-stage relative overflow-hidden">
      <div className="hero-mesh opacity-50" />
      <svg className="hero-corridors" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden>
        <path className="corridor-path delay-0" d="M40 220 C 280 80, 520 280, 880 140 S 1120 80, 1180 120" fill="none" stroke="#C4A35A" strokeOpacity="0.45" />
        <path className="corridor-path delay-1" d="M20 480 C 300 360, 560 560, 920 420 S 1140 340, 1200 360" fill="none" stroke="#C4A35A" strokeOpacity="0.25" />
      </svg>
      <div className="relative mx-auto grid max-w-site items-center gap-10 px-4 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
        <div>
          <p className="hero-kicker inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-gold">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {section.subheading || "Licensed. Secure. Nationwide."}
          </p>
          <h1 className="hero-title mt-4 max-w-xl font-display text-4xl leading-tight text-navy sm:text-6xl">
            {section.heading}
          </h1>
          <p className="hero-copy mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">{section.description}</p>
          <div className="hero-copy mt-8 flex flex-wrap gap-3">
            {section.buttonLabel && section.buttonUrl ? (
              <Link to={section.buttonUrl}>
                <Button variant="gold" size="lg" className="btn-shimmer">
                  {section.buttonLabel}
                </Button>
              </Link>
            ) : null}
            {section.secondaryButtonLabel && section.secondaryButtonUrl ? (
              <Link to={section.secondaryButtonUrl}>
                <Button variant="secondary" size="lg">
                  {section.secondaryButtonLabel} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
          </div>
          {stats.length > 0 ? (
            <dl className="hero-stats mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-gold/40 pt-8 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs uppercase tracking-wider text-gold">{item.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-navy">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="portrait-stage">
          <figure className="portrait-card portrait-send">
            <img src={SITE_VISUALS.send} alt="A worker abroad sending remittance home" />
            <figcaption>Sending from abroad</figcaption>
          </figure>
          <svg className="portrait-arc" viewBox="0 0 220 160" aria-hidden>
            <path id="hero-transfer" className="corridor-path" d="M18 130 C 70 20, 150 20, 202 40" fill="none" stroke="#C4A35A" strokeWidth="2" />
            <circle r="5" fill="#C4A35A">
              <animateMotion dur="3.8s" repeatCount="indefinite">
                <mpath href="#hero-transfer" />
              </animateMotion>
            </circle>
          </svg>
          <span className="portrait-chip">USD → NPR</span>
          <figure className="portrait-card portrait-receive">
            <img src={SITE_VISUALS.receive} alt="A family in Nepal receiving remittance" />
            <figcaption>Receiving in Nepal</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
