import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutBest, AboutHero, AboutStory } from "@/components/public/AboutBlocks";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function About() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }
  if (!about) return <EmptyState title="About content is being prepared" />;

  return (
    <>
      <SeoHead title="About Remit2Nepal" description="Licensed remittance company serving families across Nepal." />
      <AboutHero
        about={about}
        kicker={about.heroKicker || "Our institution"}
        title={about.heroTitle || "Built for families who wait on a transfer"}
        description={about.heroDescription || "Licensed remittance for people sending from abroad and families receiving across Nepal."}
      />
      <AboutBest about={about} />
      <AboutStory about={about} />
    </>
  );
}
