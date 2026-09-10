import { Link } from "react-router-dom";
import type { CmsSection, GalleryItem, NewsItem, PartnerItem, ServiceItem, StatItem } from "@/types/content";
import type { PublicRatesPayload } from "@/types/rates";
import { Hero } from "./Hero";
import { WhyChoose } from "./WhyChoose";
import { NepalStory } from "./NepalPeopleMap";
import { RemittanceStage } from "./RemittanceStage";
import { RatesBoard } from "./RatesBoard";
import { NewsDesk } from "./NewsDesk";
import { Testimonials } from "./Testimonials";
import { GlobalPartners } from "./GlobalPartners";
import { ServicesBoard } from "./ServicesBoard";
import { BranchFinder } from "./BranchFinder";
import { Button } from "@/components/ui/Button";
import { entityId, mediaUrl } from "@/utils/cn";

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
      return <ServicesBoard section={section} services={services} />;
    case "RATES":
      return rates ? <RatesBoard section={section} rates={rates} compact /> : null;
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
      return <NewsDesk section={section} news={news} />;
    case "TESTIMONIALS":
      return <Testimonials section={section} />;
    case "BRANCH_FINDER":
      return (
        <section className="agent-embed">
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
    <div className="section-intro mb-8 max-w-2xl">
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
