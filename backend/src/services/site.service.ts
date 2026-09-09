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
import { defaultNews, defaultSections } from "../database/seed-content.js";

const nepalMapSeed = defaultSections.find((item) => item.key === "nepal-people");
const remittanceSeed = defaultSections.find((item) => item.key === "remittance-stage");
const testimonialsSeed = defaultSections.find((item) => item.key === "testimonials");
const partnersSeed = defaultSections.find((item) => item.key === "partners");

async function ensureSection(seed?: (typeof defaultSections)[number]) {
  if (!seed) return;
  try {
    await Section.updateOne({ key: seed.key }, { $setOnInsert: { ...seed, enabled: seed.enabled ?? true } }, { upsert: true });
  } catch {
    return;
  }
}

function isHoverInstruction(value?: string) {
  return /hover each letter/i.test(String(value || ""));
}

async function refreshSectionCopy() {
  try {
    const remittance = await Section.findOne({ key: "remittance-stage" });
    if (remittance && isHoverInstruction(remittance.description)) {
      remittance.description = "";
      if (!remittance.subheading || /into NPR through a licensed/i.test(remittance.subheading)) {
        remittance.subheading = "Earn abroad. Support home. Paid out in NPR.";
      }
      await remittance.save();
    }

    await Section.updateOne(
      { key: "why", $or: [{ icon: { $exists: false } }, { icon: "" }, { icon: null }] },
      { $set: { icon: "Why Remit2Nepal" } }
    );
    await Section.updateOne(
      { key: "why", $or: [{ subheading: { $exists: false } }, { subheading: "" }, { subheading: null }] },
      { $set: { subheading: "Regulated. Nationwide. Built for families." } }
    );
    await Section.updateOne(
      { key: "news", $or: [{ subheading: { $exists: false } }, { subheading: "" }, { subheading: null }] },
      { $set: { icon: "Desk", subheading: "Published for families and agents." } }
    );
    await Section.updateOne(
      { key: "partners" },
      {
        $set: { enabled: true, type: "PARTNERS" },
        $setOnInsert: {
          heading: "Global remittance partners",
          icon: "Our network",
          subheading: "हाम्रा विश्वव्यापी साझेदार",
          description: "Licensed desks that send money home.",
          buttonLabel: "Become a Agent",
          buttonUrl: "/partners",
          displayOrder: 5.5
        }
      },
      { upsert: true }
    );
    await Section.updateOne(
      { key: "partners", heading: { $in: ["Become a partner", ""] } },
      {
        $set: {
          heading: "Global remittance partners",
          icon: "Our network",
          subheading: "हाम्रा विश्वव्यापी साझेदार",
          description: "Licensed desks that send money home.",
          buttonLabel: "Become a Agent",
          buttonUrl: "/partners",
          displayOrder: 5.5
        }
      }
    );

    const published = await News.find({ slug: { $in: defaultNews.map((item) => item.slug) } });
    await Promise.all(
      published.map((row) => {
        const seed = defaultNews.find((item) => item.slug === row.slug);
        if (!seed) return null;
        if (!row.titleNe) row.titleNe = seed.titleNe;
        if (!row.punchLine) row.punchLine = seed.punchLine;
        if (!row.punchLineNe) row.punchLineNe = seed.punchLineNe;
        if (!row.summaryNe) row.summaryNe = seed.summaryNe;
        if (!row.contentNe) row.contentNe = seed.contentNe;
        if (!row.featuredImage) row.featuredImage = seed.featuredImage;
        return row.isModified() ? row.save() : null;
      })
    );

    const voices = await Section.findOne({ key: "testimonials" });
    const voiceSeed = testimonialsSeed?.items;
    if (voices && Array.isArray(voices.items) && Array.isArray(voiceSeed) && voices.items.length) {
      const first = voices.items[0] as { headline?: string };
      if (!first.headline) {
        voices.items = voiceSeed;
        await voices.save();
      }
    }
  } catch {
    return;
  }
}

export async function ensureNepalMapSection() {
  await Promise.all([
    ensureSection(nepalMapSeed),
    ensureSection(remittanceSeed),
    ensureSection(testimonialsSeed),
    ensureSection(partnersSeed)
  ]);
  await refreshSectionCopy();
}

export async function getPublicSite() {
  await ensureNepalMapSection();
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
  const [site, rates, gallery] = await Promise.all([getPublicSite(), publicRates(), getPublicGallery()]);
  return { ...site, rates, gallery };
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
  const staticPaths = ["/", "/about", "/about/board", "/about/team", "/about/compliance", "/services", "/service-charge", "/exchange-rate", "/branches", "/partners", "/partners/apply/national", "/news", "/faq", "/gallery", "/contact"];
  const urls = [
    ...staticPaths.map((path) => `${baseUrl}${path}`),
    ...pages.map((page) => `${baseUrl}/${page.slug}`),
    ...news.map((item) => `${baseUrl}/news/${item.slug}`)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>`;
}
