import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Ban,
  FileText,
  Headset,
  Landmark,
  Link2,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CmsPage, CompanySettings, DocumentItem, ServiceItem } from "@/types/content";
import { htmlToText, mediaUrl } from "@/utils/cn";

const TOC = [
  { id: "about-terms", label: "About These Terms" },
  { id: "eligibility", label: "Eligibility" },
  { id: "our-services", label: "Our Services" },
  { id: "account-registration", label: "Account Registration" },
  { id: "identity-verification", label: "Identity Verification" },
  { id: "sending-money", label: "Sending Money" },
  { id: "receiving-money", label: "Receiving Money" },
  { id: "fees", label: "Fees & Exchange Rates" },
  { id: "limits", label: "Transaction Limits" },
  { id: "processing", label: "Transaction Processing" },
  { id: "cancellations", label: "Cancellations & Refunds" },
  { id: "prohibited", label: "Prohibited Activities" },
  { id: "fraud", label: "Fraud & Security" },
  { id: "responsibilities", label: "Customer Responsibilities" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "ip", label: "Intellectual Property" },
  { id: "privacy", label: "Privacy" },
  { id: "availability", label: "Service Availability" },
  { id: "liability", label: "Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "suspension", label: "Suspension & Termination" },
  { id: "complaints", label: "Complaints & Disputes" },
  { id: "changes", label: "Changes to These Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Us" }
];

function formatPolicyDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function TermsMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 280" aria-hidden>
      <circle cx="210" cy="150" r="96" fill="#eef1f8" />
      <circle cx="210" cy="150" r="62" fill="#2e3192" />
      <path d="M184 132 C 196 112, 224 114, 236 132" fill="none" stroke="#f7f8ff" strokeWidth="1.4" />
      <path d="M176 158 C 198 178, 226 176, 244 154" fill="none" stroke="#e31e24" strokeWidth="1.4" />
      <rect x="42" y="48" width="148" height="186" rx="16" fill="#fff" stroke="#d7dbed" />
      <rect x="62" y="72" width="88" height="8" rx="4" fill="#2e3192" />
      <rect x="62" y="96" width="108" height="6" rx="3" fill="#d7dbed" />
      <rect x="62" y="114" width="96" height="6" rx="3" fill="#d7dbed" />
      <rect x="62" y="132" width="108" height="6" rx="3" fill="#d7dbed" />
      <rect x="62" y="150" width="72" height="6" rx="3" fill="#d7dbed" />
      <path d="M116 178 C 138 186, 150 196, 150 216 C 150 238, 134 252, 116 262 C 98 252, 82 238, 82 216 C 82 196, 94 186, 116 178Z" fill="#2e3192" />
      <path d="M106 218 L114 226 L130 206" fill="none" stroke="#e31e24" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heading({ id, n, children }: { id: string; n: string; children: string }) {
  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.location.hash = id;
    }
  }

  return (
    <h2 id={id}>
      <span>
        {n}. {children}
      </span>
      <button type="button" className="ppro-copy" onClick={copyLink} aria-label={`Copy link to ${children}`}>
        <Link2 />
      </button>
    </h2>
  );
}

const ACCOUNT_POINTS = [
  "Provide accurate and current information.",
  "Protect any login credentials, codes, or documents issued to you.",
  "Tell us promptly if you notice unauthorized activity.",
  "Do not use an account, customer record, or our services for unlawful or prohibited activities."
];

const SEND_STEPS = ["Enter Details", "Review", "Pay", "Processing", "Recipient Receives"];
const PROCESS_STEPS = ["Transaction Submitted", "Verification", "Payment Confirmed", "Processing", "Recipient Payout"];
const PROHIBITED = [
  "Fraud",
  "Money laundering",
  "Terrorist financing",
  "Sanctions violations",
  "Identity theft",
  "Unauthorized transactions",
  "Illegal activities",
  "Prohibited goods or services",
  "Misuse of accounts or customer records"
];
const SECURITY = [
  { title: "Protect Your Password", body: "Never share account passwords or login details." },
  { title: "Protect Verification Codes", body: "Never share OTPs or other security codes." },
  { title: "Check Recipient Details", body: "Review information before confirming a transfer." },
  { title: "Report Suspicious Activity", body: "Contact us immediately if you suspect fraud or unauthorized activity." }
];
const DUTIES = [
  "Provide accurate information.",
  "Keep your details updated.",
  "Protect login credentials and documents.",
  "Use services lawfully.",
  "Review transaction details carefully.",
  "Complete required verification.",
  "Report unauthorized activity.",
  "Follow these Terms & Services."
];

