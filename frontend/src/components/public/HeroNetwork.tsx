import { NEPAL_CITIES, NEPAL_MAP_VIEWBOX, NEPAL_PROVINCES } from "@/constants/nepalMap";

const FILLS: Record<string, string> = {
  P1: "#3A3DA8",
  P2: "#E31E24",
  P3: "#2E3192",
  P4: "#5B5DB8",
  P5: "#C4191F",
  P6: "#25277A",
  P7: "#8F91D0"
};

const FLIGHTS = [
  { id: "ktm", d: "M18 50 C 38 14, 58 18, 74 52", delay: "0s", color: "#E31E24" },
  { id: "p7", d: "M18 50 C 30 24, 40 30, 52 42", delay: "-0.8s", color: "#2E3192" },
  { id: "p6", d: "M18 50 C 32 10, 46 16, 56 36", delay: "-1.6s", color: "#E31E24" },
  { id: "p5", d: "M18 50 C 34 20, 48 40, 62 58", delay: "-2.4s", color: "#2E3192" },
  { id: "p4", d: "M18 50 C 40 8, 54 20, 68 44", delay: "-3.2s", color: "#E31E24" },
  { id: "p3", d: "M18 50 C 42 12, 60 22, 74 50", delay: "-4s", color: "#2E3192" },
  { id: "p2", d: "M18 50 C 44 32, 64 50, 80 68", delay: "-4.8s", color: "#E31E24" },
  { id: "p1", d: "M18 50 C 48 10, 72 24, 88 60", delay: "-5.6s", color: "#2E3192" }
];

function EarthLand() {
  return (
    <g fill="#7eb6ff" fillOpacity="0.92">
      <path d="M42 62c18-22 52-24 58 6 8 28-18 58-36 72-16-10-32-42-22-78z" />
      <path d="M78 118c12 8 18 28 8 44-14 6-28-8-32-24 4-10 12-16 24-20z" />
      <path d="M188 58c18-10 32 4 28 22-10 8-24 6-32-4 0-8 2-14 4-18z" />
      <path d="M196 92c22-6 34 18 28 48-10 18-28 22-38 8 2-18 4-38 10-56z" />
      <path d="M228 52c48-16 96-2 112 28-18 22-70 18-102 8-8-10-12-22-10-36z" />
      <path d="M312 132c18-4 28 10 22 22-12 8-26 2-28-8 0-6 2-12 6-14z" />
      <circle className="hero-globe-nepal" cx="292" cy="72" r="4" fill="#E31E24" />
    </g>
  );
}

function EarthGlobe() {
  return (
    <div className="hero-earth">
      <div className="hero-earth-ring" aria-hidden />
      <div className="hero-earth-sphere">
        <div className="hero-earth-spin">
          <svg viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            <EarthLand />
            <g transform="translate(400 0)">
              <EarthLand />
            </g>
          </svg>
        </div>
        <svg className="hero-earth-grid" viewBox="0 0 200 200" aria-hidden>
          <ellipse cx="100" cy="100" rx="96" ry="28" />
          <ellipse cx="100" cy="100" rx="96" ry="56" />
          <ellipse cx="100" cy="100" rx="36" ry="96" />
          <ellipse cx="100" cy="100" rx="68" ry="96" />
        </svg>
        <div className="hero-earth-shade" />
      </div>
    </div>
  );
}

export function HeroNetwork() {
  return (
    <div className="hero-network hero-corridor">
      <EarthGlobe />

      <svg className="hero-flights" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {FLIGHTS.map((flight) => (
          <g key={flight.id}>
            <path id={`flight-${flight.id}`} d={flight.d} className="hero-flight-path" />
            <circle r="1.15" fill={flight.color}>
              <animateMotion dur="4.8s" begin={flight.delay} repeatCount="indefinite">
                <mpath href={`#flight-${flight.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      <div className="hero-nepal">
        <svg className="hero-nepal-art" viewBox={NEPAL_MAP_VIEWBOX} role="img" aria-label="Map of Nepal">
          {NEPAL_PROVINCES.map((province, index) => (
            <path
              key={province.id}
              className="hero-province"
              d={province.d}
              fill={FILLS[province.id]}
              style={{ animationDelay: `${index * 0.35}s` }}
            >
              <title>{province.name} Province</title>
            </path>
          ))}
          {NEPAL_PROVINCES.map((province) => (
            <text key={`${province.id}-label`} x={province.label.x} y={province.label.y} className="hero-province-label">
              {province.name}
            </text>
          ))}
          {NEPAL_CITIES.map((city) => (
            <g key={city.name}>
              {city.name === "Kathmandu" ? <circle cx={city.x} cy={city.y} r="10" className="nepal-pulse" fill="#E31E24" /> : null}
              <circle cx={city.x} cy={city.y} r={city.name === "Kathmandu" ? 3.4 : 2.2} fill="#fff" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
