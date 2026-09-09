import { Link } from "react-router-dom";
import { Clock3, Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import type { CompanySettings, NavItem, SocialLink } from "@/types/content";
import { ABOUT_NAV } from "@/config/about-nav";
import { PUBLIC_NAV } from "@/config/public-labels";
import { BRAND } from "@/constants/brand";

const icons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube
};

const TRANSFER_LINKS = [
  { label: "Services", path: "/services" },
  { label: "Exchange Rate", path: "/exchange-rate" },
  { label: PUBLIC_NAV.ourAgent.label, path: PUBLIC_NAV.ourAgent.path },
  { label: "Service Charge", path: "/service-charge" },
  { label: "News & Notices", path: "/news" },
  { label: "FAQ", path: "/faq" }
];

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="site-footer-link">
      {children}
    </Link>
  );
}

export function Footer({
  settings,
  items,
  social
}: {
  settings: CompanySettings | null;
  items: NavItem[];
  social: SocialLink[];
}) {
  const footerNav = items.filter((item) => item.location === "FOOTER" && item.enabled);
  const legal = settings?.legalLinks?.length
    ? settings.legalLinks
    : footerNav.map((item) => ({ label: item.label, url: item.path }));
  const company = settings?.companyName || BRAND.name;
  const liveSocial = social.filter((item) => item.enabled);

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" aria-label={`${company} home`}>
            <img src={settings?.logoUrl || BRAND.logo} alt={company} className="site-logo-footer" />
          </Link>
          <p className="site-footer-tagline">{settings?.tagline || BRAND.tagline}</p>
          <p className="site-footer-about">
            {settings?.footerAbout ||
              "A licensed remittance company serving families and businesses with regulated payouts across Nepal."}
          </p>
        </div>

        <nav aria-label="Company">
          <p className="site-footer-heading">Company</p>
          <ul>
            {ABOUT_NAV.map((link) => (
              <li key={link.path}>
                <FooterLink to={link.path}>{link.label}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink to={PUBLIC_NAV.becomeAgent.path}>{PUBLIC_NAV.becomeAgent.label}</FooterLink>
            </li>
            <li>
              <FooterLink to="/contact">Contact</FooterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Transfer">
          <p className="site-footer-heading">Transfer</p>
          <ul>
            {TRANSFER_LINKS.map((link) => (
              <li key={link.path}>
                <FooterLink to={link.path}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="site-footer-heading">Get in touch</p>
          <ul className="site-footer-contact">
            {settings?.phone ? (
              <li>
                <Phone className="site-footer-icon" aria-hidden />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            ) : null}
            {settings?.email ? (
              <li>
                <Mail className="site-footer-icon" aria-hidden />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {settings?.address ? (
              <li>
                <MapPin className="site-footer-icon" aria-hidden />
                <span>{settings.address}</span>
              </li>
            ) : null}
            {settings?.officeHours ? (
              <li>
                <Clock3 className="site-footer-icon" aria-hidden />
                <span>{settings.officeHours}</span>
              </li>
            ) : null}
          </ul>
          {liveSocial.length ? (
            <div className="site-footer-social">
              {liveSocial.map((item) => {
                const Icon = icons[item.platform] ?? Facebook;
                return (
                  <a key={item._id} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label} className="site-footer-social-btn">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-legal">
          <p>
            {settings?.copyrightText || `© ${new Date().getFullYear()} ${company}. All rights reserved.`} Licensed remittance operations in Nepal.
          </p>
          {legal.length ? (
            <ul>
              {legal.map((item) => (
                <li key={`${item.label}-${item.url}`}>
                  <Link to={item.url}>{item.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
