import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CmsSection, PartnerItem } from "@/types/content";
import { PUBLIC_NAV } from "@/config/public-labels";
import { entityId, mediaUrl } from "@/utils/cn";
import { partnerLogoFocus } from "@/utils/partners";

function PartnerLogos({
  partners,
  decorative
}: {
  partners: PartnerItem[];
  decorative?: boolean;
}) {
  return (
    <>
      {partners.map((partner, index) => {
        const tile = (
          <span className="corridor-logo-mark">
            <img src={mediaUrl(partner.logoUrl)} alt="" style={{ objectPosition: partnerLogoFocus(partner.name) }} />
          </span>
        );
        return (
          <li key={`${entityId(partner)}-${decorative ? "loop" : "live"}-${index}`} aria-hidden={decorative || undefined}>
            {partner.website && !decorative ? (
              <a href={partner.website} target="_blank" rel="noreferrer" className="corridor-logo" aria-label={partner.name}>
                {tile}
              </a>
            ) : (
              <div className="corridor-logo" aria-label={decorative ? undefined : partner.name}>
                {tile}
              </div>
            )}
          </li>
        );
      })}
    </>
  );
}

export function GlobalPartners({ section, partners }: { section: CmsSection; partners: PartnerItem[] }) {
  const logos = partners.filter((partner) => partner.status !== "INACTIVE" && partner.logoUrl);
  const ctaLabel = section.buttonLabel || PUBLIC_NAV.becomeAgent.label;
  const ctaUrl = section.buttonUrl || PUBLIC_NAV.becomeAgent.path;
  const duration = Math.max(22, logos.length * 5);

  return (
    <section className="corridor-partners" aria-labelledby={`${section.key}-heading`}>
      <div className="corridor-partners-wrap">
        <header className="corridor-partners-head">
          <div>
            <p className="corridor-partners-kicker">{section.icon || "Our network"}</p>
            <h2 id={`${section.key}-heading`}>{section.heading || "Global remittance partners"}</h2>
            {section.subheading ? <p className="corridor-partners-ne">{section.subheading}</p> : null}
            {section.description ? <p className="corridor-partners-deck">{section.description}</p> : null}
          </div>
          <Link className="corridor-partners-cta" to={ctaUrl}>
            {ctaLabel}
            <ArrowRight />
          </Link>
        </header>

        {logos.length ? (
          <div className="corridor-logo-marquee">
            <ul className="corridor-logo-track" style={{ animationDuration: `${duration}s` }}>
              <PartnerLogos partners={logos} />
              <PartnerLogos partners={logos} decorative />
            </ul>
          </div>
        ) : (
          <p className="corridor-partners-empty">Partner logos will appear here after they are added in Admin → Partners.</p>
        )}
      </div>
    </section>
  );
}
