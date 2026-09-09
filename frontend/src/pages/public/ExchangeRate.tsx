import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { RateTable } from "@/components/public/RateTable";
import { PageHero } from "@/components/public/PageHero";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ExchangeRate() {
  const query = useQuery({ queryKey: ["public", "rates"], queryFn: publicApi.rates });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 py-16"><SkeletonLines /></div>;
  if (!query.data) return <EmptyState title="Rates are unavailable" />;

  return (
    <>
      <PageHero
        kicker="Treasury desk"
        title="Today's exchange rates"
        description="Official Nepal Rastra Bank reference rates alongside Remit2Nepal customer rates. Confirm the applicable rate at the counter before completing a transfer."
      />
      <div className="mx-auto max-w-site px-4 py-16">
      <SeoHead title="Today's exchange rates" description="NRB-referenced and company customer rates for remittance to Nepal." />
      <div className="glass-panel rounded-3xl p-4 sm:p-6">
        <RateTable payload={query.data} />
      </div>
    </div>
    </>
  );
}
