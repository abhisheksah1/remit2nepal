import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Eye,
  FileSearch,
  FileText,
  Fingerprint,
  HeartHandshake,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { ComplianceVisual } from "./ComplianceVisuals";
import { Button } from "@/components/ui/Button";
import type { AboutCompany, CompanySettings, DocumentItem, LegalLink, TeamMember } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { personInitials } from "@/utils/team";

const COMMITMENT = [
  { title: "Regulatory Compliance", body: "We follow applicable laws and regulatory requirements in the markets where we provide our services." },
  { title: "Customer Protection", body: "Controls and processes are designed to help protect customers and keep transfers safer." },
  { title: "Financial Crime Prevention", body: "We maintain policies intended to reduce the risk of fraud, money laundering, and other misuse." }
];

const KYC_STEPS = [
  { n: "01", title: "Identify", body: "Collect required customer information." },
  { n: "02", title: "Verify", body: "Validate information using appropriate verification procedures." },
  { n: "03", title: "Protect", body: "Use the information responsibly and securely in accordance with applicable requirements." }
];

const AML_CARDS = [
  { title: "Customer Due Diligence", body: "We may review customer information to understand risk and meet applicable due-diligence requirements.", icon: UserCheck },
  { title: "Transaction Monitoring", body: "Monitoring is designed to help identify unusual or potentially suspicious activity.", icon: Activity },
  { title: "Risk Assessment", body: "We assess risk so controls can be applied in a proportionate and responsible way.", icon: ShieldAlert },
  { title: "Regulatory Reporting", body: "Where required by applicable law, we report activity through the appropriate channels.", icon: ClipboardCheck }
];

const FRAUD_CARDS = [
  { title: "Identity Protection", body: "Measures designed to help protect customer identity.", icon: Fingerprint },
  { title: "Transaction Monitoring", body: "Monitoring designed to identify unusual or potentially suspicious activity.", icon: Eye },
  { title: "Security Controls", body: "Technical and operational controls designed to protect systems and information.", icon: Lock },
  { title: "Customer Awareness", body: "Helping customers recognize suspicious activity and potential scams.", icon: HeartHandshake }
];

const PROTECTION = [
  "Clear transaction information",
  "Secure customer verification",
  "Responsible transaction processing",
  "Customer support and assistance"
];

