type VisualKind = "hero" | "commitment" | "fraud" | "flow";

export function ComplianceVisual({ kind }: { kind: VisualKind }) {
  if (kind === "commitment") return <CommitmentScene />;
  if (kind === "fraud") return <FraudScene />;
  if (kind === "flow") return <FlowScene />;
  return <HeroScene />;
}

function HeroScene() {
  return (
    <svg className="cpro-art" viewBox="0 0 480 480" aria-hidden>
      <defs>
        <radialGradient id="cproHeroGlow" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#5b5ec4" />
          <stop offset="55%" stopColor="#2e3192" />
          <stop offset="100%" stopColor="#17194f" />
        </radialGradient>
        <linearGradient id="cproShield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f8ff" />
          <stop offset="100%" stopColor="#d7dbf4" />
        </linearGradient>
      </defs>
      <circle cx="240" cy="240" r="168" fill="url(#cproHeroGlow)" />
      <circle cx="240" cy="240" r="196" fill="none" stroke="rgba(46,49,146,0.18)" strokeDasharray="6 10" />
      <circle cx="240" cy="240" r="148" fill="none" stroke="rgba(247,248,255,0.16)" />
      <path d="M92 210 C 140 120, 200 148, 240 188" fill="none" stroke="#e31e24" strokeWidth="1.6" opacity="0.8" />
      <path d="M388 168 C 330 110, 276 150, 240 188" fill="none" stroke="#f7f8ff" strokeWidth="1.4" opacity="0.55" />
      <path d="M120 312 C 168 250, 210 240, 240 188" fill="none" stroke="#e31e24" strokeWidth="1.4" opacity="0.55" />
      <circle cx="92" cy="210" r="5" fill="#e31e24" />
      <circle cx="388" cy="168" r="5" fill="#f7f8ff" />
      <circle cx="120" cy="312" r="5" fill="#e31e24" />
      <circle cx="352" cy="318" r="4" fill="#9aa0d8" />
      <circle cx="176" cy="128" r="3.5" fill="#f7f8ff" opacity="0.8" />
      <path
        d="M240 108 C 292 124, 328 150, 328 214 C 328 286, 284 334, 240 368 C 196 334, 152 286, 152 214 C 152 150, 188 124, 240 108Z"
        fill="url(#cproShield)"
      />
      <path
        d="M240 128 C 280 142, 308 162, 308 214 C 308 272, 274 314, 240 344 C 206 314, 172 272, 172 214 C 172 162, 200 142, 240 128Z"
        fill="#2e3192"
      />
      <circle cx="240" cy="208" r="46" fill="none" stroke="#f7f8ff" strokeWidth="2" opacity="0.35" />
      <ellipse cx="240" cy="208" rx="46" ry="16" fill="none" stroke="#f7f8ff" strokeWidth="1.2" opacity="0.45" />
      <path d="M222 210 L234 222 L262 192" fill="none" stroke="#e31e24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="206" y="268" width="68" height="10" rx="5" fill="#f7f8ff" opacity="0.28" />
      <rect x="218" y="286" width="44" height="8" rx="4" fill="#e31e24" opacity="0.85" />
    </svg>
  );
}

function CommitmentScene() {
  return (
    <svg className="cpro-art" viewBox="0 0 560 420" aria-hidden>
      <defs>
        <linearGradient id="cproDesk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef0fb" />
          <stop offset="100%" stopColor="#d9dcf3" />
        </linearGradient>
      </defs>
      <rect x="24" y="28" width="512" height="364" rx="36" fill="url(#cproDesk)" />
      <circle cx="400" cy="168" r="108" fill="#2e3192" />
      <circle cx="400" cy="168" r="78" fill="none" stroke="#f7f8ff" strokeWidth="1.2" opacity="0.28" />
      <path d="M338 168 C 360 128, 388 132, 400 150" fill="none" stroke="#e31e24" strokeWidth="1.6" />
      <path d="M458 128 C 430 108, 412 136, 400 150" fill="none" stroke="#f7f8ff" strokeWidth="1.4" opacity="0.7" />
      <circle cx="338" cy="168" r="4" fill="#e31e24" />
      <circle cx="458" cy="128" r="4" fill="#f7f8ff" />
      <circle cx="430" cy="214" r="3.5" fill="#e31e24" />
      <path d="M400 108 C 432 118, 452 134, 452 168 C 452 208, 428 236, 400 256 C 372 236, 348 208, 348 168 C 348 134, 368 118, 400 108Z" fill="#f7f8ff" />
      <path d="M388 168 L396 176 L416 154" fill="none" stroke="#e31e24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="56" y="88" width="220" height="248" rx="24" fill="#fff" />
      <rect x="78" y="112" width="120" height="12" rx="6" fill="#2e3192" opacity="0.9" />
      <rect x="78" y="140" width="176" height="8" rx="4" fill="#d7dbed" />
      <rect x="78" y="160" width="154" height="8" rx="4" fill="#d7dbed" />
      <g fill="#eef0fb">
        <rect x="78" y="196" width="176" height="36" rx="10" />
        <rect x="78" y="244" width="176" height="36" rx="10" />
        <rect x="78" y="292" width="176" height="36" rx="10" />
      </g>
      <circle cx="96" cy="214" r="7" fill="#2e3192" />
      <circle cx="96" cy="262" r="7" fill="#e31e24" />
      <circle cx="96" cy="310" r="7" fill="#2e3192" />
    </svg>
  );
}

function FraudScene() {
  return (
    <svg className="cpro-art is-bright" viewBox="0 0 420 360" aria-hidden>
      <rect x="18" y="22" width="384" height="316" rx="32" fill="#fff5f5" />
      <circle cx="210" cy="168" r="96" fill="#2e3192" />
      <path d="M210 92 C 252 106, 278 126, 278 168 C 278 218, 246 250, 210 276 C 174 250, 142 218, 142 168 C 142 126, 168 106, 210 92Z" fill="#f7f8ff" />
      <path d="M210 112 C 242 124, 260 140, 260 168 C 260 206, 238 232, 210 252 C 182 232, 160 206, 160 168 C 160 140, 178 124, 210 112Z" fill="#e31e24" />
      <path d="M192 170 L204 182 L230 152" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="86" y="278" width="248" height="28" rx="14" fill="#2e3192" opacity="0.1" />
      <circle cx="72" cy="86" r="10" fill="#2e3192" />
      <circle cx="348" cy="74" r="8" fill="#e31e24" />
      <circle cx="360" cy="250" r="7" fill="#2e3192" />
    </svg>
  );
}

function FlowScene() {
  const steps = ["Compliance", "Risk", "Security", "Operations"];
  return (
    <div className="cpro-flow" aria-hidden>
      {steps.map((step, index) => (
        <span key={step}>
          {step}
          {index < steps.length - 1 ? <i /> : null}
        </span>
      ))}
    </div>
  );
}
