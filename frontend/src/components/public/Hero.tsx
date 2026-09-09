import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { HeroNetwork } from "./HeroNetwork";
import type { CmsSection, StatItem } from "@/types/content";

const TRUST = ["Secure Transfers", "Transparent Fees", "Global Reach", "Reliable Support"];

export function Hero({ stats = [] }: { section: CmsSection; stats?: StatItem[] }) {
  const stage = useRef<HTMLElement>(null);

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
    <section ref={stage} className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-atm" aria-hidden>
        <span className="hero-atm-glow is-blue" />
        <span className="hero-atm-glow is-red" />
        <span className="hero-atm-grid" />
        <div className="hero-mountains" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy-block">
          <p className="hero-badge">
            <span className="hero-badge-dot" />
            Global Remittance • Fast • Secure
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="is-navy">Moving Money.</span>
            <span className="is-red">Connecting Lives.</span>
          </h1>
          <p className="hero-lede">
            Send money across borders with confidence. Experience fast, secure, and transparent international money
            transfers designed to keep you connected with the people who matter most.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="hero-cta is-primary">
              Send Money <ArrowRight />
            </Link>
            <a href="#how-it-works" className="hero-cta is-ghost">
              How It Works <ArrowRight />
            </a>
          </div>
          <ul className="hero-trust">
            {TRUST.map((item) => (
              <li key={item}>
                <Check aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-visual">
          <HeroNetwork />
        </div>
      </div>

      {stats.length ? (
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
