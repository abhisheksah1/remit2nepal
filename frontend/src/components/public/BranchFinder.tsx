import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, X } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId } from "@/utils/cn";

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function BranchFinder({ compact }: { compact?: boolean }) {
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [province, setProvince] = useState(searchParams.get("province") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");

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
    const source = province ? agents.filter((item) => item.province === province) : agents;
    return Array.from(new Set(source.map((item) => item.district).filter(Boolean))).sort();
  }, [agents, province]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return agents.filter((agent) => {
      if (province && agent.province !== province) return false;
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

  const visible = compact ? filtered.slice(0, 6) : filtered;
  const hasFilters = Boolean(q || province || district);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-navy/10 bg-white p-4 shadow-card md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_1fr_1fr_auto]">
          <Input
            name="q"
            label="Search agent"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Agent name or address"
          />
          <Select
            name="province"
            label="Province"
            value={province}
            placeholder="All provinces"
            options={provinces.map((item) => ({ value: item, label: item }))}
            onChange={(event) => {
              setProvince(event.target.value);
              setDistrict("");
            }}
          />
          <Select
            name="district"
            label="District"
            value={district}
            placeholder={province ? "All districts" : "Select province first or all"}
            options={districts.map((item) => ({ value: item, label: item }))}
            onChange={(event) => setDistrict(event.target.value)}
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={!hasFilters}
              onClick={() => {
                setQ("");
                setProvince("");
                setDistrict("");
              }}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          <Search className="h-4 w-4 text-gold" />
          {query.isLoading ? "Loading agents…" : `${filtered.length} agent${filtered.length === 1 ? "" : "s"} found`}
          {province ? ` in ${district || province}` : ""}
        </p>
      </div>

      {query.isLoading ? <SkeletonLines rows={4} /> : null}
      {query.isError ? <EmptyState title="Unable to load agents" description="Please try again shortly." /> : null}
      {!query.isLoading && filtered.length === 0 ? (
        <EmptyState title="No agents matched" description="Try another district, or search by agent name or street." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((branch) => (
          <Link
            key={entityId(branch)}
            to={`/branches/${entityId(branch)}`}
            className="lift-card rounded-2xl border border-navy/10 bg-white/90 p-5 shadow-card"
          >
            <p className="text-xs uppercase tracking-wider text-gold">{branch.district}</p>
            <h3 className="mt-1 font-display text-xl text-navy">{branch.name}</h3>
            <p className="mt-2 flex items-start gap-2 text-sm text-ink-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {branch.address}
            </p>
            {branch.phone ? <p className="mt-2 text-sm text-navy">{branch.phone}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
