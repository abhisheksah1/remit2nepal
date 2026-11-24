import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { CompliancePro } from "@/components/public/CompliancePro";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { resolveCompliancePage } from "@/content/compliance-defaults";
import { groupTeam } from "@/utils/team";

export default function AboutCompliance() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const documents = useQuery({ queryKey: ["public", "documents"], queryFn: publicApi.documents });
  const about = site.data?.about;
  const { team } = groupTeam(site.data?.team ?? []);

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }
  if (!about) return <EmptyState title="Compliance content is being prepared" />;

  const seo = resolveCompliancePage(about.compliancePage);

  return (
    <>
      <SeoHead title={seo.seoTitle} description={seo.seoDescription} />
      <CompliancePro
        about={about}
        settings={site.data?.settings ?? null}
        team={team}
        documents={documents.data ?? []}
      />
    </>
  );
}
