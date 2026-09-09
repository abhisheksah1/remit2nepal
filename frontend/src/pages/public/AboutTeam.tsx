import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { AboutHero, AboutPeople } from "@/components/public/AboutBlocks";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { groupTeam, isTeamCeo } from "@/utils/team";

function topLeadersHeading(value?: string) {
  if (!value || /^(managers\s*&\s*top employees|department heads)$/i.test(value.trim())) {
    return "Top Leaders";
  }
  return value;
}

export default function AboutTeam() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;
  const grouped = groupTeam(site.data?.team ?? []);
  const topLeaders = grouped.leads.filter((member) => !isTeamCeo(member));
  const staff = grouped.staff;

  if (site.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const title = about?.teamHeading || "Our Team";
  const description =
    about?.teamDescription || "The desk that runs corridors, branches, and the payout file every day.";

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
      {topLeaders.length ? (
        <AboutPeople
          kicker="Top Leaders"
          title={topLeadersHeading(about?.teamLeadHeading)}
          description="Top employees of the Remit2Nepal desk."
          members={topLeaders}
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
      {!topLeaders.length && !staff.length ? (
        <AboutPeople kicker="Team" title={title} description={description} members={[]} tone="team" />
      ) : null}
    </div>
  );
}
