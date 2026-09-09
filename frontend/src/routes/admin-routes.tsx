import { lazy } from "react";
import { Route } from "react-router-dom";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Homepage = lazy(() => import("@/pages/admin/Homepage"));
const Pages = lazy(() => import("@/pages/admin/Pages"));
const Sections = lazy(() => import("@/pages/admin/Sections"));
const HeaderFooter = lazy(() => import("@/pages/admin/HeaderFooter"));
const About = lazy(() => import("@/pages/admin/About"));
const Team = lazy(() => import("@/pages/admin/Team"));
const Partners = lazy(() => import("@/pages/admin/Partners"));
const Services = lazy(() => import("@/pages/admin/Services"));
const Documents = lazy(() => import("@/pages/admin/Documents"));
const Branches = lazy(() => import("@/pages/admin/Branches"));
const CurrentRates = lazy(() => import("@/pages/admin/CurrentRates"));
const RateHistory = lazy(() => import("@/pages/admin/RateHistory"));
const NrbSync = lazy(() => import("@/pages/admin/NrbSync"));
const RateSettings = lazy(() => import("@/pages/admin/RateSettings"));
const News = lazy(() => import("@/pages/admin/News"));
const Faq = lazy(() => import("@/pages/admin/Faq"));
const Gallery = lazy(() => import("@/pages/admin/Gallery"));
const Media = lazy(() => import("@/pages/admin/Media"));
const Contact = lazy(() => import("@/pages/admin/Contact"));
const Seo = lazy(() => import("@/pages/admin/Seo"));
const Admins = lazy(() => import("@/pages/admin/Admins"));
const AuditLogs = lazy(() => import("@/pages/admin/AuditLogs"));
const Settings = lazy(() => import("@/pages/admin/Settings"));

export const adminRouteElements = (
  <>
    <Route index element={<Dashboard />} />
    <Route path="homepage" element={<Homepage />} />
    <Route path="pages" element={<Pages />} />
    <Route path="sections" element={<Sections />} />
    <Route path="header-footer" element={<HeaderFooter />} />
    <Route path="about" element={<About />} />
    <Route path="team" element={<Team />} />
    <Route path="partners" element={<Partners />} />
    <Route path="services" element={<Services />} />
    <Route path="documents" element={<Documents />} />
    <Route path="branches" element={<Branches />} />
    <Route path="rates" element={<CurrentRates />} />
    <Route path="rates/history" element={<RateHistory />} />
    <Route path="rates/nrb" element={<NrbSync />} />
    <Route path="rates/settings" element={<RateSettings />} />
    <Route path="news" element={<News />} />
    <Route path="faq" element={<Faq />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="media" element={<Media />} />
    <Route path="contact" element={<Contact />} />
    <Route path="seo" element={<Seo />} />
    <Route path="admins" element={<Admins />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    <Route path="settings" element={<Settings />} />
  </>
);
