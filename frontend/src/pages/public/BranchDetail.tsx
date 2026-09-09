import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { AgentCard } from "@/components/public/BranchFinder";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId } from "@/utils/cn";
import NotFound from "./NotFound";

export default function BranchDetail() {
  const { id = "" } = useParams();
  const query = useQuery({
    queryKey: ["public", "branch", id],
    queryFn: () => publicApi.branch(id),
    enabled: Boolean(id),
    retry: false
  });
  const list = useQuery({
    queryKey: ["public", "branches", "all"],
    queryFn: () => publicApi.branches({ limit: 5000 })
  });

  const branch = query.data;
  const nearby = useMemo(() => {
    if (!branch) return [];
    const current = entityId(branch);
    return (list.data?.items ?? [])
      .filter((item) => item.district === branch.district && entityId(item) !== current)
      .slice(0, 4);
  }, [branch, list.data]);

  if (query.isLoading) {
    return (
      <div className="agent-desk">
        <div className="agent-stage">
          <SkeletonLines />
        </div>
      </div>
    );
  }
  if (!branch) return <NotFound />;

  const place = [branch.address, branch.district, branch.province].filter(Boolean).join(", ");

  return (
    <div className="agent-desk reveal-skip">
      <SeoHead title={branch.name} description={`${branch.address}, ${branch.district}`} />
      <div className="agent-sky" aria-hidden>
        <span className="agent-mesh" />
        <div className="agent-mountains" />
      </div>
      <div className="agent-profile">
        <Link to="/branches" className="agent-back">
          ← Our Agent
        </Link>
        <article className="agent-profile-card">
          <p className="agent-profile-kicker">{branch.district}</p>
          <h1>{branch.name}</h1>
          {branch.branchCode ? <p className="agent-profile-code">Desk {branch.branchCode}</p> : null}

          <ul className="agent-facts">
            <li>
              <span className="agent-facts-ico" aria-hidden>
                <MapPin />
              </span>
              <div>
                <small>Address</small>
                <p>{place}</p>
              </div>
            </li>
            {branch.phone ? (
              <li>
                <span className="agent-facts-ico" aria-hidden>
                  <Phone />
                </span>
                <div>
                  <small>Phone</small>
                  <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                </div>
              </li>
            ) : null}
            <li>
              <span className="agent-facts-ico" aria-hidden>
                <Clock />
              </span>
              <div>
                <small>Hours</small>
                <p>
                  {branch.openingTime}–{branch.closingTime}
                  {branch.weeklyHoliday ? ` · Weekly holiday ${branch.weeklyHoliday}` : ""}
                </p>
              </div>
            </li>
          </ul>

          {branch.managerName ? <p className="agent-profile-note">Manager {branch.managerName}</p> : null}

          {branch.servicesAvailable?.length ? (
            <ul className="agent-chips">
              {branch.servicesAvailable.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {branch.googleMapUrl ? (
            <a className="agent-maps" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
              <ArrowUpRight />
            </a>
          ) : null}
        </article>

        {nearby.length ? (
          <section className="agent-nearby" aria-labelledby="nearby-title">
            <h2 id="nearby-title">More in {branch.district}</h2>
            <div className="agent-grid">
              {nearby.map((item, index) => (
                <AgentCard key={entityId(item)} branch={item} index={index} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
