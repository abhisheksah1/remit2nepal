import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import { SeoHead } from "@/components/public/SeoHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StatItem } from "@/types/content";

export default function Home() {
  const home = useQuery({ queryKey: ["public", "home"], queryFn: publicApi.home });

  if (home.isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[70vh] w-full" />
      </div>
    );
  }

  if (home.isError || !home.data) {
    return <EmptyState title="The homepage could not be loaded" description="Please refresh in a moment." />;
  }

  const sections = [...home.data.sections]
    .filter(
      (section) =>
        section.type !== "NEPAL_MAP" &&
        section.type !== "CONTACT_CTA" &&
        section.type !== "NEWS"
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const statsSection = sections.find((section) => section.type === "STATS");
  const stats = Array.isArray(statsSection?.items) ? (statsSection.items as StatItem[]) : [];

  return (
    <>
      <SeoHead seo={home.data.seo} title={home.data.seo?.siteTitle} description={home.data.seo?.metaDescription} />
      {sections.map((section) => (
        <SectionRenderer
          key={section._id}
          section={section}
          services={home.data.services}
          partners={home.data.partners}
          news={home.data.news}
          rates={home.data.rates}
          stats={stats}
          gallery={home.data.gallery}
        />
      ))}
    </>
  );
}
