import type { CSSProperties } from "react";
import type { StatItem } from "@/types/content";

const MAP_W = 1000;
const NEPAL = { x: 733.3, y: 172.2 };

const ARCS = [
  { id: "gulf", d: "M42 118 C 70 58, 118 52, 128 96", color: "#E31E24" },
  { id: "eu", d: "M78 64 C 102 38, 128 58, 128 96", color: "#2E3192" },
  { id: "sea", d: "M168 108 C 150 78, 136 70, 128 96", color: "#E31E24" },
  { id: "aus", d: "M162 148 C 148 128, 134 112, 128 96", color: "#2E3192" }
];

const HUBS = [
  { x: 46, y: 118, color: "#E31E24" },
  { x: 78, y: 64, color: "#2E3192" },
  { x: 128, y: 96, color: "#E31E24" },
  { x: 166, y: 108, color: "#2E3192" },
  { x: 160, y: 148, color: "#E31E24" }
];

function NepalPulse({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx={NEPAL.x} cy={NEPAL.y} r="5" fill="#E31E24" />
      <circle cx={NEPAL.x} cy={NEPAL.y} r="5" fill="none" stroke="#E31E24" strokeWidth="1.6">
        <animate attributeName="r" values="5;16;5" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export function AboutGlobe({ stats = [] }: { stats?: StatItem[] }) {
  const figures = stats.filter((item) => item.value && item.label).slice(0, 5);

  return (
    <div className={figures.length ? "apro-globe has-sats" : "apro-globe"}>
      <div className="apro-globe-scene" aria-hidden>
        <span className="apro-globe-atm" />
        <span className="apro-globe-halo" />
        <span className="apro-globe-ring" />
        <span className="apro-globe-ring is-inner" />
        <span className="apro-globe-ring is-sats" />
        <div className="apro-globe-sphere">
          <span className="apro-globe-ocean" />
          <div className="apro-globe-spin">
            <img src="/images/globe-countries.svg" alt="" />
            <img src="/images/globe-countries.svg" alt="" />
            <svg className="apro-globe-pulse" viewBox={`0 0 ${MAP_W * 2} 500`} preserveAspectRatio="none">
              <NepalPulse x={0} />
              <NepalPulse x={MAP_W} />
            </svg>
          </div>
          <svg className="apro-globe-grid" viewBox="0 0 200 200">
            <ellipse cx="100" cy="100" rx="96" ry="22" />
            <ellipse cx="100" cy="100" rx="96" ry="48" />
            <ellipse cx="100" cy="100" rx="96" ry="72" />
            <ellipse cx="100" cy="100" rx="28" ry="96" />
            <ellipse cx="100" cy="100" rx="56" ry="96" />
            <ellipse cx="100" cy="100" rx="80" ry="96" />
          </svg>
          <svg className="apro-globe-arcs" viewBox="0 0 200 200">
            {ARCS.map((arc) => (
              <g key={arc.id}>
                <path id={`apro-${arc.id}`} d={arc.d} className="apro-globe-path" stroke={arc.color} />
                <circle r="2.6" fill={arc.color}>
                  <animateMotion
                    dur="5.4s"
                    begin={arc.id === "eu" ? "-1.3s" : arc.id === "sea" ? "-2.6s" : arc.id === "aus" ? "-3.8s" : "0s"}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#apro-${arc.id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
            {HUBS.map((hub) => (
              <circle key={`${hub.x}-${hub.y}`} cx={hub.x} cy={hub.y} r="2.4" fill={hub.color} />
            ))}
          </svg>
          <span className="apro-globe-shine" />
        </div>
      </div>
      {figures.length ? null : (
        <>
          <span className="apro-globe-coin is-npr">रू</span>
          <span className="apro-globe-coin is-usd">$</span>
          <span className="apro-globe-coin is-gbp">£</span>
          <span className="apro-globe-coin is-aed">د.إ</span>
        </>
      )}
      {figures.length ? (
        <ul className="apro-globe-sats">
          {figures.map((item, index) => (
            <li
              key={`${item.label}-${item.value}`}
              className={`apro-globe-sat is-${index + 1}`}
              style={{ "--sat-a": `${-18 + (360 / figures.length) * index}deg` } as CSSProperties}
            >
              <div className="apro-globe-sat-hold">
                <p className="apro-globe-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
