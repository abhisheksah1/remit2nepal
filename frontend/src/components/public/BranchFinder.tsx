import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Phone, Search, X } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { NepalPeopleMap } from "@/components/public/NepalPeopleMap";
import { cn, entityId } from "@/utils/cn";
import { sameProvince } from "@/constants/nepalMosaic";
import type { BranchItem } from "@/types/content";

const PAGE_SIZE = 12;

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function AgentCard({
  branch,
  index = 0
}: {
  branch: BranchItem;
  index?: number;
}) {
  return (
    <Link
      to={`/branches/${entityId(branch)}`}
      className="agent-card"
      style={{ "--i": index } as CSSProperties}
    >
      <span className="agent-card-mark" aria-hidden>
        <MapPin />
      </span>
      <div className="agent-card-body">
        <p>
          {branch.district}
          {branch.province ? <small>{branch.province}</small> : null}
        </p>
        <h3>{branch.name}</h3>
        <span>
          <MapPin />
          {branch.address}
        </span>
        {branch.phone ? (
          <em>
            <Phone />
            {branch.phone}
          </em>
        ) : null}
      </div>
      <span className="agent-card-go">
        View
        <ArrowUpRight />
      </span>
    </Link>
  );
}

export function BranchFinder({ compact }: { compact?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [province, setProvince] = useState(searchParams.get("province") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["public", "branches", "all"],
    queryFn: () => publicApi.branches({ limit: 5000 })
  });

  const agents = query.data?.items ?? [];
  const provinces = useMemo(
    () => Array.from(new Set(agents.map((item) => item.province).filter(Boolean))).sort(),
    [agents]
  );
  const districts = useMemo(() => {
    const source = province ? agents.filter((item) => sameProvince(item.province, province)) : agents;
    return Array.from(new Set(source.map((item) => item.district).filter(Boolean))).sort();
  }, [agents, province]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return agents.filter((agent) => {
      if (province && !sameProvince(agent.province, province)) return false;
      if (district && agent.district !== district) return false;
      if (!needle) return true;
      return (
        matchesQuery(agent.name, needle) ||
        matchesQuery(agent.address, needle) ||
        matchesQuery(agent.district, needle) ||
        matchesQuery(agent.city || "", needle) ||
        matchesQuery(agent.branchCode, needle)
      );
    });
  }, [agents, q, province, district]);

  const pageSize = compact ? 6 : PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = compact ? filtered.slice(0, pageSize) : filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const hasFilters = Boolean(q || province || district);

  useEffect(() => {
    setPage(1);
  }, [q, province, district]);

  useEffect(() => {
    if (compact) return;
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (province) next.set("province", province);
    if (district) next.set("district", district);
    setSearchParams(next, { replace: true });
  }, [compact, q, province, district, setSearchParams]);

  function goPage(next: number) {
    setPage(next);
    window.requestAnimationFrame(() => {
      document.querySelector(".agent-grid")?.scrollIntoView({ block: "start" });
    });
  }

  const directory = (
    <>
      <div className="agent-dock">
        <div className="agent-dock-grid">
          <label className="agent-field is-search">
            <span>Search agent</span>
            <Search />
            <input
              name="q"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Agent name or street"
            />
          </label>
          <label className="agent-field">
            <span>Province</span>
            <select
              name="province"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value);
                setDistrict("");
              }}
            >
              <option value="">All provinces</option>
              {provinces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="agent-field">
            <span>District</span>
            <select name="district" value={district} onChange={(event) => setDistrict(event.target.value)}>
              <option value="">{province ? "All districts" : "All districts"}</option>
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="agent-clear"
            disabled={!hasFilters}
            onClick={() => {
              setQ("");
              setProvince("");
              setDistrict("");
            }}
          >
            <X />
            Clear
          </button>
        </div>
        <p className="agent-count">
          <Search />
          {query.isLoading ? "Loading agents…" : `${filtered.length} agent${filtered.length === 1 ? "" : "s"} found`}
          {province ? ` in ${district || province}` : ""}
        </p>
      </div>

      {query.isLoading ? <SkeletonLines rows={4} /> : null}
      {query.isError ? <EmptyState title="Unable to load agents" description="Please try again shortly." /> : null}
      {!query.isLoading && filtered.length === 0 ? (
        <EmptyState title="No agents matched" description="Try another district, or search by agent name or street." />
      ) : null}

      <div className="agent-grid" key={`${province}-${district}-${safePage}`}>
        {visible.map((branch, index) => (
          <AgentCard key={entityId(branch)} branch={branch} index={index} />
        ))}
      </div>

      {compact && filtered.length > pageSize ? (
        <Link to="/branches" className="agent-more">
          View all agents
        </Link>
      ) : null}

      {!compact && filtered.length > pageSize ? (
        <div className="agent-pager">
          <button type="button" disabled={safePage <= 1} onClick={() => goPage(safePage - 1)}>
            <ChevronLeft />
            Previous
          </button>
          <p>
            {safePage} / {pageCount}
          </p>
          <button type="button" disabled={safePage >= pageCount} onClick={() => goPage(safePage + 1)}>
            Next
            <ChevronRight />
          </button>
        </div>
      ) : null}
    </>
  );

  return (
    <div className={cn("agent-finder", compact ? "is-compact" : "is-page")}>
      {compact ? (
        directory
      ) : (
        <div className="agent-atlas">
          <div className="agent-atlas-board">
            <p className="agent-atlas-kicker">Nepal atlas</p>
            <h2>Choose a province</h2>
            <NepalPeopleMap
              variant="atlas"
              label="Our Agent map"
              province={province}
              onProvince={(name) => {
                setProvince(name);
                setDistrict("");
              }}
            />
          </div>
          <div className="agent-atlas-dir">{directory}</div>
        </div>
      )}
    </div>
  );
}
