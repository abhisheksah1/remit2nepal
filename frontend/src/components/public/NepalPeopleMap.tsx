import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MapPin, Phone, X } from "lucide-react";
import { NEPAL_MAP_VIEWBOX } from "@/constants/nepalMap";
import { NEPAL_MOSAIC, PROVINCE_DISTRICTS, sameProvince, type NepalMosaicCell } from "@/constants/nepalMosaic";
import { publicApi } from "@/api/public.api";
import type { BranchItem, CmsSection, GalleryItem } from "@/types/content";
import { cn, entityId } from "@/utils/cn";

function provinceAgents(agents: BranchItem[], province: string) {
  return agents.filter((agent) => sameProvince(agent.province, province));
}

function districtNames(agents: BranchItem[], province: string) {
  const fromAgents = Array.from(new Set(provinceAgents(agents, province).map((agent) => agent.district).filter(Boolean))).sort();
  if (fromAgents.length) return fromAgents;
  const official = Object.entries(PROVINCE_DISTRICTS).find(([name]) => sameProvince(name, province));
  return official?.[1] ?? [];
}

export function NepalPeopleMap({ label = "Map of Nepal" }: { label?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState<NepalMosaicCell | null>(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const query = useQuery({
    queryKey: ["public", "branches", "all"],
    queryFn: () => publicApi.branches({ limit: 5000 })
  });
  const agents = query.data?.items ?? [];

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hoverDistricts = hover ? districtNames(agents, hover.name) : [];
  const selectedAgents = useMemo(() => {
    if (!province) return [];
    const inProvince = provinceAgents(agents, province);
    if (!district) return inProvince;
    return inProvince.filter((agent) => agent.district.toLowerCase() === district.toLowerCase());
  }, [agents, province, district]);
  const selectedDistricts = province ? districtNames(agents, province) : [];

  function pickRegion(cell: NepalMosaicCell) {
    if (sameProvince(province, cell.name)) {
      setProvince("");
      setDistrict("");
      return;
    }
    const names = districtNames(agents, cell.name);
    setProvince(cell.name);
    setDistrict(names[0] ?? "");
  }

  return (
    <div ref={frameRef} className={cn("nepal-map-frame", inView && "is-in")}>
      <svg className="nepal-map-art" viewBox={NEPAL_MAP_VIEWBOX} role="img" aria-label={label}>
        {NEPAL_MOSAIC.map((cell, index) => {
          const ox = cell.band === 0 ? "-22px" : cell.band === 2 ? "22px" : "0px";
          const oy = cell.band === 1 ? "26px" : "14px";
          const on = province ? sameProvince(province, cell.name) : false;
          return (
            <g
              key={cell.id}
              className={cn("nepal-mosaic-cell", on && "is-on")}
              style={{ "--i": index, "--ox": ox, "--oy": oy } as CSSProperties}
              onMouseEnter={() => setHover(cell)}
              onMouseLeave={() => setHover((current) => (current?.id === cell.id ? null : current))}
            >
              <title>{cell.name}</title>
              <g className="nepal-mosaic-hit">
                <path
                  className="nepal-mosaic-fill"
                  d={cell.d}
                  tabIndex={0}
                  onFocus={() => setHover(cell)}
                  onBlur={() => setHover((current) => (current?.id === cell.id ? null : current))}
                  onClick={() => pickRegion(cell)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      pickRegion(cell);
                    }
                  }}
                />
                <path className="nepal-mosaic-stroke" d={cell.d} fill="none" />
              </g>
            </g>
          );
        })}
      </svg>

      {hover ? (
        <div
          className="nepal-mosaic-tip"
          style={{ left: `${(hover.x / 640) * 100}%`, top: `${(hover.y / 332) * 100}%` }}
        >
          <strong>{hover.name}</strong>
          <span>
            {hoverDistricts.length
              ? hoverDistricts.slice(0, 4).join(", ") + (hoverDistricts.length > 4 ? "…" : "")
              : "Click to see district agents"}
          </span>
        </div>
      ) : null}
      <p className="nepal-mosaic-hint">{hover ? `${hover.name} · click to open agents` : "Hover a region · click to see district agents"}</p>

      {province ? (
        <div className="nepal-agent-panel">
          <div className="nepal-agent-panel-head">
            <div>
              <p className="nepal-story-kicker">District agents</p>
              <h3>{province}</h3>
            </div>
            <button type="button" className="nepal-agent-close" onClick={() => { setProvince(""); setDistrict(""); }} aria-label="Close agent list">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="nepal-district-row">
            {selectedDistricts.map((name) => (
              <button
                key={name}
                type="button"
                className={cn("nepal-district-chip", district.toLowerCase() === name.toLowerCase() && "is-on")}
                onClick={() => setDistrict(name)}
              >
                {name}
                <em>{provinceAgents(agents, province).filter((agent) => agent.district.toLowerCase() === name.toLowerCase()).length}</em>
              </button>
            ))}
          </div>
          {query.isLoading ? <p className="nepal-mosaic-hint">Loading agents…</p> : null}
          {!query.isLoading && !selectedAgents.length ? (
            <p className="nepal-mosaic-hint">No published agents in {district || province} yet.</p>
          ) : null}
          <div className="nepal-agent-grid">
            {selectedAgents.map((agent) => (
              <Link key={entityId(agent)} to={`/branches/${entityId(agent)}`} className="nepal-agent-card">
                <p>{agent.district}</p>
                <h4>{agent.name}</h4>
                <span>
                  <MapPin />
                  {agent.address}
                </span>
                {agent.phone ? (
                  <span>
                    <Phone />
                    {agent.phone}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
          <Link className="nepal-story-cta" to={`/branches?province=${encodeURIComponent(province)}${district ? `&district=${encodeURIComponent(district)}` : ""}`}>
            View all in {district || province}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function NepalStory({
  section,
  compact
}: {
  section: CmsSection;
  gallery?: GalleryItem[];
  compact?: boolean;
}) {
  const align = section.alignment === "left" ? "is-left" : section.alignment === "right" ? "is-right" : "is-center";

  return (
    <section className={cn("nepal-story", "reveal-skip", compact && "is-compact")} aria-labelledby={`${section.key}-heading`}>
      <div className={cn("nepal-story-wrap", align)}>
        <header className="nepal-story-copy">
          {section.icon ? <p className="nepal-story-kicker">{section.icon}</p> : null}
          <h2 id={`${section.key}-heading`}>{section.heading || "Find an agent across Nepal"}</h2>
          {section.subheading ? <p className="nepal-story-lede">{section.subheading}</p> : null}
          {section.description && !/illustrated scenes of nepali/i.test(section.description) ? (
            <p className="nepal-story-body">{section.description}</p>
          ) : null}
        </header>
        <NepalPeopleMap label={section.heading || "Map of Nepal"} />
        {section.buttonUrl ? (
          <Link className="nepal-story-cta" to={section.buttonUrl}>
            {section.buttonLabel || "Our Agent"}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

