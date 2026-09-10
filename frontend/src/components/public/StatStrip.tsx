import type { StatItem } from "@/types/content";

export function StatStrip({ stats }: { stats: StatItem[] }) {
  const items = stats.filter((item) => item.value && item.label);
  if (!items.length) return null;

  return (
    <div className="hero-metrics">
      <svg className="hero-metrics-wave" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden>
        <path d="M40 78 C 180 18, 320 118, 500 58 C 680 8, 820 108, 960 48" />
        <circle cx="140" cy="42" r="6" />
        <circle cx="500" cy="58" r="6" />
        <circle cx="860" cy="72" r="6" />
      </svg>
      <div className="hero-metrics-inner">
        {items.map((item) => (
          <div key={item.label} className="hero-metrics-item">
            <p>{item.value}</p>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
