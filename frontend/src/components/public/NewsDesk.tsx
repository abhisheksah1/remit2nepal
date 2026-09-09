import { Link } from "react-router-dom";
import type { CmsSection, NewsItem } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { formatDate } from "@/utils/format";

function coverFor(item: NewsItem) {
  return mediaUrl(item.featuredImage) || (item.category === "NOTICE" ? "/images/news/cover-hours.svg" : "/images/news/cover-rates.svg");
}

function StoryCard({ item, lead }: { item: NewsItem; lead?: boolean }) {
  return (
    <Link to={`/news/${item.slug}`} className={lead ? "paper-lead" : "paper-card"}>
      <figure className="paper-photo">
        <img src={coverFor(item)} alt="" />
      </figure>
      <div className="paper-copy">
        <p className="paper-kicker">
          {item.category}
          {item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
        </p>
        <h3>{item.title}</h3>
        {item.titleNe ? <p className="paper-ne">{item.titleNe}</p> : null}
        {item.punchLine ? <p className="paper-punch">{item.punchLine}</p> : null}
        {item.punchLineNe ? <p className="paper-punch is-ne">{item.punchLineNe}</p> : null}
        {lead && item.summary ? <p className="paper-summary">{item.summary}</p> : null}
        {lead && item.summaryNe ? <p className="paper-summary is-ne">{item.summaryNe}</p> : null}
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
  const stories = listing ? news : news.slice(0, 4);
  const [lead, ...rest] = stories;

  return (
    <section className={listing ? "paper-desk is-page" : "paper-desk"}>
      {section ? (
        <header className="paper-masthead">
          <div>
            {section.icon ? <p className="paper-flag">{section.icon}</p> : null}
            <h2>{section.heading || "News and notices"}</h2>
            {section.subheading ? <p className="paper-deck">{section.subheading}</p> : null}
          </div>
          {section.buttonUrl ? (
            <Link className="paper-all" to={section.buttonUrl}>
              {section.buttonLabel || "All notices"}
            </Link>
          ) : null}
        </header>
      ) : null}

      {lead ? (
        <div className="paper-grid">
          <StoryCard item={lead} lead />
          {rest.length ? (
            <div className="paper-stack">
              {rest.map((item) => (
                <StoryCard key={entityId(item)} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="paper-empty">Notices will appear here once they are published in Admin → News.</p>
      )}
    </section>
  );
}
