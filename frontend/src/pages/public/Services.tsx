import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { entityId } from "@/utils/cn";

export default function Services() {
  const query = useQuery({ queryKey: ["public", "services"], queryFn: publicApi.services });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState title="Services will appear here" />;

  return (
    <>
      <PageHero
        kicker="What we do"
        title="Services for every kind of transfer"
        description="From a single cash pickup in Kathmandu to payroll for a company with staff in seven provinces."
      />
      <div className="mx-auto max-w-site px-4 lg:px-8 py-16">
      <SeoHead title="Remittance services" description="International remittance, cash pickup, bank deposit and corporate payouts." />
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((service) => (
          <Link
            key={entityId(service)}
            to={`/services/${service.slug || entityId(service)}`}
            className="lift-card glass-panel rounded-2xl p-6"
          >
            <h2 className="font-display text-2xl text-navy">{service.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{service.shortDescription}</p>
            {service.countryAvailability?.length ? (
              <p className="mt-4 text-xs uppercase tracking-wider text-gold">{service.countryAvailability.join(" · ")}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
