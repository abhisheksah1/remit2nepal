export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="atmosphere-grid" />
      <svg className="atmosphere-corridors" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="corridorBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E3192" stopOpacity="0" />
            <stop offset="45%" stopColor="#2E3192" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2E3192" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="route-line" id="route-a" d="M-40 210 C 280 80, 620 260, 980 190 S 1380 80, 1500 140" fill="none" stroke="url(#corridorBlue)" />
        <path className="route-line delay-1" id="route-b" d="M-20 620 C 320 480, 610 640, 960 540 S 1320 430, 1500 470" fill="none" stroke="url(#corridorBlue)" />
        <path className="route-line delay-2" id="route-c" d="M80 860 C 420 700, 720 780, 1040 640 S 1360 560, 1480 600" fill="none" stroke="url(#corridorBlue)" />
        <circle className="nepal-pulse" cx="220" cy="230" r="4" fill="#2E3192" />
        <circle className="nepal-pulse" cx="980" cy="190" r="5" fill="#2E3192" />
        <circle r="3.5" fill="#2E3192">
          <animateMotion dur="10s" repeatCount="indefinite">
            <mpath href="#route-a" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#2E3192">
          <animateMotion dur="13s" begin="-4s" repeatCount="indefinite">
            <mpath href="#route-b" />
          </animateMotion>
        </circle>
      </svg>
      <div className="atmosphere-grain" />
    </div>
  );
}
