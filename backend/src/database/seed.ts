import { connectDatabase, disconnectDatabase } from "./connection.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";
import { CompanySetting } from "../models/company-setting.model.js";
import { SeoSetting } from "../models/seo-setting.model.js";
import { Currency } from "../models/currency.model.js";
import { NrbConfig } from "../models/nrb-config.model.js";
import { Navigation } from "../models/navigation.model.js";
import { Section } from "../models/section.model.js";
import { Service } from "../models/service.model.js";
import { Branch } from "../models/branch.model.js";
import { Faq } from "../models/faq.model.js";
import { News } from "../models/news.model.js";
import { Partner } from "../models/partner.model.js";
import { AboutCompany } from "../models/about-company.model.js";
import { TeamMember } from "../models/team-member.model.js";
import { SocialLink } from "../models/social-link.model.js";
import { Page } from "../models/page.model.js";
import { PERMISSIONS, PERMISSION_LABELS } from "../constants/permissions.js";
import { hashSecret } from "../services/token.service.js";
import {
  defaultBranches,
  defaultCurrencies,
  defaultFaqs,
  defaultNavigation,
  defaultNews,
  defaultPartners,
  defaultSections,
  defaultServices
} from "./seed-content.js";

async function seed() {
  await connectDatabase();
  logger.info("Seeding Remit2Nepal data (idempotent)");

  for (const key of PERMISSIONS) {
    await Permission.updateOne(
      { key },
      { key, label: PERMISSION_LABELS[key], module: key },
      { upsert: true }
    );
  }

  await Role.updateOne(
    { name: "SUPER_ADMIN" },
    { name: "SUPER_ADMIN", description: "Full platform access", isSystem: true },
    { upsert: true }
  );
  await Role.updateOne(
    { name: "ADMIN" },
    { name: "ADMIN", description: "Permission-scoped administrator", isSystem: true },
    { upsert: true }
  );

  const existingAdmin = await User.findOne({ userId: env.DEFAULT_SUPER_ADMIN_USER_ID.toLowerCase() });
  if (!existingAdmin) {
    await User.create({
      fullName: env.DEFAULT_SUPER_ADMIN_NAME,
      userId: env.DEFAULT_SUPER_ADMIN_USER_ID.toLowerCase(),
      passwordHash: await hashSecret(env.DEFAULT_SUPER_ADMIN_PASSWORD),
      email: "admin@remit2nepal.com",
      role: "SUPER_ADMIN",
      permissions: [...PERMISSIONS],
      status: "ACTIVE",
      mustChangePassword: true
    });
    logger.info("Created default super admin");
  }

  await CompanySetting.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        key: "default",
        companyName: "Remit2Nepal",
        tagline: "Secure remittance. Nationwide payout.",
        phone: "+977-1-5550100",
        email: "hello@remit2nepal.com",
        address: "New Baneshwor, Kathmandu, Nepal",
        officeHours: "Sunday–Friday, 10:00–17:00",
        emergencyContact: "+977-9800000000",
        headerCta: { label: "Send Enquiry", url: "/contact", enabled: true },
        footerAbout:
          "Remit2Nepal is a licensed remittance company serving families and businesses with regulated payouts across Nepal.",
        copyrightText: "© Remit2Nepal. All rights reserved.",
        legalLinks: [
          { label: "Privacy Policy", url: "/privacy" },
          { label: "Terms of Service", url: "/terms" }
        ],
        publicRateDisplay: "BOTH",
        contactFormEnabled: true
      }
    },
    { upsert: true }
  );

  await SeoSetting.updateOne(
    { key: "global" },
    {
      $setOnInsert: {
        siteTitle: "Remit2Nepal | Licensed Remittance",
        metaDescription:
          "Licensed remittance to Nepal with official NRB-referenced rates, nationwide branches, and secure payout services.",
        keywords: "remittance, Nepal, NRB, money transfer, cash pickup",
        robots: "index,follow",
        canonicalUrl: env.FRONTEND_URL
      }
    },
    { upsert: true }
  );

  await NrbConfig.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        enabled: true,
        automaticFetchEnabled: true,
        fetchFrequencyCron: "0 */4 * * *",
        retryCount: env.NRB_RETRY_COUNT,
        timeoutMs: env.NRB_TIMEOUT_MS,
        sourceUrl: env.NRB_API_URL,
        hasApiKey: Boolean(env.NRB_API_KEY)
      }
    },
    { upsert: true }
  );

  for (const currency of defaultCurrencies) {
    await Currency.updateOne({ code: currency.code }, { $setOnInsert: currency }, { upsert: true });
  }
  for (const item of defaultNavigation) {
    await Navigation.updateOne({ path: item.path, location: item.location }, { $setOnInsert: { ...item, enabled: true } }, { upsert: true });
  }
  for (const item of defaultSections) {
    await Section.updateOne({ key: item.key }, { $setOnInsert: { ...item, enabled: true } }, { upsert: true });
  }
  for (const item of defaultServices) {
    await Service.updateOne({ slug: item.slug }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }
  for (const item of defaultBranches) {
    await Branch.updateOne({ branchCode: item.branchCode }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }
  for (const item of defaultFaqs) {
    await Faq.updateOne({ question: item.question }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }
  for (const item of defaultNews) {
    await News.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
  }
  for (const item of defaultPartners) {
    await Partner.updateOne({ name: item.name }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }

  await AboutCompany.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        introduction:
          "<p>Remit2Nepal is a regulated remittance company connecting overseas earners with families across Nepal. We operate a documented payout network, publish exchange rates with NRB comparison, and keep licenses visible to the public.</p>",
        mission: "<p>Move money with care, speed, and accountability.</p>",
        vision: "<p>To be Nepal's most trusted remittance institution.</p>",
        history:
          "<p>Founded to serve migrant workers and their families, Remit2Nepal expanded from Kathmandu into a nationwide branch and partner network.</p>",
        chairmanName: "Rajendra Adhikari",
        chairmanTitle: "Chairman",
        chairmanMessage:
          "<p>Trust is earned in every payout. We built Remit2Nepal around transparent rates, licensed operations, and people who answer the phone.</p>",
        coreValues: [
          { title: "Integrity", description: "Publish what we charge and honour what we promise." },
          { title: "Security", description: "Protect customer data and payout identity checks." },
          { title: "Access", description: "Reach district towns as well as capital city hubs." }
        ],
        statistics: [
          { label: "Years of Experience", value: "18+" },
          { label: "Branches", value: "120+" },
          { label: "Countries Served", value: "25" },
          { label: "Customers", value: "1.2M+" },
          { label: "Partners", value: "40+" }
        ],
        licenses: ["NRB Remittance License"],
        certifications: ["ISO-aligned information security practices"],
        awards: ["National remittance service recognition"]
      }
    },
    { upsert: true }
  );

  await TeamMember.updateOne(
    { name: "Rajendra Adhikari" },
    { $setOnInsert: { name: "Rajendra Adhikari", title: "Chairman", bio: "Oversees governance and licensed operations.", displayOrder: 1, status: "ACTIVE" } },
    { upsert: true }
  );
  await TeamMember.updateOne(
    { name: "Meera Shrestha" },
    { $setOnInsert: { name: "Meera Shrestha", title: "Chief Executive Officer", bio: "Leads nationwide payout operations and partner corridors.", displayOrder: 2, status: "ACTIVE" } },
    { upsert: true }
  );

  const socials = [
    { platform: "facebook", label: "Facebook", url: "https://facebook.com/remit2nepal", displayOrder: 1 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/company/remit2nepal", displayOrder: 2 },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com/@remit2nepal", displayOrder: 3 }
  ] as const;
  for (const item of socials) {
    await SocialLink.updateOne({ platform: item.platform }, { $setOnInsert: { ...item, enabled: true } }, { upsert: true });
  }

  await Page.updateOne(
    { slug: "privacy" },
    {
      $setOnInsert: {
        title: "Privacy Policy",
        slug: "privacy",
        status: "PUBLISHED",
        content: "<p>Remit2Nepal collects only the information required to operate remittance services and respond to enquiries. Contact messages are never published.</p>",
        seoTitle: "Privacy Policy | Remit2Nepal"
      }
    },
    { upsert: true }
  );
  await Page.updateOne(
    { slug: "terms" },
    {
      $setOnInsert: {
        title: "Terms of Service",
        slug: "terms",
        status: "PUBLISHED",
        content: "<p>Transfers are processed according to applicable Nepal Rastra Bank regulations and branch identification requirements.</p>",
        seoTitle: "Terms of Service | Remit2Nepal"
      }
    },
    { upsert: true }
  );

  logger.info("Seed complete");
  await disconnectDatabase();
}

seed().catch(async (error) => {
  logger.error({ err: error instanceof Error ? error.message : error }, "Seed failed");
  await disconnectDatabase();
  process.exit(1);
});
