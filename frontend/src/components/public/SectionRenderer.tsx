import { Link } from "react-router-dom";
import { Banknote, Briefcase, Building2, Globe, Send, ShieldCheck, Smartphone } from "lucide-react";
import type { CmsSection, GalleryItem, NewsItem, PartnerItem, ServiceItem, StatItem } from "@/types/content";
import type { PublicRatesPayload } from "@/types/rates";
import { Hero } from "./Hero";
import { WhyChoose } from "./WhyChoose";
import { NepalStory } from "./NepalPeopleMap";
import { RemittanceStage } from "./RemittanceStage";
import { TransferDesk } from "./TransferDesk";
import { RateTable } from "./RateTable";
import { NewsDesk } from "./NewsDesk";
import { Testimonials } from "./Testimonials";
import { GlobalPartners } from "./GlobalPartners";
import { BranchFinder } from "./BranchFinder";
import { Button } from "@/components/ui/Button";
import { entityId, mediaUrl } from "@/utils/cn";

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
  rates,
  stats,
  gallery
}: {
  section: CmsSection;
  services: ServiceItem[];
  partners: PartnerItem[];
  news: NewsItem[];
  rates?: PublicRatesPayload;
  stats?: StatItem[];
  gallery?: GalleryItem[];
}) {
  switch (section.type) {
    case "HERO":
      return <Hero section={section} stats={stats} />;
    case "STATS":
      return null;
    case "SERVICES":
      return <ServicesSection section={section} services={services} />;
    case "RATES":
      return rates ? (
        <section className="mx-auto max-w-site px-4 py-8 lg:px-8 sm:py-16">
          <SectionHeading section={section} />
          <div className="rates-board">
            <TransferDesk rates={rates} />
            <div className="glass-panel rounded-3xl p-4 sm:p-6">
              <RateTable payload={rates} compact />
            </div>
          </div>
        </section>
      ) : null;
    case "WHY_CHOOSE":
      return <WhyChoose section={section} />;
    case "REMITTANCE":
      return <RemittanceStage section={section} />;
    case "NEPAL_MAP":
      return <NepalStory section={section} gallery={gallery} />;
    case "GALLERY":
      return <GalleryPreview section={section} gallery={gallery ?? []} />;
    case "PARTNERS":
      return <GlobalPartners section={section} partners={partners} />;
    case "NEWS":
      return <NewsSection section={section} news={news} />;
    case "TESTIMONIALS":
      return <Testimonials section={section} />;
    case "BRANCH_FINDER":
      return (
        <section className="mx-auto max-w-site px-4 lg:px-8 py-16">
          <SectionHeading section={section} />
          <BranchFinder compact />
        </section>
      );
    case "CONTACT_CTA":
      return (
        <section className="mx-auto max-w-site px-4 lg:px-8 py-8">
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-cream md:flex md:items-center md:justify-between">
            <div className="hero-mesh opacity-40" />
            <div className="relative">
              {section.icon ? <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-gold">{section.icon}</p> : null}
              <h2 className="font-display text-3xl">{section.heading}</h2>
              {section.subheading ? <p className="mt-2 text-lg text-cream">{section.subheading}</p> : null}
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
        <section className="mx-auto max-w-site px-4 lg:px-8 py-16">
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
      {section.icon ? (
        <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-gold">{section.icon}</p>
      ) : null}
      <h2 className="font-display text-3xl text-navy sm:text-4xl">{section.heading}</h2>
      {section.subheading ? <p className="mt-3 text-lg font-medium text-navy">{section.subheading}</p> : null}
      {section.description ? <p className="mt-2 text-ink-muted">{section.description}</p> : null}
    </div>
  );
}

function ServicesSection({ section, services }: { section: CmsSection; services: ServiceItem[] }) {
  return (
    <section className="mx-auto max-w-site px-4 lg:px-8 py-16">
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

function NewsSection({ section, news }: { section: CmsSection; news: NewsItem[] }) {
  return (
    <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
      <NewsDesk section={section} news={news} />
    </div>
  );
}

function GalleryPreview({ section, gallery }: { section: CmsSection; gallery: GalleryItem[] }) {
  return (
    <>
      <NepalStory section={section} gallery={gallery} />
      {gallery.length ? (
        <section className="mx-auto max-w-site px-4 pb-16 lg:px-8">
          <div className="gallery-map-grid">
            {gallery.slice(0, 6).map((item) => (
              <figure key={entityId(item)} className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
                <img src={mediaUrl(item.imageUrl)} alt={item.altText || item.title} className="h-48 w-full object-cover" />
                <figcaption className="p-4">
                  <p className="font-medium text-navy">{item.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to={section.buttonUrl || "/gallery"}>
              <Button variant="gold">{section.buttonLabel || "Open gallery"}</Button>
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
