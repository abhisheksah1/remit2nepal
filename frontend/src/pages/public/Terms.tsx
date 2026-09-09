import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { TermsPro } from "@/components/public/TermsPro";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function Terms() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const page = useQuery({
    queryKey: ["public", "page", "terms"],
    queryFn: () => publicApi.page("terms")
  });
  const documents = useQuery({ queryKey: ["public", "documents"], queryFn: publicApi.documents });

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={page.data?.seoTitle || "Terms & Services | Remit2Nepal"}
        description={
          page.data?.seoDescription ||
          page.data?.summary ||
          "Terms that apply when you use Remit2Nepal’s website and remittance services."
        }
      />
      <TermsPro
        settings={site.data?.settings ?? null}
        page={page.data ?? null}
        services={site.data?.services ?? []}
        documents={documents.data ?? []}
      />
    </>
  );
}
