import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { BoardChamber } from "@/components/public/BoardChamber";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { groupTeam, splitBoard } from "@/utils/team";

export default function AboutBoard() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;
  const { board } = groupTeam(site.data?.team ?? []);
  const { chair, rest } = splitBoard(board);

  if (site.isLoading) {
    return (
      <div className="board-desk">
        <div className="board-head">
          <SkeletonLines />
        </div>
      </div>
    );
  }

  const title = about?.boardHeading || "Board of Directors";
  const description =
    about?.boardDescription || "The board sets policy and keeps the payout desk accountable.";

  return (
    <>
      <SeoHead title={`${title} | Remit2Nepal`} description={description} />
      <BoardChamber
        kicker={about?.boardKicker || "Governance"}
        title={title}
        description={description}
        chair={chair}
        directors={rest}
      />
    </>
  );
}
