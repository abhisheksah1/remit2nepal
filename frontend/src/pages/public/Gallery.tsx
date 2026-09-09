import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { NepalStory } from "@/components/public/NepalPeopleMap";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId, mediaUrl } from "@/utils/cn";
import type { CmsSection } from "@/types/content";

const galleryFallback: CmsSection = {
  _id: "gallery-map",
  key: "gallery-map",
  type: "NEPAL_MAP",
  heading: "People and families across Nepal",
  subheading: "Community photos fill the map of Nepal. Upload them in Admin → Gallery.",
  description: "",
  imageUrl: "",
  backgroundUrl: "/images/nepal-map/cityscape.svg",
  overlay: true,
  icon: "Gallery",
  buttonLabel: "",
  buttonUrl: "",
  secondaryButtonLabel: "",
  secondaryButtonUrl: "",
  alignment: "center",
  items: [],
  enabled: true,
  displayOrder: 0
};

export default function Gallery() {
  const gallery = useQuery({ queryKey: ["public", "gallery"], queryFn: publicApi.gallery });
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });

  if (gallery.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const photos = gallery.data ?? [];
  const mapSection =
    site.data?.sections.find((section) => section.type === "NEPAL_MAP" || section.key === "nepal-people") ?? galleryFallback;
  const galleryCopy = {
    ...mapSection,
    key: "gallery-map",
    icon: mapSection.icon || "Gallery",
    heading: mapSection.heading || "People and families across Nepal",
    buttonLabel: "",
    buttonUrl: ""
  };

  return (
    <>
      <PageHero kicker="Inside the network" title="Gallery" description="Branches, events and community work from Remit2Nepal." />
      <SeoHead title="Gallery" description="Branches, events and community work from Remit2Nepal." />
      <NepalStory section={galleryCopy} gallery={photos} compact />
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
