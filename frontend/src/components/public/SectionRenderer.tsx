import { Link } from "react-router-dom";
import { ArrowRight, Banknote, Briefcase, Building2, Globe, Send, ShieldCheck, Smartphone } from "lucide-react";
import type { CmsSection, NewsItem, PartnerItem, ServiceItem, StatItem, WhyItem } from "@/types/content";
import type { PublicRatesPayload } from "@/types/rates";
import { Hero } from "./Hero";
import { RateTable } from "./RateTable";
import { BranchFinder } from "./BranchFinder";
import { Button } from "@/components/ui/Button";
import { entityId } from "@/utils/cn";
import { formatDate } from "@/utils/format";

const icons = {
  globe: Globe,
  send: Send,
  banknote: Banknote,
  "building-2": Building2,
  smartphone: Smartphone,
  briefcase: Briefcase
};

export function SectionRenderer({
  section,
  services,
  partners,
  news,
  rates
}: {
  section: CmsSection;
  services: ServiceItem[];
  partners: PartnerItem[];
  news: NewsItem[];
  rates?: PublicRatesPayload;
}) {
  switch (section.type) {
    case "HERO":
      return <Hero section={section} />;
    case "STATS":
      return <StatsSection section={section} />;
    case "SERVICES":
      return <ServicesSection section={section} services={services} />;
    case "RATES":
      return rates ? (
        <section className="mx-auto max-w-site px-4 py-16">
          <SectionHeading section={section} />
          <div className="glass-panel rounded-3xl p-4 sm:p-6">
            <RateTable payload={rates} compact />
          </div>
          {section.buttonUrl ? (
            <div className="mt-6">
              <Link to={section.buttonUrl} className="inline-flex items-center gap-2 text-sm font-medium text-navy">
                {section.buttonLabel || "Full rate table"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </section>
      ) : null;
    case "WHY_CHOOSE":
      return <WhySection section={section} />;
    case "PARTNERS":
      return <PartnersSection section={section} partners={partners} />;
    case "NEWS":
      return <NewsSection section={section} news={news} />;
    case "BRANCH_FINDER":
      return (
        <section className="mx-auto max-w-site px-4 py-16">
          <SectionHeading section={section} />
          <BranchFinder compact />
        </section>
      );
    case "CONTACT_CTA":
      return (
        <section className="mx-auto max-w-site px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-cream md:flex md:items-center md:justify-between">
            <div className="hero-mesh opacity-40" />
            <div className="relative">
              <h2 className="font-display text-3xl">{section.heading}</h2>
              <p className="mt-3 max-w-xl text-cream/80">{section.description}</p>
            </div>
            {section.buttonUrl ? (
              <Link to={section.buttonUrl} className="relative mt-6 inline-block md:mt-0">
                <Button variant="gold" className="btn-shimmer">{section.buttonLabel}</Button>
              </Link>
            ) : null}
          </div>
        </section>
      );
    default:
      return section.heading ? (
        <section className="mx-auto max-w-site px-4 py-16">
          <SectionHeading section={section} />
          <div className="prose-r2n" dangerouslySetInnerHTML={{ __html: section.description }} />
        </section>
      ) : null;
  }
}

function SectionHeading({ section }: { section: CmsSection }) {
  return (
    <div className="mb-8 max-w-2xl">
      <div className="section-gold-line mb-3 h-px w-16 bg-gold" />
      <h2 className="font-display text-3xl text-navy sm:text-4xl">{section.heading}</h2>
      {section.subheading ? <p className="mt-3 text-ink-muted">{section.subheading}</p> : null}
    </div>
  );
}

function StatsSection({ section }: { section: CmsSection }) {
  const items = Array.isArray(section.items) ? (section.items as StatItem[]) : [];
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-14 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-display text-3xl text-navy">{item.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ section, services }: { section: CmsSection; services: ServiceItem[] }) {
  return (
    <section className="mx-auto max-w-site px-4 py-16">
      <SectionHeading section={section} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service) => {
          const Icon = icons[service.icon as keyof typeof icons] ?? ShieldCheck;
          return (
            <Link
              key={entityId(service)}
              to={`/services/${service.slug || entityId(service)}`}
              className="lift-card glass-panel rounded-2xl p-6"
            >
              <Icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-xl text-navy">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function WhySection({ section }: { section: CmsSection }) {
  const items = Array.isArray(section.items) ? (section.items as WhyItem[]) : [];
  return (
    <section className="relative overflow-hidden bg-navy text-cream">
      <div className="hero-mesh opacity-30" />
      <div className="relative mx-auto max-w-site px-4 py-16">
        <h2 className="font-display text-3xl sm:text-4xl">{section.heading}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="border-t border-gold/40 pt-5">
              <h3 className="font-display text-xl text-gold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection({ section, partners }: { section: CmsSection; partners: PartnerItem[] }) {
  return (
    <section className="mx-auto max-w-site px-4 py-16">
      <SectionHeading section={section} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {partners.map((partner) => (
          <div key={entityId(partner)} className="lift-card glass-panel flex min-h-[7rem] items-center justify-center rounded-2xl px-4 text-center">
            <p className="font-medium text-navy">{partner.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsSection({ section, news }: { section: CmsSection; news: NewsItem[] }) {
  return (
    <section className="mx-auto max-w-site px-4 py-16">
      <SectionHeading section={section} />
      <div className="grid gap-5 md:grid-cols-2">
        {news.slice(0, 4).map((item) => (
          <Link key={entityId(item)} to={`/news/${item.slug}`} className="lift-card glass-panel rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-gold">{item.category}</p>
            <h3 className="mt-2 font-display text-2xl text-navy">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>
            <p className="mt-3 text-xs text-ink-muted">{formatDate(item.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
