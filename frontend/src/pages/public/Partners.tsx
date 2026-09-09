import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { Card } from "@/components/ui/Card";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId } from "@/utils/cn";

export default function Partners() {
  const query = useQuery({ queryKey: ["public", "partners"], queryFn: publicApi.partners });
  if (query.isLoading) return <div className="mx-auto max-w-site px-4 py-16"><SkeletonLines /></div>;

  return (
    <>
      <PageHero
        kicker="Corridors"
        title="Banks and payout partners"
        description="Correspondent banks and payout partners of Remit2Nepal."
      />
      <div className="mx-auto max-w-site px-4 py-16">
      <SeoHead title="Banks and payout partners" description="Correspondent banks and payout partners of Remit2Nepal." />
      <div className="grid gap-5 md:grid-cols-3">
        {(query.data ?? []).map((partner) => (
          <Card key={entityId(partner)}>
            <h2 className="font-display text-xl text-navy">{partner.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-gold">{partner.country}</p>
            <p className="mt-3 text-sm text-ink-muted">{partner.description}</p>
            {partner.website ? (
              <a href={partner.website} className="mt-4 inline-block text-sm text-navy underline" target="_blank" rel="noreferrer">
                Visit website
              </a>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}
