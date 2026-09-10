import { lazy } from "react";
import { Route } from "react-router-dom";

const loaders = {
  "/admin": () => import("@/pages/admin/Dashboard"),
  "/admin/homepage": () => import("@/pages/admin/Homepage"),
  "/admin/pages": () => import("@/pages/admin/Pages"),
  "/admin/sections": () => import("@/pages/admin/Sections"),
  "/admin/header-footer": () => import("@/pages/admin/HeaderFooter"),
  "/admin/banners": () => import("@/pages/admin/Banners"),
  "/admin/about": () => import("@/pages/admin/About"),
  "/admin/team": () => import("@/pages/admin/Team"),
  "/admin/partners": () => import("@/pages/admin/Partners"),
  "/admin/partners/settings": () => import("@/pages/admin/PartnershipSettings"),
  "/admin/partners/applications": () => import("@/pages/admin/PartnerApplications"),
  "/admin/services": () => import("@/pages/admin/Services"),
  "/admin/service-charge": () => import("@/pages/admin/ServiceCharges"),
  "/admin/documents": () => import("@/pages/admin/Documents"),
  "/admin/branches": () => import("@/pages/admin/Branches"),
  "/admin/rates": () => import("@/pages/admin/CurrentRates"),
  "/admin/rates/history": () => import("@/pages/admin/RateHistory"),
  "/admin/rates/nrb": () => import("@/pages/admin/NrbSync"),
  "/admin/rates/settings": () => import("@/pages/admin/RateSettings"),
  "/admin/news": () => import("@/pages/admin/News"),
  "/admin/faq": () => import("@/pages/admin/Faq"),
  "/admin/remittances": () => import("@/pages/admin/Remittances"),
  "/admin/chatbot": () => import("@/pages/admin/Chatbot"),
  "/admin/gallery": () => import("@/pages/admin/Gallery"),
  "/admin/media": () => import("@/pages/admin/Media"),
  "/admin/contact": () => import("@/pages/admin/Contact"),
  "/admin/seo": () => import("@/pages/admin/Seo"),
  "/admin/admins": () => import("@/pages/admin/Admins"),
  "/admin/audit-logs": () => import("@/pages/admin/AuditLogs"),
  "/admin/settings": () => import("@/pages/admin/Settings")
} as const;

export function prefetchAdminPage(path: string) {
  const load = loaders[path as keyof typeof loaders];
  if (load) void load();
}

const Dashboard = lazy(loaders["/admin"]);
const Homepage = lazy(loaders["/admin/homepage"]);
const Pages = lazy(loaders["/admin/pages"]);
const Sections = lazy(loaders["/admin/sections"]);
const HeaderFooter = lazy(loaders["/admin/header-footer"]);
const Banners = lazy(loaders["/admin/banners"]);
const About = lazy(loaders["/admin/about"]);
const Team = lazy(loaders["/admin/team"]);
const Partners = lazy(loaders["/admin/partners"]);
const PartnershipSettings = lazy(loaders["/admin/partners/settings"]);
const PartnerApplications = lazy(loaders["/admin/partners/applications"]);
const Services = lazy(loaders["/admin/services"]);
const ServiceCharges = lazy(loaders["/admin/service-charge"]);
const Documents = lazy(loaders["/admin/documents"]);
const Branches = lazy(loaders["/admin/branches"]);
const CurrentRates = lazy(loaders["/admin/rates"]);
const RateHistory = lazy(loaders["/admin/rates/history"]);
const NrbSync = lazy(loaders["/admin/rates/nrb"]);
const RateSettings = lazy(loaders["/admin/rates/settings"]);
const News = lazy(loaders["/admin/news"]);
const Faq = lazy(loaders["/admin/faq"]);
const Remittances = lazy(loaders["/admin/remittances"]);
const Chatbot = lazy(loaders["/admin/chatbot"]);
const Gallery = lazy(loaders["/admin/gallery"]);
const Media = lazy(loaders["/admin/media"]);
const Contact = lazy(loaders["/admin/contact"]);
const Seo = lazy(loaders["/admin/seo"]);
const Admins = lazy(loaders["/admin/admins"]);
const AuditLogs = lazy(loaders["/admin/audit-logs"]);
const Settings = lazy(loaders["/admin/settings"]);

export const adminRouteElements = (
  <>
    <Route index element={<Dashboard />} />
    <Route path="homepage" element={<Homepage />} />
    <Route path="pages" element={<Pages />} />
    <Route path="sections" element={<Sections />} />
    <Route path="header-footer" element={<HeaderFooter />} />
    <Route path="banners" element={<Banners />} />
    <Route path="about" element={<About />} />
    <Route path="team" element={<Team />} />
    <Route path="partners" element={<Partners />} />
    <Route path="partners/settings" element={<PartnershipSettings />} />
    <Route path="partners/applications" element={<PartnerApplications />} />
    <Route path="services" element={<Services />} />
    <Route path="service-charge" element={<ServiceCharges />} />
    <Route path="documents" element={<Documents />} />
    <Route path="branches" element={<Branches />} />
    <Route path="rates" element={<CurrentRates />} />
    <Route path="rates/history" element={<RateHistory />} />
    <Route path="rates/nrb" element={<NrbSync />} />
    <Route path="rates/settings" element={<RateSettings />} />
    <Route path="news" element={<News />} />
    <Route path="faq" element={<Faq />} />
    <Route path="remittances" element={<Remittances />} />
    <Route path="chatbot" element={<Chatbot />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="media" element={<Media />} />
    <Route path="contact" element={<Contact />} />
    <Route path="seo" element={<Seo />} />
    <Route path="admins" element={<Admins />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    <Route path="settings" element={<Settings />} />
  </>
);
