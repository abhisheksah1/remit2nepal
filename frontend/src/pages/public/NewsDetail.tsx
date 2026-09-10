import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Megaphone, Newspaper, TriangleAlert } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { formatDate } from "@/utils/format";
import { mediaUrl } from "@/utils/cn";
import NotFound from "./NotFound";

const META = {
  NEWS: { label: "News", Icon: Newspaper },
  NOTICE: { label: "Notice", Icon: Megaphone },
  ALERT: { label: "Alert", Icon: TriangleAlert }
} as const;

function photoOf(src?: string) {
  const raw = src?.trim() || "";
  if (!raw || /\/images\/news\/cover-/.test(raw)) return "";
  return mediaUrl(raw);
}

export default function NewsDetail() {
  const { slug = "" } = useParams();
  const query = useQuery({ queryKey: ["public", "news"], queryFn: () => publicApi.news() });
  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }
  const item = (query.data ?? []).find((entry) => entry.slug === slug);
  if (!item) return <NotFound />;
  const meta = META[item.category] ?? META.NEWS;
  const photo = photoOf(item.featuredImage);

  return (
    <article className="ndesk-story" aria-labelledby="ndesk-story-title">
      <SeoHead title={item.seoTitle || item.title} description={item.seoDescription || item.summary} image={photo || undefined} />
      <div className="ndesk-sky" aria-hidden>
        <span className="ndesk-glow is-blue" />
        <span className="ndesk-glow is-red" />
        <span className="ndesk-mesh" />
      </div>
      <div className="ndesk-story-wrap">
        <Link to="/news" className="ndesk-back">
          <ArrowLeft /> All notices
        </Link>
        <p className="ndesk-meta">
          <span>{meta.label}</span>
          {item.publishedAt ? <time dateTime={String(item.publishedAt)}>{formatDate(item.publishedAt)}</time> : null}
          {item.author ? <span className="is-author">{item.author}</span> : null}
        </p>
        <h1 id="ndesk-story-title">{item.title}</h1>
        {item.titleNe ? <p className="ndesk-ne is-story">{item.titleNe}</p> : null}
        {item.punchLine ? <p className="ndesk-punch is-story">{item.punchLine}</p> : null}
        {item.punchLineNe ? <p className="ndesk-ne is-punch">{item.punchLineNe}</p> : null}
        {photo ? <img src={photo} alt="" className="ndesk-story-photo" /> : null}
        {item.content ? <div className="prose-r2n ndesk-body" dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
        {item.contentNe ? (
          <div className="ndesk-ne-block">
            <p className="ndesk-kicker">नेपाली</p>
            <div className="prose-r2n is-ne" dangerouslySetInnerHTML={{ __html: item.contentNe }} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
