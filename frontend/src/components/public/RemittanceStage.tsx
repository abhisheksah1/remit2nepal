import { useId, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { NEPAL_MAP_VIEWBOX, NEPAL_PROVINCES } from "@/constants/nepalMap";
import type { CmsSection } from "@/types/content";
import { cn, mediaUrl } from "@/utils/cn";

function cubeWord(section: CmsSection) {
  const items = Array.isArray(section.items) ? section.items : [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as { word?: string; title?: string };
    const value = String(row.word || "").trim();
    if (value) return value.toUpperCase();
  }
  const heading = (section.heading || "").trim();
  if (heading && heading.length <= 16 && !heading.includes(" ")) return heading.toUpperCase();
  return "REMITTANCE";
}

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

export function RemittanceStage({ section }: { section: CmsSection }) {
  const uid = useId().replace(/:/g, "");
  const word = cubeWord(section);
  const letters = Array.from(word);
  const showTitle = (section.heading || "").trim() && (section.heading || "").trim().toUpperCase() !== word;

  return (
    <section className="remittance-stage reveal-skip" aria-labelledby={`${section.key}-word`}>
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
      {section.overlay ? <div className="remittance-wash" aria-hidden /> : null}

      <NprRoll className="remittance-roll is-tl" label="1000" gid={`${uid}-a`} />
      <NprRoll className="remittance-roll is-tr" label="500" gid={`${uid}-b`} />
      <NprRoll className="remittance-roll is-bl" label="100" gid={`${uid}-c`} />
      <NprRoll className="remittance-roll is-br" label="50" gid={`${uid}-d`} />

      <div className="remittance-wrap">
        <header className="remittance-copy">
          <p className="remittance-kicker">{section.icon || "Licensed transfer"}</p>
          {showTitle ? <p className="remittance-title">{section.heading}</p> : null}
          <h2 id={`${section.key}-word`} className="sr-only">
            {word}
          </h2>
        </header>

        <div className="remittance-word" aria-hidden="true">
          {letters.map((letter, index) => {
            const mid = (letters.length - 1) / 2;
            const arc = Math.round((index - mid) * (index - mid) * 1.15);
            const tilt = index % 2 === 0 ? -4 : 3;
            const style = {
              transitionDelay: `${80 + index * 70}ms`,
              "--tilt": `${tilt}deg`,
              "--arc": `${arc}px`
            } as CSSProperties;
            return (
              <span key={`${letter}-${index}`} className={cn("remittance-cube", letter === " " && "is-gap")} style={style}>
                {letter === " " ? "" : letter}
              </span>
            );
          })}
        </div>

        {section.subheading ? <p className="remittance-punch">{section.subheading}</p> : null}
        {section.description && !/hover each letter/i.test(section.description) ? (
          <p className="remittance-body">{section.description}</p>
        ) : null}

        {section.buttonUrl ? (
          <Link className="remittance-cta" to={section.buttonUrl}>
            {section.buttonLabel || "View exchange rate"}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

