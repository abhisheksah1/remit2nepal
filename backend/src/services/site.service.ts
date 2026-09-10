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
import { publicBanners } from "./content.service.js";
import { publicRates } from "./exchange-rate.service.js";
import {
  defaultNews,
  defaultSections,
  receivingAboutCopy,
  receivingCompanyCopy,
  receivingHeroCopy,
  receivingPartnersCopy,
  receivingRemittanceCopy,
  receivingSeoCopy,
  receivingWhyCopy
} from "../database/seed-content.js";

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
      remittance.description = receivingRemittanceCopy.description;
      if (!remittance.subheading || /into NPR through a licensed/i.test(remittance.subheading)) {
        remittance.subheading = receivingRemittanceCopy.subheading;
      }
      await remittance.save();
    }

    await Section.updateOne(
      { key: "why", $or: [{ icon: { $exists: false } }, { icon: "" }, { icon: null }] },
      { $set: { icon: receivingWhyCopy.icon } }
    );
    await Section.updateOne(
      {
        key: "why",
        $or: [{ subheading: { $exists: false } }, { subheading: "" }, { subheading: null }]
      },
      { $set: { subheading: receivingWhyCopy.subheading } }
    );
    await Section.updateOne(
      { key: "why", subheading: "Regulated. Nationwide. Built for families." },
      { $set: { subheading: receivingWhyCopy.subheading } }
    );
    await Section.updateOne(
      {
        key: "why",
        $or: [
          { "items.description": "Licensed remittance with published documents and notices." },
          { "items.description": "Regulated operations, audited processes, and protected customer data." }
        ]
      },
      { $set: { items: receivingWhyCopy.items } }
    );
    await Section.updateOne(
      { key: "news", $or: [{ subheading: { $exists: false } }, { subheading: "" }, { subheading: null }] },
      { $set: { icon: "Desk", subheading: "Published for families and agents." } }
    );
    await Section.updateOne(
      { key: "partners" },
      {
        $set: { enabled: true, type: "PARTNERS" },
        $setOnInsert: { ...receivingPartnersCopy, enabled: true, type: "PARTNERS" }
      },
      { upsert: true }
    );
    await Section.updateOne(
      { key: "hero", buttonLabel: { $in: ["Send Money", "Send money", ""] } },
      { $set: { buttonLabel: "Track", buttonUrl: "/track" } }
    );
    await Section.updateOne(
      {
        key: "hero",
        $or: [
          { heading: "Moving Money. // Connecting Lives." },
          { heading: "Trusted remittance to every corner of Nepal" },
          { description: /Send money across borders/i }
        ]
      },
      { $set: receivingHeroCopy }
    );
    await Section.updateOne(
      {
        key: "remittance-stage",
        $or: [
          { icon: "Send home" },
          { icon: "Licensed transfer" },
          { description: /Send through a partner desk/i },
          { subheading: "Earn abroad. Support home. Collect in NPR." },
          { subheading: "Earn abroad. Support home. Paid out in NPR." }
        ]
      },
      { $set: receivingRemittanceCopy }
    );
    await Section.updateOne(
      {
        key: "partners",
        $or: [
          { heading: { $in: ["Become a partner", ""] } },
          { description: "Licensed desks that send money home." }
        ]
      },
      { $set: { ...receivingPartnersCopy, enabled: true, type: "PARTNERS" } }
    );
    await CompanySetting.updateOne(
      {
        key: "default",
        $or: [
          {
            footerAbout:
              "Remit2Nepal is a licensed remittance company serving families and businesses with regulated payouts across Nepal."
          },
          { footerAbout: /licensed remittance company/i }
        ]
      },
      { $set: { footerAbout: receivingCompanyCopy.footerAbout } }
    );
    await CompanySetting.updateOne(
      { key: "default", tagline: "Secure remittance. Nationwide payout." },
      { $set: { tagline: receivingCompanyCopy.tagline } }
    );
    await SeoSetting.updateOne(
      { key: "global", siteTitle: "Remit2Nepal | Licensed Remittance" },
      { $set: receivingSeoCopy }
    );
    await AboutCompany.updateOne(
      {
        key: "default",
        $or: [
          { heroPrimaryLabel: { $in: ["Send Money", "Send money"] } },
          { ctaPrimaryLabel: { $in: ["Send Money", "Send money"] } },
          { heroTitle: "Built for families who wait on a transfer" },
          { introduction: /sending money across borders/i },
          { introduction: /regulated remittance company connecting overseas earners/i }
        ]
      },
      { $set: receivingAboutCopy }
    );
    await Service.updateOne(
      { slug: "international-remittance", fullDescription: /Send funds to Nepal through licensed corridors/i },
      {
        $set: {
          shortDescription: "Inbound remittance from overseas corridors, paid out in Nepal.",
          fullDescription:
            "<p>Remit2Nepal receives transfers sent from abroad and pays beneficiaries in Nepal with identification and payout tracking.</p>",
          features: ["Inbound corridors", "ID verification", "Payout tracking"]
        }
      }
    );
    await Section.updateOne(
      { key: "services", heading: "Remittance services designed for real journeys" },
      {
        $set: {
          heading: "How families collect remittance in Nepal",
          subheading: "Cash pickup, bank deposit, and wallet payout for transfers sent from abroad."
        }
      }
    );
    await Section.updateOne(
      { key: "cta", heading: "Need help with a transfer?" },
      {
        $set: {
          heading: "Need help with a payout?",
          description: "Our desk assists with branch hours, collection questions, and corporate remittance into Nepal."
        }
      }
    );
    await Section.updateOne(
      { key: "nepal-people", subheading: /Earners abroad, families at home/i },
      {
        $set: {
          subheading: "Money sent from abroad. Families collecting at home — from the Himalaya to the Terai."
        }
      }
    );
    await Section.updateOne(
      { key: "testimonials", subheading: "Families who send. Families who receive." },
      { $set: { subheading: "Families who send from abroad. Families who collect in Nepal." } }
    );
    await Section.updateOne(
      { key: "stats", heading: "A national payment network with global reach" },
      { $set: { heading: "A nationwide payout network for remittance from abroad" } }
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
  const [settings, seo, navigation, social, sections, services, partners, news, about, team, banners] = await Promise.all([
    CompanySetting.findOne({ key: "default" }).lean(),
    SeoSetting.findOne({ key: "global" }).lean(),
    Navigation.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    SocialLink.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    Section.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    Service.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Partner.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    News.find({ status: "PUBLISHED" }).sort({ publishedAt: -1 }).limit(4).lean(),
    AboutCompany.findOne({ key: "default" }).lean(),
    TeamMember.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    publicBanners()
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
    team,
    banners
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
  const staticPaths = ["/", "/about", "/about/board", "/about/team", "/about/compliance", "/services", "/service-charge", "/exchange-rate", "/branches", "/partners", "/partners/apply/national", "/news", "/faq", "/gallery", "/track", "/contact"];
  const urls = [
    ...staticPaths.map((path) => `${baseUrl}${path}`),
    ...pages.map((page) => `${baseUrl}/${page.slug}`),
    ...news.map((item) => `${baseUrl}/news/${item.slug}`)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>`;
}
