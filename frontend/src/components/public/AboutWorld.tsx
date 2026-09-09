export function AboutWorld({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 420" fill="none" aria-hidden>
      <defs>
        <linearGradient id="aw-sea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E3192" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E31E24" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <ellipse cx="320" cy="210" rx="270" ry="168" fill="url(#aw-sea)" />
      <ellipse cx="320" cy="210" rx="270" ry="168" stroke="#2E3192" strokeOpacity="0.18" />
      <ellipse cx="320" cy="210" rx="198" ry="124" stroke="#E31E24" strokeOpacity="0.16" strokeDasharray="4 8" />
      <path
        d="M148 168c22-28 48-34 78-18 18 10 28 8 46-6 22-18 48-16 70 4 16 14 38 12 54-4 20-18 48-10 62 16 10 18 8 40-8 54-18 16-14 38 6 50 14 8 16 28 2 40-22 18-54 14-74-6-16-16-38-14-52 4-18 24-50 22-70-2-14-16-36-14-50 2-22 24-54 16-70-10-10-16-6-36 8-46 18-14 16-36-4-48z"
        fill="#2E3192"
        fillOpacity="0.22"
      />
      <path d="M118 210 C 210 96, 430 90, 522 210" stroke="#E31E24" strokeWidth="1.4" fill="none" opacity="0.55" />
      <path d="M140 268 C 250 310, 400 318, 510 250" stroke="#2E3192" strokeWidth="1.4" fill="none" opacity="0.45" />
      <path d="M168 148 C 280 190, 360 250, 490 292" stroke="#E31E24" strokeWidth="1.2" fill="none" opacity="0.4" />
      {[
        [168, 148],
        [250, 176],
        [320, 132],
        [410, 168],
        [490, 210],
        [210, 250],
        [330, 268],
        [460, 292]
      ].map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={index % 2 ? 5 : 6} fill={index % 2 ? "#E31E24" : "#2E3192"} />
          <circle cx={x} cy={y} r="11" stroke={index % 2 ? "#E31E24" : "#2E3192"} strokeOpacity="0.28" />
        </g>
      ))}
    </svg>
  );
}
