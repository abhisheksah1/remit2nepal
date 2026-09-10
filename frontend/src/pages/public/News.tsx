import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
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
      <SeoHead title="News and notices" description="Public notices, alerts and news from Remit2Nepal." />
      <NewsDesk news={query.data ?? []} listing />
    </>
  );
}
