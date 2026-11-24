import type { CSSProperties } from "react";
import type { StatItem } from "@/types/content";
import { NEPAL_CITIES, NEPAL_PROVINCES } from "@/constants/nepalMap";

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
const NEPAL_SCALE = 0.16;
const NEPAL_SHIFT = { x: 70, y: 62 };
const KATHMANDU = {
  x: NEPAL_SHIFT.x + 411.3 * NEPAL_SCALE,
  y: NEPAL_SHIFT.y + 219.1 * NEPAL_SCALE
};

const CORRIDORS = [
  { id: "usa", x: 22, y: 82, color: "#E31E24", lift: 48 },
  { id: "uk", x: 64, y: 46, color: "#2E3192", lift: 44 },
  { id: "gulf", x: 38, y: 114, color: "#E31E24", lift: 36 },
  { id: "eu", x: 80, y: 54, color: "#2E3192", lift: 40 },
  { id: "afr", x: 70, y: 130, color: "#E31E24", lift: 28 },
  { id: "sea", x: 168, y: 108, color: "#2E3192", lift: 32 },
  { id: "aus", x: 160, y: 152, color: "#E31E24", lift: 30 },
  { id: "jp", x: 178, y: 68, color: "#2E3192", lift: 38 }
];

const RECEIVE_POINTS = [
  ...NEPAL_CITIES,
  { name: "Dhangadhi", x: 52, y: 128 },
  { name: "Jumla", x: 168, y: 78 },
  { name: "Butwal", x: 216, y: 210 },
  { name: "Janakpur", x: 441, y: 286 },
  { name: "Dharan", x: 560, y: 262 },
  { name: "Hetauda", x: 400, y: 248 }
];

function curve(fromX: number, fromY: number, toX: number, toY: number, lift: number) {
  const midX = (fromX + toX) / 2;
  const midY = Math.min(fromY, toY) - lift;
  return `M${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
}

function isNepalDot(x: number, y: number) {
  return x >= 572 && x <= 604 && y >= 126 && y <= 150;
}

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
        <div className="apro-globe-spin">
          <svg viewBox={`0 0 ${MAP_W * 2} ${MAP_H}`} preserveAspectRatio="none">
            <defs>
              <g id="apro-land">
                {DOTS.map(([x, y]) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={isNepalDot(x, y) ? 2.1 : 1.45}
                    fill={isNepalDot(x, y) ? "#E31E24" : "#f4f6ff"}
                    fillOpacity="0.92"
                  />
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
          {CORRIDORS.map((arc, index) => {
            const d = curve(arc.x, arc.y, KATHMANDU.x, KATHMANDU.y, arc.lift);
            return (
              <g key={arc.id}>
                <path id={`apro-${arc.id}`} d={d} className="apro-globe-path is-in" stroke={arc.color} />
                <circle r="2.5" fill={arc.color}>
                  <animateMotion dur="4.8s" begin={`${-index * 0.55}s`} repeatCount="indefinite">
                    <mpath href={`#apro-${arc.id}`} />
                  </animateMotion>
                </circle>
                <circle cx={arc.x} cy={arc.y} r="2.2" fill={arc.color} />
              </g>
            );
          })}
          <g transform={`translate(${NEPAL_SHIFT.x} ${NEPAL_SHIFT.y}) scale(${NEPAL_SCALE})`}>
            {NEPAL_PROVINCES.map((province) => (
              <path key={province.id} d={province.d} className="apro-nepal-fill" />
            ))}
            {RECEIVE_POINTS.map((city, index) => (
              <g key={city.name}>
                <path
                  d={curve(411.3, 219.1, city.x, city.y, 18 + (index % 3) * 8)}
                  className={`apro-nepal-route ${index % 2 ? "is-navy" : "is-red"}`}
                  style={{ animationDelay: `${-index * 0.35}s` }}
                />
                <circle cx={city.x} cy={city.y} r="5.5" fill={index % 2 ? "#2E3192" : "#E31E24"} />
              </g>
            ))}
            <circle cx="411.3" cy="219.1" r="8" fill="#E31E24" />
            <circle cx="411.3" cy="219.1" r="8" fill="none" stroke="#E31E24" strokeWidth="3">
              <animate attributeName="r" values="8;22;8" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
        <span className="apro-globe-shade" />
      </div>
      {figures.length ? null : (
        <>
          <span className="apro-globe-coin is-npr">रू</span>
          <span className="apro-globe-coin is-usd">$</span>
          <span className="apro-globe-coin is-gbp">£</span>
          <span className="apro-globe-coin is-aed">د.إ</span>
        </>
      )}
      </div>
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
