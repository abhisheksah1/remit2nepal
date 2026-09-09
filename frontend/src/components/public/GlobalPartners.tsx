import { Link } from "react-router-dom";
import type { CmsSection, PartnerItem } from "@/types/content";
import { PUBLIC_NAV } from "@/config/public-labels";
import { entityId, mediaUrl } from "@/utils/cn";

export function GlobalPartners({ section, partners }: { section: CmsSection; partners: PartnerItem[] }) {
  const logos = partners.filter((partner) => partner.status !== "INACTIVE");
  const ctaLabel = section.buttonLabel || PUBLIC_NAV.becomeAgent.label;
  const ctaUrl = section.buttonUrl || PUBLIC_NAV.becomeAgent.path;

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
          </Link>
        </header>

        {logos.length ? (
          <ul className="corridor-logo-board">
            {logos.map((partner) => {
              const tile = (
                <>
                  {partner.logoUrl ? (
                    <img src={mediaUrl(partner.logoUrl)} alt={partner.name} />
                  ) : (
                    <span>{partner.name}</span>
                  )}
                </>
              );
              return (
                <li key={entityId(partner)}>
                  {partner.website ? (
                    <a href={partner.website} target="_blank" rel="noreferrer" className="corridor-logo">
                      {tile}
                    </a>
                  ) : (
                    <div className="corridor-logo">{tile}</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="corridor-partners-empty">Partner logos will appear here after they are added in Admin → Partners.</p>
        )}
      </div>
    </section>
  );
}
