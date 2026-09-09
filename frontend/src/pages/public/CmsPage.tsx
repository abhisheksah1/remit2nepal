import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { SkeletonLines } from "@/components/ui/Skeleton";
import NotFound from "./NotFound";

export default function CmsPage() {
  const { slug = "" } = useParams();
  const query = useQuery({
    queryKey: ["public", "page", slug],
    queryFn: () => publicApi.page(slug),
    enabled: Boolean(slug),
    retry: false
  });

  if (query.isLoading) return <div className="mx-auto max-w-3xl px-4 py-16"><SkeletonLines /></div>;
  if (!query.data) return <NotFound />;

  return (
    <>
      <PageHero kicker="Information" title={query.data.title} description={query.data.summary} />
      <article className="mx-auto max-w-3xl px-4 py-16">
        <SeoHead title={query.data.seoTitle || query.data.title} description={query.data.seoDescription || query.data.summary} />
        <div className="prose-r2n" dangerouslySetInnerHTML={{ __html: query.data.content }} />
      </article>
    </>
  );
}
