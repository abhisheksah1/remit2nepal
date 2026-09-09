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
import { BranchFinder } from "./BranchFinder";
import { Button } from "@/components/ui/Button";
import { entityId, mediaUrl } from "@/utils/cn";
import { formatDate } from "@/utils/format";
import { groupPartners, nationalTypeLabel } from "@/utils/partners";

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
      return <PartnersSection section={section} partners={partners} />;
    case "NEWS":
      return <NewsSection section={section} news={news} />;
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
      <h2 className="font-display text-3xl text-navy sm:text-4xl">{section.heading}</h2>
      {section.subheading ? <p className="mt-3 text-ink-muted">{section.subheading}</p> : null}
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

function PartnersSection({ section, partners }: { section: CmsSection; partners: PartnerItem[] }) {
  const { international, national } = groupPartners(partners);
  const groups = [
    { title: "International Partner", items: international, href: "/partners/apply/international" },
    { title: "National Partner", items: national, href: "/partners/apply/national" }
  ];

  return (
    <section className="mx-auto max-w-site px-4 py-16 lg:px-8">
      <SectionHeading section={section} />
      <div className="grid gap-8 lg:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title} className="min-w-0">
            <div className="flex items-end justify-between gap-3">
              <h3 className="font-display text-2xl text-navy">{group.title}</h3>
              <Link to={group.href} className="shrink-0 text-sm text-gold underline-offset-4 hover:underline">
                Become a partner
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {group.items.length ? (
                group.items.slice(0, 6).map((partner) => (
                  <div key={entityId(partner)} className="lift-card glass-panel flex min-h-[6.5rem] items-center justify-center rounded-2xl px-3 text-center">
                    <div>
                      <p className="font-medium text-navy">{partner.name}</p>
                      {nationalTypeLabel(partner.nationalType) ? (
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-gold">{nationalTypeLabel(partner.nationalType)}</p>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-sm text-ink-muted">Partners in this track will appear here.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/partners">
          <Button variant="secondary">View partnership tracks</Button>
        </Link>
      </div>
    </section>
  );
}

function NewsSection({ section, news }: { section: CmsSection; news: NewsItem[] }) {
  return (
    <section className="mx-auto max-w-site px-4 lg:px-8 py-16">
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
