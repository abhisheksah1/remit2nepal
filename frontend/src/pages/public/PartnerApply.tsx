import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, FileCheck2, Landmark, ShieldCheck, Stamp } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PartnerApplyForm } from "@/components/public/PartnerApplyForm";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { PUBLIC_NAV } from "@/config/public-labels";
import type { ApplicationNationalType } from "@/types/content";

function parseNationalType(value: string | null): ApplicationNationalType | "" {
  if (value === "cooperative") return "COOPERATIVE";
  if (value === "private-agent") return "PRIVATE_AGENT";
  return "";
}

export default function PartnerApply() {
  const { track } = useParams();
  const [search] = useSearchParams();
  const presetType = parseNationalType(search.get("type"));
  const partnership = useQuery({ queryKey: ["public", "partnership"], queryFn: publicApi.partnership });
  const settings = partnership.data;

  if (track && track !== "national") {
    return <Navigate to="/partners/apply/national" replace />;
  }

  if (partnership.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const closed = settings?.formEnabled === false || settings?.nationalEnabled === false;
  const title = settings?.nationalTitle || "National Agent";
  const intro = settings?.nationalIntro;
  const points = settings?.nationalPoints ?? [];

  return (
    <>
      <SeoHead title={`Apply as ${title}`} description={intro || "Submit your Remit2Nepal national agent application."} />
      <section className="apply-hero is-national">
        <div className="apply-hero-wash" />
        <div className="relative mx-auto max-w-site px-4 py-12 lg:px-8 sm:py-16">
          <Link to={PUBLIC_NAV.becomeAgent.path} className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-cream">
            <ArrowLeft className="h-4 w-4" />
            Back to {PUBLIC_NAV.becomeAgent.label}
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-gold">
            {settings?.nationalKicker || "Payout network"}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl">Apply as {title}</h1>
          {intro ? <p className="mt-4 max-w-2xl text-cream/85">{intro}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {[settings?.cooperativeLabel || "Cooperative", settings?.privateAgentLabel || "Private Agent"].map((chip) => (
              <span key={chip} className="apply-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="apply-page mx-auto grid max-w-site gap-8 px-4 py-12 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-16">
        <aside className="apply-aside">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">How it works</p>
          <ol className="mt-5 space-y-4">
            {[
              { icon: Landmark, text: `Choose ${settings?.cooperativeLabel || "Cooperative"} or ${settings?.privateAgentLabel || "Private Agent"}` },
              { icon: Building2, text: "Enter company, owner, and contact details" },
              { icon: Stamp, text: "Download the agreement, sign it, and stamp it" },
              { icon: FileCheck2, text: "Upload registration, PAN, tax, citizenship, and cheque" }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.text} className="flex gap-3">
                  <span className="apply-step-index">{index + 1}</span>
                  <span className="pt-0.5 text-sm text-ink/85">
                    <Icon className="mb-1 h-4 w-4 text-gold" />
                    <span className="block">{step.text}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          {points.length ? (
            <ul className="mt-8 space-y-2 border-t border-navy/10 pt-6 text-sm text-ink-muted">
              {points.slice(0, 4).map((point) => (
                <li key={point} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>

        {closed || !settings ? (
          <div className="apply-panel">
            <h2 className="font-display text-2xl text-navy">Applications are closed</h2>
            <p className="mt-2 text-sm text-ink-muted">National agent applications are not open right now. Please call the relationship desk.</p>
            <Link to={PUBLIC_NAV.becomeAgent.path} className="mt-6 inline-flex text-sm text-navy underline">
              Return to {PUBLIC_NAV.becomeAgent.label}
            </Link>
          </div>
        ) : (
          <PartnerApplyForm settings={settings} defaultKind="NATIONAL" defaultNationalType={presetType} />
        )}
      </div>
    </>
  );
}
