import type { WhyItem } from "@/types/content";

export const ABOUT_DEFAULTS = {
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
  introduction:
    "We are a trusted remittance company dedicated to making international money transfers easier, faster, and more reliable. Our goal is to remove the complexity from sending money across borders and provide a seamless experience for individuals, families, businesses, and communities.",
  whoBody:
    "With technology, transparency, and customer care at the heart of everything we do, we help people send money with confidence and stay connected across countries.",
  whoHighlights: [
    { title: "Fast & Reliable Transfers", description: "", icon: "zap" },
    { title: "Secure Transactions", description: "", icon: "lock" },
    { title: "Global Connectivity", description: "", icon: "globe" },
    { title: "Customer First", description: "", icon: "heart" }
  ] as WhyItem[],
  missionKicker: "Purpose",
  missionHeading: "Our Mission",
  mission:
    "Our mission is to make cross-border money transfers simple, secure, and accessible for everyone. We work to deliver a reliable remittance experience powered by modern technology, transparent processes, and exceptional customer service.",
  missionBody:
    "We believe sending money should be more than a transaction—it should be a simple way to support families, build opportunities, and stay connected.",
  missionPoints: [
    { title: "Simple", description: "Easy-to-use money transfer experience." },
    { title: "Secure", description: "Protecting every transaction and customer." },
    { title: "Reliable", description: "Delivering money with confidence and transparency." }
  ] as WhyItem[],
  visionKicker: "Future",
  visionHeading: "Our Vision",
  vision:
    "Our vision is to create a world where sending money across borders is effortless, trusted, and accessible to everyone.",
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
  ] as WhyItem[],
  valuesKicker: "Culture",
  valuesHeading: "What We Stand For",
  valuesSubheading: "Our values guide every decision we make and every service we provide.",
  coreValues: [
    { title: "Trust", description: "We build lasting relationships through honesty, transparency, and reliability.", icon: "shield" },
    { title: "Security", description: "We take the protection of your money and information seriously.", icon: "lock" },
    { title: "Customer First", description: "Your needs and experience are at the center of everything we do.", icon: "heart" },
    { title: "Innovation", description: "We continuously improve our technology and services to make transfers easier.", icon: "sparkles" },
    { title: "Transparency", description: "We believe customers deserve clear information and straightforward transactions.", icon: "check" },
    { title: "Community", description: "We help strengthen connections between families, communities, and countries.", icon: "users" }
  ] as WhyItem[],
  stepsKicker: "How we work",
  stepsHeading: "Simple. // Secure. // Seamless.",
  steps: [
    { title: "Start", description: "Choose the country and enter the amount you want to send." },
    { title: "Verify", description: "Complete the required information securely." },
    { title: "Send", description: "Confirm your transfer using your preferred payment method." },
    { title: "Connect", description: "Your recipient receives the money safely and conveniently." }
  ] as WhyItem[],
  teamKicker: "Team work",
  teamAboutKicker: "Team work",
  teamAboutHeading: "Together, We Make a Difference",
  teamDescription:
    "Great service starts with great people. Our team brings together technology, financial expertise, customer service, and a shared commitment to making international money transfers better.",
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
  ctaSecondaryUrl: "/contact"
};

const SEED_LINES = new Set([
  "Our institution",
  "Built for families who wait on a transfer",
  "Licensed remittance for people sending from abroad and families receiving across Nepal.",
  "Remit2Nepal is a regulated remittance company connecting overseas earners with families across Nepal. We operate a documented payout network, publish exchange rates with NRB comparison, and keep licenses visible to the public.",
  "Move money with care, speed, and accountability.",
  "To be Nepal's most trusted remittance institution.",
  "The company",
  "Who we are"
]);

function plain(value: string | undefined) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function aboutLine(value: string | undefined, fallback: string) {
  const text = plain(value);
  if (!text || SEED_LINES.has(text)) return fallback;
  return text;
}

function filledList<T>(value: T[] | undefined, hasContent: (item: T) => boolean) {
  return (value ?? []).filter(hasContent);
}

export function aboutList<T>(value: T[] | undefined, fallback: T[]) {
  const list = filledList(value, (item) => {
    if (typeof item === "string") return item.trim().length > 0;
    if (item && typeof item === "object" && "title" in item) {
      return String((item as { title?: string }).title || "").trim().length > 0;
    }
    return true;
  });
  return list.length ? list : fallback;
}

export function isSeedCoreValues(values?: WhyItem[]) {
  const list = filledList(values, (item) => Boolean(item.title?.trim()));
  if (!list.length) return true;
  return list.map((item) => item.title.trim().toLowerCase()).join(",") === "integrity,security,access";
}

export function aboutValues(values: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedCoreValues(values) ? fallback : aboutList(values, fallback);
}
