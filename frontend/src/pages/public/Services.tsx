import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { ServiceRail } from "@/components/public/ServiceRail";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Services() {
  const query = useQuery({ queryKey: ["public", "services"], queryFn: publicApi.services });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState title="Services will appear here" />;

  return (
    <div className="ba-desk reveal-skip">
      <SeoHead title="Remittance services" description="Receive remittance sent from abroad as cash pickup, bank deposit, or wallet payout in Nepal." />
      <PageHero
        kicker="What we do"
        title="How families collect in Nepal"
        description="Cash pickup, bank deposit, and wallet payout for remittance sent from overseas — from a single collection in Kathmandu to payroll paid out across the country."
      />
      <div className="ba-stage is-rail">
        <ServiceRail services={items} />
      </div>
    </div>
  );
}
