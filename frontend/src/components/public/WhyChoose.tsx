import { Award, BadgeCheck, Banknote, MapPinned, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import type { CmsSection, WhyItem } from "@/types/content";

const whyIcons: { match: RegExp; icon: LucideIcon }[] = [
  { match: /secure|protect|audit/i, icon: ShieldCheck },
  { match: /fast|same-day|speed/i, icon: Zap },
  { match: /reliable|depend/i, icon: BadgeCheck },
  { match: /nationwide|network|branch|province/i, icon: MapPinned },
  { match: /rate|price|nrb|competitive/i, icon: Banknote },
  { match: /trust|license|service|document/i, icon: Award }
];

function iconFor(title: string) {
  return whyIcons.find((entry) => entry.match.test(title))?.icon ?? ShieldCheck;
}

export function WhyChoose({ section }: { section: CmsSection }) {
  const items = Array.isArray(section.items) ? (section.items as WhyItem[]) : [];

  return (
    <section className="why-stage" aria-labelledby="why-heading">
      <div className="why-orbs" aria-hidden>
        <span />
        <span />
      </div>
      <div className="why-wash" />
      <div className="why-mountains" aria-hidden />
      <div className="why-wrap">
        <header className="why-head">
          <p className="why-kicker">Why Remit2Nepal</p>
          <h2 id="why-heading">{section.heading || "Why families choose Remit2Nepal"}</h2>
          {section.subheading ? <p className="why-lede">{section.subheading}</p> : null}
        </header>
        <div className="why-grid">
          {items.map((item, index) => {
            const Icon = iconFor(item.title);
            return (
              <article key={item.title} className="why-card" style={{ transitionDelay: `${index * 70}ms` }}>
                <span className="why-icon" aria-hidden>
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
