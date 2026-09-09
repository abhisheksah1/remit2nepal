import { Link } from "react-router-dom";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import type { CompanySettings, NavItem, SocialLink } from "@/types/content";

const icons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube
};

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
  const headerNav = items.filter((item) => item.location === "HEADER" && item.enabled).slice(0, 6);

  return (
    <footer className="relative z-10 mt-20 bg-navy text-cream">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-site gap-10 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl text-gold">{settings?.companyName || "Remit2Nepal"}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/80">
            {settings?.footerAbout ||
              "A licensed remittance company serving families and businesses with regulated payouts across Nepal."}
          </p>
          <p className="mt-4 text-sm text-cream/70">{settings?.address}</p>
          <p className="text-sm text-cream/70">{settings?.officeHours}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {headerNav.map((item) => (
              <li key={item._id}>
                <Link to={item.path} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(settings?.legalLinks?.length ? settings.legalLinks : footerNav.map((item) => ({ label: item.label, url: item.path }))).map(
              (item) => (
                <li key={item.label}>
                  <Link to={item.url} className="hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
          <div className="mt-6 flex gap-3">
            {social
              .filter((item) => item.enabled)
              .map((item) => {
                const Icon = icons[item.platform] ?? Facebook;
                return (
                  <a key={item._id} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label} className="rounded-full border border-gold/40 p-2 hover:bg-gold/10">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/60">
        {settings?.copyrightText || "© Remit2Nepal. All rights reserved."} Licensed remittance operations in Nepal.
      </div>
    </footer>
  );
}
