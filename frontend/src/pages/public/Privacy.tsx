import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { PrivacyPro } from "@/components/public/PrivacyPro";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function Privacy() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const page = useQuery({
    queryKey: ["public", "page", "privacy"],
    queryFn: () => publicApi.page("privacy")
  });

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
        title={page.data?.seoTitle || "Privacy Policy | Remit2Nepal"}
        description={
          page.data?.seoDescription ||
          page.data?.summary ||
          "How Remit2Nepal collects, uses, and protects personal information when you use our website and remittance services."
        }
      />
      <PrivacyPro settings={site.data?.settings ?? null} page={page.data ?? null} />
    </>
  );
}
