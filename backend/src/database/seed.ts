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
  defaultNews,
  defaultPartners,
  defaultSections,
  defaultServices
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
    { key: "partners" },
    {
      $set: {
        enabled: true,
        type: "PARTNERS",
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

  await AboutCompany.updateOne(
    { key: "default" },
    {
      $setOnInsert: {
        introduction:
          "We are a trusted remittance company dedicated to making international money transfers easier, faster, and more reliable. Our goal is to remove the complexity from sending money across borders and provide a seamless experience for individuals, families, businesses, and communities.",
        whoBody:
          "With technology, transparency, and customer care at the heart of everything we do, we help people send money with confidence and stay connected across countries.",
        whoHighlights: [
          { title: "Fast & Reliable Transfers", description: "", icon: "zap" },
          { title: "Secure Transactions", description: "", icon: "lock" },
          { title: "Global Connectivity", description: "", icon: "globe" },
          { title: "Customer First", description: "", icon: "heart" }
        ],
        mission:
          "Our mission is to make cross-border money transfers simple, secure, and accessible for everyone. We work to deliver a reliable remittance experience powered by modern technology, transparent processes, and exceptional customer service.",
        missionKicker: "Purpose",
        missionHeading: "Our Mission",
        missionBody:
          "We believe sending money should be more than a transaction—it should be a simple way to support families, build opportunities, and stay connected.",
        missionPoints: [
          { title: "Simple", description: "Easy-to-use money transfer experience." },
          { title: "Secure", description: "Protecting every transaction and customer." },
          { title: "Reliable", description: "Delivering money with confidence and transparency." }
        ],
        vision:
          "Our vision is to create a world where sending money across borders is effortless, trusted, and accessible to everyone.",
        visionKicker: "Future",
        visionHeading: "Our Vision",
        visionBody:
          "We aspire to become a leading remittance partner by combining innovative technology, human-centered service, and a commitment to transparency—making global financial connections easier for millions of people.",
        visionChips: ["Global Access", "Smart Technology", "Stronger Connections"],
        whyKicker: "Why Remit2Nepal",
        whyHeading: "Why Choose Us?",
        whySubheading:
          "Everything we do is designed around one simple goal: making your money transfer experience safer, faster, and easier.",
        whyItems: [
          { title: "Fast Transfers", description: "Send money quickly and conveniently across borders.", icon: "zap" },
          { title: "Secure & Protected", description: "Advanced security measures help keep your money and information protected.", icon: "shield" },
          { title: "Transparent Pricing", description: "Clear fees and exchange rates with no unnecessary surprises.", icon: "banknote" },
          { title: "Easy to Use", description: "A simple and intuitive experience designed for everyone.", icon: "sparkles" },
          { title: "Trusted Service", description: "Reliable support whenever you need assistance.", icon: "check" },
          { title: "Global Reach", description: "Helping people connect financially across countries and communities.", icon: "globe" }
        ],
        valuesKicker: "Culture",
        valuesHeading: "What We Stand For",
        valuesSubheading: "Our values guide every decision we make and every service we provide.",
        history:
          "<p>Founded to serve migrant workers and their families, Remit2Nepal expanded from Kathmandu into a nationwide branch and partner network.</p>",
        chairmanName: "Rajendra Adhikari",
        chairmanTitle: "Chairman",
        chairmanMessage:
          "<p>Trust is earned in every payout. We built Remit2Nepal around transparent rates, licensed operations, and people who answer the phone.</p>",
        heroKicker: "About Remit2Nepal",
        heroTitle: "Connecting People. // Moving Money. // Building Trust.",
        heroDescription:
          "We make international money transfers simple, secure, fast, and accessible—helping people stay connected with the ones who matter most, wherever they are in the world.",
        heroPrimaryLabel: "Send Money",
        heroPrimaryUrl: "/contact",
        heroSecondaryLabel: "Learn More About Us",
        heroSecondaryUrl: "#who-we-are",
        storyKicker: "Our story",
        storyHeading: "Who We Are",
        stepsKicker: "How we work",
        stepsHeading: "Simple. // Secure. // Seamless.",
        steps: [
          { title: "Start", description: "Choose the country and enter the amount you want to send." },
          { title: "Verify", description: "Complete the required information securely." },
          { title: "Send", description: "Confirm your transfer using your preferred payment method." },
          { title: "Connect", description: "Your recipient receives the money safely and conveniently." }
        ],
        teamAboutKicker: "Team work",
        teamAboutHeading: "Together, We Make a Difference",
        teamAboutIntro:
          "Great service starts with great people. Our team brings together technology, financial expertise, customer service, and a shared commitment to making international money transfers better.",
        teamAboutBody:
          "We work together across teams and borders to create simple solutions, solve problems, support our customers, and continuously improve the way money moves around the world.",
        teamMotto: "One Team • One Goal • Global Impact",
        teamAboutLinkLabel: "Meet the full team",
        teamAboutLinkUrl: "/about/team",
        commitmentKicker: "Promise",
        commitmentHeading: "Our Commitment to You",
        commitmentBody:
          "Your trust means everything to us. We are committed to providing a secure, transparent, and dependable remittance experience while continuously improving our services to meet the changing needs of our customers.",
        commitmentItems: ["Security", "Transparency", "Reliability", "Customer Support", "Continuous Innovation"],
        storyBandKicker: "Every payout",
        storyBandHeading: "Because Every Transfer Has a Story.",
        storyBandBody:
          "Behind every transfer is a family, a dream, an opportunity, or someone who matters. We help make those connections possible—one transfer at a time.",
        ctaHeading: "Move Money. Stay Connected.",
        ctaBody: "Experience a simpler, safer, and more reliable way to send money across borders.",
        ctaPrimaryLabel: "Send Money",
        ctaPrimaryUrl: "/contact",
        ctaSecondaryLabel: "Contact Us",
        ctaSecondaryUrl: "/contact",
        bestOfHeading: "Best of Remit2Nepal",
        bestOfSubheading: "Licensed operations, a nationwide payout desk, and rates you can check against NRB.",
        galleryImages: [],
        coreValues: [
          { title: "Trust", description: "We build lasting relationships through honesty, transparency, and reliability.", icon: "shield" },
          { title: "Security", description: "We take the protection of your money and information seriously.", icon: "lock" },
          { title: "Customer First", description: "Your needs and experience are at the center of everything we do.", icon: "heart" },
          { title: "Innovation", description: "We continuously improve our technology and services to make transfers easier.", icon: "sparkles" },
          { title: "Transparency", description: "We believe customers deserve clear information and straightforward transactions.", icon: "check" },
          { title: "Community", description: "We help strengthen connections between families, communities, and countries.", icon: "users" }
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

  const leadership = [
    { name: "Rajendra Adhikari", title: "Chairman", group: "BOARD", bio: "Oversees governance and licensed operations.", displayOrder: 1 },
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
