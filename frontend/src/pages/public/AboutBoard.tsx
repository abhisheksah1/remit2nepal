import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutHero, AboutPeople } from "@/components/public/AboutBlocks";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { groupTeam } from "@/utils/team";

export default function AboutBoard() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;
  const { board } = groupTeam(site.data?.team ?? []);

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const title = about?.boardHeading || "Board of Directors";
  const description =
    about?.boardDescription || "The board sets policy, watches licensed operations, and keeps payouts accountable.";

  return (
    <>
      <SeoHead title={`${title} | Remit2Nepal`} description={description} />
      <AboutHero about={about} kicker={about?.boardKicker || "Governance"} title={title} description={description} />
      <AboutPeople
        kicker={about?.boardKicker || "Board"}
        title={title}
        description={description}
        members={board}
        tone="board"
      />
    </>
  );
}
