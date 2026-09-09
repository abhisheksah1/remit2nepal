import type { CmsSection, TestimonialItem } from "@/types/content";
import { mediaUrl } from "@/utils/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Photo({ item, className }: { item: TestimonialItem; className?: string }) {
  return (
    <figure className={className}>
      {item.imageUrl ? <img src={mediaUrl(item.imageUrl)} alt={item.name} /> : <span>{initials(item.name)}</span>}
    </figure>
  );
}

function Copy({ item, featured }: { item: TestimonialItem; featured?: boolean }) {
  const heading = item.headline || item.quote;
  const headingNe = item.headlineNe || item.quoteNe;
  return (
    <div className="voices-copy">
      <h3 className={featured ? "voices-title" : "voices-title is-small"}>{heading}</h3>
      {headingNe ? <p className="voices-title-ne">{headingNe}</p> : null}
      {item.headline && item.quote ? <p className="voices-body">{item.quote}</p> : null}
      {item.headline && item.quoteNe ? <p className="voices-body-ne">{item.quoteNe}</p> : null}
      <p className="voices-by">– {item.name}</p>
    </div>
  );
}

export function Testimonials({ section }: { section: CmsSection }) {
  const items = (Array.isArray(section.items) ? section.items : []) as TestimonialItem[];
  const [featured, ...rest] = items;
  const label = (section.icon || "Testimonials").toUpperCase();

  if (!featured) return null;

  return (
    <section className="voices" aria-label={section.heading || "Testimonials"}>
      <article className="voices-lead">
        <div className="voices-spine" aria-hidden>
          <span>{label}</span>
        </div>
        <Photo item={featured} className="voices-shot is-lead" />
        <Copy item={featured} featured />
      </article>

      {rest.length ? (
        <div className="voices-more">
          {rest.map((item) => (
            <article key={item.name} className="voices-item">
              <Photo item={item} className="voices-shot" />
              <Copy item={item} />
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
