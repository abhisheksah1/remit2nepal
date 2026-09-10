import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Newspaper, TriangleAlert } from "lucide-react";
import type { CmsSection, NewsItem } from "@/types/content";
import { cn, entityId, mediaUrl } from "@/utils/cn";
import { formatDate } from "@/utils/format";
import { heroTitleParts } from "@/utils/hero";

type Filter = "ALL" | NewsItem["category"];

const META = {
  NEWS: { label: "News", Icon: Newspaper },
  NOTICE: { label: "Notice", Icon: Megaphone },
  ALERT: { label: "Alert", Icon: TriangleAlert }
} as const;

function photoOf(item: NewsItem) {
  const raw = item.featuredImage?.trim() || "";
  if (!raw || /\/images\/news\/cover-/.test(raw)) return "";
  return mediaUrl(raw);
}

function StoryCard({
  item,
  featured,
  index
}: {
  item: NewsItem;
  featured?: boolean;
  index: number;
}) {
  const meta = META[item.category] ?? META.NEWS;
  const Icon = meta.Icon;
  const photo = photoOf(item);

  return (
    <Link
      to={`/news/${item.slug}`}
      className={cn("ndesk-card", featured && "is-lead", photo && "has-photo")}
      style={{ "--i": index } as CSSProperties}
    >
      <figure className={cn("ndesk-media", `is-${item.category.toLowerCase()}`)}>
        {photo ? <img src={photo} alt="" /> : <Icon aria-hidden />}
      </figure>
      <div className="ndesk-copy">
        <p className="ndesk-meta">
          <span>{meta.label}</span>
          {item.publishedAt ? <time dateTime={String(item.publishedAt)}>{formatDate(item.publishedAt)}</time> : null}
        </p>
        <h3>{item.title}</h3>
        {item.titleNe ? <p className="ndesk-ne">{item.titleNe}</p> : null}
        {item.punchLine ? <p className="ndesk-punch">{item.punchLine}</p> : null}
        {featured && item.summary ? <p className="ndesk-summary">{item.summary}</p> : null}
        <span className="ndesk-more">
          Read {item.category === "NEWS" ? "story" : "notice"} <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function NewsDesk({
  section,
  news,
  listing
}: {
  section?: CmsSection;
  news: NewsItem[];
  listing?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const heading = listing
    ? "News // and notices"
    : section?.heading?.trim() || "News // and notices";
  const titleParts = heroTitleParts(heading);
  const kicker = listing ? "Desk" : section?.icon?.trim() || "Desk";
  const lede = listing
    ? "Published for families and agents — English and नेपाली."
    : section?.subheading?.trim();
  const ctaLabel = section?.buttonLabel?.trim() || "All notices";
  const ctaUrl = section?.buttonUrl?.trim() || "/news";

  const stories = useMemo(() => {
    const list = listing ? news : news.slice(0, 4);
    if (!listing || filter === "ALL") return list;
    return list.filter((item) => item.category === filter);
  }, [filter, listing, news]);

  const [lead, ...rest] = stories;
  const counts = {
    ALL: news.length,
    NEWS: news.filter((item) => item.category === "NEWS").length,
    NOTICE: news.filter((item) => item.category === "NOTICE").length,
    ALERT: news.filter((item) => item.category === "ALERT").length
  };

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
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      className={cn("ndesk reveal-skip", listing && "is-page")}
      aria-labelledby="ndesk-heading"
    >
      <div className="ndesk-sky" aria-hidden>
        <span className="ndesk-glow is-blue" />
        <span className="ndesk-glow is-red" />
        <span className="ndesk-mesh" />
        {listing ? <span className="ndesk-mountains" /> : null}
      </div>

      <div className="ndesk-wrap">
        <header className="ndesk-head">
          <div>
            {kicker ? <p className="ndesk-kicker">{kicker}</p> : null}
            {listing ? (
              <h1 id="ndesk-heading" className="ndesk-title">
                {titleParts.map((part, index) => (
                  <span key={`${part.tone}-${index}`} className={part.tone}>
                    {part.text}
                  </span>
                ))}
              </h1>
            ) : (
              <h2 id="ndesk-heading" className="ndesk-title">
                {titleParts.map((part, index) => (
                  <span key={`${part.tone}-${index}`} className={part.tone}>
                    {part.text}
                  </span>
                ))}
              </h2>
            )}
            {lede ? <p className="ndesk-lede">{lede}</p> : null}
          </div>
          {listing ? null : (
            <Link className="ndesk-all" to={ctaUrl}>
              {ctaLabel} <ArrowRight />
            </Link>
          )}
        </header>

        {listing ? (
          <div className="ndesk-filters" role="tablist" aria-label="Filter notices">
            {(["ALL", "NEWS", "NOTICE", "ALERT"] as const)
              .filter((key) => key === "ALL" || counts[key] > 0)
              .map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={cn("ndesk-chip", filter === key && "is-on")}
                onClick={() => setFilter(key)}
              >
                {key === "ALL" ? "All" : META[key].label}
                <em>{counts[key]}</em>
              </button>
            ))}
          </div>
        ) : null}

        {lead ? (
          <div className={cn("ndesk-board", rest.length > 0 && "has-rail")}>
            <StoryCard item={lead} featured index={0} />
            {rest.length ? (
              <div className="ndesk-rail">
                {rest.map((item, index) => (
                  <StoryCard key={entityId(item)} item={item} index={index + 1} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="ndesk-empty">
            {filter === "ALL"
              ? "Notices will appear here once they are published."
              : `No ${META[filter].label.toLowerCase()} items are published yet.`}
          </p>
        )}
      </div>
    </section>
  );
}
