import type { StatItem } from "@/types/content";

const MAP_W = 800;
const MAP_H = 400;

const LAND = [
  { cx: 307, cy: 42, rx: 26, ry: 26 },
  { cx: 178, cy: 78, rx: 98, ry: 48 },
  { cx: 172, cy: 128, rx: 82, ry: 30 },
  { cx: 152, cy: 168, rx: 30, ry: 22 },
  { cx: 228, cy: 248, rx: 40, ry: 78 },
  { cx: 222, cy: 328, rx: 22, ry: 26 },
  { cx: 364, cy: 86, rx: 14, ry: 18 },
  { cx: 400, cy: 96, rx: 44, ry: 36 },
  { cx: 418, cy: 58, rx: 22, ry: 24 },
  { cx: 412, cy: 208, rx: 58, ry: 86 },
  { cx: 430, cy: 298, rx: 28, ry: 28 },
  { cx: 470, cy: 154, rx: 32, ry: 26 },
  { cx: 580, cy: 72, rx: 128, ry: 40 },
  { cx: 608, cy: 144, rx: 72, ry: 46 },
  { cx: 546, cy: 176, rx: 38, ry: 44 },
  { cx: 648, cy: 218, rx: 54, ry: 20 },
  { cx: 712, cy: 288, rx: 42, ry: 30 },
  { cx: 710, cy: 126, rx: 14, ry: 22 },
  { cx: 758, cy: 328, rx: 10, ry: 16 }
];

const NEPAL = { x: 589, y: 138 };

function continentDots() {
  const dots: Array<[number, number]> = [];
  const step = 7;
  for (let y = 16; y <= MAP_H - 16; y += step) {
    for (let x = 18; x <= MAP_W - 18; x += step) {
      const onLand = LAND.some(({ cx, cy, rx, ry }) => {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        return nx * nx + ny * ny < 0.96;
      });
      if (onLand) dots.push([x, y]);
    }
  }
  return dots;
}

const DOTS = continentDots();

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
      <circle cx={NEPAL.x} cy={NEPAL.y} r="4.2" fill="#E31E24" />
      <circle cx={NEPAL.x} cy={NEPAL.y} r="4.2" fill="none" stroke="#E31E24" strokeWidth="1.4">
        <animate attributeName="r" values="4.2;13;4.2" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0;0.85" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export function AboutGlobe({ stats = [] }: { stats?: StatItem[] }) {
  const first = stats[0];
  const second = stats[1];

  return (
    <div className="apro-globe" aria-hidden>
      <span className="apro-globe-atm" />
      <span className="apro-globe-halo" />
      <span className="apro-globe-ring" />
      <span className="apro-globe-ring is-inner" />
      <div className="apro-globe-sphere">
        <div className="apro-globe-spin">
          <svg viewBox={`0 0 ${MAP_W * 2} ${MAP_H}`} preserveAspectRatio="none">
            <defs>
              <g id="apro-land">
                {DOTS.map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="1.45" fill="#f4f6ff" fillOpacity="0.92" />
                ))}
              </g>
            </defs>
            <use href="#apro-land" />
            <use href="#apro-land" x={MAP_W} />
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
        <span className="apro-globe-shade" />
      </div>
      <span className="apro-globe-coin is-npr">रू</span>
      <span className="apro-globe-coin is-usd">$</span>
      <span className="apro-globe-coin is-gbp">£</span>
      <span className="apro-globe-coin is-aed">د.إ</span>
      {first ? (
        <p className="apro-globe-pill is-top">
          <strong>{first.value}</strong>
          <span>{first.label}</span>
        </p>
      ) : null}
      {second ? (
        <p className="apro-globe-pill is-bot">
          <strong>{second.value}</strong>
          <span>{second.label}</span>
        </p>
      ) : null}
    </div>
  );
}
