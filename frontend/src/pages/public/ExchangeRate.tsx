import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { RatesBoard } from "@/components/public/RatesBoard";
import { InteriorPage } from "@/components/public/PageHero";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ExchangeRate() {
  const query = useQuery({
    queryKey: ["public", "rates"],
    queryFn: publicApi.rates,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;
  if (!query.data) return <EmptyState title="Rates are unavailable" />;

  return (
    <>
      <SeoHead title="Today's exchange rates" description="NRB-referenced and company customer rates for remittance received in Nepal." />
      <InteriorPage
        kicker="Treasury desk"
        title="Today's exchange rates"
        description="Live official Nepal Rastra Bank rates for every published currency, shown beside Remit2Nepal customer rates. Confirm the applicable rate at the counter before you collect."
        dockClassName="is-fx"
      >
        <RatesBoard rates={query.data} />
      </InteriorPage>
    </>
  );
}
