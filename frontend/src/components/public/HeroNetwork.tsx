function EarthLand() {
  return (
    <g fill="#4d5eab" fillOpacity="0.82">
      <path d="M42 62c18-22 52-24 58 6 8 28-18 58-36 72-16-10-32-42-22-78z" />
      <path d="M78 118c12 8 18 28 8 44-14 6-28-8-32-24 4-10 12-16 24-20z" />
      <path d="M188 58c18-10 32 4 28 22-10 8-24 6-32-4 0-8 2-14 4-18z" />
      <path d="M196 92c22-6 34 18 28 48-10 18-28 22-38 8 2-18 4-38 10-56z" />
      <path d="M228 52c48-16 96-2 112 28-18 22-70 18-102 8-8-10-12-22-10-36z" />
      <path d="M312 132c18-4 28 10 22 22-12 8-26 2-28-8 0-6 2-12 6-14z" />
      <circle cx="292" cy="72" r="4" fill="#E31E24" />
    </g>
  );
}

const ROUTES = [
  { id: "gulf", d: "M36 118 C 70 48, 118 42, 132 96", color: "#E31E24", delay: "0s" },
  { id: "uk", d: "M72 58 C 98 28, 128 52, 132 96", color: "#8F91D0", delay: "-1.4s" },
  { id: "usa", d: "M48 86 C 78 64, 114 74, 132 96", color: "#E31E24", delay: "-2.6s" },
  { id: "aus", d: "M168 148 C 154 118, 138 104, 132 96", color: "#8F91D0", delay: "-3.8s" }
];

export function HeroNetwork() {
  return (
    <div className="hero-hub" aria-hidden>
      <span className="hero-hub-ring" />
      <span className="hero-hub-ring is-slow" />
      <div className="hero-hub-globe">
        <div className="hero-hub-spin">
          <svg viewBox="0 0 800 200" preserveAspectRatio="none">
            <EarthLand />
            <g transform="translate(400 0)">
              <EarthLand />
            </g>
          </svg>
        </div>
        <svg className="hero-hub-grid" viewBox="0 0 200 200">
          <ellipse cx="100" cy="100" rx="96" ry="24" />
          <ellipse cx="100" cy="100" rx="96" ry="52" />
          <ellipse cx="100" cy="100" rx="96" ry="78" />
          <ellipse cx="100" cy="100" rx="32" ry="96" />
          <ellipse cx="100" cy="100" rx="62" ry="96" />
        </svg>
        <span className="hero-hub-shade" />
        <span className="hero-hub-core">
          <b>$</b>
          <b>€</b>
          <b>£</b>
          <b>¥</b>
        </span>
      </div>
      <svg className="hero-hub-routes" viewBox="0 0 200 200">
        {ROUTES.map((route) => (
          <g key={route.id}>
            <path id={`hub-${route.id}`} d={route.d} className="hero-hub-path" stroke={route.color} />
            <circle r="3" fill={route.color}>
              <animateMotion dur="6.4s" begin={route.delay} repeatCount="indefinite">
                <mpath href={`#hub-${route.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>
      <article className="hero-float is-send">
        <span>Example</span>
        <strong>Sending $1,250</strong>
        <em>Gulf corridor</em>
      </article>
      <article className="hero-float is-recv">
        <span>Example</span>
        <strong>Received NPR</strong>
        <em>Family payout</em>
      </article>
      <article className="hero-float is-shield">
        <span>Protected</span>
        <strong>Secure Transaction</strong>
      </article>
      <article className="hero-float is-status">
        <span>Transfer Status</span>
        <strong>
          <i /> Processing
        </strong>
        <em>Fast &amp; Reliable</em>
        <b className="hero-progress" />
      </article>
    </div>
  );
}
