import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { NEPAL_MAP_VIEWBOX, NEPAL_PROVINCES } from "@/constants/nepalMap";
import type { CmsSection } from "@/types/content";
import { cn, mediaUrl } from "@/utils/cn";
import { heroTitleParts } from "@/utils/hero";
import { remittancePoints, remittanceWord } from "@/utils/remittance";

function NprRoll({ className, label, gid }: { className?: string; label: string; gid: string }) {
  return (
    <svg className={className} viewBox="0 0 120 78" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1f7a3a" />
          <stop offset="55%" stopColor="#2e9b4c" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>
      <ellipse cx="96" cy="39" rx="18" ry="28" fill="#d7f0de" />
      <ellipse cx="96" cy="39" rx="12" ry="20" fill="#14532d" />
      <rect x="8" y="11" width="88" height="56" rx="6" fill={`url(#${gid})`} />
      <rect x="16" y="19" width="72" height="40" rx="4" fill="none" stroke="#bbf7d0" strokeWidth="1.4" opacity="0.7" />
      <text x="52" y="36" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fill="#ecfdf3">
        NPR
      </text>
      <text x="52" y="52" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill="#fff">
        {label}
      </text>
      <path d="M8 24 C 0 28, 0 50, 8 54" fill="none" stroke="#a16207" strokeWidth="3" />
    </svg>
  );
}

function StageLink({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  const href = to.trim() || "/";
  if (href.startsWith("#") || /^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={className} {...(/^https?:\/\//i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}>
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

export function RemittanceStage({ section }: { section: CmsSection }) {
  const root = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  const word = remittanceWord(section.items, section.heading);
  const letters = Array.from(word);
  const points = remittancePoints(section.items);
  const kicker = section.icon?.trim();
  const heading = section.heading?.trim();
  const showTitle = Boolean(heading) && heading.toUpperCase() !== word;
  const titleParts = heroTitleParts(showTitle ? heading : "");
  const punch = section.subheading?.trim();
  const lede = section.description?.trim() && !/hover each letter/i.test(section.description) ? section.description.trim() : "";
  const primaryLabel = section.buttonLabel?.trim();
  const primaryUrl = section.buttonUrl?.trim() || "/exchange-rate";
  const secondaryLabel = section.secondaryButtonLabel?.trim();
  const secondaryUrl = section.secondaryButtonUrl?.trim() || "/branches";

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

  return (
    <section ref={root} className="remittance-stage reveal-skip" aria-labelledby={`${section.key}-heading`}>
      <div
        className="remittance-paper"
        style={section.backgroundUrl ? { backgroundImage: `url(${mediaUrl(section.backgroundUrl)})` } : undefined}
        aria-hidden
      />
      <div className="remittance-charts" aria-hidden>
        <span className="is-red" />
        <span className="is-navy" />
        <span className="is-line" />
      </div>
      <svg className="remittance-nepal" viewBox={NEPAL_MAP_VIEWBOX} aria-hidden>
        {NEPAL_PROVINCES.map((province) => (
          <path key={province.id} d={province.d} />
        ))}
      </svg>
      {section.overlay !== false ? <div className="remittance-wash" aria-hidden /> : null}

      <NprRoll className="remittance-roll is-tl" label="1000" gid={`${uid}-a`} />
      <NprRoll className="remittance-roll is-tr" label="500" gid={`${uid}-b`} />
      <NprRoll className="remittance-roll is-bl" label="100" gid={`${uid}-c`} />
      <NprRoll className="remittance-roll is-br" label="50" gid={`${uid}-d`} />

      <div className="remittance-wrap">
        <header className="remittance-copy">
          {kicker ? <p className="remittance-kicker">{kicker}</p> : null}
          {showTitle ? (
            <h2 id={`${section.key}-heading`} className="remittance-title">
              {titleParts.map((part, index) => (
                <span key={`${part.tone}-${index}`} className={part.tone}>
                  {part.text}
                </span>
              ))}
            </h2>
          ) : (
            <h2 id={`${section.key}-heading`} className="sr-only">
              {word}
            </h2>
          )}
        </header>

        <div className="remittance-word" aria-hidden={showTitle ? true : undefined}>
          {letters.map((letter, index) => {
            const mid = (letters.length - 1) / 2;
            const arc = Math.round((index - mid) * (index - mid) * 1.15);
            const tilt = index % 2 === 0 ? -4 : 3;
            const style = {
              transitionDelay: `${80 + index * 70}ms`,
              "--tilt": `${tilt}deg`,
              "--arc": `${arc}px`,
              "--i": index
            } as CSSProperties;
            return (
              <span key={`${letter}-${index}`} className={cn("remittance-cube", letter === " " && "is-gap")} style={style}>
                {letter === " " ? "" : letter}
              </span>
            );
          })}
        </div>

        {punch ? <p className="remittance-punch">{punch}</p> : null}
        {lede ? <p className="remittance-body">{lede}</p> : null}

        {points.length ? (
          <ul className="remittance-points">
            {points.map((point, index) => (
              <li key={point.title} className="remittance-point" style={{ "--i": index } as CSSProperties}>
                <strong>{point.title}</strong>
                {point.description ? <span>{point.description}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}

        {primaryLabel || secondaryLabel ? (
          <div className="remittance-actions">
            {primaryLabel ? (
              <StageLink to={primaryUrl} className="remittance-cta">
                {primaryLabel}
              </StageLink>
            ) : null}
            {secondaryLabel ? (
              <StageLink to={secondaryUrl} className="remittance-cta is-ghost">
                {secondaryLabel}
              </StageLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
