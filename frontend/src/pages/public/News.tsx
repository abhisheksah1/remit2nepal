import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { NewsDesk } from "@/components/public/NewsDesk";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function News() {
  const query = useQuery({ queryKey: ["public", "news"], queryFn: () => publicApi.news() });
  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  return (
    <>
      <PageHero kicker="Desk" title="News and notices" description="Published for families and agents — English and नेपाली." />
      <SeoHead title="News and notices" description="Public notices, alerts and news from Remit2Nepal." />
      <div className="mx-auto max-w-site px-4 py-10 lg:px-8">
        <NewsDesk news={query.data ?? []} listing />
      </div>
    </>
  );
}
