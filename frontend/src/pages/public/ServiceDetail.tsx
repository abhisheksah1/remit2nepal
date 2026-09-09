import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import NotFound from "./NotFound";
import { entityId } from "@/utils/cn";

export default function ServiceDetail() {
  const { id = "" } = useParams();
  const list = useQuery({ queryKey: ["public", "services"], queryFn: publicApi.services });
  const direct = useQuery({
    queryKey: ["public", "service", id],
    queryFn: () => publicApi.service(id),
    enabled: Boolean(id) && id.length >= 20,
    retry: false
  });

  const fromList = (list.data ?? []).find((item) => item.slug === id || entityId(item) === id);
  const service = direct.data ?? fromList;

  if (list.isLoading && !service) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;
  if (!service) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SeoHead title={service.seoTitle || service.title} description={service.seoDescription || service.shortDescription} />
      <Link to="/services" className="text-sm text-gold">
        ← All services
      </Link>
      <h1 className="mt-4 font-display text-4xl text-navy">{service.title}</h1>
      <p className="mt-3 text-lg text-ink-muted">{service.shortDescription}</p>
      <div className="prose-r2n mt-8" dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
      {service.features?.length ? (
        <ul className="mt-8 space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="border-l-2 border-gold pl-3 text-navy">
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
