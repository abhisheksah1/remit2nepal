import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutHero, AboutPeople, LeaderSpotlight } from "@/components/public/AboutBlocks";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { groupTeam } from "@/utils/team";

export default function AboutTeam() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;
  const { leads, staff } = groupTeam(site.data?.team ?? []);
  const [leader, ...heads] = leads;

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const title = about?.teamHeading || "Our Team";
  const description =
    about?.teamDescription || "The desk that runs corridors, branches, and the compliance file every day.";

  return (
    <div className="about-team-page">
      <SeoHead title={`${title} | Remit2Nepal`} description={description} />
      <AboutHero
        about={about}
        kicker={about?.teamKicker || "Operations"}
        title={title}
        description={description}
        variant="card"
      />
      {leader ? <LeaderSpotlight member={leader} kicker="Leadership" /> : null}
      {heads.length ? (
        <AboutPeople
          kicker="Department"
          title={about?.teamLeadHeading || "Department heads"}
          description="The managers who run operations, compliance, and the payout desk."
          members={heads}
          tone="team"
        />
      ) : null}
      {staff.length ? (
        <AboutPeople
          kicker="Team"
          title={about?.teamStaffHeading || "Our people"}
          description="The people who serve families and branches every day."
          members={staff}
          tone="team"
        />
      ) : null}
      {!leader && !staff.length ? (
        <AboutPeople kicker="Team" title={title} description={description} members={[]} tone="team" />
      ) : null}
    </div>
  );
}
