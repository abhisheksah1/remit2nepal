export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="atmosphere-wash" />
      <div className="atmosphere-aurora" />
      <svg className="atmosphere-corridors" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="corridorGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4A35A" stopOpacity="0" />
            <stop offset="45%" stopColor="#C4A35A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#C4A35A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="route-line" id="route-a" d="M-40 210 C 280 80, 620 260, 980 190 S 1380 80, 1500 140" fill="none" stroke="url(#corridorGold)" />
        <path className="route-line delay-1" id="route-b" d="M-20 620 C 320 480, 610 640, 960 540 S 1320 430, 1500 470" fill="none" stroke="url(#corridorGold)" />
        <path className="route-line delay-2" id="route-c" d="M80 860 C 420 700, 720 780, 1040 640 S 1360 560, 1480 600" fill="none" stroke="url(#corridorGold)" />
        <circle className="nepal-pulse" cx="220" cy="240" r="5" fill="#C4A35A" />
        <circle className="nepal-pulse" cx="980" cy="190" r="6" fill="#C4A35A" />
        <circle className="money-dot dot-a" r="4" fill="#C4A35A">
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#route-a" />
          </animateMotion>
        </circle>
        <circle className="money-dot dot-b" r="3.5" fill="#F4EBD4">
          <animateMotion dur="12s" begin="-3s" repeatCount="indefinite" rotate="auto">
            <mpath href="#route-b" />
          </animateMotion>
        </circle>
        <circle className="money-dot dot-c" r="3" fill="#C4A35A">
          <animateMotion dur="15s" begin="-6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#route-c" />
          </animateMotion>
        </circle>
      </svg>
      <div className="atmosphere-orbs">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <div className="atmosphere-grain" />
    </div>
  );
}
