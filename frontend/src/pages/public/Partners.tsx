import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Landmark, ShieldCheck, Store } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { PUBLIC_NAV } from "@/config/public-labels";
import type { PartnerItem } from "@/types/content";
import { entityId } from "@/utils/cn";
import { groupPartners, nationalTypeLabel } from "@/utils/partners";
import { smoothScrollToHash } from "@/utils/smooth-scroll";

function AgentCard({ partner }: { partner: PartnerItem }) {
  const subtype = nationalTypeLabel(partner.nationalType);
  return (
    <Card className="min-w-0">
      <h3 className="font-display text-xl text-navy">{partner.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-wider text-gold">
        {[partner.country, subtype].filter(Boolean).join(" · ")}
      </p>
      {partner.description ? <p className="mt-3 text-sm text-ink-muted">{partner.description}</p> : null}
      {partner.website ? (
        <a href={partner.website} className="mt-4 inline-block text-sm text-navy underline" target="_blank" rel="noreferrer">
          Visit website
        </a>
      ) : null}
    </Card>
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
    settings?.pageDescription || "Join Remit2Nepal as a national agent and serve families across Nepal.";

  return (
    <>
      <SeoHead title={title} description={description} />
      <PageHero
        kicker={settings?.pageKicker || "National agent"}
        title={title}
        description={description}
      />

      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        {formOpen ? (
          <article id="national" className="partner-anchor partner-track partner-track-nat mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{settings?.nationalKicker || "Payout network"}</p>
            <h2 className="mt-2 font-display text-3xl text-navy">{settings?.nationalTitle || "National Agent"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {settings?.nationalIntro || "For cooperatives and private agents that deliver funds across Nepal."}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink/85">
              {(settings?.nationalPoints?.length
                ? settings.nationalPoints
                : ["Cooperative or Private Agent", "Download, sign, and stamp the company agreement"]
              ).map((point) => (
                <li key={point} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {settings?.cooperativeEnabled !== false ? (
                <Link to="/partners/apply/national?type=cooperative" className="apply-jump">
                  <Landmark className="h-5 w-5" />
                  <span>
                    <span className="block font-medium">{settings?.cooperativeLabel || "Cooperative"}</span>
                    <span className="block text-xs text-ink-muted">Open application</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              ) : null}
              {settings?.privateAgentEnabled !== false ? (
                <Link to="/partners/apply/national?type=private-agent" className="apply-jump">
                  <Store className="h-5 w-5" />
                  <span>
                    <span className="block font-medium">{settings?.privateAgentLabel || "Private Agent"}</span>
                    <span className="block text-xs text-ink-muted">Open application</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              ) : null}
            </div>
            <Link to="/partners/apply/national" className="mt-5 inline-flex">
              <Button variant="gold">
                Continue to agent application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </article>
        ) : (
          <p className="text-sm text-ink-muted">National agent applications are closed right now. Please contact the desk.</p>
        )}

        <section className="mt-20">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Current network</p>
          <h2 className="mt-2 font-display text-3xl text-navy">National agents</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">Cooperatives, private agents, and payout partners in Nepal.</p>
          {grouped.national.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {grouped.national.map((partner) => (
                <AgentCard key={entityId(partner)} partner={partner} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-muted">National agents will appear here once published.</p>
          )}
        </section>
      </div>
    </>
  );
}
