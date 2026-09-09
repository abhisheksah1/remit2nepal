import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { formatDate } from "@/utils/format";
import { mediaUrl } from "@/utils/cn";
import NotFound from "./NotFound";

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

  return (
    <article className="paper-story mx-auto max-w-3xl px-4 py-16">
      <SeoHead title={item.seoTitle || item.title} description={item.seoDescription || item.summary} image={item.featuredImage} />
      <Link to="/news" className="text-sm text-gold">
        ← All notices
      </Link>
      <p className="paper-kicker mt-4">
        {item.category}
        {item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
        {item.author ? ` · ${item.author}` : ""}
      </p>
      <h1 className="mt-2 font-display text-4xl text-navy">{item.title}</h1>
      {item.titleNe ? <p className="paper-ne mt-2 text-2xl">{item.titleNe}</p> : null}
      {item.punchLine ? <p className="paper-punch mt-5">{item.punchLine}</p> : null}
      {item.punchLineNe ? <p className="paper-punch is-ne">{item.punchLineNe}</p> : null}
      {item.featuredImage ? <img src={mediaUrl(item.featuredImage)} alt="" className="paper-story-photo" /> : null}
      {item.content ? <div className="prose-r2n mt-8" dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
      {item.contentNe ? (
        <div className="paper-ne-block">
          <p className="paper-flag">नेपाली</p>
          <div className="prose-r2n is-ne" dangerouslySetInnerHTML={{ __html: item.contentNe }} />
        </div>
      ) : null}
    </article>
  );
}
