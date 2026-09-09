import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { formatDate } from "@/utils/format";
import NotFound from "./NotFound";

export default function NewsDetail() {
  const { slug = "" } = useParams();
  const query = useQuery({ queryKey: ["public", "news"], queryFn: () => publicApi.news() });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 py-16"><SkeletonLines /></div>;
  const item = (query.data ?? []).find((entry) => entry.slug === slug);
  if (!item) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <SeoHead title={item.seoTitle || item.title} description={item.seoDescription || item.summary} image={item.featuredImage} />
      <Link to="/news" className="text-sm text-gold">
        ← All notices
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wider text-gold">
        {item.category} · {formatDate(item.publishedAt)}
      </p>
      <h1 className="mt-2 font-display text-4xl text-navy">{item.title}</h1>
      {item.author ? <p className="mt-2 text-sm text-ink-muted">{item.author}</p> : null}
      {item.featuredImage ? <img src={item.featuredImage} alt="" className="mt-6 w-full rounded-2xl" /> : null}
      <div className="prose-r2n mt-8" dangerouslySetInnerHTML={{ __html: item.content }} />
    </article>
  );
}