export function TermsPro({
  settings,
  page,
  services,
  documents
}: {
  settings: CompanySettings | null;
  page: CmsPage | null;
  services: ServiceItem[];
  documents: DocumentItem[];
}) {
  const [active, setActive] = useState(TOC[0].id);
  const [query, setQuery] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const company = settings?.companyName?.trim() || "Remit2Nepal";
  const address = settings?.address?.trim() || "";
  const email = settings?.email?.trim() || "";
  const phone = settings?.phone?.trim() || "";
  const inNepal = /nepal/i.test(address);
  const lastUpdated = formatPolicyDate(page?.updatedAt);
  const effective = formatPolicyDate(page?.createdAt);
  const extra = htmlToText(page?.content || "");
  const extraHtml = extra.length > 240 ? page?.content : "";
  const termsPdf = documents.find((doc) => /term/i.test(doc.title) && doc.fileUrl);
  const q = query.trim().toLowerCase();
  const tocItems = useMemo(() => (q ? TOC.filter((item) => item.label.toLowerCase().includes(q)) : TOC), [q]);

  useEffect(() => {
    const nodes = TOC.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="ppro tpro">
      <section className="ppro-hero">
        <div className="ppro-wrap ppro-hero-grid">
          <div>
            <p className="ppro-kicker">Terms &amp; Services</p>
            <h1>Terms &amp; Services</h1>
            <p className="tpro-punch">
              <span>Clear Terms.</span> <span className="is-red">Better Protection.</span> <span>Greater Trust.</span>
            </p>
            <p>
              Please read these Terms &amp; Services carefully before using our website or money transfer services. These
              terms explain your rights, responsibilities, and the conditions that apply when using our services.
            </p>
            <ul className="ppro-dates">
              {lastUpdated ? <li>Last Updated: {lastUpdated}</li> : null}
              {effective ? <li>Effective Date: {effective}</li> : null}
            </ul>
          </div>
          <TermsMark className="ppro-mark" />
        </div>
      </section>

      <div className="ppro-wrap">
        <aside className="tpro-notice">
          <ShieldCheck />
          <div>
            <h2>Please Read Before Using Our Services</h2>
            <p>
              By accessing or using our services, you acknowledge that you have read, understood, and agreed to these
              Terms &amp; Services, our <Link to="/privacy">Privacy Policy</Link>, and any additional terms applicable to
              specific services.
            </p>
            <p>If you do not agree with these terms, please do not use our services.</p>
          </div>
        </aside>
      </div>

      <div className="ppro-wrap ppro-layout">
        <aside className="ppro-toc-wrap">
          <button type="button" className="ppro-toc-toggle" aria-expanded={tocOpen} onClick={() => setTocOpen((open) => !open)}>
            On This Page
            <span>{tocOpen ? "Hide" : "Show"}</span>
          </button>
          <nav className={tocOpen ? "ppro-toc is-open" : "ppro-toc"} aria-label="Terms sections">
            <p>On This Page</p>
            <label className="ppro-search">
              <Search />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this page" />
            </label>
            <ol>
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={active === item.id ? "is-active" : undefined} onClick={() => setTocOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
            {!tocItems.length ? <p className="ppro-empty">No matching sections.</p> : null}
          </nav>
        </aside>

        <article className="ppro-body">
          <div className="ppro-tools">
            <button type="button" onClick={() => window.print()}>
              <Printer /> Print
            </button>
            <button type="button" onClick={copyPageLink}>
              <Link2 /> {copied ? "Copied" : "Copy page link"}
            </button>
            {termsPdf ? (
              <a href={mediaUrl(termsPdf.fileUrl)} target="_blank" rel="noreferrer">
                <FileText /> Download PDF
              </a>
            ) : null}
          </div>

          <section>
            <Heading id="about-terms" n="1">About These Terms</Heading>
            <p>
              These Terms govern access to and use of {company}&apos;s website, remittance services, and related money
              transfer services. Using the services means you agree to these Terms and related policies, including our
              Privacy Policy.
            </p>
            <dl className="ppro-dl">
              <div>
                <dt>Company Legal Name</dt>
                <dd>{company}</dd>
              </div>
              {inNepal ? (
                <div>
                  <dt>Jurisdiction</dt>
                  <dd>Nepal</dd>
                </div>
              ) : null}
              {address ? (
                <div>
                  <dt>Registered Address</dt>
                  <dd>{address}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section>
            <Heading id="eligibility" n="2">Eligibility</Heading>
            <p>
              You must meet the eligibility requirements applicable to the relevant service and jurisdiction. You may need
              to provide accurate information and complete identity verification before using certain services.
            </p>
            <p className="ppro-note">
              Eligibility requirements may vary by country, service, transaction type, and applicable law.
            </p>
          </section>

          <section>
            <Heading id="our-services" n="3">Our Services</Heading>
            <div className="ppro-cards">
              <article>
                <Wallet />
                <h3>Send Money</h3>
                <p>Send funds to eligible recipients through supported destinations and payment methods.</p>
              </article>
              <article>
                <Landmark />
                <h3>Receive Money</h3>
                <p>Receive funds in Nepal through supported payout channels such as cash pickup, bank deposit, or mobile wallet where available.</p>
              </article>
              <article>
                <Smartphone />
                <h3>Digital Services</h3>
                <p>Use this website for rates, charges, branch information, and service enquiries.</p>
              </article>
              <article>
                <Headset />
                <h3>Customer Support</h3>
                <p>Receive assistance with transactions, branches, and service-related questions.</p>
              </article>
            </div>
            {services.length ? (
              <p className="ppro-note">
                Published service pages currently include {services.map((item) => item.title).join(", ")}.
              </p>
            ) : null}
          </section>

          <section>
            <Heading id="account-registration" n="4">Account Registration</Heading>
            <p>
              Where a customer record, agent profile, or login is created for our services, the following responsibilities
              apply.
            </p>
            <ul className="tpro-check">
              {ACCOUNT_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <Heading id="identity-verification" n="5">Identity Verification</Heading>
            <p className="tpro-lead">Your Identity Helps Us Keep Transactions Secure</p>
            <p>
              We may request identity information or documents to verify customers and meet applicable legal and
              regulatory requirements.
            </p>
            <ol className="tpro-steps">
              <li>
                <span>01</span>
                <strong>Submit Information</strong>
                <p>Provide required information or documents.</p>
              </li>
              <li>
                <span>02</span>
                <strong>Verification</strong>
                <p>Information is reviewed using appropriate procedures.</p>
              </li>
              <li>
                <span>03</span>
                <strong>Approval</strong>
                <p>Eligible transactions can proceed once required checks are completed.</p>
              </li>
            </ol>
            <p>
              Transactions may be delayed, restricted, rejected, or cancelled where verification cannot be completed or
              where required by law.
            </p>
          </section>

          <section>
            <Heading id="sending-money" n="6">Sending Money</Heading>
            <ol className="tpro-journey">
              {SEND_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>Customers are responsible for providing accurate sender and recipient information.</p>
            <p>
              Before confirming a transaction, carefully review the recipient details, transfer amount, applicable fees,
              exchange rate, and other transaction information displayed to you.
            </p>
          </section>

          <section>
            <Heading id="receiving-money" n="7">Receiving Money</Heading>
            <p>
              Recipients may need to provide identification or other information before receiving funds. Availability can
              depend on destination, payout method, verification requirements, operating hours, holidays, payment
              partners, and regulatory requirements.
            </p>
            <p>We do not promise a specific delivery time unless that time is confirmed for your transaction.</p>
          </section>

          <section>
            <Heading id="fees" n="8">Fees &amp; Exchange Rates</Heading>
            <div className="ppro-cards">
              <article>
                <h3>Transfer Fees</h3>
                <p>
                  Applicable transaction fees are published on our Service Charge page and shown where required before
                  confirmation.
                </p>
                <Link to="/service-charge" className="ppro-text-link">
                  View service charges <ArrowRight />
                </Link>
              </article>
              <article>
                <h3>Exchange Rates</h3>
                <p>
                  Currency conversion follows the rate applicable to the transaction. Company and NRB-referenced rates are
                  published on the Exchange Rate page.
                </p>
                <Link to="/exchange-rate" className="ppro-text-link">
                  View exchange rates <ArrowRight />
                </Link>
              </article>
            </div>
            <p>
              Applicable fees and exchange rates will be displayed to customers where required before transaction
              confirmation. Fees and rates may vary based on amount, destination, payment method, currency, and other
              factors.
            </p>
          </section>

          <section>
            <Heading id="limits" n="9">Transaction Limits</Heading>
            <p>
              We do not publish a single global minimum, maximum, daily, or monthly amount on this page. Limits may vary
              based on country, verification status, transaction type, payment method, regulatory requirements, and risk
              controls.
            </p>
            <div className="tpro-limits">
              {["Minimum Transfer", "Maximum Transfer", "Daily Limit", "Monthly Limit"].map((label) => (
                <article key={label}>
                  <p>Varies</p>
                  <span>{label}</span>
                </article>
              ))}
            </div>
            <p>Ask the sending agent, branch, or support desk for the limits that apply to your corridor before you send.</p>
          </section>

          <section>
            <Heading id="processing" n="10">Transaction Processing</Heading>
            <ol className="tpro-journey is-process">
              {PROCESS_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              Processing times may be affected by verification, payment providers, weekends, holidays, technical issues,
              regulatory requirements, and circumstances outside our reasonable control.
            </p>
          </section>

          <section>
            <Heading id="cancellations" n="11">Cancellations &amp; Refunds</Heading>
            <div className="ppro-cards">
              <article>
                <h3>Before Processing</h3>
                <p>Cancellation may be available where permitted and the transfer has not yet been processed.</p>
              </article>
              <article>
                <h3>During Processing</h3>
                <p>Cancellation may not always be possible once payment partners or payout channels are involved.</p>
              </article>
              <article>
                <h3>Completed Transaction</h3>
                <p>Refund or cancellation of a completed payout may be subject to additional conditions and applicable law.</p>
              </article>
            </div>
            <Link to="/contact?subject=Cancellation%20or%20refund%20request" className="ppro-text-link">
              Request Cancellation / Refund <ArrowRight />
            </Link>
          </section>

          <section>
            <Heading id="prohibited" n="12">Prohibited &amp; Restricted Activities</Heading>
            <div className="tpro-ban">
              <p>
                You must not use the services for unlawful, fraudulent, deceptive, or prohibited activities. We may
                restrict, reject, suspend, or report transactions where required or permitted by applicable law or our
                compliance procedures.
              </p>
              <ul>
                {PROHIBITED.map((item) => (
                  <li key={item}>
                    <Ban />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <Heading id="fraud" n="13">Fraud &amp; Security</Heading>
            <p className="tpro-lead">Your Security Matters</p>
            <p>
              We use security and risk controls designed to help protect our customers and services. Customers are also
              responsible for protecting their accounts, documents, and personal information.
            </p>
            <div className="ppro-cards is-secure">
              {SECURITY.map((item) => (
                <article key={item.title}>
                  <ShieldCheck />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <Heading id="responsibilities" n="14">Customer Responsibilities</Heading>
            <ul className="tpro-check">
              {DUTIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <Heading id="third-parties" n="15">Third-Party Services</Heading>
            <p>
              We may work with banks, payout partners, identity-verification processes, technology providers, and security
              providers to operate remittance services. Those parties may have their own terms and privacy policies.
            </p>
          </section>

          <section>
            <Heading id="ip" n="16">Intellectual Property</Heading>
            <p>
              The {company} website, logo, branding, designs, content, software, and graphics are owned by or licensed to{" "}
              {company} and protected by applicable intellectual-property laws. You may not copy, modify, or use them
              except as allowed by these Terms or with our written permission.
            </p>
          </section>

          <section className="ppro-rights">
            <Heading id="privacy" n="17">Privacy</Heading>
            <p>
              Your use of our services is also subject to our Privacy Policy, which explains how we collect, use,
              disclose, retain, and protect personal information.
            </p>
            <Link to="/privacy" className="ppro-text-link">
              Read Privacy Policy <ArrowRight />
            </Link>
          </section>

          <section>
            <Heading id="availability" n="18">Service Availability</Heading>
            <p>
              We work to maintain reliable services but cannot guarantee that services will always be available,
              uninterrupted, error-free, or offered in every country. Interruptions may result from maintenance, technical
              issues, network problems, payment-provider availability, security incidents, regulatory requirements, or
              events outside reasonable control.
            </p>
          </section>

          <section>
            <Heading id="liability" n="19">Liability</Heading>
            <p className="ppro-note">
              A jurisdiction-specific limitation of liability has not yet been published on this page. Until that legally
              reviewed clause is added, our responsibility is subject to applicable law, including mandatory consumer
              protections that cannot be excluded.
            </p>
          </section>

          <section>
            <Heading id="indemnification" n="20">Indemnification</Heading>
            <p className="ppro-note">
              A legally reviewed indemnification clause for {company}&apos;s jurisdiction and services has not yet been
              published here. This section will be updated after legal review rather than using generic or unenforceable
              wording.
            </p>
          </section>

          <section>
            <Heading id="suspension" n="21">Suspension &amp; Termination</Heading>
            <div className="tpro-warn">
              <ShieldAlert />
              <div>
                <p>
                  We may suspend or terminate access where permitted or required by applicable law, security requirements,
                  compliance obligations, fraud concerns, a violation of these Terms, failure to complete required
                  verification, or prohibited activities.
                </p>
              </div>
            </div>
          </section>

          <section>
            <Heading id="complaints" n="22">Complaints &amp; Disputes</Heading>
            <ol className="tpro-steps">
              <li>
                <span>01</span>
                <strong>Contact Us</strong>
                <p>Submit your complaint through the official contact form or published phone and email channels.</p>
              </li>
              <li>
                <span>02</span>
                <strong>Review</strong>
                <p>Our team investigates the issue.</p>
              </li>
              <li>
                <span>03</span>
                <strong>Resolution</strong>
                <p>We communicate the outcome and available next steps.</p>
              </li>
            </ol>
            <dl className="ppro-dl">
              {email ? (
                <div>
                  <dt>Complaints Email</dt>
                  <dd>
                    <a href={`mailto:${email}`}>{email}</a>
                  </dd>
                </div>
              ) : null}
              {phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>{phone}</dd>
                </div>
              ) : null}
              <div>
                <dt>Complaint Form</dt>
                <dd>
                  <Link to="/contact?subject=Service%20complaint">Contact form</Link>
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <Heading id="changes" n="23">Changes to These Terms</Heading>
            <p>
              We may update these Terms from time to time to reflect changes to our services, business practices, or legal
              requirements. The updated Terms will be published on this page with a revised Last Updated date. Where
              required, we will provide additional notice.
            </p>
          </section>

          <section>
            <Heading id="governing-law" n="24">Governing Law</Heading>
            <p>
              These Terms are governed by the laws of {inNepal ? "Nepal" : "the jurisdiction in which we operate"}, except
              where applicable law provides otherwise.
            </p>
          </section>

          {extraHtml ? (
            <section>
              <h2>Additional published information</h2>
              <div className="prose-r2n" dangerouslySetInnerHTML={{ __html: extraHtml }} />
            </section>
          ) : null}

          <section id="contact" className="ppro-contact">
            <FileText />
            <div>
              <h2>Questions About Our Terms?</h2>
              <p>
                If you have questions about these Terms &amp; Services, our services, or your responsibilities as a
                customer, please contact us through our official support channels.
              </p>
              <dl className="ppro-dl">
                <div>
                  <dt>Company</dt>
                  <dd>{company}</dd>
                </div>
                {email ? (
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${email}`}>{email}</a>
                    </dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>{phone}</dd>
                  </div>
                ) : null}
                {address ? (
                  <div>
                    <dt>Address</dt>
                    <dd>{address}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="ppro-tools">
                <Link to="/contact">
                  <Button variant="gold" size="lg">
                    Contact Support
                  </Button>
                </Link>
                <Link to="/privacy">
                  <Button variant="secondary" size="lg">
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>

      <section className="ppro-final tpro-final" aria-labelledby="tpro-close">
        <div className="ppro-wrap ppro-final-grid">
          <div>
            <h2 id="tpro-close">
              Clear Terms. <span className="is-red">Better Protection.</span>
            </h2>
            <p>
              We believe transparency builds trust. Our Terms explain how our services work and help customers understand
              their rights and responsibilities.
            </p>
            <div className="ppro-tools">
              <Link to="/contact">
                <Button variant="gold" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Link to="/contact?subject=Send%20money%20enquiry">
                <Button variant="secondary" size="lg" className="apro-btn is-ghost">
                  Send Money
                </Button>
              </Link>
            </div>
          </div>
          <TermsMark className="ppro-mark is-final" />
        </div>
      </section>

      <a className="ppro-top" href="#about-terms">
        <ArrowUp />
        <span>Back to top</span>
      </a>
    </div>
  );
}
