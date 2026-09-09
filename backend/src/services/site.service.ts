import { CompanySetting } from "../models/company-setting.model.js";
import { SeoSetting } from "../models/seo-setting.model.js";
import { Navigation } from "../models/navigation.model.js";
import { SocialLink } from "../models/social-link.model.js";
import { Section } from "../models/section.model.js";
import { Service } from "../models/service.model.js";
import { Partner } from "../models/partner.model.js";
import { News } from "../models/news.model.js";
import { Faq } from "../models/faq.model.js";
import { Gallery } from "../models/gallery.model.js";
import { CompanyDocument } from "../models/document.model.js";
import { AboutCompany } from "../models/about-company.model.js";
import { TeamMember } from "../models/team-member.model.js";
import { Page } from "../models/page.model.js";
import { publicRates } from "./exchange-rate.service.js";

export async function getPublicSite() {
  const [settings, seo, navigation, social, sections, services, partners, news, about, team] = await Promise.all([
    CompanySetting.findOne({ key: "default" }).lean(),
    SeoSetting.findOne({ key: "global" }).lean(),
    Navigation.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    SocialLink.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    Section.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    Service.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Partner.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    News.find({ status: "PUBLISHED" }).sort({ publishedAt: -1 }).limit(4).lean(),
    AboutCompany.findOne({ key: "default" }).lean(),
    TeamMember.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean()
  ]);

  return {
    settings,
    seo,
    navigation,
    social,
    sections,
    services,
    partners,
    news,
    about,
    team
  };
}

export async function getHomePayload() {
  const [site, rates] = await Promise.all([getPublicSite(), publicRates()]);
  return { ...site, rates };
}

export async function getPublishedPage(slug: string) {
  return Page.findOne({ slug, status: "PUBLISHED" }).lean();
}

export async function getPublicFaqs() {
  return Faq.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean();
}

export async function getPublicGallery() {
  return Gallery.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean();
}

export async function getPublicDocuments() {
  return CompanyDocument.find({ status: "ACTIVE", isPublic: true }).sort({ displayOrder: 1 }).lean();
}

export function robotsTxt(canonical?: string) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${canonical ? `${canonical.replace(/\/$/, "")}/sitemap.xml` : "/sitemap.xml"}\n`;
}

export async function sitemapXml(baseUrl: string) {
  const pages = await Page.find({ status: "PUBLISHED" }).lean();
  const news = await News.find({ status: "PUBLISHED" }).lean();
  const staticPaths = ["/", "/about", "/services", "/exchange-rate", "/branches", "/partners", "/news", "/faq", "/gallery", "/contact"];
  const urls = [
    ...staticPaths.map((path) => `${baseUrl}${path}`),
    ...pages.map((page) => `${baseUrl}/${page.slug}`),
    ...news.map((item) => `${baseUrl}/news/${item.slug}`)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>`;
}
