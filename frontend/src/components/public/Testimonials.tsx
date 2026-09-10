import { useEffect, useRef, type CSSProperties } from "react";
import { Quote } from "lucide-react";
import type { CmsSection, TestimonialItem } from "@/types/content";
import { cn, entityId, mediaUrl } from "@/utils/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function byline(item: TestimonialItem) {
  return [item.name, item.location, item.title].filter(Boolean).join(" · ");
}

function Photo({ item, featured }: { item: TestimonialItem; featured?: boolean }) {
  return (
    <figure className={cn("voices-shot", featured && "is-lead")}>
      {item.imageUrl ? (
        <img src={mediaUrl(item.imageUrl)} alt="" />
      ) : (
        <span aria-hidden>{initials(item.name)}</span>
      )}
    </figure>
  );
}

function Copy({ item, featured }: { item: TestimonialItem; featured?: boolean }) {
  const heading = item.headline || item.quote;
  const headingNe = item.headlineNe || (!item.headline ? item.quoteNe : "");
  const quote = item.headline ? item.quote : "";
  const quoteNe = item.headline ? item.quoteNe : "";
  return (
    <div className={cn("voices-copy", featured && "is-lead")}>
      {featured ? <Quote className="voices-mark" aria-hidden /> : null}
      {heading ? <h3 className={cn("voices-title", !featured && "is-small")}>{heading}</h3> : null}
      {headingNe ? <p className="voices-title-ne">{headingNe}</p> : null}
      {quote ? <p className="voices-body">{quote}</p> : null}
      {quoteNe ? <p className="voices-body-ne">{quoteNe}</p> : null}
      <p className="voices-by">{byline(item)}</p>
    </div>
  );
}

export function Testimonials({ section }: { section: CmsSection }) {
  const root = useRef<HTMLElement>(null);
  const items = (Array.isArray(section.items) ? section.items : []) as TestimonialItem[];
  const [featured, ...rest] = items;
  const label = (section.icon || "Testimonials").trim();

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

  if (!featured) return null;

  return (
    <section ref={root} className="voices reveal-skip" aria-labelledby="voices-heading">
      <header className="voices-head">
        <p className="voices-kicker">{label}</p>
        <h2 id="voices-heading">{section.heading || "Stories from families"}</h2>
        {section.subheading ? <p className="voices-lede">{section.subheading}</p> : null}
      </header>

      <article className="voices-lead" style={{ "--i": 0 } as CSSProperties}>
        <div className="voices-spine" aria-hidden>
          <span>{label}</span>
        </div>
        <Photo item={featured} featured />
        <Copy item={featured} featured />
      </article>

      {rest.length ? (
        <div className="voices-more">
          {rest.map((item, index) => (
            <article
              key={entityId(item) || `${item.name}-${index}`}
              className="voices-item"
              style={{ "--i": index + 1 } as CSSProperties}
            >
              <Photo item={item} />
              <Copy item={item} />
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
