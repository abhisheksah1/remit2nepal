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
      <div className="hero-mesh opacity-30" />
      <div className="relative mx-auto max-w-site px-4 py-14 lg:px-8 sm:py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">{kicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-cream/85">{description}</p> : null}
      </div>
    </section>
  );
}
