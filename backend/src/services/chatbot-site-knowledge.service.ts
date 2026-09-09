import { CompanySetting } from "../models/company-setting.model.js";
import { SeoSetting } from "../models/seo-setting.model.js";
import { AboutCompany } from "../models/about-company.model.js";
import { Service } from "../models/service.model.js";
import { Faq } from "../models/faq.model.js";
import { Branch } from "../models/branch.model.js";
import { News } from "../models/news.model.js";
import { Page } from "../models/page.model.js";
import { TeamMember } from "../models/team-member.model.js";
import { Partner } from "../models/partner.model.js";
import { Section } from "../models/section.model.js";
import { CompanyDocument } from "../models/document.model.js";
import { SocialLink } from "../models/social-link.model.js";
import { PartnershipSetting } from "../models/partnership-setting.model.js";
import { ServiceChargeRow } from "../models/service-charge.model.js";
import { getServiceChargePage } from "./service-charge.service.js";
import { publicRates } from "./exchange-rate.service.js";
import { stripHtml } from "../utils/sanitize.js";

export interface SiteCard {
  kind:
    | "company"
    | "contact"
    | "about"
    | "service"
    | "faq"
    | "branch"
    | "rate"
    | "charge"
    | "news"
    | "page"
    | "team"
    | "partner"
    | "section"
    | "document"
    | "agent";
  title: string;
  text: string;
  keywords: string;
  href?: string;
  hrefLabel?: string;
  place?: string;
  phone?: string;
}

function clean(value?: string | null) {
  return stripHtml(value ?? "").replace(/\s+/g, " ").trim();
}

function joinLines(parts: Array<string | undefined | null>) {
  return parts.map((part) => clean(part)).filter(Boolean).join("\n");
}

function clip(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}

function uniquePlace(parts: Array<string | undefined | null>) {
  const result: string[] = [];
  for (const raw of parts) {
    const part = (raw ?? "").trim();
    if (!part) continue;
    const lower = part.toLowerCase();
    if (result.some((item) => item.toLowerCase() === lower)) continue;
    if (result.some((item) => item.toLowerCase().includes(lower) && item.length > part.length)) continue;
    const index = result.findIndex((item) => lower.includes(item.toLowerCase()) && part.length > item.length);
    if (index >= 0) result[index] = part;
    else result.push(part);
  }
  return result.join(", ");
}

