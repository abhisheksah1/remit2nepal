import { SITE_VISUALS } from "@/constants/visuals";

export function PageHero({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="page-hero relative overflow-hidden text-cream">
      <div className="hero-mesh opacity-40" />
      <svg className="hero-corridors" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden>
        <path className="corridor-path" d="M0 220 C 240 80, 520 300, 900 140 S 1140 80, 1200 110" fill="none" stroke="#C4A35A" strokeOpacity="0.45" />
      </svg>
      <div className="relative mx-auto grid max-w-site items-center gap-8 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr] sm:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">{kicker}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-cream/85">{description}</p> : null}
        </div>
        <div className="page-hero-portraits hidden sm:block">
          <img src={SITE_VISUALS.send} alt="Sending remittance from abroad" />
          <img src={SITE_VISUALS.receive} alt="Receiving remittance in Nepal" />
        </div>
      </div>
    </section>
  );
}
