import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId, mediaUrl } from "@/utils/cn";

export default function Gallery() {
  const gallery = useQuery({ queryKey: ["public", "gallery"], queryFn: publicApi.gallery });

  if (gallery.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const photos = gallery.data ?? [];

  return (
    <>
      <PageHero kicker="Inside the network" title="Gallery" description="Branches, events and community work from Remit2Nepal." />
      <SeoHead title="Gallery" description="Branches, events and community work from Remit2Nepal." />
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <div className="gallery-map-grid">
          {photos.map((item) => (
            <figure key={entityId(item)} className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
              <img src={mediaUrl(item.imageUrl)} alt={item.altText || item.title} className="h-56 w-full object-cover" />
              <figcaption className="p-4">
                <p className="font-medium text-navy">{item.title}</p>
                <p className="text-sm text-ink-muted">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {!photos.length ? (
          <p className="mt-6 text-center text-sm text-ink-muted">Gallery photos will appear here once they are published in Admin.</p>
        ) : null}
      </div>
    </>
  );
}
