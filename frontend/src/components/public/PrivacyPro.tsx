import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ClipboardCheck,
  Eye,
  FileText,
  Link2,
  Lock,
  Printer,
  Search,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CmsPage, CompanySettings } from "@/types/content";
import { htmlToText } from "@/utils/cn";

const TOC = [
  { id: "who-we-are", label: "Who We Are" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-collect", label: "How We Collect Information" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "legal-bases", label: "Legal Bases for Processing" },
  { id: "information-sharing", label: "Information Sharing" },
  { id: "international-transfers", label: "International Data Transfers" },
  { id: "data-security", label: "Data Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "cookies", label: "Cookies and Similar Technologies" },
  { id: "privacy-rights", label: "Your Privacy Rights" },
  { id: "marketing", label: "Marketing Communications" },
  { id: "children", label: "Children's Privacy" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "changes", label: "Changes to This Privacy Policy" },
  { id: "contact", label: "Contact Us" }
];

function formatPolicyDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function PrivacyMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 280" aria-hidden>
      <circle cx="140" cy="140" r="108" fill="#eef1f8" />
      <circle cx="140" cy="140" r="78" fill="#2e3192" />
      <path
        d="M140 72 C 176 84, 196 98, 196 136 C 196 178, 168 204, 140 224 C 112 204, 84 178, 84 136 C 84 98, 104 84, 140 72Z"
        fill="#f7f8ff"
      />
      <path
        d="M140 92 C 166 102, 178 114, 178 136 C 178 166, 160 186, 140 200 C 120 186, 102 166, 102 136 C 102 114, 114 102, 140 92Z"
        fill="#2e3192"
      />
      <path d="M126 138 L136 148 L158 122" fill="none" stroke="#e31e24" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heading({
  id,
  n,
  children
}: {
  id: string;
  n: string;
  children: string;
}) {
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
      <span>{n}. {children}</span>
      <button type="button" className="ppro-copy" onClick={copyLink} aria-label={`Copy link to ${children}`}>
        <Link2 />
      </button>
    </h2>
  );
}

export function PrivacyPro({
  settings,
  page
}: {
  settings: CompanySettings | null;
  page: CmsPage | null;
}) {
  const [active, setActive] = useState(TOC[0].id);
  const [query, setQuery] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cookieHelp, setCookieHelp] = useState(false);

  const company = settings?.companyName?.trim() || "Remit2Nepal";
  const address = settings?.address?.trim() || "";
  const email = settings?.email?.trim() || "";
  const phone = settings?.phone?.trim() || "";
  const analyticsOn = Boolean(settings?.analyticsScript?.trim());
  const lastUpdated = formatPolicyDate(page?.updatedAt);
  const effective = formatPolicyDate(page?.createdAt);
  const extra = htmlToText(page?.content || "");
  const extraHtml = extra.length > 240 ? page?.content : "";
  const q = query.trim().toLowerCase();

  const tocItems = useMemo(
    () => (q ? TOC.filter((item) => item.label.toLowerCase().includes(q)) : TOC),
    [q]
  );

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
    <div className="ppro">
      <section className="ppro-hero">
        <div className="ppro-wrap ppro-hero-grid">
          <div>
            <p className="ppro-kicker">Privacy Policy</p>
            <h1>Your Privacy Matters</h1>
            <p>
              We respect your privacy and are committed to protecting the personal information you provide when using our
              services. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the
              choices available to you.
            </p>
            <ul className="ppro-dates">
              {lastUpdated ? <li>Last Updated: {lastUpdated}</li> : null}
              {effective ? <li>Effective Date: {effective}</li> : null}
            </ul>
          </div>
          <PrivacyMark className="ppro-mark" />
        </div>
      </section>

      <div className="ppro-wrap ppro-layout">
        <aside className="ppro-toc-wrap">
          <button type="button" className="ppro-toc-toggle" aria-expanded={tocOpen} onClick={() => setTocOpen((open) => !open)}>
            On this page
            <span>{tocOpen ? "Hide" : "Show"}</span>
          </button>
          <nav className={tocOpen ? "ppro-toc is-open" : "ppro-toc"} aria-label="Privacy Policy sections">
            <p>Table of Contents</p>
            <label className="ppro-search">
              <Search />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this page"
              />
            </label>
            <ol>
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={active === item.id ? "is-active" : undefined}
                    onClick={() => setTocOpen(false)}
                  >
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
          </div>

          <section>
            <Heading id="who-we-are" n="1">Who We Are</Heading>
            <p>
              {company} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a remittance receiving company in Nepal.
              We pay out transfers sent from abroad and are committed to handling personal information responsibly and in
              accordance with applicable privacy and data protection requirements.
            </p>
            <dl className="ppro-dl">
              <div>
                <dt>Legal Name</dt>
                <dd>{company}</dd>
              </div>
              {address ? (
                <div>
                  <dt>Registered Address</dt>
                  <dd>{address}</dd>
                </div>
              ) : null}
              {address.toLowerCase().includes("nepal") ? (
                <div>
                  <dt>Jurisdiction</dt>
                  <dd>Nepal</dd>
                </div>
              ) : null}
              {email || phone ? (
                <div>
                  <dt>Contact</dt>
                  <dd>
                    {email ? <a href={`mailto:${email}`}>{email}</a> : null}
                    {email && phone ? " · " : null}
                    {phone || null}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section>
            <Heading id="information-we-collect" n="2">Information We Collect</Heading>
            <p>
              The information we collect depends on how you interact with us. We collect only what is needed to operate
              this website, respond to enquiries, review partner applications, and provide remittance services where those
              services are used.
            </p>
            <div className="ppro-cards">
              <article>
                <h3>Personal Information</h3>
                <p>Depending on the service or form you use, this may include:</p>
                <ul>
                  <li>Full name</li>
                  <li>Contact information such as email address and phone number</li>
                  <li>Residential or business address</li>
                  <li>Identification information where required for remittance or partner onboarding</li>
                </ul>
              </article>
              <article>
                <h3>Transaction Information</h3>
                <p>When remittance is sent from abroad and paid out in Nepal, this may include:</p>
                <ul>
                  <li>Sender and recipient information</li>
                  <li>Transfer amount, currency, and destination</li>
                  <li>Transaction history and status</li>
                  <li>Payment or payout details needed to complete the transfer</li>
                </ul>
              </article>
              <article>
                <h3>Verification Information</h3>
                <p>Where required for customer due diligence, partner review, or applicable law, this may include:</p>
                <ul>
                  <li>Government-issued identification</li>
                  <li>Identity verification information</li>
                  <li>Company registration, tax, and related onboarding documents for agent applications</li>
                </ul>
              </article>
              <article>
                <h3>Technical and Support Information</h3>
                <p>When you use this website, contact us, or use the chat assistant, this may include:</p>
                <ul>
                  <li>IP address, browser, device, and log information</li>
                  <li>Website activity needed to operate and secure the site</li>
                  <li>Messages you send through the contact form or chat assistant</li>
                </ul>
              </article>
            </div>
          </section>

          <section>
            <Heading id="how-we-collect" n="3">How We Collect Information</Heading>
            <div className="ppro-stack">
              <article>
                <h3>Directly From You</h3>
                <p>For example, when you contact customer support, submit a form, use the chat assistant, apply to become an agent, or collect remittance sent from abroad.</p>
              </article>
              <article>
                <h3>Automatically</h3>
                <p>Some technical information may be collected automatically when you use our website, including information needed for security, performance, and basic site operation.</p>
              </article>
              <article>
                <h3>From Other Sources</h3>
                <p>
                  Where legally permitted and necessary, we may receive or review information from payment or payout
                  partners, identity-verification processes used for remittance or partner onboarding, and regulatory or
                  government authorities.
                </p>
              </article>
            </div>
          </section>

          <section>
            <Heading id="how-we-use" n="4">How We Use Your Information</Heading>
            <p>We use personal information only for appropriate purposes and in accordance with applicable law.</p>
            <div className="ppro-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Why We Use Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Provide Services</td>
                    <td>Process and manage money transfers and related customer requests</td>
                  </tr>
                  <tr>
                    <td>Identity Verification</td>
                    <td>Verify customers or applicants and meet applicable requirements</td>
                  </tr>
                  <tr>
                    <td>Security</td>
                    <td>Detect and help prevent fraud, misuse, and unauthorized activity</td>
                  </tr>
                  <tr>
                    <td>Compliance</td>
                    <td>Meet legal and regulatory obligations applicable to remittance services</td>
                  </tr>
                  <tr>
                    <td>Customer Support</td>
                    <td>Respond to questions and provide assistance</td>
                  </tr>
                  <tr>
                    <td>Improve Services</td>
                    <td>Understand website and service usage so we can improve them</td>
                  </tr>
                  <tr>
                    <td>Communications</td>
                    <td>Send service-related communications about your enquiry or transfer</td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>Send promotional communications only where permitted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <Heading id="legal-bases" n="5">Legal Bases for Processing</Heading>
            <p>
              Where applicable law requires a legal basis for processing personal information, the basis depends on the
              activity and the jurisdiction. It may include:
            </p>
            <ul className="ppro-list">
              <li><strong>Contract</strong> — Processing necessary to provide requested services.</li>
              <li><strong>Legal obligation</strong> — Processing required by applicable law or regulation.</li>
              <li><strong>Legitimate interests</strong> — Processing necessary for legitimate business or security purposes, where permitted by law.</li>
              <li><strong>Consent</strong> — Processing based on your consent where consent is required.</li>
            </ul>
            <p className="ppro-note">The legal basis for a specific activity is determined by applicable law and our privacy and compliance review. This page does not claim that every basis applies to every use of information.</p>
          </section>

          <section>
            <Heading id="information-sharing" n="6">When We Share Your Information</Heading>
            <p>
              We may share personal information when necessary to provide our services, protect customers, comply with
              legal requirements, or work with trusted service providers.
            </p>
            <div className="ppro-cards is-share">
              <article>
                <h3>Service Providers</h3>
                <p>Companies that help us operate our website, communications, hosting, and related services.</p>
              </article>
              <article>
                <h3>Financial Partners</h3>
                <p>Banks, payout partners, or other financial institutions involved in processing transactions.</p>
              </article>
              <article>
                <h3>Verification &amp; Security Partners</h3>
                <p>Providers that support identity verification, security, fraud prevention, or compliance where those processes are used.</p>
              </article>
              <article>
                <h3>Regulators &amp; Authorities</h3>
                <p>Where disclosure is required or permitted by applicable law, including Nepal Rastra Bank where relevant.</p>
              </article>
              <article>
                <h3>Business Transactions</h3>
                <p>Information may be disclosed as part of a merger, acquisition, restructuring, or similar transaction where legally permitted.</p>
              </article>
            </div>
            <p>We do not sell personal information.</p>
          </section>

          <section>
            <Heading id="international-transfers" n="7">International Data Transfers</Heading>
            <p>
              Because remittance services operate across borders, your information may be processed or transferred to
              countries other than the country in which you live. Website hosting and support tools may also process
              information outside Nepal.
            </p>
            <p>
              Where required, we take appropriate steps to ensure that international transfers are handled in accordance
              with applicable data protection requirements.
            </p>
          </section>

          <section className="ppro-secure">
            <Heading id="data-security" n="8">How We Protect Your Information</Heading>
            <p>
              We use appropriate technical, organizational, and operational measures designed to protect personal
              information against unauthorized access, misuse, alteration, disclosure, or loss.
            </p>
            <div className="ppro-cards is-secure">
              <article>
                <Lock />
                <h3>Secure Systems</h3>
                <p>Measures designed to protect systems and information.</p>
              </article>
              <article>
                <Eye />
                <h3>Access Controls</h3>
                <p>Access to information is restricted based on appropriate authorization.</p>
              </article>
              <article>
                <ShieldCheck />
                <h3>Monitoring</h3>
                <p>Security and operational monitoring helps identify potential threats.</p>
              </article>
              <article>
                <ClipboardCheck />
                <h3>Employee Awareness</h3>
                <p>Relevant employees and service providers receive appropriate privacy and security guidance.</p>
              </article>
            </div>
          </section>

          <section>
            <Heading id="data-retention" n="9">How Long We Keep Your Information</Heading>
            <p>
              We retain personal information only for as long as necessary for the purposes described in this Privacy
              Policy, including providing services, maintaining business records, resolving disputes, enforcing agreements,
              preventing fraud, and meeting applicable legal and regulatory requirements.
            </p>
            <p>Retention periods may vary depending on the type of information and the purpose for which it is processed.</p>
          </section>

          <section>
            <Heading id="cookies" n="10">Cookies and Similar Technologies</Heading>
            <p>
              We may use cookies and similar technologies to operate our website, keep it secure, and understand how
              visitors use our services.
            </p>
            <div className="ppro-cards">
              <article>
                <h3>Essential Cookies</h3>
                <p>Required for basic website functionality and security, including protecting forms and authenticated sessions where used.</p>
              </article>
              {analyticsOn ? (
                <article>
                  <h3>Analytics Cookies</h3>
                  <p>If analytics tools are enabled in our website settings, they may help us understand website usage.</p>
                </article>
              ) : (
                <article>
                  <h3>Analytics and Marketing</h3>
                  <p>We do not currently run a separate marketing-cookie program on this website. If analytics or marketing scripts are added later, we will update this section.</p>
                </article>
              )}
            </div>
            <p>
              You can control or delete cookies through your browser settings. Blocking essential cookies may affect how
              parts of the website work.
            </p>
            <button type="button" className="ppro-text-link" onClick={() => setCookieHelp((open) => !open)}>
              Manage Cookie Preferences
            </button>
            {cookieHelp ? (
              <p className="ppro-note">
                This website does not use a separate cookie-consent panel. Use your browser&apos;s cookie or privacy
                settings to block or delete cookies. Essential cookies used for security and basic site function may still
                be required if you continue to use the website.
              </p>
            ) : null}
          </section>

          <section className="ppro-rights">
            <Heading id="privacy-rights" n="11">Your Privacy Rights</Heading>
            <p>Depending on your location and applicable law, you may have rights relating to your personal information, including:</p>
            <ul className="ppro-pills">
              <li>Right to access</li>
              <li>Right to correction</li>
              <li>Right to deletion</li>
              <li>Right to restriction</li>
              <li>Right to object</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent where applicable</li>
              <li>Right to lodge a complaint with an appropriate authority</li>
            </ul>
            <p>These rights may vary depending on applicable law and your circumstances.</p>
            <Link to="/contact?subject=Privacy%20request" className="ppro-text-link">
              Submit a Privacy Request <ArrowRight />
            </Link>
          </section>

          <section>
            <Heading id="marketing" n="12">Marketing Communications</Heading>
            <p>
              Where permitted, we may send promotional communications about our products, services, offers, or updates.
              You can unsubscribe from marketing communications at any time using the unsubscribe option provided in the
              communication or by contacting us.
            </p>
            <p>Service-related messages about a transfer, enquiry, or account matter are separate from promotional communications.</p>
          </section>

          <section>
            <Heading id="children" n="13">Children&apos;s Privacy</Heading>
            <p>
              Our services are intended for individuals who meet the applicable age and eligibility requirements. We do
              not knowingly collect personal information from children where prohibited by applicable law.
            </p>
          </section>

          <section>
            <Heading id="third-parties" n="14">Third-Party Services</Heading>
            <p>
              Our website or services may contain links to or integrate with third-party services. Those third parties may
              have their own privacy policies and practices. We encourage you to review their privacy notices where
              appropriate.
            </p>
          </section>

          <section>
            <Heading id="changes" n="15">Changes to This Privacy Policy</Heading>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our services, legal requirements,
              or privacy practices. When we make changes, we will update the &quot;Last Updated&quot; date at the beginning
              of this Policy and provide additional notice where required.
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
              <h2>Questions About Your Privacy?</h2>
              <p>
                If you have questions about this Privacy Policy or want to exercise a privacy right, please contact us
                through the official channels below.
              </p>
              <dl className="ppro-dl">
                {email ? (
                  <div>
                    <dt>Email</dt>
                    <dd><a href={`mailto:${email}`}>{email}</a></dd>
                  </div>
                ) : null}
                {address ? (
                  <div>
                    <dt>Address</dt>
                    <dd>{address}</dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>{phone}</dd>
                  </div>
                ) : null}
              </dl>
              <Link to="/contact?subject=Privacy%20request">
                <Button variant="gold" size="lg">
                  Contact Privacy Team
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </div>

      <section className="ppro-final" aria-labelledby="ppro-close">
        <div className="ppro-wrap ppro-final-grid">
          <div>
            <h2 id="ppro-close">
              <span className="is-navy">Your Data.</span> <span className="is-red">Your Rights.</span> Our Responsibility.
            </h2>
            <p>
              We are committed to handling your personal information responsibly and transparently while working to provide
              secure and reliable remittance services.
            </p>
          </div>
          <PrivacyMark className="ppro-mark is-final" />
        </div>
      </section>

      <a className="ppro-top" href="#who-we-are">
        <ArrowUp />
        <span>Back to top</span>
      </a>
    </div>
  );
}
