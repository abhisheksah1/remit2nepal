import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { formatDate } from "@/utils/format";
import { entityId } from "@/utils/cn";

export default function News() {
  const query = useQuery({ queryKey: ["public", "news"], queryFn: () => publicApi.news() });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;

  return (
    <>
      <PageHero kicker="Notices" title="News and notices" description="Public notices, alerts and news from Remit2Nepal." />
      <div className="mx-auto max-w-site px-4 lg:px-8 py-16">
      <SeoHead title="News and notices" description="Public notices, alerts and news from Remit2Nepal." />
      <div className="space-y-4">
        {(query.data ?? []).map((item) => (
          <Link key={entityId(item)} to={`/news/${item.slug}`} className="block glass-panel rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-gold">
              {item.category} · {formatDate(item.publishedAt)}
            </p>
            <h2 className="mt-2 font-display text-2xl text-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
