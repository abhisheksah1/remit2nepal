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
import { Banner } from "../models/banner.model.js";
import { Partner } from "../models/partner.model.js";
import { PartnershipSetting } from "../models/partnership-setting.model.js";
import { AboutCompany } from "../models/about-company.model.js";
import { TeamMember } from "../models/team-member.model.js";
import { SocialLink } from "../models/social-link.model.js";
import { Page } from "../models/page.model.js";
import { ChatbotQa } from "../models/chatbot-qa.model.js";
import { ChatbotAgentStep } from "../models/chatbot-agent-step.model.js";
import { ChatbotSetting } from "../models/chatbot-setting.model.js";
import { PERMISSIONS, PERMISSION_LABELS } from "../constants/permissions.js";
import { hashSecret } from "../services/token.service.js";
import {
  defaultBranches,
  defaultCurrencies,
  defaultFaqs,
  defaultNavigation,
  defaultBanners,
  defaultNews,
  defaultPartners,
  defaultSections,
  defaultServices,
  receivingAboutCopy,
  receivingCompanyCopy,
  receivingHeroCopy,
  receivingPartnersCopy,
  receivingRemittanceCopy,
  receivingSeoCopy
} from "./seed-content.js";
import { defaultChatbotQuestions, defaultChatbotSteps } from "../constants/chatbot.js";

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
        tagline: receivingCompanyCopy.tagline,
        phone: "+977-1-5550100",
        email: "hello@remit2nepal.com",
        address: "New Baneshwor, Kathmandu, Nepal",
        officeHours: "Sunday–Friday, 10:00–17:00",
        emergencyContact: "+977-9800000000",
        headerCta: { label: "Send Enquiry", url: "/contact", enabled: true },
        footerAbout: receivingCompanyCopy.footerAbout,
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
        siteTitle: receivingSeoCopy.siteTitle,
        metaDescription: receivingSeoCopy.metaDescription,
        keywords: receivingSeoCopy.keywords,
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
        retryCount: env.NRB_RETRY_COUNT,
        timeoutMs: env.NRB_TIMEOUT_MS,
        sourceUrl: env.NRB_API_URL,
        hasApiKey: Boolean(env.NRB_API_KEY)
      },
      $set: {
        fetchFrequencyCron: "0 * * * *"
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
  for (const item of defaultBanners) {
    await Banner.updateOne({ kind: item.kind, title: item.title }, { $setOnInsert: item }, { upsert: true });
  }
  for (const item of defaultPartners) {
    await Partner.updateOne({ name: item.name }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }
  await Partner.updateMany({ kind: { $exists: false }, country: { $regex: /nepal/i } }, { $set: { kind: "NATIONAL" } });
  await Partner.updateMany({ kind: { $exists: false }, country: { $not: { $regex: /nepal/i } } }, { $set: { kind: "INTERNATIONAL" } });
  await Partner.updateMany(
    { kind: "NATIONAL", $or: [{ nationalType: { $exists: false } }, { nationalType: "" }] },
    { $set: { nationalType: "BANK" } }
  );
  await PartnershipSetting.updateOne({ key: "default" }, { $setOnInsert: { key: "default" } }, { upsert: true });
  await Section.updateOne(
    { key: "hero", heading: "Trusted remittance to every corner of Nepal" },
    { $set: receivingHeroCopy }
  );
  await Section.updateOne(
    { key: "hero", heading: "Moving Money. // Connecting Lives." },
    { $set: receivingHeroCopy }
  );
  await Section.updateOne(
    { key: "services", $or: [{ buttonLabel: "" }, { buttonLabel: { $exists: false } }] },
    {
      $set: {
        icon: "What we do",
        buttonLabel: "All services",
        buttonUrl: "/services"
      }
    }
  );
  await Section.updateOne(
    { key: "remittance-stage", icon: "Licensed transfer" },
    { $set: receivingRemittanceCopy }
  );
  await Section.updateOne(
    { key: "remittance-stage", icon: "Send home" },
    { $set: receivingRemittanceCopy }
  );
  await Section.updateOne(
    { key: "partners" },
    {
      $set: {
        enabled: true,
        type: "PARTNERS",
        ...receivingPartnersCopy
      }
    }
  );

  await AboutCompany.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        ...receivingAboutCopy,
        missionKicker: "Purpose",
        missionHeading: "Our Mission",
        visionKicker: "Future",
        visionHeading: "Our Vision",
        whyKicker: "Why Remit2Nepal",
        whyHeading: "Why Choose Us?",
        valuesKicker: "Culture",
        valuesHeading: "What We Stand For",
        valuesSubheading: "Our values guide every decision we make and every payout we complete.",
        chairmanName: "Rajendra Adhikari",
        chairmanTitle: "Chairman",
        heroKicker: "About Remit2Nepal",
        heroSecondaryLabel: "Learn More About Us",
        heroSecondaryUrl: "#who-we-are",
        storyKicker: "Our story",
        storyHeading: "Who We Are",
        stepsKicker: "How we work",
        stepsHeading: "Receive. // Confirm. // Pay out.",
        teamAboutKicker: "Team work",
        teamAboutHeading: "Together, We Make a Difference",
        teamAboutLinkLabel: "Meet the full team",
        teamAboutLinkUrl: "/about/team",
        commitmentKicker: "Promise",
        commitmentHeading: "Our Commitment to You",
        commitmentBody:
          "Your trust means everything to us. We are committed to a clear, dependable payout experience for families collecting remittance in Nepal.",
        commitmentItems: ["Security", "Transparency", "Reliability", "Customer Support", "Continuous Innovation"],
        storyBandKicker: "Every payout",
        storyBandHeading: "Because Every Transfer Has a Story.",
        storyBandBody:
          "Behind every payout is a family in Nepal waiting on money sent from abroad. We help make those connections possible — one collection at a time.",
        ctaSecondaryLabel: "Contact Us",
        ctaSecondaryUrl: "/contact",
        bestOfHeading: "Best of Remit2Nepal",
        galleryImages: [],
        coreValues: [
          { title: "Trust", description: "We build lasting relationships through honesty, transparency, and reliability.", icon: "shield" },
          { title: "Security", description: "We take the protection of your money and information seriously.", icon: "lock" },
          { title: "Customer First", description: "Your needs and experience are at the center of everything we do.", icon: "heart" },
          { title: "Innovation", description: "We continuously improve our technology and services to make collection in Nepal clearer.", icon: "sparkles" },
          { title: "Transparency", description: "We believe customers deserve clear information and straightforward transactions.", icon: "check" },
          { title: "Community", description: "We help strengthen connections between families abroad and homes in Nepal.", icon: "users" }
        ],
        statistics: [
          { label: "Years of Experience", value: "18+" },
          { label: "Branches", value: "120+" },
          { label: "Countries Served", value: "25" },
          { label: "Customers", value: "1.2M+" },
          { label: "Partners", value: "40+" }
        ]
      }
    },
    { upsert: true }
  );
  await AboutCompany.updateOne(
    { key: "default", heroPrimaryLabel: { $in: ["Send Money", "Send money"] } },
    { $set: receivingAboutCopy }
  );

  const leadership = [
    { name: "Rajendra Adhikari", title: "Chairman", group: "BOARD", bio: "Oversees governance and the nationwide payout desk.", displayOrder: 1 },
    { name: "Sushila Karki", title: "Board Director", group: "BOARD", bio: "Guides compliance, audit, and shareholder accountability.", displayOrder: 2 },
    { name: "Bikash Thapa", title: "Independent Director", group: "BOARD", bio: "Advises on risk, NRB reporting, and payout integrity.", displayOrder: 3 },
    { name: "Meera Shrestha", title: "Chief Executive Officer", group: "TEAM", tier: "LEAD", bio: "Leads nationwide payout operations and partner corridors.", displayOrder: 4 },
    { name: "Anil Gurung", title: "Head of Operations", group: "TEAM", tier: "LEAD", bio: "Runs branch desks, agent settlement, and same-day payouts.", displayOrder: 5 },
    { name: "Priya Basnet", title: "Compliance Officer", group: "TEAM", tier: "LEAD", bio: "Owns KYC, AML screening, and regulatory filings.", displayOrder: 6 },
    { name: "Nabin Rai", title: "Payout Executive", group: "TEAM", tier: "STAFF", bio: "Supports same-day payouts and branch follow-up.", displayOrder: 7 },
    { name: "Sabina Magar", title: "Customer Desk", group: "TEAM", tier: "STAFF", bio: "Helps families track transfers and branch visits.", displayOrder: 8 }
  ] as const;
  for (const person of leadership) {
    await TeamMember.updateOne(
      { name: person.name },
      {
        $set: { group: person.group, title: person.title, tier: "tier" in person ? person.tier : "STAFF" },
        $setOnInsert: {
          name: person.name,
          bio: person.bio,
          displayOrder: person.displayOrder,
          status: "ACTIVE",
          photoUrl: ""
        }
      },
      { upsert: true }
    );
  }

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

  await ChatbotSetting.updateOne({ key: "default" }, { $setOnInsert: { key: "default" } }, { upsert: true });
  if ((await ChatbotQa.countDocuments()) === 0) {
    await ChatbotQa.insertMany(defaultChatbotQuestions.map((item) => ({ ...item, status: "ACTIVE" })));
  }
  if ((await ChatbotAgentStep.countDocuments()) === 0) {
    await ChatbotAgentStep.insertMany(defaultChatbotSteps.map((item) => ({ ...item, status: "ACTIVE" })));
  }

  logger.info("Seed complete");
  await disconnectDatabase();
}

seed().catch(async (error) => {
  logger.error({ err: error instanceof Error ? error.message : error }, "Seed failed");
  await disconnectDatabase();
  process.exit(1);
});