export async function loadSiteKnowledge(): Promise<SiteCard[]> {
  const [
    settings,
    seo,
    about,
    services,
    faqs,
    branches,
    news,
    pages,
    team,
    partners,
    sections,
    documents,
    social,
    partnership,
    chargePage,
    chargeRows,
    rates
  ] = await Promise.all([
    CompanySetting.findOne({ key: "default" }).lean(),
    SeoSetting.findOne({ key: "global" }).lean(),
    AboutCompany.findOne({ key: "default" }).lean(),
    Service.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Faq.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Branch.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).select("name branchCode province district municipality city address phone email openingTime closingTime weeklyHoliday managerName servicesAvailable").lean(),
    News.find({ status: "PUBLISHED" }).sort({ publishedAt: -1 }).limit(12).lean(),
    Page.find({ status: "PUBLISHED" }).sort({ displayOrder: 1 }).lean(),
    TeamMember.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Partner.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    Section.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    CompanyDocument.find({ status: "ACTIVE", isPublic: true }).sort({ displayOrder: 1 }).lean(),
    SocialLink.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
    PartnershipSetting.findOne({ key: "default" }).lean(),
    getServiceChargePage(),
    ServiceChargeRow.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    publicRates()
  ]);

  const cards: SiteCard[] = [];

  if (settings) {
    cards.push({
      kind: "company",
      title: settings.companyName || "Remit2Nepal",
      keywords: "remit2nepal, company, about, who, tagline, what is",
      href: "/about",
      hrefLabel: "About Us",
      text: joinLines([
        settings.companyName,
        settings.tagline,
        settings.footerAbout,
        seo?.siteTitle,
        seo?.metaDescription,
        seo?.keywords
      ])
    });
    cards.push({
      kind: "contact",
      title: "Contact Remit2Nepal",
      keywords: "contact, phone, email, address, office, hours, location, hotline, emergency, whatsapp",
      href: "/contact",
      hrefLabel: "Contact",
      text: joinLines([
        settings.phone ? `Phone: ${settings.phone}` : "",
        settings.emergencyContact ? `Emergency: ${settings.emergencyContact}` : "",
        settings.email ? `Email: ${settings.email}` : "",
        settings.address ? `Address: ${settings.address}` : "",
        settings.officeHours ? `Office hours: ${settings.officeHours}` : "",
        social.map((item) => `${item.label}: ${item.url}`).join("\n")
      ])
    });
  }

  if (about) {
    cards.push({
      kind: "about",
      title: about.heroTitle || about.storyHeading || "About Remit2Nepal",
      keywords: "about, mission, vision, history, license, compliance, values, who we are",
      href: "/about",
      hrefLabel: "About Us",
      text: clip(
        joinLines([
          about.heroDescription,
          about.introduction,
          about.mission ? `Mission: ${clean(about.mission)}` : "",
          about.vision ? `Vision: ${clean(about.vision)}` : "",
          about.history ? `History: ${clean(about.history)}` : "",
          about.coreValues?.map((value) => `${value.title}: ${value.description}`).join("\n"),
          about.licenses?.length ? `Licenses: ${about.licenses.join(", ")}` : "",
          about.certifications?.length ? `Certifications: ${about.certifications.join(", ")}` : "",
          about.awards?.length ? `Awards: ${about.awards.join(", ")}` : "",
          about.statistics?.map((stat) => `${stat.label}: ${stat.value}`).join("\n")
        ]),
        1200
      )
    });
  }

  for (const service of services) {
    cards.push({
      kind: "service",
      title: service.title,
      keywords: `service, ${service.title}, ${service.slug}, payout, transfer, ${service.features?.join(" ") ?? ""}`,
      href: `/services/${service.slug}`,
      hrefLabel: service.title,
      text: clip(joinLines([service.shortDescription, service.fullDescription, service.features?.join(", "), service.countryAvailability?.join(", ")]), 900)
    });
  }

  for (const faq of faqs) {
    cards.push({
      kind: "faq",
      title: faq.question,
      keywords: `faq, ${faq.category ?? ""}, ${faq.question}`,
      href: "/faq",
      hrefLabel: "FAQ",
      place: clip(clean(faq.answer), 90),
      text: clip(clean(faq.answer), 800)
    });
  }

  if (branches.length) {
    cards.push({
      kind: "branch",
      title: "Our Agent network",
      keywords: "branch, branches, our agent, finder, nationwide, how many agents, location, agent list",
      href: "/branches",
      hrefLabel: "Our Agent",
      text: `Remit2Nepal has ${branches.length} active agents/branches. Ask with a district, city, or agent name to get the list, address, and phone. Open Our Agent to search everyone.`
    });
  }
  for (const branch of branches) {
    const place = uniquePlace([branch.municipality, branch.city, branch.district, branch.province]);
    cards.push({
      kind: "branch",
      title: branch.name,
      keywords: `${branch.name} ${branch.branchCode} ${branch.province} ${branch.district} ${branch.city} ${branch.municipality} branch agent`,
      href: `/branches/${String(branch._id)}`,
      hrefLabel: branch.name,
      place,
      phone: branch.phone || "",
      text: joinLines([
        branch.name,
        place,
        branch.address,
        branch.phone ? `Phone: ${branch.phone}` : "",
        branch.email ? `Email: ${branch.email}` : "",
        branch.openingTime || branch.closingTime ? `Hours: ${branch.openingTime || "10:00"}–${branch.closingTime || "17:00"}` : "",
        branch.weeklyHoliday ? `Weekly holiday: ${branch.weeklyHoliday}` : "",
        branch.managerName ? `Manager: ${branch.managerName}` : "",
        branch.servicesAvailable?.length ? `Services: ${branch.servicesAvailable.join(", ")}` : ""
      ])
    });
  }

  if (rates.rates.length) {
    const lines = rates.rates.slice(0, 12).map((rate) => {
      const buy = rate.companyBuyRate ?? rate.nrbBuyRate;
      const sell = rate.companySellRate ?? rate.nrbSellRate;
      return `${rate.currencyCode} (${rate.unit}): buy ${buy ?? "—"} / sell ${sell ?? "—"}`;
    });
    cards.push({
      kind: "rate",
      title: "Exchange rates",
      keywords: `exchange rate, nrb, forex, usd, currency, ${rates.rates.map((rate) => rate.currencyCode).join(" ")}`,
      href: "/exchange-rate",
      hrefLabel: "Exchange Rate",
      text: joinLines([
        `Source: ${rates.source}. Display: ${rates.displayMode}.`,
        ...lines,
        "See the Exchange Rate page for the full table."
      ])
    });
  }

  if (chargeRows.length || chargePage) {
    cards.push({
      kind: "charge",
      title: chargePage.pageTitle || "Service Charge",
      keywords: "service charge, fee, commission, cash pickup, bank transfer, charges",
      href: "/service-charge",
      hrefLabel: "Service Charge",
      text: clip(
        joinLines([
          chargePage.pageDescription,
          ...chargeRows.slice(0, 20).map((row) =>
            row.mergePayout
              ? `${row.sendingAgent}: ${row.mergedCharge || row.cashPickup}`
              : `${row.sendingAgent}: cash pickup ${row.cashPickup || "—"}, bank transfer ${row.bankTransfer || "—"}`
          ),
          chargePage.footnote
        ]),
        1100
      )
    });
    for (const row of chargeRows) {
      cards.push({
        kind: "charge",
        title: `Charge: ${row.sendingAgent}`,
        keywords: `${row.sendingAgent} fee charge commission`,
        href: "/service-charge",
        hrefLabel: "Service Charge",
        text: row.mergePayout
          ? `${row.sendingAgent} charge: ${row.mergedCharge || row.cashPickup}`
          : `${row.sendingAgent}: cash pickup ${row.cashPickup || "—"}, bank transfer ${row.bankTransfer || "—"}`
      });
    }
  }

  for (const item of news) {
    cards.push({
      kind: "news",
      title: item.title,
      keywords: `news notice alert ${item.category} ${item.title} ${item.titleNe ?? ""}`,
      href: `/news/${item.slug}`,
      hrefLabel: item.title,
      text: clip(joinLines([item.punchLine, item.summary, item.summaryNe, item.content, item.contentNe]), 800)
    });
  }

  for (const page of pages) {
    cards.push({
      kind: "page",
      title: page.title,
      keywords: `${page.slug} ${page.title} ${page.seoTitle} privacy terms policy`,
      href: `/${page.slug}`,
      hrefLabel: page.title,
      text: clip(joinLines([page.summary, page.seoDescription, page.content]), 900)
    });
  }

  for (const member of team) {
    cards.push({
      kind: "team",
      title: member.name,
      keywords: `${member.name} ${member.title} team board leader chairman chairperson director directors manager staff our team board of directors`,
      href: member.group === "BOARD" ? "/about/board" : "/about/team",
      hrefLabel: member.group === "BOARD" ? "Board of Directors" : "Our Team",
      place: member.title,
      text: joinLines([
        member.name,
        member.title,
        member.group === "BOARD" ? "Board of Directors" : "Our Team",
        member.tier === "LEAD" ? "Leadership" : "",
        member.bio
      ])
    });
  }

  for (const partner of partners) {
    cards.push({
      kind: "partner",
      title: partner.name,
      keywords: `${partner.name} partner agent ${partner.country} ${partner.kind} ${partner.nationalType}`,
      href: "/partners",
      hrefLabel: "Become a Agent",
      text: joinLines([partner.name, partner.country, partner.kind, partner.nationalType, partner.description, partner.website])
    });
  }

  for (const section of sections) {
    const extra = Array.isArray(section.items)
      ? section.items
          .map((item) => {
            if (!item || typeof item !== "object") return "";
            const record = item as Record<string, unknown>;
            return [record.title, record.label, record.heading, record.description, record.value].filter((value) => typeof value === "string").join(" ");
          })
          .join("\n")
      : "";
    const text = joinLines([section.heading, section.subheading, section.description, extra]);
    if (!text) continue;
    cards.push({
      kind: "section",
      title: section.heading || section.key,
      keywords: `${section.type} ${section.heading} homepage`,
      href: "/",
      hrefLabel: "Home",
      text: clip(text, 700)
    });
  }

  for (const doc of documents) {
    cards.push({
      kind: "document",
      title: doc.title,
      keywords: `${doc.title} ${doc.documentType} license certificate document`,
      href: "/about/compliance",
      hrefLabel: "Compliance",
      text: joinLines([doc.title, doc.documentType, doc.description])
    });
  }

  if (partnership) {
    cards.push({
      kind: "agent",
      title: String(partnership.pageTitle || "Become a Agent"),
      keywords: "become a agent, national agent, cooperative, private agent, apply, partnership",
      href: "/partners",
      hrefLabel: "Become a Agent",
      text: clip(
        joinLines([
          String(partnership.pageDescription || ""),
          String(partnership.nationalTitle || ""),
          String(partnership.nationalIntro || ""),
          Array.isArray(partnership.nationalPoints) ? partnership.nationalPoints.join("\n") : "",
          partnership.formEnabled === false ? "The agent application form is currently closed." : "The national agent form is open on Become a Agent."
        ]),
        900
      )
    });
  }

  return cards.filter((card) => card.text);
}
