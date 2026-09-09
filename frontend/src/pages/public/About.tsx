import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutPro } from "@/components/public/AboutPro";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ABOUT_DEFAULTS, aboutLine } from "@/content/about-defaults";

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
      <SeoHead
        title={`${aboutLine(about.heroTitle, ABOUT_DEFAULTS.heroTitle).replace(/\s*\/\/\s*/g, " ")} | Remit2Nepal`}
        description={aboutLine(about.heroDescription, ABOUT_DEFAULTS.heroDescription)}
      />
      <AboutPro about={about} />
    </>
  );
}
