import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutComplianceBlock, AboutHero } from "@/components/public/AboutBlocks";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AboutCompliance() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const documents = useQuery({ queryKey: ["public", "documents"], queryFn: publicApi.documents });
  const about = site.data?.about;

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }
  if (!about) return <EmptyState title="Compliance content is being prepared" />;

  return (
    <>
      <SeoHead title="Compliance | Remit2Nepal" description="Licenses, certifications, and public documents." />
      <AboutHero
        about={about}
        kicker="Regulatory desk"
        title="Compliance"
        description="Licenses, certifications, and filings you can check before you send or partner with us."
      />
      <AboutComplianceBlock about={about} documents={documents.data ?? []} />
    </>
  );
}
