import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, FileCheck2, Landmark, Mail, ShieldCheck, Stamp } from "lucide-react";
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
  const intro =
    settings?.nationalIntro || "For cooperatives and private agents that deliver funds across Nepal.";
  const points = settings?.nationalPoints ?? [];
  const coop = settings?.cooperativeLabel || "Cooperative";
  const privateAgent = settings?.privateAgentLabel || "Private Agent";
  const steps = [
    { icon: Landmark, text: `Choose ${coop} or ${privateAgent}` },
    { icon: Building2, text: "Fill the form with full company and owner details" },
    { icon: FileCheck2, text: "Upload documents so the desk can verify them first" },
    { icon: Mail, text: "After verification, Remit2Nepal emails the company agreement" },
    { icon: Stamp, text: "Sign, stamp, complete the papers, scan them, and email them back" }
  ];

  return (
    <div className="apply-desk reveal-skip">
      <SeoHead title={`Apply as ${title}`} description={intro} />

      <section className="apply-hero is-national" aria-labelledby="apply-title">
        <div className="apply-hero-wash" />
        <div className="apply-hero-copy">
          <Link to={PUBLIC_NAV.becomeAgent.path} className="apply-back">
            <ArrowLeft />
            Back to {PUBLIC_NAV.becomeAgent.label}
          </Link>
          <p className="apply-hero-kicker">{settings?.nationalKicker || "Payout network"}</p>
          <h1 id="apply-title">Apply as {title}</h1>
          <span>{intro}</span>
          <div className="apply-chips">
            <span className="apply-chip">{coop}</span>
            <span className="apply-chip">{privateAgent}</span>
          </div>
        </div>
      </section>

      <div className="apply-stage">
        <aside className="apply-aside">
          <p className="apply-kicker">How it works</p>
          <ol className="apply-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.text}>
                  <span className="apply-step-badge" aria-hidden>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon />
                  </span>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          {points.length ? (
            <ul className="apply-points">
              {points.slice(0, 4).map((point) => (
                <li key={point}>
                  <ShieldCheck aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>

        {closed || !settings ? (
          <div className="apply-panel">
            <p className="apply-section-kicker">Applications</p>
            <h2>Applications are closed</h2>
            <p>National agent applications are not open right now. Please call the relationship desk.</p>
            <Link to={PUBLIC_NAV.becomeAgent.path} className="apply-back-ink">
              Return to {PUBLIC_NAV.becomeAgent.label}
            </Link>
          </div>
        ) : (
          <PartnerApplyForm settings={settings} defaultKind="NATIONAL" defaultNationalType={presetType} />
        )}
      </div>
    </div>
  );
}
