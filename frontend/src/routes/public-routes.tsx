import { lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("@/pages/public/Home"));
const About = lazy(() => import("@/pages/public/About"));
const AboutBoard = lazy(() => import("@/pages/public/AboutBoard"));
const AboutTeam = lazy(() => import("@/pages/public/AboutTeam"));
const AboutCompliance = lazy(() => import("@/pages/public/AboutCompliance"));
const Services = lazy(() => import("@/pages/public/Services"));
const ServiceDetail = lazy(() => import("@/pages/public/ServiceDetail"));
const ExchangeRate = lazy(() => import("@/pages/public/ExchangeRate"));
const Branches = lazy(() => import("@/pages/public/Branches"));
const BranchDetail = lazy(() => import("@/pages/public/BranchDetail"));
const Partners = lazy(() => import("@/pages/public/Partners"));
const PartnerApply = lazy(() => import("@/pages/public/PartnerApply"));
const Track = lazy(() => import("@/pages/public/Track"));
const News = lazy(() => import("@/pages/public/News"));
const NewsDetail = lazy(() => import("@/pages/public/NewsDetail"));
const Faq = lazy(() => import("@/pages/public/Faq"));
const ServiceCharge = lazy(() => import("@/pages/public/ServiceCharge"));
const Gallery = lazy(() => import("@/pages/public/Gallery"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Privacy = lazy(() => import("@/pages/public/Privacy"));
const Terms = lazy(() => import("@/pages/public/Terms"));
const CmsPage = lazy(() => import("@/pages/public/CmsPage"));
const NotFound = lazy(() => import("@/pages/public/NotFound"));

export const publicRouteElements = (
  <>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="about/board" element={<AboutBoard />} />
    <Route path="about/team" element={<AboutTeam />} />
    <Route path="about/compliance" element={<AboutCompliance />} />
    <Route path="services" element={<Services />} />
    <Route path="services/:id" element={<ServiceDetail />} />
    <Route path="service-charge" element={<ServiceCharge />} />
    <Route path="exchange-rate" element={<ExchangeRate />} />
    <Route path="branches" element={<Branches />} />
    <Route path="branches/:id" element={<BranchDetail />} />
    <Route path="partners" element={<Partners />} />
    <Route path="partners/apply/:track" element={<PartnerApply />} />
    <Route path="news" element={<News />} />
    <Route path="news/:slug" element={<NewsDetail />} />
    <Route path="faq" element={<Faq />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="track" element={<Track />} />
    <Route path="contact" element={<Contact />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="terms" element={<Terms />} />
    <Route path=":slug" element={<CmsPage />} />
    <Route path="*" element={<NotFound />} />
  </>
);
