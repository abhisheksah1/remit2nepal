import { Partner } from "../models/partner.model.js";
import { Faq } from "../models/faq.model.js";
import { Gallery } from "../models/gallery.model.js";
import { CompanyDocument } from "../models/document.model.js";
import { News } from "../models/news.model.js";
import { Banner } from "../models/banner.model.js";
import { Page } from "../models/page.model.js";
import { Section } from "../models/section.model.js";
import { Navigation } from "../models/navigation.model.js";
import { SocialLink } from "../models/social-link.model.js";
import { TeamMember } from "../models/team-member.model.js";
import { createResourceService } from "./resource.service.js";
import { toSlug } from "../utils/slug.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { writeAudit } from "./audit.service.js";
import type { Request } from "express";

export const partnerCatalog = createResourceService(Partner, {
  module: "partners",
  searchFields: ["name", "country"]
});

export const faqCatalog = createResourceService(Faq, {
  module: "faq",
  searchFields: ["question", "answer", "category"],
  richTextFields: ["answer"]
});

export const galleryCatalog = createResourceService(Gallery, {
  module: "gallery",
  searchFields: ["title", "category"]
});

export const documentCatalog = createResourceService(CompanyDocument, {
  module: "documents",
  searchFields: ["title", "documentType"]
});

export const pageCatalog = createResourceService(Page, {
  module: "pages",
  searchFields: ["title", "slug"],
  richTextFields: ["content"],
  publicFilter: { status: "PUBLISHED" }
});

export const sectionCatalog = createResourceService(Section, {
  module: "website",
  searchFields: ["heading", "key"]
});

export const navigationCatalog = createResourceService(Navigation, {
  module: "website",
  searchFields: ["label", "path"]
});

export const socialCatalog = createResourceService(SocialLink, {
  module: "website",
  searchFields: ["platform", "label"]
});

export const teamCatalog = createResourceService(TeamMember, {
  module: "about",
  searchFields: ["name", "title"],
  richTextFields: ["bio"]
});

export const bannerCatalog = createResourceService(Banner, {
  module: "website",
  searchFields: ["title", "subtitle", "kind", "position"]
});

export function cleanBannerInput(input: Record<string, unknown>) {
  const next = { ...input };
  if (!next.startsAt) delete next.startsAt;
  if (!next.endsAt) delete next.endsAt;
  if (next.kind === "COOKIE") next.position = "BOTTOM";
  if (!next.imageRatio) next.imageRatio = "16:9";
  return next;
}

export const newsCatalog = createResourceService(News, {
  module: "news",
  searchFields: ["title", "titleNe", "summary", "summaryNe", "punchLine", "category"],
  richTextFields: ["content", "contentNe"],
  publicFilter: { status: "PUBLISHED" }
});

export async function createNews(input: Record<string, unknown>, req?: Request) {
  const slug = typeof input.slug === "string" && input.slug ? input.slug : toSlug(String(input.title ?? ""));
  const item = await newsCatalog.create({ ...input, slug }, req);
  if (input.status === "PUBLISHED" && req?.user) {
    await writeAudit({
      action: AUDIT_ACTIONS.PUBLISH_NEWS,
      module: "news",
      userId: req.user.userId,
      userName: req.user.fullName,
      entityId: String((item as unknown as { _id: unknown })._id)
    });
  }
  return item;
}

export async function createPage(input: Record<string, unknown>, req?: Request) {
  const slug = typeof input.slug === "string" && input.slug ? input.slug : toSlug(String(input.title ?? ""));
  return pageCatalog.create({ ...input, slug }, req);
}

export async function publicDocuments() {
  return CompanyDocument.find({ status: "ACTIVE", isPublic: true }).sort({ displayOrder: 1 }).lean();
}

export async function publicNews(category?: string) {
  const filter: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) filter.category = category;
  return News.find(filter).sort({ publishedAt: -1, createdAt: -1 }).lean();
}

const defaultCookieBanner = {
  title: "Cookies on this site",
  subtitle: "",
  body: "We store a small preference on this device so we do not keep showing the same notice.",
  imageUrl: "",
  altText: "",
  kind: "COOKIE",
  position: "BOTTOM",
  pageScope: "ALL",
  pagePath: "",
  linkUrl: "/privacy",
  buttonLabel: "Accept",
  secondaryButtonLabel: "Essential only",
  frequency: "ONCE",
  dismissible: true,
  status: "ACTIVE",
  displayOrder: 0
};

export async function ensureDefaultBanners() {
  try {
    const count = await Banner.countDocuments({ kind: "COOKIE" });
    if (count === 0) {
      await Banner.create(defaultCookieBanner);
    }
  } catch {
    return;
  }
}

export async function publicBanners() {
  await ensureDefaultBanners();
  const now = new Date();
  return Banner.find({
    status: "ACTIVE",
    $and: [
      { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] }
    ]
  })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}
