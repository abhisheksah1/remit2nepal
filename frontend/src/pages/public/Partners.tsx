import { useEffect, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Landmark, ShieldCheck, Store } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { PUBLIC_NAV } from "@/config/public-labels";
import type { PartnerItem } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { groupPartners, nationalTypeLabel } from "@/utils/partners";
import { smoothScrollToHash } from "@/utils/smooth-scroll";

function AgentCard({ partner, index }: { partner: PartnerItem; index: number }) {
  const subtype = nationalTypeLabel(partner.nationalType);
  const inner = (
    <>
      {partner.logoUrl ? <img src={mediaUrl(partner.logoUrl)} alt="" /> : <span className="ba-mark">{partner.name.slice(0, 1)}</span>}
      <p>{[partner.country, subtype].filter(Boolean).join(" · ") || "National agent"}</p>
      <h3>{partner.name}</h3>
      {partner.description ? <em>{partner.description}</em> : null}
    </>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noreferrer"
        className={index < 12 ? "ba-card" : "ba-card is-static"}
        style={{ "--i": index } as CSSProperties}
      >
        {inner}
      </a>
    );
  }

  return (
    <article className={index < 12 ? "ba-card" : "ba-card is-static"} style={{ "--i": index } as CSSProperties}>
      {inner}
    </article>
  );
}

export default function Partners() {
  const location = useLocation();
  const partners = useQuery({ queryKey: ["public", "partners"], queryFn: publicApi.partners });
  const partnership = useQuery({ queryKey: ["public", "partnership"], queryFn: publicApi.partnership });
  const grouped = groupPartners(partners.data ?? []);
  const settings = partnership.data;
  const formOpen = settings?.formEnabled !== false && settings?.nationalEnabled !== false;

  useEffect(() => {
    const target = location.hash.replace("#", "");
    if (!target) return;
    window.requestAnimationFrame(() => smoothScrollToHash(target));
  }, [location.hash]);

  if (partners.isLoading || partnership.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const title = PUBLIC_NAV.becomeAgent.label;
  const description =
    settings?.pageDescription || "Join Remit2Nepal as a national agent. Submit full details for verification, then complete the emailed agreement.";
  const points = settings?.nationalPoints?.length
    ? settings.nationalPoints
    : ["Cooperative or Private Agent", "Submit full details and documents for verification", "Sign and stamp the agreement after the company emails it"];

  return (
    <div className="ba-desk reveal-skip">
      <SeoHead title={title} description={description} />

      <section className="ba-hero" aria-labelledby="ba-title">
        <div className="ba-hero-copy">
          <p>{settings?.pageKicker || "National agent"}</p>
          <h1 id="ba-title">{title}</h1>
          <span>{description}</span>
          {formOpen ? (
            <a className="ba-hero-cta" href="#national">
              Start application <ArrowRight />
            </a>
          ) : null}
        </div>
      </section>

      <div className="ba-stage">
        {formOpen ? (
          <section id="national" className="ba-dock partner-anchor" aria-labelledby="ba-apply-heading">
            <div className="ba-dock-copy">
              <p className="ba-kicker">{settings?.nationalKicker || "Payout network"}</p>
              <h2 id="ba-apply-heading">{settings?.nationalTitle || "National Agent"}</h2>
              <p>
                {settings?.nationalIntro || "For cooperatives and private agents that deliver funds across Nepal."}
              </p>
              <ul className="ba-points">
                {points.map((point) => (
                  <li key={point}>
                    <ShieldCheck aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ba-tracks">
              {settings?.cooperativeEnabled !== false ? (
                <Link to="/partners/apply/national?type=cooperative" className="ba-track">
                  <span className="ba-track-icon" aria-hidden>
                    <Landmark />
                  </span>
                  <strong>{settings?.cooperativeLabel || "Cooperative"}</strong>
                  <em>Open application</em>
                  <span className="ba-track-go">
                    Apply <ArrowRight />
                  </span>
                </Link>
              ) : null}
              {settings?.privateAgentEnabled !== false ? (
                <Link to="/partners/apply/national?type=private-agent" className="ba-track is-red">
                  <span className="ba-track-icon" aria-hidden>
                    <Store />
                  </span>
                  <strong>{settings?.privateAgentLabel || "Private Agent"}</strong>
                  <em>Open application</em>
                  <span className="ba-track-go">
                    Apply <ArrowRight />
                  </span>
                </Link>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="ba-dock is-closed">
            <p className="ba-kicker">Applications</p>
            <h2>National agent applications are closed right now</h2>
            <p>Please contact the desk when the next intake opens.</p>
          </section>
        )}

        <section className="ba-network" aria-labelledby="ba-network-heading">
          <p className="ba-kicker">Current network</p>
          <h2 id="ba-network-heading">National agents</h2>
          <p>Cooperatives, private agents, and payout partners in Nepal.</p>
          {grouped.national.length ? (
            <div className="ba-grid">
              {grouped.national.map((partner, index) => (
                <AgentCard key={entityId(partner)} partner={partner} index={index} />
              ))}
            </div>
          ) : (
            <p className="ba-empty">National agents will appear here once published.</p>
          )}
        </section>
      </div>
    </div>
  );
}
