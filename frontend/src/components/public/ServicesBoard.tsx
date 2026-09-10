import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CmsSection, ServiceItem } from "@/types/content";
import { ServiceRail } from "./ServiceRail";
import { heroTitleParts } from "@/utils/hero";

export function ServicesBoard({ section, services }: { section: CmsSection; services: ServiceItem[] }) {
  const root = useRef<HTMLElement>(null);
  const cards = services.filter((item) => item.status !== "INACTIVE");
  const kicker = section.icon?.trim();
  const heading = section.heading?.trim() || "Services for every transfer";
  const titleParts = heroTitleParts(heading);
  const punch = section.subheading?.trim();
  const lede = section.description?.trim();
  const ctaLabel = section.buttonLabel?.trim();
  const ctaUrl = section.buttonUrl?.trim() || "/services";

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!cards.length) return null;

  return (
    <section ref={root} id="how-it-works" className="svc-board reveal-skip" aria-labelledby={`${section.key}-heading`}>
      <div className="svc-wrap">
        <header className="svc-head">
          {kicker ? <p className="svc-kicker">{kicker}</p> : null}
          <h2 id={`${section.key}-heading`} className="svc-title">
            {titleParts.map((part, index) => (
              <span key={`${part.tone}-${index}`} className={part.tone}>
                {part.text}
              </span>
            ))}
          </h2>
          {punch ? <p className="svc-punch">{punch}</p> : null}
          {lede ? <p className="svc-lede">{lede}</p> : null}
        </header>

        <ServiceRail services={cards} />

        {ctaLabel ? (
          <div className="svc-actions">
            <Link className="svc-cta" to={ctaUrl}>
              {ctaLabel}
              <ArrowRight />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
