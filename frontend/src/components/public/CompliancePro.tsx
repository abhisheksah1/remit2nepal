import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, FileText, ShieldCheck } from "lucide-react";
import { ComplianceFlow, CompliancePhoto } from "./ComplianceVisuals";
import { Button } from "@/components/ui/Button";
import { isComplianceSectionOn, resolveCompliancePage } from "@/content/compliance-defaults";
import type {
  AboutCompany,
  CompanySettings,
  CompliancePhotoItem,
  DocumentItem,
  LegalLink,
  TeamMember
} from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { aboutIcon } from "@/utils/about-icons";
import { personInitials } from "@/utils/team";

function paras(text: string) {
  return text
    .split(/\n\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function accentParts(text: string) {
  if (!text.includes("//")) return [{ text, tone: "is-navy" }];
  return text
    .split("//")
    .map((part, index) => ({ text: part.trim(), tone: index % 2 ? "is-red" : "is-navy" }))
    .filter((part) => part.text);
}

function AccentTitle({
  text,
  id,
  className,
  as: Tag = "h1"
}: {
  text: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const parts = accentParts(text);
  return (
    <Tag id={id} className={className}>
      {parts.map((part, index) => (
        <span key={`${part.tone}-${index}`} className={part.tone}>
          {part.text}
          {index < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

function CmsLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

function PagePhoto({
  photo
}: {
  photo: CompliancePhotoItem;
}) {
  const src = mediaUrl(photo.url);
  if (!src) return null;
  return (
    <CompliancePhoto
      src={src}
      alt={photo.alt || ""}
      overlay={photo.overlay}
      credit={photo.credit}
    />
  );
}

function isComplianceMember(member: TeamMember) {
  return /compliance|kyc|aml|cft|sanctions/i.test(`${member.title} ${member.bio}`);
}

function policyHint(label: string) {
  if (/privacy/i.test(label)) return "How we collect, use, and protect personal information.";
  if (/term/i.test(label)) return "The conditions that apply when you use our remittance services.";
  if (/fee|rate|charge/i.test(label)) return "Published service charges and exchange-rate information.";
  return "Read this policy for the details that apply to our services.";
}

function policyCards(legalLinks: LegalLink[], documents: DocumentItem[]) {
  const cards: Array<{ title: string; href: string; description: string; external?: boolean }> = [];
  const seen = new Set<string>();

  for (const link of legalLinks) {
    const href = link.url?.trim();
    if (!href || seen.has(href)) continue;
    seen.add(href);
    cards.push({ title: link.label, href, description: policyHint(link.label) });
  }

  if (!seen.has("/service-charge")) {
    cards.push({
      title: "Fee & Exchange Rate Information",
      href: "/service-charge",
      description: policyHint("Fee & Exchange Rate Information")
    });
  }

  for (const doc of documents) {
    const href = mediaUrl(doc.fileUrl);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    cards.push({
      title: doc.title,
      href,
      description: doc.description || "Official document published for customers and partners.",
      external: true
    });
  }

  return cards;
}

function regulatorFromLicenses(licenses: string[]) {
  if (licenses.some((item) => /nrb|rastra bank/i.test(item))) return "Nepal Rastra Bank";
  return "";
}

export function CompliancePro({
  about,
  settings,
  team,
  documents
}: {
  about: AboutCompany;
  settings: CompanySettings | null;
  team: TeamMember[];
  documents: DocumentItem[];
}) {
  const page = resolveCompliancePage(about.compliancePage);
  const licenses = about.licenses?.filter(Boolean) ?? [];
  const certifications = about.certifications?.filter(Boolean) ?? [];
  const awards = about.awards?.filter(Boolean) ?? [];
  const stats = about.statistics?.filter((item) => item.value && item.label) ?? [];
  const complianceTeam = team.filter(isComplianceMember);
  const policies = policyCards(settings?.legalLinks ?? [], documents);
  const regulator = page.regulatorName.trim() || regulatorFromLicenses(licenses);
  const companyName = settings?.companyName?.trim() || "";
  const address = settings?.address?.trim() || "";
  const hasRegistry = Boolean(regulator || licenses.length || companyName || address);
  const on = (id: string) => isComplianceSectionOn(page.disabledSections, id);

  return (
    <div className="about-pro cpro reveal-skip">
      {on("hero") ? (
      <section className="photo-bleed is-right cpro-hero" aria-labelledby="cpro-title">
        <PagePhoto photo={page.heroPhoto} />
        <div className="photo-bleed-copy">
          <p className="apro-kicker">{page.heroKicker}</p>
          <AccentTitle text={page.heroTitle} id="cpro-title" className="cpro-title" />
          {paras(page.heroBody).map((item) => (
            <p key={item} className="apro-lede">
              {item}
            </p>
          ))}
          {page.heroBadge ? (
            <p className="cpro-badge">
              <ShieldCheck />
              {page.heroBadge}
            </p>
          ) : null}
        </div>
      </section>
      ) : null}

      {on("commitment") ? (
      <section className="photo-bleed is-left is-tint" aria-labelledby="commitment-heading">
        <PagePhoto photo={page.commitmentPhoto} />
        <div className="photo-bleed-copy">
          <p className="apro-kicker">{page.commitmentKicker}</p>
          <h2 id="commitment-heading">{page.commitmentHeading}</h2>
          {paras(page.commitmentBody).map((item) => (
            <p key={item}>{item}</p>
          ))}
          <ul className="apro-points">
            {page.commitmentItems.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
      ) : null}

      {on("kyc") ? (
      <section className="apro-steps" aria-labelledby="kyc-heading">
        <div className="photo-bleed is-right">
          <PagePhoto photo={page.kycPhoto} />
          <div className="photo-bleed-copy">
            <p className="apro-kicker">{page.kycKicker}</p>
            <h2 id="kyc-heading">{page.kycHeading}</h2>
            {paras(page.kycBody).map((item) => (
              <p key={item} className="apro-lede">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="apro-wrap">
          <ol className="apro-step-row">
            {page.kycSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          {page.kycNote ? <p className="cpro-note">{page.kycNote}</p> : null}
        </div>
      </section>
      ) : null}

      {on("aml") ? (
      <section className="cpro-aml" aria-labelledby="aml-heading">
        <div className="photo-bleed is-left">
          <PagePhoto photo={page.amlPhoto} />
          <div className="photo-bleed-copy">
            <p className="apro-kicker is-light">{page.amlKicker}</p>
            <h2 id="aml-heading">{page.amlHeading}</h2>
            {paras(page.amlBody).map((item) => (
              <p key={item} className="apro-lede is-light">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="apro-wrap">
          <div className="apro-cards cpro-aml-cards">
            {page.amlCards.map((item) => {
              const Icon = aboutIcon(item.icon, item.title);
              return (
                <article key={item.title} className="cpro-dark-card">
                  <span className="apro-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {on("screening") ? (
      <section className="photo-bleed is-left is-tint" aria-labelledby="screen-heading">
        <PagePhoto photo={page.screenPhoto} />
        <div className="photo-bleed-copy">
          <p className="apro-kicker">{page.screenKicker}</p>
          <h2 id="screen-heading">{page.screenHeading}</h2>
          {paras(page.screenBody).map((item) => (
            <p key={item}>{item}</p>
          ))}
          <ul className="cpro-pills">
            {page.screenPills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      ) : null}

      {on("fraud") ? (
      <section className="cpro-fraud" aria-labelledby="fraud-heading">
        <div className="photo-bleed is-right">
          <PagePhoto photo={page.fraudPhoto} />
          <div className="photo-bleed-copy">
            <p className="apro-kicker">{page.fraudKicker}</p>
            <h2 id="fraud-heading">{page.fraudHeading}</h2>
            {paras(page.fraudBody).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
        <div className="apro-wrap">
          <div className="apro-cards">
            {page.fraudCards.map((item) => {
              const Icon = aboutIcon(item.icon, item.title);
              return (
                <article key={item.title} className="apro-card">
                  <span className="apro-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {on("privacy") ? (
      <section className="apro-values" aria-labelledby="privacy-heading">
        <div className="photo-bleed is-right">
          <PagePhoto photo={page.privacyPhoto} />
          <div className="photo-bleed-copy">
            <p className="apro-kicker">{page.privacyKicker}</p>
            <h2 id="privacy-heading">{page.privacyHeading}</h2>
            {paras(page.privacyBody).map((item) => (
              <p key={item} className="apro-lede">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="apro-wrap">
          <div className="cpro-two">
            {page.privacyCards.map((item) => {
              const Icon = aboutIcon(item.icon, item.title);
              return (
                <article key={item.title} className="apro-card">
                  <span className="apro-icon" aria-hidden>
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
          {page.privacyLinkUrl ? (
            <CmsLink href={page.privacyLinkUrl} className="apro-text-link">
              {page.privacyLinkLabel} <ArrowRight className="h-4 w-4" />
            </CmsLink>
          ) : null}
        </div>
      </section>
      ) : null}

      {on("protect") ? (
      <section className="photo-bleed is-left is-tint" aria-labelledby="protect-heading">
        <PagePhoto photo={page.protectPhoto} />
        <div className="photo-bleed-copy">
          <p className="apro-kicker">{page.protectKicker}</p>
          <h2 id="protect-heading">{page.protectHeading}</h2>
          {paras(page.protectBody).map((item) => (
            <p key={item} className="apro-lede">
              {item}
            </p>
          ))}
          <ul className="cpro-protect">
            {page.protectItems.map((item) => (
              <li key={item}>
                <BadgeCheck />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      ) : null}

      {on("report") ? (
      <section className="cpro-report-wrap" aria-labelledby="report-heading">
        <div className="apro-wrap">
          <article className="cpro-report">
            <div>
              <p className="apro-kicker">{page.reportKicker}</p>
              <h2 id="report-heading">{page.reportHeading}</h2>
              {paras(page.reportBody).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="apro-actions">
              {page.reportPrimaryUrl ? (
                <CmsLink href={page.reportPrimaryUrl}>
                  <Button variant="gold" size="lg" className="apro-btn">
                    {page.reportPrimaryLabel}
                  </Button>
                </CmsLink>
              ) : null}
              {page.reportSecondaryUrl ? (
                <CmsLink href={page.reportSecondaryUrl}>
                  <Button variant="secondary" size="lg" className="apro-btn">
                    {page.reportSecondaryLabel}
                  </Button>
                </CmsLink>
              ) : null}
            </div>
          </article>
        </div>
      </section>
      ) : null}

      {on("team") ? (
      <section className="apro-split is-team" aria-labelledby="team-heading">
        <div className="apro-wrap apro-split-grid">
          <div>
            <p className="apro-kicker">{page.teamKicker}</p>
            <h2 id="team-heading">{page.teamHeading}</h2>
            {paras(page.teamBody).map((item) => (
              <p key={item}>{item}</p>
            ))}
            <ComplianceFlow steps={page.teamFlow} />
            {page.teamLinkUrl ? (
              <CmsLink href={page.teamLinkUrl} className="apro-text-link">
                {page.teamLinkLabel} <ArrowRight className="h-4 w-4" />
              </CmsLink>
            ) : null}
          </div>
          {complianceTeam.length ? (
            <div className="cpro-people">
              {complianceTeam.map((member) => (
                <figure key={entityId(member)}>
                  {member.photoUrl ? (
                    <img src={mediaUrl(member.photoUrl)} alt={member.name} />
                  ) : (
                    <span>{personInitials(member.name)}</span>
                  )}
                  <figcaption>
                    <strong>{member.name}</strong>
                    <em>{member.title}</em>
                    {member.bio ? <p>{member.bio}</p> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <PagePhoto photo={page.teamPhoto} shape="round" />
          )}
        </div>
      </section>
      ) : null}

      {on("regulatory") && hasRegistry ? (
        <section id="regulatory-information" className="cpro-reg-wrap" aria-labelledby="reg-heading">
          <div className="apro-wrap">
            <article className="cpro-reg">
              <div className="cpro-reg-photo">
                <PagePhoto photo={page.regPhoto} shape="capsule-wide" />
              </div>
              <p className="apro-kicker">{page.regKicker}</p>
              <h2 id="reg-heading">{page.regHeading}</h2>
              {paras(page.regBody).map((item) => (
                <p key={item}>{item}</p>
              ))}
              <dl className="cpro-dl">
                {regulator ? (
                  <>
                    <dt>Regulator</dt>
                    <dd>{regulator}</dd>
                  </>
                ) : null}
                {licenses.length ? (
                  <>
                    <dt>License Type</dt>
                    <dd>{licenses.join(" · ")}</dd>
                  </>
                ) : null}
                {companyName ? (
                  <>
                    <dt>Legal Entity</dt>
                    <dd>{companyName}</dd>
                  </>
                ) : null}
                {address ? (
                  <>
                    <dt>Jurisdiction</dt>
                    <dd>{address}</dd>
                  </>
                ) : null}
              </dl>
              {certifications.length ? (
                <div className="cpro-lists">
                  <h3>Published practices</h3>
                  <ul>
                    {certifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {awards.length ? (
                <div className="cpro-lists">
                  <h3>Recognition</h3>
                  <ul>
                    {awards.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {page.regNote ? <p className="cpro-note">{page.regNote}</p> : null}
              <a href="#policies" className="apro-text-link">
                View Regulatory Details <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          </div>
        </section>
      ) : null}

      {on("policies") && policies.length ? (
        <section id="policies" className="apro-band" aria-labelledby="docs-heading">
          <div className="apro-wrap">
            <p className="apro-kicker">{page.docsKicker}</p>
            <h2 id="docs-heading">{page.docsHeading}</h2>
            <p className="apro-lede">{page.docsBody}</p>
            <div className="cpro-docs">
              {policies.map((item) => {
                const inner = (
                  <>
                    <span className="apro-icon" aria-hidden>
                      <FileText />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <em>
                      View document <ArrowRight className="h-4 w-4" />
                    </em>
                  </>
                );
                return item.external ? (
                  <a key={item.href} className="cpro-doc" href={item.href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link key={item.href} className="cpro-doc" to={item.href}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {on("stats") && stats.length ? (
        <section className="apro-stats" aria-label="Trust figures">
          <div className="apro-wrap apro-stat-row">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p>{stat.value}</p>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {on("cta") ? (
      <section className="apro-cta" aria-labelledby="cpro-final">
        <div className="apro-wrap apro-center">
          <AccentTitle text={page.ctaHeading} id="cpro-final" className="cpro-final" as="h2" />
          {paras(page.ctaBody).map((item) => (
            <p key={item} className="apro-lede is-center is-light">
              {item}
            </p>
          ))}
          <div className="apro-actions is-center">
            {page.ctaPrimaryUrl ? (
              <CmsLink href={page.ctaPrimaryUrl}>
                <Button variant="gold" size="lg" className="apro-btn">
                  {page.ctaPrimaryLabel}
                </Button>
              </CmsLink>
            ) : null}
            {page.ctaSecondaryUrl ? (
              <CmsLink href={page.ctaSecondaryUrl}>
                <Button variant="secondary" size="lg" className="apro-btn is-ghost">
                  {page.ctaSecondaryLabel}
                </Button>
              </CmsLink>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