const SCREENING = ["Screening", "Risk Controls", "Review", "Responsible Decisions"];

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
  const licenses = about.licenses?.filter(Boolean) ?? [];
  const certifications = about.certifications?.filter(Boolean) ?? [];
  const awards = about.awards?.filter(Boolean) ?? [];
  const stats = about.statistics?.filter((item) => item.value && item.label) ?? [];
  const complianceTeam = team.filter(isComplianceMember);
  const policies = policyCards(settings?.legalLinks ?? [], documents);
  const regulator = regulatorFromLicenses(licenses);
  const companyName = settings?.companyName?.trim() || "";
  const address = settings?.address?.trim() || "";
  const hasRegistry = Boolean(regulator || licenses.length || companyName || address);

  return (
    <div className="about-pro cpro">
      <section className="cpro-hero" aria-labelledby="cpro-title">
        <div className="apro-wrap cpro-hero-grid">
          <div>
            <p className="apro-kicker">Compliance &amp; Security</p>
            <h1 id="cpro-title" className="cpro-title">
              <span className="is-navy">Compliance</span> You Can <span className="is-red">Trust</span>
            </h1>
            <p className="apro-lede">
              We are committed to maintaining high standards of compliance, security, and responsible financial services.
              Our compliance framework is designed to help protect our customers, prevent financial crime, and support safe
              and transparent money transfers.
            </p>
            <p className="cpro-badge">
              <ShieldCheck />
              Committed to Safe &amp; Responsible Money Transfers
            </p>
          </div>
          <ComplianceVisual kind="hero" />
        </div>
      </section>

      <section className="apro-split" aria-labelledby="commitment-heading">
        <div className="apro-wrap apro-split-grid">
          <div>
            <p className="apro-kicker">Our commitment</p>
            <h2 id="commitment-heading">Built on Trust. Driven by Responsibility.</h2>
            <p>
              Compliance is at the heart of how we operate. We follow applicable laws, regulations, and regulatory
              requirements in the markets where we provide our services.
            </p>
            <p>
              Our approach combines technology, trained professionals, monitoring processes, and internal controls to help
              maintain a safe and responsible remittance environment.
            </p>
            <ul className="apro-points">
              {COMMITMENT.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  {item.body}
                </li>
              ))}
            </ul>
          </div>
          <div className="cpro-media">
            <ComplianceVisual kind="commitment" />
          </div>
        </div>
      </section>

      <section className="apro-steps" aria-labelledby="kyc-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">Customer verification</p>
          <h2 id="kyc-heading">Know Your Customer (KYC)</h2>
          <p className="apro-lede">
            To help protect our customers and the financial system, we may verify customer identity and other required
            information before processing certain transactions.
          </p>
          <p className="apro-lede">
            Our verification procedures help us meet applicable regulatory requirements and reduce the risk of fraud,
            identity theft, money laundering, and other financial crime.
          </p>
          <ol className="apro-step-row">
            {KYC_STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="cpro-note">
            Verification requirements may vary depending on the service, transaction, destination, and applicable
            regulations.
          </p>
        </div>
      </section>

      <section className="cpro-aml" aria-labelledby="aml-heading">
        <div className="apro-wrap">
          <p className="apro-kicker is-light">AML / CFT</p>
          <h2 id="aml-heading">Fighting Financial Crime</h2>
          <p className="apro-lede is-light">
            We maintain policies and controls designed to help prevent our services from being misused for money
            laundering, terrorist financing, fraud, or other prohibited activities.
          </p>
          <p className="apro-lede is-light">
            Our compliance approach may include customer due diligence, transaction monitoring, risk assessment,
            screening, investigation, and reporting where required by applicable law.
          </p>
          <div className="apro-cards cpro-aml-cards">
            {AML_CARDS.map((item) => (
              <article key={item.title} className="cpro-dark-card">
                <span className="apro-icon" aria-hidden>
                  <item.icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cpro-screen" aria-labelledby="screen-heading">
        <div className="apro-wrap cpro-screen-row">
          <div>
            <p className="apro-kicker">Sanctions</p>
            <h2 id="screen-heading">Responsible Screening</h2>
            <p>
              We conduct appropriate screening and controls designed to identify transactions or parties that may require
              additional review under applicable sanctions, regulatory, or internal risk requirements.
            </p>
          </div>
          <ul className="cpro-pills">
            {SCREENING.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cpro-fraud" aria-labelledby="fraud-heading">
        <div className="apro-wrap">
          <div className="apro-split-grid">
            <div>
              <p className="apro-kicker">Fraud prevention</p>
              <h2 id="fraud-heading">Protecting You From Fraud</h2>
              <p>
                We continuously work to identify and reduce fraudulent or suspicious activity. Our security and compliance
                processes are designed to help protect customers and maintain the integrity of our services.
              </p>
            </div>
            <div className="cpro-media is-fraud">
              <ComplianceVisual kind="fraud" />
            </div>
          </div>
          <div className="apro-cards">
            {FRAUD_CARDS.map((item) => (
              <article key={item.title} className="apro-card">
                <span className="apro-icon" aria-hidden>
                  <item.icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="apro-values" aria-labelledby="privacy-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">Data privacy</p>
          <h2 id="privacy-heading">Your Information Matters</h2>
          <p className="apro-lede">
            We respect the privacy of our customers and take appropriate measures to protect personal information.
            Customer information is handled in accordance with applicable privacy laws, our privacy policies, and
            legitimate business and regulatory requirements.
          </p>
          <div className="cpro-two">
            <article className="apro-card">
              <span className="apro-icon" aria-hidden>
                <Lock />
              </span>
              <h3>Data Protection</h3>
              <p>We use appropriate technical and organizational safeguards to protect personal information.</p>
            </article>
            <article className="apro-card">
              <span className="apro-icon" aria-hidden>
                <FileSearch />
              </span>
              <h3>Responsible Data Use</h3>
              <p>Information is collected, used, and retained according to applicable requirements and our published policies.</p>
            </article>
          </div>
          <Link to="/privacy" className="apro-text-link">
            Read Our Privacy Policy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="apro-split is-mission" aria-labelledby="protect-heading">
        <div className="apro-wrap">
          <p className="apro-kicker">Customers first</p>
          <h2 id="protect-heading">Protecting Our Customers</h2>
          <p className="apro-lede">
            Your security and confidence are important to us. We work to provide transparent information about our
            services, applicable fees, transaction requirements, and security practices.
          </p>
          <ul className="cpro-protect">
            {PROTECTION.map((item) => (
              <li key={item}>
                <BadgeCheck />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cpro-report-wrap" aria-labelledby="report-heading">
        <div className="apro-wrap">
          <article className="cpro-report">
            <div>
              <p className="apro-kicker">Need help</p>
              <h2 id="report-heading">See Something Suspicious?</h2>
              <p>
                If you believe a transaction or activity may be fraudulent, suspicious, or unauthorized, please contact
                our support team as soon as possible.
              </p>
            </div>
            <div className="apro-actions">
              <Link to="/contact?subject=Report%20a%20suspicious%20activity">
                <Button variant="gold" size="lg" className="apro-btn">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="apro-btn">
                  Contact Support
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="apro-split is-team" aria-labelledby="team-heading">
        <div className="apro-wrap apro-split-grid">
          <div>
            <p className="apro-kicker">People</p>
            <h2 id="team-heading">Our Compliance Team</h2>
            <p>
              Our compliance function works across the organization to support responsible operations, identify risks,
              strengthen controls, and help ensure that our services operate within applicable legal and regulatory
              requirements.
            </p>
            <ComplianceVisual kind="flow" />
            <Link to="/about/team" className="apro-text-link">
              Meet the full team <ArrowRight className="h-4 w-4" />
            </Link>
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
            <div className="cpro-media">
              <ComplianceVisual kind="commitment" />
            </div>
          )}
        </div>
      </section>

      {hasRegistry ? (
        <section id="regulatory-information" className="cpro-reg-wrap" aria-labelledby="reg-heading">
          <div className="apro-wrap">
            <article className="cpro-reg">
              <p className="apro-kicker">Transparency</p>
              <h2 id="reg-heading">Regulatory Information</h2>
              <p>
                We operate in accordance with the regulatory requirements applicable to our services and the
                jurisdictions in which we operate.
              </p>
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
              <p className="cpro-note">
                License numbers, certificates, and additional filings appear here only when they have been published as
                public documents.
              </p>
              <a href="#policies" className="apro-text-link">
                View Regulatory Details <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          </div>
        </section>
      ) : null}

      {policies.length ? (
        <section id="policies" className="apro-band" aria-labelledby="docs-heading">
          <div className="apro-wrap">
            <p className="apro-kicker">Documents</p>
            <h2 id="docs-heading">Policies &amp; Important Information</h2>
            <p className="apro-lede">Read the published policies and service information that apply to our customers.</p>
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

      {stats.length ? (
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

      <section className="apro-cta" aria-labelledby="cpro-final">
        <div className="apro-wrap apro-center">
          <h2 id="cpro-final" className="cpro-final">
            <span className="is-red">Trust</span> Is More Than a Promise. It&apos;s Our Responsibility.
          </h2>
          <p className="apro-lede is-center is-light">
            We believe responsible financial services are built on transparency, security, accountability, and continuous
            improvement. We remain committed to strengthening our compliance practices and protecting the people and
            communities we serve.
          </p>
          <div className="apro-actions is-center">
            <a href="#policies">
              <Button variant="gold" size="lg" className="apro-btn">
                Learn More About Our Policies
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="apro-btn is-ghost">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
